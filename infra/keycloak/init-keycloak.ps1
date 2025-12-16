# Wait for Keycloak to start
Write-Host "Waiting for Keycloak to start..."
do {
    Start-Sleep -Seconds 5
    $status = try { Invoke-WebRequest -Uri "http://localhost:8090/realms/master/.well-known/openid-configuration" -Method Get -ErrorAction Stop } catch { $null }
} until ($status.StatusCode -eq 200)

# Variables
$KC_URL = "http://localhost:8090"
$KC_ADM = "admin"
$KC_PWD = "admin"
$REALM_NAME = "MedInsightRealm"

Write-Host "Getting Admin Token..."
$tokenResponse = Invoke-RestMethod -Uri "$KC_URL/realms/master/protocol/openid-connect/token" -Method Post -Body @{
    username = $KC_ADM
    password = $KC_PWD
    grant_type = "password"
    client_id = "admin-cli"
}
$TKN = $tokenResponse.access_token

if (-not $TKN) {
    Write-Host "Error getting token"
    exit 1
}

$Headers = @{
    Authorization = "Bearer $TKN"
    "Content-Type" = "application/json"
}

Write-Host "Creating Realm $REALM_NAME..."
try {
    Invoke-RestMethod -Uri "$KC_URL/admin/realms" -Method Post -Headers $Headers -Body (@{
        realm = $REALM_NAME
        enabled = $true
    } | ConvertTo-Json)
} catch {
    Write-Host "Realm might already exist, continuing..."
}

Write-Host "Creating Client frontend..."
try {
    Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM_NAME/clients" -Method Post -Headers $Headers -Body (@{
        clientId = "frontend-client"
        enabled = $true
        publicClient = $true
        redirectUris = @("http://localhost:5173/*", "http://localhost:8080/*")
        webOrigins = @("*")
    } | ConvertTo-Json -Depth 10)
} catch {}

Write-Host "Creating Client backend-service..."
try {
    Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM_NAME/clients" -Method Post -Headers $Headers -Body (@{
        clientId = "backend-service"
        enabled = $true
        publicClient = $false
        clientAuthenticatorType = "client-secret"
        secret = "backend-secret"
        serviceAccountsEnabled = $true
    } | ConvertTo-Json)
} catch {}

Write-Host "Creating Roles..."
$ROLES = @("ADMIN", "MEDECIN", "PATIENT", "SECRETAIRE")
foreach ($ROLE in $ROLES) {
    try {
        Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM_NAME/roles" -Method Post -Headers $Headers -Body (@{
            name = $ROLE
        } | ConvertTo-Json)
    } catch {}
}

Write-Host "Setting 'PATIENT' as Default Role..."
try {
    # Get PATIENT Role ID
    $patientRole = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM_NAME/roles/PATIENT" -Method Get -Headers $Headers
    $PATIENT_ROLE_ID = $patientRole.id
    
    # Get Realm Default Role (usually just /roles) 
    # Use: POST /{realm}/users/{id}/role-mappings/realm IS for users
    # To make it default for NEW users, we add it to the Realm's default roles.
    # Endpoint: POST /admin/realms/{realm}/roles/{role-name}/composites -> Add child role (PATIENT) to default-roles-{realm}
    
    # 1. Get default-roles-{realm} ID
    $defaultRole = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM_NAME/roles/default-roles-$REALM_NAME" -Method Get -Headers $Headers
    $DEFAULT_ROLE_ID = $defaultRole.id

    # 2. Add PATIENT to default roles
    Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM_NAME/roles-by-id/$DEFAULT_ROLE_ID/composites" -Method Post -Headers $Headers -Body (@(@{
        id = $PATIENT_ROLE_ID
        name = "PATIENT"
    }) | ConvertTo-Json)
} catch {
    Write-Host "Failed to set default role: $_"
}

Write-Host "Creating Admin User..."
try {
    Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM_NAME/users" -Method Post -Headers $Headers -Body (@{
        username = "admin"
        enabled = $true
        email = "admin@medinsight.com"
        firstName = "Admin"
        lastName = "System"
        credentials = @(@{
            type = "password"
            value = "admin"
            temporary = $false
        })
    } | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "User might already exist"
}

# Get Admin User ID
$users = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM_NAME/users?username=admin" -Method Get -Headers $Headers
$USER_ID = $users[0].id

# Get ADMIN Role ID
$role = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM_NAME/roles/ADMIN" -Method Get -Headers $Headers
$ROLE_ID = $role.id

Write-Host "Assigning ADMIN role to admin user..."
try {
    Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM_NAME/users/$USER_ID/role-mappings/realm" -Method Post -Headers $Headers -Body (@(@{
        id = $ROLE_ID
        name = "ADMIN"
    }) | ConvertTo-Json)
} catch {}

Write-Host "Done."
