$ErrorActionPreference = "Stop"

# Configuration
$KC_URL = "http://localhost:8090"
$REALM = "MedInsightRealm"
$CLIENT_ID = "frontend-client"
$ADMIN_USER = "admin"
$ADMIN_PWD = "admin"

Write-Host "1. Getting Admin Token..." -ForegroundColor Cyan
try {
    $tokenResponse = Invoke-RestMethod -Uri "$KC_URL/realms/master/protocol/openid-connect/token" -Method Post -Body @{
        username = "admin"
        password = "admin"
        grant_type = "password"
        client_id = "admin-cli"
    }
    $ADMIN_TOKEN = $tokenResponse.access_token
    Write-Host "SUCCESS: Admin token retrieved." -ForegroundColor Green
} catch {
    Write-Error "FAILED to get admin token. Check Keycloak is running and admin credentials."
    $_.Exception.Response.GetResponseStream() | %{ [System.IO.StreamReader]::new($_).ReadToEnd() }
    exit 1
}

$Headers = @{ Authorization = "Bearer $ADMIN_TOKEN"; "Content-Type" = "application/json" }

Write-Host "`n2. Listing All Users..." -ForegroundColor Cyan
try {
    $users = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users" -Method Get -Headers $Headers
    Write-Host "Found $($users.Count) users:"
    $users | Select-Object id, username, enabled, email | ConvertTo-Json
} catch {
    Write-Error "FAILED to list users."
    Write-Error $_
}

$TEST_USER = "jean.dupont@test.com"
Write-Host "`n3. Checking specific user: $TEST_USER" -ForegroundColor Cyan
$targetUser = $users | Where-Object { $_.username -eq $TEST_USER -or $_.email -eq $TEST_USER }

if ($targetUser) {
    Write-Host "User FOUND: $($targetUser.id)" -ForegroundColor Green
    Write-Host "Enabled Status: $($targetUser.enabled)"
    
    if (-not $targetUser.enabled) {
        Write-Host "User is DISABLED. Attempting to enable..." -ForegroundColor Yellow
        try {
            # Enable via Keycloak Admin API
            $updateBody = @{ enabled = $true } | ConvertTo-Json
            Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users/$($targetUser.id)" -Method Put -Headers $Headers -Body $updateBody
            Write-Host "SUCCESS: User enabled." -ForegroundColor Green
        } catch {
            Write-Error "FAILED to enable user."
            Write-Error $_
        }
    } else {
        Write-Host "User is already ENABLED." -ForegroundColor Green
    }
    
    Write-Host "`n4. Testing Login for $TEST_USER" -ForegroundColor Cyan
    try {
        $loginResponse = Invoke-RestMethod -Uri "$KC_URL/realms/MedInsightRealm/protocol/openid-connect/token" -Method Post -Body @{
            username = $TEST_USER
            password = "Patient123!"
            grant_type = "password"
            client_id = $CLIENT_ID
        }
        if ($loginResponse.access_token) {
            Write-Host "SUCCESS: Login successful! Access Token retrieved." -ForegroundColor Green
        }
    } catch {
        Write-Error "FAILED to login as $TEST_USER."
        $errorDetails = $_.Exception.Response.GetResponseStream() | %{ [System.IO.StreamReader]::new($_).ReadToEnd() }
        Write-Host "Error Details: $errorDetails" -ForegroundColor Red
        Write-Host "Possible causes: Wrong password, user still disabled, or client configuration issue."
    }

} else {
    Write-Warning "User $TEST_USER NOT FOUND. Registering DIRECTLY in Keycloak..."
    
    # Create User Data
    $userData = @{
        username = $TEST_USER
        email = $TEST_USER
        firstName = "Jean"
        lastName = "Dupont"
        enabled = $true
        credentials = @(@{
            type = "password"
            value = "Patient123!"
            temporary = $false
        })
    } | ConvertTo-Json -Depth 5

    try {
        # Create User
        Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users" -Method Post -Headers $Headers -Body $userData
        Write-Host "SUCCESS: User created in Keycloak." -ForegroundColor Green
        
        # We need to find the user to assign role
        $users = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users?username=$TEST_USER" -Method Get -Headers $Headers
        $newUserId = $users[0].id
        
        # Assign PATIENT Role
        Write-Host "Assigning PATIENT role..."
        $role = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/roles/PATIENT" -Method Get -Headers $Headers
        Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users/$newUserId/role-mappings/realm" -Method Post -Headers $Headers -Body (@($role) | ConvertTo-Json)
        Write-Host "SUCCESS: Role PATIENT assigned." -ForegroundColor Green
        
        # Test Login
        Write-Host "`n4. Testing Login for $TEST_USER" -ForegroundColor Cyan
        $loginResponse = Invoke-RestMethod -Uri "$KC_URL/realms/MedInsightRealm/protocol/openid-connect/token" -Method Post -Body @{
            username = $TEST_USER
            password = "Patient123!"
            grant_type = "password"
            client_id = "frontend-client"
        }
        if ($loginResponse.access_token) {
            Write-Host "SUCCESS: Login successful! Access Token retrieved." -ForegroundColor Green
        }
        
    } catch {
        Write-Error "FAILED to register or enable user."
        Write-Error $_
    }
}
