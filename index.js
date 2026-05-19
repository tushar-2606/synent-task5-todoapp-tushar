const STORAGE_KEY = 'todoListTasks';
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const todoList = document.getElementById('todoList');

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const saveTasks = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const escapeHtml = (text) =>
    text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

const renderTasks = () => {
    todoList.innerHTML = tasks
        .map(
            (task, index) =>
                `<li class="${task.completed ? 'completed' : ''}" data-index="${index}">
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <button class="delete-btn" aria-label="Delete task">&times;</button>
                </li>`
        )
        .join('');
};

const addTask = () => {
    const text = taskInput.value.trim();
    if (!text) {
        taskInput.focus();
        return;
    }

    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
};

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

todoList.addEventListener('click', (event) => {
    const listItem = event.target.closest('li');
    if (!listItem) {
        return;
    }

    const index = Number(listItem.dataset.index);
    if (event.target.classList.contains('delete-btn')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        return;
    }

    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
});

renderTasks();
