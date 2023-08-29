export const dynamicConfig = {
    version: '1.0.0',
    swaggerDefinition: {
        basePath: '/api',
        info: {
            description: 'Growers Swagger',
            title: 'Growers',
        },
        securityDefinitions: {
            Bearer: {
                in: 'header',
                name: 'Authorization',
                type: 'apiKey',
            },
        },
    },
    swaggerUrl: '/api-docs',
    authProvider: {
        authorization: {
            rules: []
        },
    },
};
