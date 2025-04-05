// swagger.config.js


export const swaggerConfig = {
    swaggerDefinition: {
        openapi: "3.1.0",
        info:{
            title: 'Api de ejemplo',
            description: "Lorem ipsum dolor sit amet del api de ejemplo",
            version: "1.0.0"
        },
        server: [
            { url: "http://localhost:3000"}
        ]
    }, 
    apis : ["./src/routes/**/*.ts"]
}
