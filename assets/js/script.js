// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));


function saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function readTasksFromStorage(){
    return(JSON.parse(localStorage.getItem("tasks")) || []);
}


// Todo: create a function to generate a unique task id
function generateTaskId() {
    return crypto.randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(task) {

    // task items: name, id, dueDate, description, status

    let newCard = $("<div>");
    newCard.addClass("card task-card draggable my-3");
    newCard.attr("data-task-id", task.id);

    let newHeader = $("<header>");
    newHeader.addClass("card-header h4")
    newHeader.text(task.name)

    let newBody = $("<body>");
    newBody.addClass("card-body")

    let newDate = $("<p>");
    newDate.addClass("card-text");
    newDate.text(task.dueDate)
    
    let newDesc = $("<p>");
    newDate.addClass("card-text");
    newDate.text(task.description)

    let newBtn = $("<button>");
    newBtn.addClass("btn btn-danger delete");
    newBtn.text("delete");
    newBtn.attr("data-task-id", task.id);
    newBtn.on("click", handleDeleteTask);


    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const dueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    
        // ? If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(dueDate, 'day')) {
          newCard.addClass('bg-warning text-white');
        } else if (now.isAfter(dueDate)) {
          newCard.addClass('bg-danger text-white');
          newBtn.addClass('border-light');
        }
      }

    newBody.append(newDate);
    newBody.append(newDesc);
    newBody.append(newBtn);

    newCard.append(newHeader);
    newCard.append(newBody);

    return newCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const tasks = readTasksFromStorage();

  // ? Empty existing task cards out of the lanes
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  // TODO: Loop through tasks and create task cards for each status
  for (let task of tasks) {
    let newCard = createTaskCard(task);

    if (task.status === "to-do"){
      todoList.append(newCard);
    }else if (task.status === "in-progress"){
      inProgressList.append(newCard);
    }else if (task.status === "done"){
      doneList.append(newCard);
    }
  }

  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,
    helper: function (e) {
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(){

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
    const taskId = $(this).attr('data-task-id');
    const tasks = readTasksFromStorage();

    let tempTasks = [];

    for (let i = 0; i < tasks.length; i++){
        if (tasks[i].id === taskId){
        }else {
          tempTasks.push(tasks[i]);
        }
      }

    saveTasksToStorage(tempTasks);
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const tasks = taskList;

    const taskIdent = ui.draggable[0].dataset.taskId

    const newStatus = event.target.id;

    for (let task of tasks){
        if (task.id === taskIdent) {
            task.status = newStatus;
        }
    }

    saveTasksToStorage(taskList);
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    console.log("ready")
  // ? Print task data to the screen on page load if there is any
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

  $('#add-task').click(function(e){
    e.preventDefault();
    handleAddTask();
    $('#formModal').modal('toggle');
  })


});

