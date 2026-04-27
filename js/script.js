document.addEventListener("DOMContentLoaded", () => {

    const taskForm = document.getElementById("taskForm");
    const taskTitle = document.getElementById("taskTitle");
    const taskDesc = document.getElementById("taskDesc");
    const taskDueDate = document.getElementById("taskDueDate");
    const taskList = document.getElementById("tasks");

    const API_URL = "http://localhost:3000/tasks";

    // LOAD TASKS
    async function loadTasks() {
        const res = await fetch(API_URL);
        const tasks = await res.json();

        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.dataset.id = task.id;

            if (task.completed) {
                li.classList.add("completed");
            }

            const header = document.createElement("div");
            header.classList.add("task-header");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            const title = document.createElement("h3");
            title.textContent = task.title;

            const due = document.createElement("span");
            due.textContent = task.due ? `Due: ${task.due}` : "";
            due.style.fontSize = "0.9rem";
            due.style.color = "#999";
            due.style.marginLeft = "0.8rem";

            header.appendChild(checkbox);
            header.appendChild(title);
            header.appendChild(due);

            const desc = document.createElement("div");
            desc.classList.add("task-desc");
            desc.textContent = task.desc;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";

            const taskText = document.createElement("div");
            taskText.classList.add("task-text");

            taskText.appendChild(header);
            taskText.appendChild(desc);

            li.appendChild(taskText);
            li.appendChild(deleteBtn);

            // Toggle completed (PUT)
            checkbox.addEventListener("change", async () => {
                await fetch(`${API_URL}/${task.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        completed: checkbox.checked
                    })
                });

                loadTasks();
            });

            // Delete task (DELETE)
            deleteBtn.addEventListener("click", async (e) => {
                e.stopPropagation();

                await fetch(`${API_URL}/${task.id}`, {
                    method: "DELETE"
                });

                loadTasks();
            });

            taskList.appendChild(li);
        });
    }

    // ADD TASK (POST)
    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const task = {
            title: taskTitle.value.trim(),
            desc: taskDesc.value.trim(),
            due: taskDueDate.value,
            completed: false
        };

        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        taskTitle.value = "";
        taskDesc.value = "";
        taskDueDate.value = "";

        loadTasks();
    });

    loadTasks();
});