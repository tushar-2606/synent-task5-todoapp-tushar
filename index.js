const STORAGE_KEY = 'todoListTasks';
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const completeAllButton = document.getElementById('completeAllButton');
const clearCompletedButton = document.getElementById('clearCompletedButton');
const taskForm = document.getElementById('taskForm');
const todoList = document.getElementById('todoList');
const stats = document.getElementById('stats');

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const saveTasks = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const updateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    stats.textContent = `${total} task${total === 1 ? '' : 's'} · ${completed} completed`;
    updateButtons();
};

const escapeHtml = (text) =>
    text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

const renderTasks = () => {
    if (!tasks.length) {
        todoList.innerHTML = '<li class="empty-state">No tasks yet. Add one above to get started!</li>';
        return;
    }

    todoList.innerHTML = tasks
        .map(
            (task, index) =>
                `<li class="${task.completed ? 'completed' : ''}" data-index="${index}">
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <div class="task-actions">
                        <button class="complete-btn" aria-label="${task.completed ? 'Undo task' : 'Complete task'}">
                            ${task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button class="delete-btn" aria-label="Delete task">&times;</button>
                    </div>
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

    tasks.unshift({ text, completed: false });
    saveTasks();
    renderTasks();
    updateStats();
    taskInput.value = '';
    taskInput.focus();
};

const completeAllTasks = () => {
    tasks = tasks.map((task) => ({ ...task, completed: true }));
    saveTasks();
    renderTasks();
    updateStats();
};

const clearCompletedTasks = () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
    updateStats();
};

const updateButtons = () => {
    const completedCount = tasks.filter((task) => task.completed).length;
    const hasTasks = tasks.length > 0;
    const hasIncomplete = tasks.some((task) => !task.completed);

    completeAllButton.disabled = !hasTasks || !hasIncomplete;
    clearCompletedButton.disabled = completedCount === 0;
};

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addTask();
});

completeAllButton.addEventListener('click', completeAllTasks);
clearCompletedButton.addEventListener('click', clearCompletedTasks);

todoList.addEventListener('click', (event) => {
    const listItem = event.target.closest('li');
    if (!listItem || listItem.classList.contains('empty-state')) {
        return;
    }

    const index = Number(listItem.dataset.index);
    if (event.target.classList.contains('delete-btn')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        updateStats();
        return;
    }

    if (event.target.classList.contains('complete-btn')) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
        updateStats();
        return;
    }

    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    updateStats();
});

renderTasks();
updateStats();
updateButtons();
