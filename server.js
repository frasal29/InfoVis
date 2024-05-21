const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html'; // Se l'URL è '/', carica l'index.html
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
    }[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('Internal Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');

            // Stampa il contenuto del file JSON nel terminale
            if (extname === '.json') {
                console.log('Contenuto del file JSON:');
                console.log(content.toString());
            }
        }
    });
});

const port = 3000;
const hostname = '127.0.0.1';
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
