import { handler } from './dist/server/entry.mjs';
import http from 'node:http';

const server = http.createServer(handler);
const port = process.env.PORT || 4321;
const host = '0.0.0.0';

// Function to try different ports if the default is in use
const startServer = async (initialPort) => {
    let currentPort = initialPort;

    while (true) {
        try {
            await new Promise((resolve, reject) => {
                server.listen(currentPort, host)
                    .once('listening', () => {
                        console.log(`Server running on http://${host}:${currentPort}`);
                        resolve();
                    })
                    .once('error', (err) => {
                        if (err.code === 'EADDRINUSE') {
                            server.close();
                            reject(err);
                        } else {
                            reject(err);
                        }
                    });
            });
            break; // If successful, exit the loop
        } catch (err) {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${currentPort} is in use, trying ${currentPort + 1}...`);
                currentPort++;
            } else {
                console.error('Server error:', err);
                process.exit(1);
            }
        }
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

startServer(port); 