// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskForm = document.getElementById('addTaskForm');
const taskList = document.getElementById('taskList');
const categoryList = document.getElementById('categoryList');
const customCategoryList = document.getElementById('customCategoryList');
const newCategoryInput = document.getElementById('newCategoryInput');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const currentCategoryTitle = document.getElementById('currentCategory');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const noTasksMessage = document.getElementById('noTasksMessage');
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const taskModal = document.getElementById('taskModal');
const closeModal = document.querySelector('.close-modal');
const taskDetailsForm = document.getElementById('taskDetailsForm');
const detailTaskName = document.getElementById('detailTaskName');
const detailTaskDescription = document.getElementById('detailTaskDescription');
const detailTaskDate = document.getElementById('detailTaskDate');
const detailTaskCategory = document.getElementById('detailTaskCategory');
const detailTaskPriority = document.getElementById('detailTaskPriority');
const detailTaskImportant = document.getElementById('detailTaskImportant');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');
const taskIdInput = document.getElementById('taskId');

// App State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let currentCategory = 'all';
let searchQuery = '';
let sortMethod = 'date-desc';

// Initialize App
function initApp() {
    // Set today's date as minimum for task date inputs
    const today = new Date().toISOString().split('T')[0];
    detailTaskDate.min = today;
    
    // Initialize categories if empty
    if (categories.length === 0) {
        categories = ['Work', 'Personal', 'Shopping'];
        saveCategories();
    }
    
    renderCategories();
    updateTaskCounters();
    renderTasks();
    
    // Set default sort method
    sortSelect.value = sortMethod;
}

// Event Listeners
addTaskForm.addEventListener('submit', addTask);
addCategoryBtn.addEventListener('click', addCategory);
categoryList.addEventListener('click', handleCategoryClick);
customCategoryList.addEventListener('click', handleCategoryClick);
searchInput.addEventListener('input', handleSearch);
sortSelect.addEventListener('change', handleSort);
toggleSidebarBtn.addEventListener('click', toggleSidebar);
closeModal.addEventListener('click', closeTaskModal);
taskDetailsForm.addEventListener('submit', saveTaskDetails);
deleteTaskBtn.addEventListener('click', deleteTask);

