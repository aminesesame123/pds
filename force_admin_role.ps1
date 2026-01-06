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

Write-Host "Finding Service Account User..."
$saUser = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users?username=service-account-backend-service" -Method Get -Headers $Headers
if (-not $saUser) { Write-Error "Service account user not found"; exit 1 }
$saUserId = $saUser[0].id
Write-Host "Service Account ID: $saUserId"

Write-Host "Finding realm-management client..."
$realmMgmt = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/clients?clientId=realm-management" -Method Get -Headers $Headers
$realmMgmtId = $realmMgmt[0].id
Write-Host "realm-management ID: $realmMgmtId"

Write-Host "Getting realm-admin role..."
$adminRole = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/clients/$realmMgmtId/roles/realm-admin" -Method Get -Headers $Headers
Write-Host "Role found: $($adminRole.name)"

Write-Host "Assigning realm-admin role..."
try {
    # Keycloak might return 204 or 409 if exists, but we use POST
    Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users/$saUserId/role-mappings/clients/$realmMgmtId" -Method Post -Headers $Headers -Body (@($adminRole) | ConvertTo-Json)
    Write-Host "SUCCESS: realm-admin assigned." -ForegroundColor Green
} catch {
    Write-Warning "Assignment failed (possibly already exists?): $_"
    # Print roles to verify
    $roles = Invoke-RestMethod -Uri "$KC_URL/admin/realms/$REALM/users/$saUserId/role-mappings/clients/$realmMgmtId" -Method Get -Headers $Headers
    Write-Host "Current roles for realm-management:"
    $roles | Select-Object name | ConvertTo-Json
}
