// import hapi
const Hapi = require('@hapi/hapi');
// import routes
const routes = require('./routes');

// create a new server instance
const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);
    
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();