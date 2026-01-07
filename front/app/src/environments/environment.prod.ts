export const environment = {
    production: true,
    keycloak: {
        url: 'http://keycloak:8080', // Docker internal URL for heavy calls if needed, or public URL for browser
        realm: 'MedInsightRealm',
        clientId: 'frontend-client'
    },
    apiUrl: 'http://localhost:8084' // Gateway public URL
};
