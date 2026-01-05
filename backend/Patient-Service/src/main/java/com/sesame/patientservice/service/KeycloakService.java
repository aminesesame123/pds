package com.sesame.patientservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class KeycloakService {

    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public void createUser(String username, String email, String password, String firstName, String lastName,
            boolean enabled) {
        String token = getAdminToken();

        String url = authServerUrl + "/admin/realms/" + realm + "/users";

        Map<String, Object> user = new HashMap<>();
        user.put("username", username);
        user.put("email", email);
        user.put("firstName", firstName);
        user.put("lastName", lastName);
        user.put("enabled", enabled);

        Map<String, Object> credential = new HashMap<>();
        credential.put("type", "password");
        credential.put("value", password);
        credential.put("temporary", false);

        user.put("credentials", Collections.singletonList(credential));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(user, headers);

        try {
            ResponseEntity<Void> response = restTemplate.postForEntity(url, request, Void.class);
            if (response.getStatusCode() == HttpStatus.CREATED) {
                // Get User ID for role assignment
                String location = response.getHeaders().getLocation().getPath();
                String userId = location.substring(location.lastIndexOf('/') + 1);

                // Assign PATIENT role
                assignRole(userId, "PATIENT");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to create user in Keycloak: " + e.getMessage());
        }
    }

    public void assignRole(String userId, String roleName) {
        String token = getAdminToken();

        // 1. Get Role ID
        String roleUrl = authServerUrl + "/admin/realms/" + realm + "/roles/" + roleName;
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> getRoleRequest = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> roleResponse = restTemplate.exchange(roleUrl, HttpMethod.GET, getRoleRequest,
                    Map.class);
            Map role = roleResponse.getBody();

            // 2. Assign Role to User
            String assignUrl = authServerUrl + "/admin/realms/" + realm + "/users/" + userId + "/role-mappings/realm";
            HttpEntity<List<Map>> assignRoleRequest = new HttpEntity<>(Collections.singletonList(role), headers);
            restTemplate.postForEntity(assignUrl, assignRoleRequest, Void.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to assign role " + roleName + " in Keycloak: " + e.getMessage());
        }
    }

    private String getAdminToken() {
        String url = authServerUrl + "/realms/master/protocol/openid-connect/token"; // Admin CLI usually in master
        // OR get token for the realm where service account lives.
        // If backend-service is in MedInsightRealm, we should get token from
        // MedInsightRealm.

        // Let's assume backend-service is in MedInsightRealm as per init script
        url = authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("client_id", "backend-service"); // Using the service account
        map.add("client_secret", "backend-secret");
        map.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return (String) response.getBody().get("access_token");
        } catch (Exception e) {
            throw new RuntimeException("Failed to get admin token: " + e.getMessage());
        }
    }
}
