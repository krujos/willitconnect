const http = require('http');
const https = require('https');
const net = require('net');
const url = require('url');
const path = require('path');
const fs = require('fs');

const PORT = 8080;

// Helper to parse hostname:port
function parseHostPort(target) {
    const match = target.match(/^([\w\.-]+)(?::(\d+))?$/);
    if (match) {
        return {
            hostname: match[1],
            port: match[2] ? parseInt(match[2]) : 80
        };
    }
    return null;
}

// Check if target is a valid URL
function isValidUrl(target) {
    try {
        const parsed = new URL(target);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (e) {
        return false;
    }
}

// Check socket connection
function checkSocketConnection(hostname, port, httpProxy) {
    return new Promise((resolve) => {
        const startTime = Date.now();

        if (httpProxy) {
            const proxyMatch = httpProxy.match(/^(.+):(\d+)$/);
            if (!proxyMatch) {
                resolve({
                    canConnect: false,
                    httpStatus: 0,
                    responseTime: Date.now() - startTime
                });
                return;
            }

            const proxyHost = proxyMatch[1];
            const proxyPort = parseInt(proxyMatch[2]);

            const socket = net.createConnection({
                host: proxyHost,
                port: proxyPort,
                timeout: 3000
            });

            socket.on('connect', () => {
                socket.write(`CONNECT ${hostname}:${port} HTTP/1.1\r\nHost: ${hostname}:${port}\r\n\r\n`);
            });

            socket.on('data', (data) => {
                const response = data.toString();
                const canConnect = response.includes('200');
                socket.end();
                resolve({
                    canConnect,
                    httpStatus: 0,
                    responseTime: Date.now() - startTime,
                    httpProxy
                });
            });

            socket.on('error', () => {
                resolve({
                    canConnect: false,
                    httpStatus: 0,
                    responseTime: Date.now() - startTime,
                    httpProxy
                });
            });

            socket.on('timeout', () => {
                socket.destroy();
                resolve({
                    canConnect: false,
                    httpStatus: 0,
                    responseTime: Date.now() - startTime,
                    httpProxy
                });
            });
        } else {
            const socket = net.createConnection({
                host: hostname,
                port: port,
                timeout: 3000
            });

            socket.on('connect', () => {
                socket.end();
                resolve({
                    canConnect: true,
                    httpStatus: 0,
                    responseTime: Date.now() - startTime
                });
            });

            socket.on('error', () => {
                resolve({
                    canConnect: false,
                    httpStatus: 0,
                    responseTime: Date.now() - startTime
                });
            });

            socket.on('timeout', () => {
                socket.destroy();
                resolve({
                    canConnect: false,
                    httpStatus: 0,
                    responseTime: Date.now() - startTime
                });
            });
        }
    });
}

// Check URL connection
function checkUrlConnection(targetUrl, httpProxy) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        const parsedUrl = new URL(targetUrl);
        const isHttps = parsedUrl.protocol === 'https:';
        const client = isHttps ? https : http;

        const options = {
            method: 'GET',
            timeout: 3000
        };

        if (httpProxy) {
            const proxyMatch = httpProxy.match(/^(.+):(\d+)$/);
            if (!proxyMatch) {
                resolve({
                    canConnect: false,
                    httpStatus: 0,
                    responseTime: Date.now() - startTime,
                    httpProxy
                });
                return;
            }

            options.agent = new http.Agent({
                host: proxyMatch[1],
                port: parseInt(proxyMatch[2])
            });
        }

        const req = client.get(targetUrl, options, (res) => {
            resolve({
                canConnect: true,
                httpStatus: res.statusCode,
                responseTime: Date.now() - startTime,
                httpProxy: httpProxy || undefined
            });
            res.resume();
        });

        req.on('error', () => {
            resolve({
                canConnect: false,
                httpStatus: 0,
                responseTime: Date.now() - startTime,
                httpProxy: httpProxy || undefined
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                canConnect: false,
                httpStatus: 0,
                responseTime: Date.now() - startTime,
                httpProxy: httpProxy || undefined
            });
        });
    });
}

// Main HTTP server
const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API endpoint
    if (req.url === '/v2/willitconnect' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const target = data.target;
                const httpProxy = data.http_proxy || null;

                let result;
                const isUrl = isValidUrl(target);
                const hostPort = parseHostPort(target);

                if (isUrl) {
                    result = await checkUrlConnection(target, httpProxy);
                } else if (hostPort) {
                    result = await checkSocketConnection(hostPort.hostname, hostPort.port, httpProxy);
                } else {
                    result = {
                        canConnect: false,
                        httpStatus: 0,
                        responseTime: 0
                    };
                }

                const response = {
                    lastChecked: Date.now(),
                    entry: target,
                    canConnect: result.canConnect,
                    httpStatus: result.httpStatus,
                    validHostname: hostPort !== null,
                    validUrl: isUrl,
                    responseTime: result.responseTime
                };

                if (httpProxy) {
                    response.httpProxy = httpProxy;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
        return;
    }

    // Serve static files
    const staticDir = path.join(__dirname, 'build/resources/main/static');
    let filePath = path.join(staticDir, req.url === '/' ? 'index.html' : req.url);

    // Security: prevent directory traversal
    if (!filePath.startsWith(staticDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }

        const ext = path.extname(filePath);
        const contentTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2'
        };

        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Will It Connect server running at http://localhost:${PORT}/`);
    console.log(`API endpoint: http://localhost:${PORT}/v2/willitconnect`);
});
