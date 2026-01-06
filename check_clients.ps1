$ErrorActionPreference = "Stop"
$KC_URL = "http://localhost:8090"
$REALM = "MedInsightRealm"

Write-Host "Getting Master Admin Token..."
$token = (Invoke-RestMethod -Uri "$KC_URL/realms/master/protocol/openid-connect/token" -Method Post -Body @{
    username = "admin"
    password = "admin"
    grant_type = "password"
    client_id = "admin-cli"
}).access_token

$Headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }

Write-Host "Listing Clients in $REALM..."
$clients = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/clients" -Method Get -Headers $Headers
$target = $clients | Where-Object { $_.clientId -eq "backend-service" }

if ($target) {
    Write-Host "Found backend-service:" -ForegroundColor Green
    $target | Select-Object clientId, id, secret, serviceAccountsEnabled | ConvertTo-Json
    
    # Check Service Account User
    $saUser = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users?username=service-account-backend-service" -Method Get -Headers $Headers
    if ($saUser) {
        $saUserId = $saUser[0].id
        Write-Host "Found Service Account User ID: $saUserId"
        
        # Check Roles
        $roles = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users/$saUserId/role-mappings/realm" -Method Get -Headers $Headers
        Write-Host "Current Realm Roles:"
        $roles | Select-Object name | ConvertTo-Json
        
        # Assign realm-admin role if missing
        $adminRole = $roles | Where-Object { $_.name -eq "admin" } # usually 'admin' or 'realm-admin' depending on setup. let's check available roles.
        
        # Actually, for service accounts to manage users, they often need 'realm-management' client roles.
        # Let's check client roles for 'realm-management'
        
        # Get realm-management client ID
        $realmMgmt = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/clients?clientId=realm-management" -Method Get -Headers $Headers
        $realmMgmtId = $realmMgmt[0].id
        
        $userClientRoles = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users/$saUserId/role-mappings/clients/$realmMgmtId" -Method Get -Headers $Headers
        Write-Host "Current Realm-Management Roles:"
        $userClientRoles | Select-Object name | ConvertTo-Json
        
        $hasManageUsers = $userClientRoles | Where-Object { $_.name -eq "manage-users" }
        
        if (-not $hasManageUsers) {
            Write-Warning "Service Account missing 'manage-users' role. Assigning..."
            
            # Get manage-users role
            $manageUsersRole = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/clients/$realmMgmtId/roles/manage-users" -Method Get -Headers $Headers
            $viewUsersRole = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/clients/$realmMgmtId/roles/view-users" -Method Get -Headers $Headers
            
            # Assign
            Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users/$saUserId/role-mappings/clients/$realmMgmtId" -Method Post -Headers $Headers -Body (@($manageUsersRole, $viewUsersRole) | ConvertTo-Json)
            Write-Host "SUCCESS: Assigned manage-users and view-users roles." -ForegroundColor Green
        } else {
             Write-Host "Service Account already has manage-users role." -ForegroundColor Green
        }
        
        # Check for view-realm
        $hasViewRealm = $userClientRoles | Where-Object { $_.name -eq "view-realm" }
        if (-not $hasViewRealm) {
             Write-Host "Assigning view-realm..."
             $viewRealmRole = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/clients/$realmMgmtId/roles/view-realm" -Method Get -Headers $Headers
             Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users/$saUserId/role-mappings/clients/$realmMgmtId" -Method Post -Headers $Headers -Body (@($viewRealmRole) | ConvertTo-Json)
             Write-Host "SUCCESS: Assigned view-realm role." -ForegroundColor Green
        } else {
             Write-Host "Service Account already has view-realm role." -ForegroundColor Green
        }
        
    } else {
        Write-Warning "Service Account User NOT FOUND (maybe service accounts not enabled?)"
    }

} else {
    Write-Warning "backend-service client NOT FOUND!"
}
