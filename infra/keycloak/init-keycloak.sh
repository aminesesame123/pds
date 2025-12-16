#!/bin/bash

# Wait for Keycloak to start
echo "Waiting for Keycloak to start..."
until curl -s http://localhost:8090/health > /dev/null; do
    echo "Waiting for Keycloak..."
    sleep 5
done

# Variables
KC_URL="http://localhost:8090"
KC_ADM="admin"
KC_PWD="admin"
REALM_NAME="MedInsightRealm"

echo "Getting Admin Token..."
TKN=$(curl -s -X POST "$KC_URL/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=$KC_ADM" \
    -d "password=$KC_PWD" \
    -d "grant_type=password" \
    -d "client_id=admin-cli" | jq -r .access_token)

if [ "$TKN" == "null" ]; then
    echo "Error getting token"
    exit 1
fi

echo "Creating Realm $REALM_NAME..."
curl -s -X POST "$KC_URL/admin/realms" \
    -H "Authorization: Bearer $TKN" \
    -H "Content-Type: application/json" \
    -d "{\"realm\": \"$REALM_NAME\", \"enabled\": true}"

echo "Creating Client frontend..."
curl -s -X POST "$KC_URL/admin/realms/$REALM_NAME/clients" \
    -H "Authorization: Bearer $TKN" \
    -H "Content-Type: application/json" \
    -d '{
        "clientId": "frontend-client",
        "enabled": true,
        "publicClient": true,
        "redirectUris": ["http://localhost:5173/*", "http://localhost:8080/*"],
        "webOrigins": ["*"]
    }'

echo "Creating Client backend-service..."
curl -s -X POST "$KC_URL/admin/realms/$REALM_NAME/clients" \
    -H "Authorization: Bearer $TKN" \
    -H "Content-Type: application/json" \
    -d '{
        "clientId": "backend-service",
        "enabled": true,
        "publicClient": false,
        "clientAuthenticatorType": "client-secret",
        "secret": "backend-secret",
        "serviceAccountsEnabled": true
    }'

echo "Creating Roles..."
ROLES=("ADMIN" "MEDECIN" "PATIENT" "SECRETAIRE")
for ROLE in "${ROLES[@]}"; do
    curl -s -X POST "$KC_URL/admin/realms/$REALM_NAME/roles" \
        -H "Authorization: Bearer $TKN" \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"$ROLE\"}"
done

echo "Creating Admin User..."
curl -s -X POST "$KC_URL/admin/realms/$REALM_NAME/users" \
    -H "Authorization: Bearer $TKN" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "admin",
        "enabled": true,
        "email": "admin@medinsight.com",
        "firstName": "Admin",
        "lastName": "System",
        "credentials": [{
            "type": "password",
            "value": "admin",
            "temporary": false
        }]
    }'

# Get Admin User ID
USER_ID=$(curl -s -X GET "$KC_URL/admin/realms/$REALM_NAME/users?username=admin" \
    -H "Authorization: Bearer $TKN" | jq -r '.[0].id')

# Get ADMIN Role ID
ROLE_ID=$(curl -s -X GET "$KC_URL/admin/realms/$REALM_NAME/roles/ADMIN" \
    -H "Authorization: Bearer $TKN" | jq -r '.id')

echo "Assigning ADMIN role to admin user..."
curl -s -X POST "$KC_URL/admin/realms/$REALM_NAME/users/$USER_ID/role-mappings/realm" \
    -H "Authorization: Bearer $TKN" \
    -H "Content-Type: application/json" \
    -d "[{\"id\": \"$ROLE_ID\", \"name\": \"ADMIN\"}]"

echo "Done."