// Toggle sidebar on mobile
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !e.target.closest('.sidebar') && 
        !e.target.closest('#toggleSidebar') &&
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// Add a new task
function addTask(e) {
    e.preventDefault();
    
    const taskName = taskInput.value.trim();
    if (!taskName) return;
    
    const newTask = {
        id: generateId(),
        name: taskName,
        description: '',
        category: currentCategory !== 'all' && 
                  currentCategory !== 'today' && 
                  currentCategory !== 'important' && 
                  currentCategory !== 'completed' ? currentCategory : 'Personal',
        completed: false,
        important: currentCategory === 'important',
        priority: 'medium',
        date: new Date().toISOString().split('T')[0],
        created: new Date().toISOString()
    };
    
    tasks.unshift(newTask);
    saveTasks();
    taskInput.value = '';
    
    renderTasks();
    updateTaskCounters();
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add a new category
function addCategory() {
    const categoryName = newCategoryInput.value.trim();
    if (!categoryName) return;
    
    if (!categories.includes(categoryName)) {
        categories.push(categoryName);
        saveCategories();
        renderCategories();
        newCategoryInput.value = '';
    } else {
        alert('Category already exists!');
    }
}

// Handle category click
function handleCategoryClick(e) {
    const clickedElement = e.target.closest('li');
    if (!clickedElement) return;
    
    // Deactivate all categories
    document.querySelectorAll('.category-list li, .custom-category-list li')
        .forEach(li => li.classList.remove('active'));
    
    // Activate clicked category
    clickedElement.classList.add('active');
    
    // Update current category
    currentCategory = clickedElement.dataset.category;
    currentCategoryTitle.textContent = clickedElement.querySelector('span:first-child').textContent.trim();
    
    renderTasks();
    
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

// Handle search
function handleSearch() {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderTasks();
}

// Handle sort
function handleSort() {
    sortMethod = sortSelect.value;
    renderTasks();
}

// Filter tasks based on current category and search
function filterTasks() {
    let filteredTasks = [...tasks];
    
    // Filter by category
    if (currentCategory === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filteredTasks = filteredTasks.filter(task => task.date === today);
    } else if (currentCategory === 'important') {
        filteredTasks = filteredTasks.filter(task => task.important);
    } else if (currentCategory === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (currentCategory !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.category === currentCategory);
    }
    
    // Filter by search
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(task => 
            task.name.toLowerCase().includes(searchQuery) || 
            task.description.toLowerCase().includes(searchQuery)
        );
    }
    
    // Sort tasks
    filteredTasks = sortTasks(filteredTasks);
    
    return filteredTasks;
}

// Sort tasks based on selected method
function sortTasks(tasksToSort) {
    switch (sortMethod) {
        case 'date-asc':
            return tasksToSort.sort((a, b) => new Date(a.created) - new Date(b.created));
        case 'date-desc':
            return tasksToSort.sort((a, b) => new Date(b.created) - new Date(a.created));
        case 'priority':
            const priorityValues = { high: 3, medium: 2, low: 1 };
            return tasksToSort.sort((a, b) => priorityValues[b.priority] - priorityValues[a.priority]);
        case 'name-asc':
            return tasksToSort.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return tasksToSort.sort((a, b) => b.name.localeCompare(a.name));
        default:
            return tasksToSort;
    }
}

// Render tasks
function renderTasks() {
    const filteredTasks = filterTasks();
    
    // Show or hide no tasks message
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '';
        noTasksMessage.style.display = 'block';
    } else {
        noTasksMessage.style.display = 'none';
        
        taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-name">${escapeHtml(task.name)}</div>
                    <div class="task-meta">
                        ${task.date ? `<span class="task-date"><i class="fas fa-calendar"></i> ${formatDate(task.date)}</span>` : ''}
                        <span class="task-category">${task.category}</span>
                        <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    </div>
                </div>
                <div class="task-actions">
                    ${task.important ? '<span class="star active"><i class="fas fa-star"></i></span>' : '<span class="star"><i class="far fa-star"></i></span>'}
                    <span class="edit"><i class="fas fa-edit"></i></span>
                </div>
            </li>
        `).join('');
        
        // Add event listeners to task items
        attachTaskEventListeners();
    }
}

// Attach event listeners to task items
function attachTaskEventListeners() {
    // Task checkbox event
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', toggleTaskCompletion);
    });
    
    // Task edit event
    document.querySelectorAll('.task-actions .edit').forEach(editBtn => {
        editBtn.addEventListener('click', openTaskModal);
    });
    
    // Task star (important) event
    document.querySelectorAll('.task-actions .star').forEach(starBtn => {
        starBtn.addEventListener('click', toggleTaskImportance);
    });
    
    // Task content click (for opening details)
    document.querySelectorAll('.task-content').forEach(content => {
        content.addEventListener('click', openTaskModal);
    });
}

// Toggle task completion
function toggleTaskCompletion(e) {
    const taskId = e.target.closest('.task-item').dataset.id;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = e.target.checked;
        e.target.closest('.task-item').classList.toggle('completed', e.target.checked);
        saveTasks();
        updateTaskCounters();
    }
}

// Toggle task importance
function toggleTaskImportance(e) {
    e.stopPropagation();
    const taskId = e.target.closest('.task-item').dataset.id;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].important = !tasks[taskIndex].important;
        const starIcon = e.target.closest('.star');
        starIcon.innerHTML = tasks[taskIndex].important ? 
            '<i class="fas fa-star"></i>' : 
            '<i class="far fa-star"></i>';
        starIcon.classList.toggle('active', tasks[taskIndex].important);
        saveTasks();
        updateTaskCounters();
    }
}

// Open task modal for editing
function openTaskModal(e) {
    e.stopPropagation();
    const taskId = e.target.closest('.task-item').dataset.id;
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        // Populate modal fields
        taskIdInput.value = task.id;
        detailTaskName.value = task.name;
        detailTaskDescription.value = task.description;
        detailTaskDate.value = task.date;
        detailTaskPriority.value = task.priority;
        detailTaskImportant.checked = task.important;
        
        // Populate category select
        populateCategorySelect(task.category);
        
        // Show modal
        taskModal.style.display = 'block';
    }
}

// Close task modal
function closeTaskModal() {
    taskModal.style.display = 'none';
}

// Populate category select in task modal
function populateCategorySelect(selectedCategory) {
    detailTaskCategory.innerHTML = categories.map(category => 
        `<option value="${category}" ${category === selectedCategory ? 'selected' : ''}>${category}</option>`
    ).join('');
}

// Save task details from modal
function saveTaskDetails(e) {
    e.preventDefault();
    
    const taskId = taskIdInput.value;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].name = detailTaskName.value;
        tasks[taskIndex].description = detailTaskDescription.value;
        tasks[taskIndex].date = detailTaskDate.value;
        tasks[taskIndex].category = detailTaskCategory.value;
        tasks[taskIndex].priority = detailTaskPriority.value;
        tasks[taskIndex].important = detailTaskImportant.checked;
        
        saveTasks();
        closeTaskModal();
        renderTasks();
        updateTaskCounters();
    }
}

// Delete task
function deleteTask() {
    const taskId = taskIdInput.value;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1 && confirm('Are you sure you want to delete this task?')) {
        tasks.splice(taskIndex, 1);
        saveTasks();
        closeTaskModal();
        renderTasks();
        updateTaskCounters();
    }
}

// Render categories
function renderCategories() {
    // Clear existing custom categories
    customCategoryList.innerHTML = '';
    
    // Add custom categories
    categories.forEach(category => {
        const li = document.createElement('li');
        li.dataset.category = category;
        li.innerHTML = `
            <span><i class="fas fa-list-alt"></i> ${category}</span>
            <span class="count" id="${category.toLowerCase()}Count">0</span>
        `;
        customCategoryList.appendChild(li);
    });

    // When editing a task, populate the category dropdown
    if (detailTaskCategory) {
        detailTaskCategory.innerHTML = categories.map(category => 
            `<option value="${category}">${category}</option>`
        ).join('');
    }
}

// Update task counters for categories
function updateTaskCounters() {
    // All tasks counter
    document.getElementById('allCount').textContent = tasks.length;
    
    // Today tasks counter
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => task.date === today);
    document.getElementById('todayCount').textContent = todayTasks.length;
    
    // Important tasks counter
    const importantTasks = tasks.filter(task => task.important);
    document.getElementById('importantCount').textContent = importantTasks.length;
    
    // Completed tasks counter
    const completedTasks = tasks.filter(task => task.completed);
    document.getElementById('completedCount').textContent = completedTasks.length;
    
    // Custom category counters
    categories.forEach(category => {
        const countElement = document.getElementById(`${category.toLowerCase()}Count`);
        if (countElement) {
            const categoryTasks = tasks.filter(task => task.category === category);
            countElement.textContent = categoryTasks.length;
        }
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Escape HTML for security
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Save categories to localStorage
function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Initialize app when DOM content is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        closeTaskModal();
    }
});