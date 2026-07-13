import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8080',
    realm: 'bookmyvenue',
    clientId: 'bookmyvenue-client',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;