/************************************
 ENHANCED STUDENT TASK TRACKER JS
************************************/

// Select DOM elements
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");
const taskDueDate = document.getElementById("taskDueDate");
const taskList = document.getElementById("tasks");

// Load tasks from localStorage when page loads
document.addEventListener("DOMContentLoaded", loadTasks);

/*************
 ADD NEW TASK
*************/
if (taskForm) {
    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = taskTitle.value.trim();
        const desc = taskDesc.value.trim();
        const due = taskDueDate.value;

        if (!title) {
            alert("Task title is required!");
            return;
        }

        const task = {
            id: Date.now(), // unique ID for each task
            title,
            desc,
            due,
            completed: false
        };

        addTaskToDOM(task);
        saveTask(task);

        // Clear form
        taskTitle.value = "";
        taskDesc.value = "";
        taskDueDate.value = "";
    });
}

/*************
 ADD TASK TO DOM
*************/
function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    if (task.completed) {
        li.classList.add("completed");
    }

    // Task header (checkbox + title + due date)
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

    // Task description (hidden by default)
    const desc = document.createElement("div");
    desc.classList.add("task-desc");
    desc.textContent = task.desc;

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    // Append everything
    li.appendChild(header);
    li.appendChild(desc);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    /********* EVENT LISTENERS *********/

    // Toggle description on header click
    header.addEventListener("click", () => {
        if (desc.textContent) { // only if description exists
            desc.style.display = desc.style.display === "block" ? "none" : "block";
        }
    });

    // Checkbox to mark completed
    checkbox.addEventListener("change", () => {
        li.classList.toggle("completed");
        updateTaskCompletion(task.id, checkbox.checked);
    });

    // Delete task
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent toggling description
        li.remove();
        deleteTask(task.id);
    });
}

/*************
 LOCALSTORAGE HELPERS
*************/

// Get all tasks
function getTasksFromStorage() {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
}

// Save new task
function saveTask(task) {
    const tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task completion
function updateTaskCompletion(id, completed) {
    const tasks = getTasksFromStorage();
    const task = tasks.find(t => t.id == id);
    if (task) {
        task.completed = completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}

// Delete task
function deleteTask(id) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(t => t.id != id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks on page load
function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => addTaskToDOM(task));
}
