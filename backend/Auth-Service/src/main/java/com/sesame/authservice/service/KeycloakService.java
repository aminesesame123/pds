package com.sesame.authservice.service;

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

    @Value("${keycloak.auth-server-url:http://localhost:8090}")
    private String authServerUrl;

    @Value("${keycloak.realm:MedInsightRealm}")
    private String realm;

    private final RestTemplate restTemplate = new RestTemplate();

    public String createUser(String username, String email, String password, String firstName, String lastName,
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
                // Return User ID from Location header
                String location = response.getHeaders().getLocation().getPath();
                return location.substring(location.lastIndexOf('/') + 1);
            }
            throw new RuntimeException("Failed to create user in Keycloak: Status " + response.getStatusCode());
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

        ResponseEntity<Map> roleResponse = restTemplate.exchange(roleUrl, HttpMethod.GET, getRoleRequest, Map.class);
        Map role = roleResponse.getBody();

        // 2. Assign Role to User
        String assignUrl = authServerUrl + "/admin/realms/" + realm + "/users/" + userId + "/role-mappings/realm";
        HttpEntity<List<Map>> assignRoleRequest = new HttpEntity<>(Collections.singletonList(role), headers);

        try {
            restTemplate.postForEntity(assignUrl, assignRoleRequest, Void.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to assign role in Keycloak: " + e.getMessage());
        }
    }

    public List<Map> getPendingUsers() {
        String token = getAdminToken();
        String url = authServerUrl + "/admin/realms/" + realm + "/users?enabled=false";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, request, List.class);
        return (List<Map>) response.getBody();
    }

    public void approveUser(String userId) {
        String token = getAdminToken();
        String url = authServerUrl + "/admin/realms/" + realm + "/users/" + userId;

        Map<String, Object> updates = new HashMap<>();
        updates.put("enabled", true);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(updates, headers);

        try {
            restTemplate.exchange(url, HttpMethod.PUT, request, Void.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to approve user in Keycloak: " + e.getMessage());
        }
    }

    private String getAdminToken() {
        // Use Master Realm Admin for full permissions
        String url = authServerUrl + "/realms/master/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("client_id", "admin-cli");
        map.add("username", "admin");
        map.add("password", "admin");
        map.add("grant_type", "password");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return (String) response.getBody().get("access_token");
        } catch (Exception e) {
            throw new RuntimeException("Failed to get admin token from Keycloak: " + e.getMessage());
        }
    }
}
