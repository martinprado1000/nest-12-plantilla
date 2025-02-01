export const envLoader = () => ({
    jwt_secret: process.env.JWT_SECRET,
    environment: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    hostApi: process.env.HOST_API,
    database: {
        uri: process.env.DATABASE_URI,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD
    },
    pagination: {
        defaultLimit: Number(process.env.PAGINATIONS_DEFAULT_LIMIT)
        // Si quiero puedo poner un valor por defecto aca pero va atener mas fuerza el que configure en el Joi. Obviamente si el valor no viene defenido en la variable de entorno.
    }
})