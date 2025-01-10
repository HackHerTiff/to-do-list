const input = document.querySelector("input");  // Input field for entering tasks.
const addButton = document.querySelector(".add-button");  // Button to add new task.
const todosHtml = document.querySelector(".todos");  // Container where task items are displayed.
const emptyImage = document.querySelector(".empty-image");  // Image shown when there are no tasks.
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];  // Retrieve tasks from localStorage, or set an empty array if none exists.
const deleteAllButton = document.querySelector(".delete-all");  // Button to delete all tasks.
const filters = document.querySelectorAll(".filter");  // All filter buttons.
let filter = '';  // Variable to hold the active filter (default is no filter).

// Function to render the HTML for each task item based on its status.
function getTodoHtml(todo, index) {
  // If there is a filter and the task doesn't match the filter, don't render it.
  if (filter && filter != todo.status) {
    return '';
  }
  // Check if the task is completed to apply the "checked" status.
  let checked = todo.status == "completed" ? "checked" : "";
  // Return the HTML structure for each task item.
  return  `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>  <!-- Checkbox to mark todo as completed/pending -->
        <span class="${checked}">${todo.name}</span>  <!-- Display todo name, add "checked" class if completed -->
      </label>
      <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>  <!-- Delete button for each todo -->
    </li>
  `; 
}

// Function to show all tasks on the page.
function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';  // If no tasks, clear the list.
    emptyImage.style.display = 'block';  // Show "empty" image when there are no tasks.
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');  // Render tasks dynamically using the getTodoHtml function.
    emptyImage.style.display = 'none';  // Hide "empty" image when there are tasks.
  }
}

// Function to add a new tasks to the list.
function addTodo(todo)  {
  input.value = "";  // Clear input field after adding task.
  todosJson.unshift({ name: todo, status: "pending" });  // Add the new task as "pending" status.
  localStorage.setItem("todos", JSON.stringify(todosJson));  // Save the updated task list to localStorage.
  showTodos();  // Refresh the task list on the page.
}

// Event listener for adding task when "Enter" is pressed.
input.addEventListener("keyup", e => {
  let todo = input.value.trim();  // Get the trimmed value from the input field.
  if (!todo || e.key != "Enter") {  // If the input is empty or the key pressed isn't "Enter", do nothing.
    return;
  }
  addTodo(todo);  // Add the new task.
});

// Event listener for adding task when "Add" button is clicked.
addButton.addEventListener("click", () => {
  let todo = input.value.trim();  // Get the trimmed value from the input field.
  if (!todo) {  // If the input is empty, do nothing.
    return;
  }
  addTodo(todo);  // Add the new task.
});

// Function to update the status of a task (completed or pending).
function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;  // Get the task name element.
  if (todo.checked) {  // If checkbox is checked, mark as completed.
    todoName.classList.add("checked");  // Add "checked" class to style completed task.
    todosJson[todo.id].status = "completed";  // Update the status of the task in the array.
  } else {  // If checkbox is unchecked, mark as pending.
    todoName.classList.remove("checked");  // Remove "checked" class.
    todosJson[todo.id].status = "pending";  // Update the status of the task in the array.
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));  // Save the updated task list to localStorage.
}

// Function to remove a task from the list.
function remove(todo) {
  const index = todo.dataset.index;  // Get the index of the task to remove.
  todosJson.splice(index, 1);  // Remove the task from the array.
  showTodos();  // Refresh the task list on the page.
  localStorage.setItem("todos", JSON.stringify(todosJson));  // Save the updated task list to localStorage.
}

// Add event listeners to each filter button to handle filtering the tasks.
filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    // If the clicked filter button is already active, remove the filter.
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';  // Reset the filter to show all tasks.
    } else {
      // If a different filter is clicked, deactivate all others and activate the clicked one.
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;  // Set the filter to the selected filter type ("completed", "pending").
    }
    showTodos();  // Refresh the task list based on the selected filter.
  });
});

// Event listener for deleting all tasks when "Delete All" button is clicked.
deleteAllButton.addEventListener("click", () => {
  todosJson = [];  // Clear all tasks.
  localStorage.setItem("todos", JSON.stringify(todosJson));  // Update localStorage with an empty task list.
  showTodos();  // Refresh the todo list to show no tasks.
});
