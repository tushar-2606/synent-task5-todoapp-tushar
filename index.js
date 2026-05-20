const STORAGE_KEY = 'todoListTasks';
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const completeAllButton = document.getElementById('completeAllButton');
const clearCompletedButton = document.getElementById('clearCompletedButton');
const taskForm = document.getElementById('taskForm');
const todoList = document.getElementById('todoList');
const stats = document.getElementById('stats');
const fab = document.getElementById('fab');

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
        todoList.innerHTML = '<li class="empty-state">No tasks yet — add something to get started.</li>';
        return;
    }

    todoList.innerHTML = tasks
        .map((task, index) => {
            const checked = task.completed ? 'completed' : '';
            return `
                <li class="${checked}" data-index="${index}">
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <div class="task-actions">
                        <button class="complete-btn" aria-label="${task.completed ? 'Undo task' : 'Complete task'}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <button class="delete-btn" aria-label="Delete task">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                    </div>
                </li>`;
        })
        .join('');

    // animate entries
    const items = Array.from(todoList.querySelectorAll('li'));
    items.forEach((li, i) => {
        li.classList.remove('show');
        requestAnimationFrame(() => setTimeout(() => li.classList.add('show'), i * 35));
    });
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

    if (completeAllButton) completeAllButton.disabled = !hasTasks || !hasIncomplete;
    if (clearCompletedButton) clearCompletedButton.disabled = completedCount === 0;
};

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addTask();
});

if (completeAllButton) completeAllButton.addEventListener('click', completeAllTasks);
if (clearCompletedButton) clearCompletedButton.addEventListener('click', clearCompletedTasks);

if (fab) fab.addEventListener('click', () => taskInput.focus());

todoList.addEventListener('click', (event) => {
    const listItem = event.target.closest('li');
    if (!listItem || listItem.classList.contains('empty-state')) return;

    const index = Number(listItem.dataset.index);
    if (event.target.closest('.delete-btn')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        updateStats();
        return;
    }

    if (event.target.closest('.complete-btn')) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
        updateStats();
        return;
    }

    // clicking the list text toggles completion as well
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    updateStats();
});

renderTasks();
updateStats();
