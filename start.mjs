import { handler } from './dist/server/entry.mjs';
import http from 'node:http';

const server = http.createServer(handler);
const port = process.env.PORT || 4321;
const host = '0.0.0.0';

server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
}); 