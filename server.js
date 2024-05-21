// Node.js server script

const http = require('http'); // Import http module
const fs = require('fs'); // Import fs module
const path = require('path'); // Import path module

// Create HTTP server
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url; // Get file path from request URL
    if (filePath === './') {
        filePath = './index.html'; // If URL is '/', load index.html
    }

    const extname = String(path.extname(filePath)).toLowerCase(); // Get file extension
    const contentType = { // Map file extensions to content types
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
    }[extname] || 'application/octet-stream';

    // Read requested file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code == 'ENOENT') { // If file not found
                res.writeHead(404);
                res.end('404 Not Found');
            } else { // Other errors
                res.writeHead(500);
                res.end('Internal Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType }); // Set response content type
            res.end(content, 'utf-8'); // Send file content

            // Print JSON file content to the terminal
            if (extname === '.json') {
                console.log('JSON file content:');
                console.log(content.toString());
            }
        }
    });
});

// Define server port and hostname
const port = 3000;
const hostname = '127.0.0.1';
server.listen(port, hostname, () => { // Start server
    console.log(`Server running at http://${hostname}:${port}/`);
});