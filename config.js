require("msnodesqlv8");
module.exports = {
    db: {
        server: 'NASSIF107',
        database: 'Предприятие здорового питания',
        driver: "msnodesqlv8",
        options: {
            trustedConnection: true,
            trustServerCertificate: true,
        },
    },
    sessionSecret: 'your-session-secret',
}