const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const killPort = require('kill-port');
const path = require('path');
const itemsRouter = require('./routes/items');
const statsRouter = require('./routes/stats');
const blockchainApiTestRouter = require('./routes/blockchainApiTest');
const { initRuntimeConfig } = require('./config/runtimeConfig');
require('dotenv').config();

const app = express();
const INITIAL_PORT = parseInt(process.env.PORT, 10) || 3001;

// Middleware
app.use(cors({ origin: `http://localhost:${INITIAL_PORT}` }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/blockchainApiTest', blockchainApiTestRouter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const startServer = async (port) => {
    await initRuntimeConfig();

    try {
        const server = app.listen(port, () => {
            console.log(`✅ Backend running at http://localhost:${port}`);
        });

        const shutdownHandler = (signal) => {
            console.log(`\nCaught ${signal}. Shutting down gracefully...`);
            server.close(() => {
                console.log('✅ Server closed. Port released.');
                process.exit(0);
            });

            setTimeout(() => {
                console.error('❌ Force exiting after timeout');
                process.exit(1);
            }, 5000);
        };

        process.on('SIGINT', () => shutdownHandler('SIGINT'));
        process.on('SIGTERM', () => shutdownHandler('SIGTERM'));
        process.on('uncaughtException', (err) => {
            console.error('❌ Uncaught Exception:', err);
            shutdownHandler('uncaughtException');
        });

    } catch (err) {
        if (err.code === 'EADDRINUSE') {
            console.warn(`⚠️ Port ${port} is already in use. Trying port ${port + 1}...`);
            safeStart(port + 1);
        } else {
            console.error('❌ Unexpected error while starting server:', err);
            process.exit(1);
        }
    }
};

const safeStart = async (port) => {
    try {
        await killPort(port, 'tcp');
        console.log(`💡 Ensured port ${port} is free.`);
    } catch (err) {
        console.log(`⚠️ Nothing to kill on port ${port}. Probably already free.`);
    }

    // Now try to start regardless of kill-port success
    startServer(port);
};

safeStart(INITIAL_PORT);
