// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));


function saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function readTasksFromStorage(){
    return(JSON.parse(localStorage.getItem("tasks")));
}


// Todo: create a function to generate a unique task id
function generateTaskId() {
    return crypto.randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let newCard = $("<div>");
    newCard.addclass("card task-card draggable my-3");
    newCard.attr("data-task-id", task.id);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    let taskName = $("#task-name-input").val();
    let taskDate = $("#task-due-date").val();
    let taskDesc = $("#task-description").val();

    const newTask = {

        id: generateTaskId(),
        name: taskName,
        dueDate: taskDate,
        description: taskDesc,
        status: "to-do"
    };

    taskList.push(newTask);

    saveTasksToStorage(taskList);

    renderTaskList();

    // $("#formModal").find('#task-name-input').val("");
    // $("#formModal").find('#task-due-date').val("");
    // $("#formModal").find('#task-description').val("");

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const tasks = taskList;
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    console.log("ready")
  // ? Print project data to the screen on page load if there is any
  renderTaskList();

    //need to change #taskDueDate to modal datepicker
  $('#task-due-date').datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // ? Make lanes droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });

  $('#formModal').on('hidden.bs.modal', function () {
    $(this).find('#task-name-input').val("");
    $(this).find('#task-due-date').val("");
    $(this).find('#task-description').val("");
  });



});

