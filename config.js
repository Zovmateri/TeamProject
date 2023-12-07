require("msnodesqlv8");
module.exports = {
    db: {
        server: 'NASSIF107',
        database: 'KitchenAmateur',
        driver: "msnodesqlv8",
        options: {
            trustedConnection: true,
            trustServerCertificate: true,
        },
    },
    sessionSecret: 'your-session-secret',
}