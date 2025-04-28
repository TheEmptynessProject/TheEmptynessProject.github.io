let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentSortOrder = 'priority';
let editingTaskIndex = -1;

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    tasks.forEach((task, index) => {
        if (searchTerm && !task.title.toLowerCase().includes(searchTerm)) {
            return;
        }

        const li = document.createElement('li');
        li.className = `task priority-${task.priority} category-${task.category}`;
        li.setAttribute('data-id', index);

        const subtasksHtml = task.subtasks && task.subtasks.length > 0
            ? task.subtasks.map((subtask, subtaskIndex) => 
                `<li>${renderSubtask(subtask, index, subtaskIndex)}</li>`
              ).join('')
            : '';

        const progressBarHtml = `
            <div class="progress-bar">
                <div class="progress" style="width: ${task.progress}%"></div>
            </div>
            <span class="progress-text">${task.progress}% Complete</span>
        `;

        li.innerHTML = `
            <div class="task-info ${task.completed ? 'completed' : ''}">
                <strong>${task.title}</strong><br>
                Due: ${task.dueDate} | Priority: ${task.priority} | Category: ${task.category}
                ${task.description ? `<p>${task.description}</p>` : ''}
                ${task.recurring ? `<p>Recurring: ${task.recurring}</p>` : ''}
                <ul class="subtasks">${subtasksHtml}</ul>
                <button onclick="showSubtaskPopup(${index})" class="btn btn-add-subtask">Add Subtask</button>
            </div>
            <div class="task-actions">
                <button onclick="toggleTask(${index})" class="btn btn-toggle" aria-label="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button onclick="editTask(${index})" class="btn btn-edit" aria-label="Edit task">Edit</button>
                <button onclick="deleteTask(${index})" class="btn btn-delete" aria-label="Delete task">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });

    
    new Sortable(taskList, {
        animation: 150,
        onEnd: function(evt) {
            const taskId = evt.item.getAttribute('data-id');
            const newIndex = evt.newIndex;
            const task = tasks.splice(taskId, 1)[0];
            tasks.splice(newIndex, 0, task);
            saveTasks();
            renderTasks();
        }
    });
}

function renderSubtask(subtask, taskIndex, subtaskIndex) {
  let subtaskHtml = '';
  switch(subtask.type) {
    case 'yesno':
      subtaskHtml = `<input type="checkbox" ${subtask.completed ? 'checked' : ''} 
                     onclick="editSubtask(${taskIndex}, ${subtaskIndex})"> ${subtask.title}`;
      break;
    case 'numeric':
      subtaskHtml = `${subtask.title}: <input type="number" value="${subtask.value}" 
                     onchange="editSubtask(${taskIndex}, ${subtaskIndex})">`;
      break;
    case 'timer':
      subtaskHtml = `${subtask.title}: <span>${formatTime(subtask.value)}</span> 
                     <button onclick="toggleTimer(${taskIndex}, ${subtaskIndex})">Start/Stop</button>`;
      break;
    case 'checklist':
      subtaskHtml = `${subtask.title}: <ul>${subtask.value.map((item, itemIndex) => 
                     `<li><input type="checkbox" ${item.checked ? 'checked' : ''} 
                     onclick="toggleChecklistItem(${taskIndex}, ${subtaskIndex}, ${itemIndex})">${item.text}</li>`).join('')}</ul>`;
      break;
    case 'text':
      subtaskHtml = `${subtask.title}: <input type="text" value="${subtask.value}" 
                     onchange="editSubtask(${taskIndex}, ${subtaskIndex})">`;
      break;
  }
  return subtaskHtml;
}

function toggleTimer(taskIndex, subtaskIndex) {
  const subtask = tasks[taskIndex].subtasks[subtaskIndex];
  if (subtask.timerInterval) {
    clearInterval(subtask.timerInterval);
    subtask.timerInterval = null;
  } else {
    subtask.timerInterval = setInterval(() => {
      subtask.value++;
      updateTimerDisplay(taskIndex, subtaskIndex);
    }, 1000);
  }
  saveTasks();
}

function resetTimer(taskIndex, subtaskIndex) {
  const subtask = tasks[taskIndex].subtasks[subtaskIndex];
  clearInterval(subtask.timerInterval);
  subtask.timerInterval = null;
  subtask.value = 0;
  updateTimerDisplay(taskIndex, subtaskIndex);
  saveTasks();
}

function updateTimerDisplay(taskIndex, subtaskIndex) {
  const timerElement = document.getElementById(`timer-${taskIndex}-${subtaskIndex}`);
  if (timerElement) {
    timerElement.textContent = formatTime(tasks[taskIndex].subtasks[subtaskIndex].value);
  }
}
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function padZero(num) {
  return num.toString().padStart(2, '0');
}

function addChecklistItem(taskIndex, subtaskIndex) {
  const newItemText = prompt('Enter new checklist item:');
  if (newItemText) {
    tasks[taskIndex].subtasks[subtaskIndex].value.push({ text: newItemText, checked: false });
    saveTasks();
    renderTasks();
  }
}

function toggleChecklistItem(taskIndex, subtaskIndex, itemIndex) {
  tasks[taskIndex].subtasks[subtaskIndex].value[itemIndex].checked = 
    !tasks[taskIndex].subtasks[subtaskIndex].value[itemIndex].checked;
  saveTasks();
  updateTaskProgress(taskIndex);
  renderTasks();
}

function addTask() {
    const title = document.getElementById('taskInput').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const priority = document.getElementById('taskPriority').value;
    const category = document.getElementById('taskCategory').value;

    if (title) {
        tasks.push({
            title,
            dueDate: dueDate ? formatDate(dueDate) : '',
            priority,
            category,
            completed: false,
            dateAdded: formatDate(new Date()),
            description: '',
            recurring: 'none',
            subtasks: [],
            progress: 0
        });
        saveTasks();
        sortTasks();
        renderTasks();
        document.getElementById('taskInput').value = '';
        document.getElementById('taskDueDate').value = '';
        document.getElementById('taskPriority').value = 'low';
        document.getElementById('taskCategory').value = '';
    } else {
        alert('Please enter a task title');
    }
}

function showSubtaskPopup(taskIndex) {
    const popup = document.createElement('div');
    popup.className = 'subtask-popup';
    popup.innerHTML = `
        <h3>Add Subtask</h3>
        <input type="text" id="subtaskTitle" placeholder="Subtask Title">
        <select id="subtaskType">
            <option value="yesno">Yes/No</option>
            <option value="numeric">Numeric Value</option>
            <option value="timer">Timer</option>
            <option value="checklist">Checklist</option>
            <option value="text">Text Input</option>
        </select>
        <button onclick="addSubtask(${taskIndex})">Add Subtask</button>
        <button onclick="closeSubtaskPopup()">Cancel</button>
    `;
    document.body.appendChild(popup);
}

function closeSubtaskPopup() {
    const popup = document.querySelector('.subtask-popup');
    if (popup) {
        popup.remove();
    }
}

function addSubtask(taskIndex) {
    const title = document.getElementById('subtaskTitle').value;
    const type = document.getElementById('subtaskType').value;

    if (title) {
        const subtask = {
            title: title,
            type: type,
            completed: false,
            value: null
        };

        switch(type) {
            case 'numeric':
                subtask.value = 0;
                break;
            case 'timer':
                subtask.value = 0;
                break;
            case 'checklist':
                subtask.value = [];
                break;
            case 'text':
                subtask.value = '';
                break;
        }

        tasks[taskIndex].subtasks.push(subtask);
        updateTaskProgress(taskIndex);
        saveTasks();
        renderTasks();
        closeSubtaskPopup();
    } else {
        alert('Please enter a subtask title');
    }
}

function editSubtask(taskIndex, subtaskIndex) {
    const subtask = tasks[taskIndex].subtasks[subtaskIndex];
    let newValue;

    switch(subtask.type) {
        case 'yesno':
            subtask.completed = !subtask.completed;
            break;
        case 'numeric':
            newValue = prompt('Enter new value:', subtask.value);
            if (newValue !== null) subtask.value = parseFloat(newValue);
            break;
        case 'timer':
            
            break;
        case 'checklist':
            
            break;
        case 'text':
            newValue = prompt('Enter new text:', subtask.value);
            if (newValue !== null) subtask.value = newValue;
            break;
    }

    updateTaskProgress(taskIndex);
    saveTasks();
    renderTasks();
}

function toggleSubtask(taskIndex, subtaskIndex) {
    tasks[taskIndex].subtasks[subtaskIndex].completed = !tasks[taskIndex].subtasks[subtaskIndex].completed;
    updateTaskProgress(taskIndex);
    saveTasks();
    renderTasks();
}

function updateTaskProgress(taskIndex) {
    const task = tasks[taskIndex];
    if (task.subtasks.length === 0) {
        task.progress = task.completed ? 100 : 0;
    } else {
        const completedSubtasks = task.subtasks.filter(subtask => 
            subtask.type === 'yesno' ? subtask.completed : 
            subtask.type === 'numeric' ? subtask.value > 0 :
            subtask.type === 'timer' ? subtask.value > 0 :
            subtask.type === 'checklist' ? subtask.value.every(item => item.checked) :
            subtask.type === 'text' ? subtask.value.trim() !== '' : false
        ).length;
        task.progress = Math.round((completedSubtasks / task.subtasks.length) * 100);
    }
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    sortTasks();
    renderTasks();
}

function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        sortTasks();
        renderTasks();
    }
}

function editTask(index) {
    editingTaskIndex = index;
    const task = tasks[index];
    document.getElementById('editTaskInput').value = task.title;
    document.getElementById('editTaskDueDate').value = task.dueDate.split('/').reverse().join('-');
    document.getElementById('editTaskPriority').value = task.priority;
    document.getElementById('editTaskCategory').value = task.category;
    document.getElementById('editTaskDescription').value = task.description;
    document.getElementById('editTaskRecurring').value = task.recurring || 'none';
    document.getElementById('editModal').style.display = 'block';
}

function saveEditedTask() {
    const title = document.getElementById('editTaskInput').value;
    const dueDate = document.getElementById('editTaskDueDate').value;
    const priority = document.getElementById('editTaskPriority').value;
    const category = document.getElementById('editTaskCategory').value;
    const description = document.getElementById('editTaskDescription').value;
    const recurring = document.getElementById('editTaskRecurring').value;

    if (title) {
        tasks[editingTaskIndex] = {
            ...tasks[editingTaskIndex],
            title,
            dueDate: formatDate(dueDate),
            priority,
            category,
            description,
            recurring
        };
        saveTasks();
        sortTasks();
        renderTasks();
        closeEditModal();
    } else {
        alert('Please enter a task title');
    }
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    editingTaskIndex = -1;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function sortTasks() {
    currentSortOrder = document.getElementById('sortOrder').value;
    
    tasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }

        switch (currentSortOrder) {
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            case 'dueDate':
                return new Date(a.dueDate.split('/').reverse().join('-')) - new Date(b.dueDate.split('/').reverse().join('-'));
            case 'added':
                return new Date(a.dateAdded.split('/').reverse().join('-')) - new Date(b.dateAdded.split('/').reverse().join('-'));
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });
}

function checkThemePreference() {
    const themePreference = localStorage.getItem('theme');
    if (themePreference) {
        return themePreference;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    const themeIcon = document.querySelector('#toggleTheme i');
    themeIcon.classList.toggle('fa-moon', theme === 'dark');
    themeIcon.classList.toggle('fa-sun', theme === 'light');
}

function toggleTheme() {
    const currentTheme = checkThemePreference();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

function initializeTheme() {
    const userTheme = checkThemePreference();
    applyTheme(userTheme);
}


document.getElementById('sortOrder').addEventListener('change', () => {
    sortTasks();
    renderTasks();
});

document.getElementById('searchInput').addEventListener('input', renderTasks);

document.getElementById('toggleTheme').addEventListener('click', toggleTheme);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem('theme')) {
        initializeTheme();
    }
});

initializeTheme();

function checkDueDates() {
    const now = new Date();
    tasks.forEach(task => {
        if (!task.completed && task.dueDate) {
            const dueDate = new Date(task.dueDate.split('/').reverse().join('-'));
            const timeDiff = dueDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysDiff === 1 || daysDiff === 0) {
                showNotification(task.title, daysDiff === 0 ? 'due today' : 'due tomorrow');
            }
        }
    });
}

function showNotification(taskTitle, dueText) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Task Reminder', {
            body: `"${taskTitle}" is ${dueText}!`
        });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification(taskTitle, dueText);
            }
        });
    }
}

sortTasks();
renderTasks();
setInterval(checkDueDates, 60000);

