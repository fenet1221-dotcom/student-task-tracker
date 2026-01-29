
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");
const taskDueDate = document.getElementById("taskDueDate");
const taskList = document.getElementById("tasks");


document.addEventListener("DOMContentLoaded", loadTasks);


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
            id: Date.now(), 
            title,
            desc,
            due,
            completed: false
        };

        addTaskToDOM(task);
        saveTask(task);

      
        taskTitle.value = "";
        taskDesc.value = "";
        taskDueDate.value = "";
    });
}

function addTaskToDOM(task) {
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

 
    li.appendChild(header);
    li.appendChild(desc);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    
    header.addEventListener("click", () => {
        if (desc.textContent) { 
            desc.style.display = desc.style.display === "block" ? "none" : "block";
        }
    });

    
    checkbox.addEventListener("change", () => {
        li.classList.toggle("completed");
        updateTaskCompletion(task.id, checkbox.checked);
        if (checkbox.checked) {
        playClickSound();   
    }
    });

    
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); 
        li.remove();
        deleteTask(task.id);
    });
}


function getTasksFromStorage() {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
}


function saveTask(task) {
    const tasks = getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    showNotification("Task saved successfully ✅");

        playClickSound();  
    }




function updateTaskCompletion(id, completed) {
    const tasks = getTasksFromStorage();
    const task = tasks.find(t => t.id == id);
    if (task) {
        task.completed = completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
       

    }
}


function deleteTask(id) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(t => t.id != id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
   

}


function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => addTaskToDOM(task));
}
function showNotification(message) {
    const notification = document.getElementById("notification");
    if (!notification) return;

    notification.textContent = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 2000);
}
const clickSound = new Audio("sounds/click.wav");

function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

