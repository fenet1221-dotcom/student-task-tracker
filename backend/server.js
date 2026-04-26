const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    // GET /tasks → read all tasks
    if (req.method === 'GET' && req.url === '/tasks') {
        fs.readFile(__dirname + '/tasks.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error reading file' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }

    // POST /tasks → create new task
    else if (req.method === 'POST' && req.url === '/tasks') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const newTask = JSON.parse(body);

            fs.readFile(__dirname + '/tasks.json', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Error reading file' }));
                }

                const tasks = JSON.parse(data);

                // give ID
                newTask.id = Date.now();

                tasks.push(newTask);

                fs.writeFile(__dirname + '/tasks.json', JSON.stringify(tasks, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: 'Error saving file' }));
                    }

                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newTask));
                });
            });
        });
    }
    //put
else if (req.method === 'PUT' && req.url.startsWith('/tasks/')) {

    const id = req.url.split('/')[2];
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {

        const updatedTask = JSON.parse(body);

        fs.readFile(__dirname + '/tasks.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error reading file' }));
            }

            let tasks = JSON.parse(data);

            let found = false;

            tasks = tasks.map(task => {
                if (task.id == id) {
                    found = true;
                    return { ...task, ...updatedTask, id: task.id };
                }
                return task;
            });

            if (!found) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Task not found' }));
            }

            fs.writeFile(__dirname + '/tasks.json', JSON.stringify(tasks, null, 2), (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Error saving file' }));
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Task updated successfully' }));
            });
        });
    });
}
else if (req.method === 'DELETE' && req.url.startsWith('/tasks/')) {

    const id = req.url.split('/')[2];

    fs.readFile(__dirname + '/tasks.json', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Error reading file' }));
        }

        let tasks = JSON.parse(data);

        const newTasks = tasks.filter(task => task.id != id);

        if (tasks.length === newTasks.length) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Task not found' }));
        }

        fs.writeFile(__dirname + '/tasks.json', JSON.stringify(newTasks, null, 2), (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error saving file' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Task deleted successfully' }));
        });
    });
}
//delete
else if (req.method === 'DELETE' && req.url.startsWith('/tasks/')) {

    const id = req.url.split('/')[2];

    fs.readFile(__dirname + '/tasks.json', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Error reading file' }));
        }

        let tasks = JSON.parse(data);

        const newTasks = tasks.filter(task => task.id != id);

        if (tasks.length === newTasks.length) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Task not found' }));
        }

        fs.writeFile(__dirname + '/tasks.json', JSON.stringify(newTasks, null, 2), (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Error saving file' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Task deleted successfully' }));
        });
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