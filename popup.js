var input = document.getElementById("taskInput");
var addBtn = document.getElementById("addButton");
var list = document.getElementById("taskList");
function saveTasks(tasks) {
    chrome.storage.sync.set({ tasks: tasks });
}
function loadTask() {
    chrome.storage.sync.get('tasks', function (data) {
        var tasks = data.tasks || [];
        list.innerHTML = '';
        tasks.forEach(function (task, index) {
            var li = document.createElement('li');
            //to show content
            var span = document.createElement('span');
            span.textContent = task.text;
            if (task.completed)
                span.classList.add("completed");
            span.addEventListener('click', function () {
                tasks[index].completed = !tasks[index].completed;
                saveTasks(tasks);
                loadTask();
            });
            //delete button
            var delBtn = document.createElement('button');
            delBtn.textContent = 'X';
            delBtn.addEventListener('click', function () {
                tasks.splice(index, 1);
                saveTasks(tasks);
                loadTask();
            });
            li.appendChild(span);
            li.appendChild(delBtn);
            list.appendChild(li);
        });
    });
}
addBtn.addEventListener('click', function () {
    var text = input.value.trim();
    if (!text)
        return;
    chrome.storage.sync.get('tasks', function (data) {
        var tasks = data.tasks || [];
        tasks.push({ text: text, completed: false });
        saveTasks(tasks);
        loadTask();
        input.value = '';
    });
});
document.addEventListener('DOMContentLoaded', loadTask);
