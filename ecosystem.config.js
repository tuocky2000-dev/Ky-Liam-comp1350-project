module.exports = {
    apps: [
        {
            name: 'comp1350-backend-1',
            script: './server.js',
            instances: 1,
            env: {
                PORT: 3001,
                NODE_ENV: 'production'
            }
        },
        {
            name: 'comp1350-backend-2',
            script: './server.js',
            instances: 1,
            env: {
                PORT: 3002,
                NODE_ENV: 'production'
            }
        }
    ]
};