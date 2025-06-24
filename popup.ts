interface Task {
    text:string;
    completed:boolean;
}
const input = document.getElementById("taskInput") as HTMLInputElement;
const addBtn = document.getElementById("addButton") as HTMLButtonElement;
const list = document.getElementById("taskList") as HTMLUListElement;

function saveTasks(tasks: Task[]):void {
    chrome.storage.sync.set({tasks});
}

function loadTask() :void{
    chrome.storage.sync.get('tasks', (data) =>{
        const tasks: Task[] = data.tasks || [];
        list.innerHTML='';
        tasks.forEach((task, index)=>{
            const li = document.createElement('li');
             
            //to show content
            const span = document.createElement('span');
            span.textContent = task.text;
            if(task.completed)
                span.classList.add("completed");

            span.addEventListener('click' ,()=>{
                tasks[index].completed =! tasks[index].completed;
                saveTasks(tasks);
                loadTask();
            });
            
            //delete button
            const delBtn = document.createElement('button');
            delBtn.textContent='X';
            delBtn.addEventListener('click', ()=>{
                tasks.splice(index,1);
                saveTasks(tasks);
                loadTask();
            });

            li.appendChild(span);
            li.appendChild(delBtn);
            list.appendChild(li);
        });
    });
}
addBtn.addEventListener('click',()=>{
    const text =input.value.trim();
    if(!text) return;

    chrome.storage.sync.get('tasks', (data)=>{
        const tasks : Task[] = data.tasks || [];
        tasks.push({text,completed:false});
        saveTasks(tasks);
        loadTask();
        input.value=''; 
    });
});
document.addEventListener('DOMContentLoaded',loadTask);