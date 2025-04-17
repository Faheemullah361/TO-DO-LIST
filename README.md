Dynamic Task Manager
A modern, responsive task management web application built with vanilla JavaScript, HTML, and CSS.
Show Image
Features

Task Management: Create, edit, complete, and delete tasks
Task Organization: Categorize tasks with custom categories
Task Prioritization: Set priority levels (low, medium, high)
Date Tracking: Set due dates for tasks
Important Tasks: Mark tasks as important for quick access
Task Filtering: View tasks by category, today's tasks, important tasks, or completed tasks
Search Functionality: Search tasks by name or description
Sort Options: Sort tasks by date, priority, or name
Responsive Design: Works on desktop, tablet, and mobile devices
Local Storage: Tasks and categories are saved locally in your browser

Demo
View Live Demo
Screenshots
<div style="display: flex; justify-content: space-between;">

</div>
Installation

Clone the repository:
bashgit clone https://faheemullah361.github.io/TO-DO-LIST/

Navigate to the project directory:
bashcd task-manager

Open the application:

Simply open the index.html file in your web browser
Alternatively, you can use a local development server:
bash# Using Python
python -m http.server

# Using Node.js (with http-server package)
npx http-server




Usage
Adding Tasks

Type your task in the "Add a new task..." input field
Press Enter or click the "+" button to add the task

Managing Tasks

Complete a task: Click the checkbox next to the task
Edit a task: Click the task or the edit icon to open the task details modal
Mark as important: Click the star icon next to the task
Delete a task: Open the task details and click "Delete Task"

Filtering Tasks

Use the sidebar to filter tasks by:

All Tasks
Today
Important
Completed
Custom Categories



Adding Categories

Enter a category name in the "New list name..." input field
Click the "+" button to add the category

Searching and Sorting

Use the search bar to find tasks
Use the dropdown menu to sort tasks by:

Date (Oldest)
Date (Newest)
Priority
Name (A-Z)
Name (Z-A)



Technical Details
Project Structure
task-manager/
├── index.html
├── style.css
├── app.js
├── README.md
└── screenshots/
    ├── desktop.png
    └── mobile.png
Technologies Used

HTML5: Structure and content
CSS3: Styling and animations
JavaScript (ES6+): Application logic
Font Awesome: Icons
LocalStorage API: Client-side storage

Browser Compatibility

Chrome (latest)
Firefox (latest)
Safari (latest)
Edge (latest)

Customization
CSS Variables
You can customize the appearance by modifying the CSS variables in the style.css file:
css:root {
  --primary-color: #4e73df;
  --secondary-color: #f8f9fc;
  --text-color: #5a5c69;
  --border-color: #e3e6f0;
  --success-color: #1cc88a;
  --warning-color: #f6c23e;
  --danger-color: #e74a3b;
  /* Add more custom variables as needed */
}
Future Enhancements

Task labels/tags
Task notes/attachments
Task recurrence
Notifications/reminders
User accounts and data synchronization
Collaboration features
Dark mode toggle
Export/import tasks

Contributing

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

Icons by Font Awesome
Inspired by popular task management applications like Todoist, Microsoft To Do, and Things


Made with ❤️ by Faheem ullah 
