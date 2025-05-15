// swagger.config.ts

export const swaggerConfig = {
    swaggerDefinition: {
        openapi: "3.1.0",
        info:{
            title: 'API E-commerce',
            description: "API REST para plataforma de E-commerce",
            version: "1.0.0"
        },
        servers: [
            { url: "http://localhost:3000"}
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    }, 
    apis : ["./src/routes/**/*.ts"]
}