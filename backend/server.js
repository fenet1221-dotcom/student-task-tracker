const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    // READ FILE HELP
    const getTasks = () => {
        try {
            const data = fs.readFileSync("tasks.json");
            return JSON.parse(data);
        } catch {
            return [];
        }
    };

    const saveTasks = (tasks) => {
        fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));
    };

    // GET TASKS
    if (req.url === "/tasks" && req.method === "GET") {
        const tasks = getTasks();
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(tasks));
    }

    // POST TASK
    if (req.url === "/tasks" && req.method === "POST") {
        let body = "";

        req.on("data", chunk => body += chunk);

        req.on("end", () => {
            const tasks = getTasks();
            const newTask = JSON.parse(body);

            newTask.id = Date.now();
            tasks.push(newTask);

            saveTasks(tasks);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(newTask));
        });
    }

    // DELETE TASK
    if (req.url.startsWith("/tasks/") && req.method === "DELETE") {
        const id = req.url.split("/")[2];
        let tasks = getTasks();

        tasks = tasks.filter(t => t.id != id);
        saveTasks(tasks);

        res.writeHead(200);
        return res.end("Deleted");
    }

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});