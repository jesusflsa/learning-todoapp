function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || []
}

function setTasks(taskList) {
    localStorage.setItem('tasks', JSON.stringify(taskList))
    TaskList.updateList()
}

const uncompletedList = document.querySelector('#uncompletedAccordion ul')
const completedList = document.querySelector('#completedAccordion ul')

const uncompletedBtn = document.getElementById('uncompletedAccordion').parentElement.querySelector('button')
const completedBtn = document.getElementById('completedAccordion').parentElement.querySelector('button')

class Task {
    constructor(task, id = Math.random().toString(36).substr(2, 9), checked = false) {
        this.task = task
        this.id = id
        this.checked = checked
    }

    getItem() {
        const id = this.id

        const li = document.createElement('li')
        li.classList.add('list-group-item')
        li.classList.add('d-flex')
        li.classList.add('align-items-center')

        const check = document.createElement('input')
        check.classList.add('form-check-input')
        check.classList.add('me-1')
        check.type = 'checkbox'
        check.checked = this.checked
        check.id = id

        const label = document.createElement('label')
        label.classList.add('form-check-label')
        label.classList.add('stretched-link')
        label.classList.add('ms-1')
        label.innerText = this.task
        label.htmlFor = id
        label.style.textDecoration = this.checked ? 'line-through' : 'none'

        const div = document.createElement('div')
        div.classList.add('w-100')
        div.classList.add('position-relative')
        div.append(check, label)

        check.addEventListener('click', () => {
            this.checked = !this.checked
            const tasks = getTasks()
            tasks.find((t, i) => {
                if (t.id === id) { tasks[i] = this; setTasks(tasks) }
            })
        })

        const deleteBtn = document.createElement('button')
        deleteBtn.classList.add('btn')
        deleteBtn.classList.add('btn-sm')
        deleteBtn.classList.add('btn-danger')
        deleteBtn.innerHTML = `<i class="fa-regular fa-trash-can"></i>`

        deleteBtn.addEventListener('click', () => {
            const tasks = getTasks()
            const newTasks = tasks.filter(t => t.id !== id)
            setTasks(newTasks)
        })

        li.append(div, deleteBtn)

        return li
    }

    printTask() {
        const item = this.getItem()
        if (this.checked) completedList.append(item)
        else uncompletedList.append(item)
    }
}

class TaskList {

    static createTask(task) {
        const newTask = new Task(task)
        const taskList = getTasks()
        setTasks([...taskList, newTask])
    }

    static getUncompletedTasks() {
        const tasks = getTasks()
        return tasks.filter(t => !t.checked)
    }

    static getCompletedTasks() {
        const tasks = getTasks()
        return tasks.filter(t => t.checked)
    }

    static updateNames() {
        const uncompletedTasks = this.getUncompletedTasks()
        const completedTasks = this.getCompletedTasks()
        uncompletedBtn.innerText = `Uncompleted (${uncompletedTasks.length})`
        completedBtn.innerText = `Completed (${completedTasks.length})`
    }

    static clearList() {
        uncompletedList.innerHTML = ''
        completedList.innerHTML = ''
    }
    static updateList() {
        const tasks = getTasks()
        this.clearList()
        tasks.map(t => {
            const { task, id, checked } = t
            const newTask = new Task(task, id, checked)
            newTask.printTask()  
        })
        if (this.getCompletedTasks().length === 0) completedList.innerHTML = `<small class="list-group-item ms-4 fst-italic ">No tasks completed</small>`
        if (this.getUncompletedTasks().length === 0) uncompletedList.innerHTML = `<small class="list-group-item ms-4 fst-italic">No tasks uncompleted</small>`
        this.updateNames()
    }
}

document.getElementById('create-task').addEventListener('submit', (e) => {
    e.preventDefault()
    const task = document.getElementById('newTask').value.trim()
    if (task !== '') {
        TaskList.createTask(task);
        document.getElementById('newTask').value = ''

    }
})

TaskList.updateList()