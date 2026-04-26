const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    // GET /tasks → read all tasks
    if (req.method === 'GET' && req.url === '/tasks') {
       fs.readFile(__dirname + '/tasks.json', 'utf8', (err, data) =>  {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error reading file' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }

    // Default route
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route not found');
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});