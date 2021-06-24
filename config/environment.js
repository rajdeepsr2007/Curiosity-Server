const development = {
    name : 'development',
    jwt_secret : '34688CC249337EB1731FBFA6F2CDA',
    db : 'curiosity_development'
}

const production = {
    name : 'production',
    jwt_secret : process.env.CURIOSITY_JWT_SECRET,
    db : process.env.CURIOSITY_DB,
}

module.exports =  (process.env.CURIOSITY_ENVIRONMENT) == undefined ? development : production ;