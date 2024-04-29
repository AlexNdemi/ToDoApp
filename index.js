let Tasks;
let date = document.querySelector('#date');
let task = document.querySelector('#task');
let saveBtn = document.querySelector('.save-btn');
let ToDoDiv = document.querySelector('.todo-list');
let savedToDos = JSON.parse(localStorage.getItem('savedToDos'));
let id = "";

if (Array.isArray(savedToDos) && savedToDos.length){
    Tasks = savedToDos;
}else{
    Tasks = [{date:'2024-04-23',Title:'eat',id:'1713791197110'}];
    console.log(Tasks,savedToDos);
}
render();
saveBtn.addEventListener('click',function(){
    if(!id){
        id = '' + new Date().getTime();
    };

    console.log(date.value,task.value,id)
    saveTask(date.value,task.value,id);
    
});
date.addEventListener('change',function(){
  let taskDate=date.value;
  let Title=task.value;
  activateSaveBtn(taskDate,Title);
});
// Attach debounced event listener to the task input field
task.addEventListener('input', debounce(function() {
    let taskDate = date.value;
    let Title = task.value;
    activateSaveBtn(taskDate, Title);
}, 500)); // Adjust delay time as needed
function deleteButtonClickHandler(event){
    const idToDelete = event.target.id;
    deleteTask(idToDelete);
}
function editButtonClickHandler(event){
    idOfTaskToBeEdited=event.target.id;
    editTask(idOfTaskToBeEdited);
}
function saveTask(taskdate,title,id){
    let taskAlreadyExists=Tasks.some(function (Task){ return Task.id === id});
    console.log(taskAlreadyExists)
    if (!taskAlreadyExists){
        Tasks.push({'date':taskdate,'Title':title,'id':'' + new Date().getTime()});
    }
    if(taskAlreadyExists){
        Tasks=Tasks.map(function(Task){
            if(Task.id === id){
                Task.date = taskdate;
                Task.Title = title;
            };
            return Task;
        });
    }
    saveToDos();
    resetTasksFields();
    activateSaveBtn(date.value,task.value);
    render();
};
function activateSaveBtn(taskDate,taskTitle){
   if(taskDate && taskTitle){
    saveBtn.disabled = false;
   } else {
    saveBtn.disabled = true;
   }
};
// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};

function deleteTask(idToDelete){
  Tasks=Tasks.filter((task) => task.id !== idToDelete);
  saveToDos();
  render();
};
function editTask(idOfTaskToBeEdited){
  id=idOfTaskToBeEdited;
  Tasks.forEach((Task)=>{
    if(Task.id === idOfTaskToBeEdited){
        date.value = Task.date;
        task.value = Task.Title;
    }

  activateSaveBtn(date.value,task.value);
  task.focus()
  })
}
function saveToDos(){
    localStorage.setItem('savedToDos',JSON.stringify(Tasks));
};
function resetTasksFields(){
    date.value='';
    task.value='';
    id = "";
}
function render(){
    console.log(Tasks);
    ToDoDiv.innerHTML=''
    Tasks.forEach((Task)=>{
        let element=document.createElement('div');
        element.innerHTML = `<span>${Task.date}</span>` + `<span>${Task.Title}</span>`;
        element.classList.add("flex");
        element.classList.add("task-div");
        let buttonsDiv = document.createElement("div");
        let editButton = document.createElement("button");
        editButton.textContent = "edit";
        editButton.setAttribute('id',Task.id);
        editButton.onclick = editButtonClickHandler;
        editButton.classList.add("edit-button")
        let deleteButton= document.createElement('button');
        deleteButton.textContent='delete';
        deleteButton.setAttribute('id',Task.id);
        deleteButton.onclick=deleteButtonClickHandler;
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);
        element.appendChild(buttonsDiv);
        ToDoDiv.appendChild(element);
    });
};
