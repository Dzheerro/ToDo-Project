const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskDescription = document.querySelector('#taskInputDescription');
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

let tasks = [];

if(localStorage.getItem('tasks')){
 tasks =  JSON.parse(localStorage.getItem('tasks'))
}

tasks.forEach(function(task) {
  renderTask(task)
})


checkEmptyList()

form.addEventListener('submit' , addTask)
tasksList.addEventListener('click' , deleteTask)
tasksList.addEventListener('click' , doneTask)

function addTask (e){
  e.preventDefault();
  const taskText = taskInput.value 
  const taskDescriptionText =  taskDescription.value


  const newTask = {
    id:Date.now(),
    text: taskText,
    description: taskDescriptionText, 
    done: false
  }

  
  
  tasks.push(newTask);
  saveToLocalStorage()
    renderTask(newTask);

  // Видаляємо текст з input'a
  taskInput.value = '';
  taskDescription.value = '';
  // Фокус на input 
  taskInput.focus();
  taskDescription.focus();

  checkEmptyList()
}

function deleteTask (e){
  if(e.target.dataset.action === 'delete') {

    const parantNode = e.target.closest('.list-group-item')

    const id = Number(parantNode.id)

    const index = tasks.findIndex((task) =>  {
        return task.id === id;
    })

    tasks.splice(index, 1)
    saveToLocalStorage()

    parantNode.remove();
  }
  checkEmptyList()
}

function doneTask(e) { 
  if (e.target.dataset.action !== 'done') return
    const parentListItem = e.target.closest('.list-group-item');


    const taskTitle = parentListItem.querySelector('.task-title');

     const id = Number(parentListItem.id)


     const task = tasks.find((task) => {
        if(task.id === id){
          return true
        }
     })

     task.done = !task.done

     saveToLocalStorage()
      taskTitle.classList.toggle('task-title--done');
    
  
}

function checkEmptyList() {
  const emptyListEl = document.querySelector('#emptyList');
  if (tasks.length === 0) {
    if (!emptyListEl) {
      const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
        <img src="./img/cloud-fog-svgrepo-com.svg" alt="Empty" width="48" class="mt-3">
        <div class="empty-list__title">The to-do list is empty</div>
      </li>`;
      tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
  } else {
    if (emptyListEl) {
      emptyListEl.remove();
    }
  }
}


function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))

}

function renderTask(task) {
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';
  const taskHTML = `
  <li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
      <span class="task-title">${task.description}</span>			
         <div class="task-item__buttons">
           <button type="button" data-action="done" class="btn-action">
             <img src="./img/tick.svg" alt="Done" width="18" height="18">
             </button>
            <button type="button" data-action="delete" class="btn-action">
         <img src="./img/cross.svg" alt="Done" width="18" height="18">
       </button>
   </div>
  </li>`
  tasksList.insertAdjacentHTML('beforeend' , taskHTML);
}