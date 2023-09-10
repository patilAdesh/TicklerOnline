const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const priorityInput = document.getElementById('priorityInput');
const taskList = document.getElementById('taskList');
const addButton = document.getElementById('addButton');
const clearCompletedButton = document.getElementById('clearCompletedButton');

const MAX_TASKS = 20; // Maximum number of tasks allowed

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function padZero(number) {
  return (number < 10) ? `0${number}` : number;
}

function createTaskItem(taskData) {
  const taskItem = document.createElement('li');
  taskItem.classList.add('task-item');
  const taskDate = taskData.date ? new Date(taskData.date).toLocaleDateString() : '';
  taskItem.innerHTML = `
    <div class="task-row">
      <span class="task-text">${taskData.text}</span>
      <span class="task-date">${taskDate}</span>
      <span class="task-priority">${taskData.priority}</span>
      <button class="completeButton button ${taskData.completed ? 'completed' : ''}">Complete</button>
      <button class="removeButton button">Remove</button>
      <button class="shareButton button">Share</button>
      <button class="reminderButton button">Remind</button>
    </div>
  `;

  const reminderButton = taskItem.querySelector('.reminderButton');
  reminderButton.addEventListener('click', function() {
    const reminderDate = new Date(taskData.date);
    const currentDate = new Date();
    
    if (reminderDate > currentDate) {
      const timeUntilReminder = reminderDate - currentDate;
      setTimeout(() => {
        alert(`Reminder: Task "${taskData.text}" is due today!`);
      }, timeUntilReminder);
    } else {
      alert(`Reminder: Task "${taskData.text}" is already overdue.`);
    }
  });

  const removeButton = taskItem.querySelector('.removeButton');
  removeButton.addEventListener('click', function() {
    taskItem.remove();
    tasks = tasks.filter(t => t !== taskData);
    saveTasksToLocalStorage();
  });

  const completeButton = taskItem.querySelector('.completeButton');
  completeButton.addEventListener('click', function() {
    completeButton.classList.toggle('completed');
    taskData.completed = !taskData.completed;
    saveTasksToLocalStorage();
  });

  const shareButton = taskItem.querySelector('.shareButton');
  shareButton.addEventListener('click', function() {
    alert(`Task shared: ${taskData.text}`);
  });



  return taskItem;
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

tasks.forEach((taskData) => {
  const taskItem = createTaskItem(taskData);
  taskList.appendChild(taskItem);
});

function addTask() {
  const taskText = taskInput.value.trim();
  const selectedDate = dateInput.value.trim();
  const selectedPriority = priorityInput.value;

  if (taskText && taskList.childElementCount < MAX_TASKS && selectedDate && selectedPriority) {
    const taskData = {
      text: taskText,
      completed: false,
      date: selectedDate,
      priority: selectedPriority,
    };
    tasks.push(taskData);

    const taskItem = createTaskItem(taskData);

    taskList.appendChild(taskItem);
    taskInput.value = '';
    dateInput.value = '';
    priorityInput.value = '';
    saveTasksToLocalStorage();
  } else {
    alert('Please fill in all fields and ensure you have not exceeded the maximum number of tasks.');
  }
}

addButton.addEventListener('click', addTask);

clearCompletedButton.addEventListener('click', function() {
  tasks = tasks.filter(taskData => !taskData.completed);
  updateTaskList();
  saveTasksToLocalStorage();
});

function updateTaskList() {
  taskList.innerHTML = '';
  tasks.forEach((taskData) => {
    const taskItem = createTaskItem(taskData);
    taskList.appendChild(taskItem);
  });
}

window.addEventListener('load', () => {
  updateTaskList();
});
