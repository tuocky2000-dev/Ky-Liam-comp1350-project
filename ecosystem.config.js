module.exports = {
    apps: [
        {
            name: 'comp1350-backend-1',
            script: './server.js',
            instances: 1,
            env: {
                PORT: 3001,
                NODE_ENV: 'production'
            },
            output: './logs/pm2-out-1.log',
            error: './logs/pm2-error-1.log',
            merge_logs: true
        },
        {
            name: 'comp1350-backend-2',
            script: './server.js',
            instances: 1,
            env: {
                PORT: 3002,
                NODE_ENV: 'production'
            },
            output: './logs/pm2-out-2.log',
            error: './logs/pm2-error-2.log',
            merge_logs: true
        }
    ]
};