$ErrorActionPreference = "Stop"

$KC_URL = "http://localhost:8090"
$REALM = "MedInsightRealm"
$ADM_USER = "admin"
$ADM_PWD = "admin"

Write-Host "Getting Admin Token..."
try {
    $tokenResponse = Invoke-RestMethod -Uri "$KC_URL/realms/master/protocol/openid-connect/token" -Method Post -Body @{
        username = "admin"
        password = "admin"
        grant_type = "password"
        client_id = "admin-cli"
    }
    $TKN = $tokenResponse.access_token
} catch {
    Write-Error "Failed to get admin token. Is Keycloak running?"
    exit 1
}

$Headers = @{ Authorization = "Bearer $TKN"; "Content-Type" = "application/json" }

Write-Host "Fixing frontend-client..."
try {
    # Get ID
    $clients = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/clients?clientId=frontend-client" -Method Get -Headers $Headers
    $CLIENT_ID = $clients[0].id

    if ($CLIENT_ID) {
        # Update
        Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/clients/$CLIENT_ID" -Method Put -Headers $Headers -Body (@{
            id = $CLIENT_ID
            clientId = "frontend-client"
            enabled = $true
            publicClient = $true
            directAccessGrantsEnabled = $true
            redirectUris = @("http://localhost:5173/*", "http://localhost:8080/*", "http://localhost:4200/*")
            webOrigins = @("*")
        } | ConvertTo-Json -Depth 5)
        Write-Host "frontend-client updated successfully."
    } else {
        Write-Warning "frontend-client not found!"
    }
} catch {
    Write-Error "Failed to update client: $_"
}

Write-Host "Verifying Admin User in $REALM..."
try {
    $users = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users?username=$ADM_USER" -Method Get -Headers $Headers
    if ($users.Count -eq 0) {
        Write-Host "User $ADM_USER not found. Creating..."
        # Create
          Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users" -Method Post -Headers $Headers -Body (@{
            username = $ADM_USER
            enabled = $true
            email = "admin@medinsight.com"
            firstName = "Admin"
            lastName = "System"
            credentials = @(@{
                type = "password"
                value = $ADM_PWD
                temporary = $false
            })
        } | ConvertTo-Json -Depth 10)
        Write-Host "User created."
        
        # Assign Role (Re-fetch user ID)
        $users = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users?username=$ADM_USER" -Method Get -Headers $Headers
        $USER_ID = $users[0].id
        
        # Get ADMIN role
        $role = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/roles/ADMIN" -Method Get -Headers $Headers
        $ROLE_ID = $role.id
        
        Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users/$USER_ID/role-mappings/realm" -Method Post -Headers $Headers -Body (@(@{
            id = $ROLE_ID
            name = "ADMIN"
        }) | ConvertTo-Json)
         Write-Host "ADMIN role assigned."
    } else {
        Write-Host "User $ADM_USER exists."
        # Reset Password just in case
        $USER_ID = $users[0].id
        Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users/$USER_ID/reset-password" -Method Put -Headers $Headers -Body (@{
            type = "password"
            value = $ADM_PWD
            temporary = $false
        } | ConvertTo-Json)
        Write-Host "Password reset to '$ADM_PWD'."
    }
} catch {
    Write-Error "Failed to check/create user: $_"
}
