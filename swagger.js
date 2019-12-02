const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const packageJson = require('./package');

const options = {
    definition: {
        servers: [{ url: '/api' }],
        openapi: '3.0.0',
        info: {
            title: packageJson.name, // Title (required)
            version: packageJson.version, // Version (required)
            description: packageJson.description,
        },
    },
    apis: [
        './routes/api/job_offers.js',
        './routes/api/tags.js',
        './routes/api/users.js',
    ]
}

const swaggerSpec = swaggerJSDoc(options);
router.get('/spec', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
})
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// router.use(components.registry.authentication.service.constructor.authenticateApiKey);
router.use((req, res) => {
    res.status(404).json({ error: '404 Not Found' });
});

module.exports = router;


