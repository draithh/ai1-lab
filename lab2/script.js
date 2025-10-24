class ToDo {
    constructor() {
        this.tasks = [];
        this.load();
        if (this.tasks.length === 0) {
            this.loadFromHtml();
            this.save();
        }
        this.initEventListeners();
        this.draw();
    }

    loadFromHtml() {
        const taskItems = document.querySelectorAll('ul li');
        taskItems.forEach(item => {
            const text = item.querySelector('.task-name').innerText;
            const dueDateElem = item.querySelector('.task-date');
            const dueDate = dueDateElem ? dueDateElem.innerText.replace('Due: ', '') : null;
            this.tasks.push({ text, dueDate });
        });
    }

    initEventListeners() {
        document.querySelector("#add-btn").addEventListener('click', () => this.addTask());
        document.getElementById("search").addEventListener('input', (e) => this.searchTasks(e.target.value));
    }

    addTask() {
        const taskInput = document.getElementById('new-task');
        const dueDateInput = document.getElementById('new-date');
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;

        if (this.validateTask(taskText, dueDate)) {
            const newTask = { text: taskText, dueDate: dueDate || null };
            this.tasks.push(newTask);
            this.save();
            this.draw();
            taskInput.value = '';
            dueDateInput.value = '';
        } else {
            alert('Data w przyszlosci ma byc i powyzej 2 znaki oraz max 254 znakow.');
        }
    }

    validateTask(text, dueDate) {
        if (text.length <= 2 || text.length > 255) return false;
        if (dueDate) {
            const due = new Date(dueDate);
            const now = new Date();
            if (due <= now) return false;
        }
        return true;
    }

    removeTask(index) {
        this.tasks.splice(index, 1);
        this.save();
        this.draw();
    }

    editTask(index, newText, newDueDate) {
        if (this.validateTask(newText, newDueDate)) {
            this.tasks[index] = { text: newText, dueDate: newDueDate || null };
            this.save();
            this.draw();
        } else {
            alert('Invalid task. Please ensure it has 3-255 characters and the due date is in the future or empty.');
        }
    }

    searchTasks(query) {
        const taskList = document.getElementById('todo-list');
        taskList.innerHTML = '';
        const lowerQuery = query.toLowerCase();

        this.tasks.forEach((task, index) => {
            if (query.length < 2 || task.text.toLowerCase().includes(lowerQuery)) {
                const listItem = this.createTaskListItem(task, index, lowerQuery);
                taskList.appendChild(listItem);
            }
        });
    }

    createTaskListItem(task, index, highlightQuery = '') {
        const listItem = document.createElement('li');
        listItem.className = 'task-item';

        const taskText = highlightQuery ? this.highlightText(task.text, highlightQuery) : task.text;
        listItem.innerHTML = `<span class="task-text">${taskText}</span> 
                              <span class="task-due-date">${task.dueDate ? `Data: ${task.dueDate}` : ''}</span>
                              <button class="edit-btn">Edytuj</button>
                              <button class="delete-btn">Usun</button>`;

        listItem.querySelector('.edit-btn').addEventListener('click', () => this.enableEditing(listItem, index));
        listItem.querySelector('.delete-btn').addEventListener('click', () => this.removeTask(index));

        return listItem;
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    enableEditing(listItem, index) {
        const task = this.tasks[index];
        listItem.innerHTML = `<input type="text" class="edit-input" value="${task.text}"/>
                              <input type="date" class="edit-due-date" value="${task.dueDate || ''}"/>
                              <button class="save-btn">Zapisz</button>`;

        listItem.querySelector('.save-btn').addEventListener('click', () => {
            const newText = listItem.querySelector('.edit-input').value.trim();
            const newDueDate = listItem.querySelector('.edit-due-date').value;
            this.editTask(index, newText, newDueDate);
        });
    }

    save() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    load() {
        const savedTasks = localStorage.getItem('todoTasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
    }

    draw() {
        const taskList = document.getElementById('todo-list');
        taskList.innerHTML = '';
        this.tasks.forEach((task, index) => {
            const listItem = this.createTaskListItem(task, index);
            taskList.appendChild(listItem);
        });
    }
}

document.todo = new ToDo();

