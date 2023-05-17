import { createTask, getAllTasks, updateTask, deleteTask } from "./db.js";

let tasks = [];
const form = document.getElementById("form");
const tasksList = document.getElementById("tasksList");

// window.updateTask = updateTask;

const getInitData = async () => {
  tasks = await getAllTasks();
  createCards();
};

// Llamar a la función fetchData al cargar la página
window.addEventListener("load", getInitData);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const {
    inputTitle: { value: title },
    inputDescription: { value: description },
  } = form;

  try {
    const newTask = await createTask({ title, description });
    console.log("newTask", newTask);
    tasks.push(newTask);
    createCards();
  } catch (e) {
    console.log(e);
  }
});

const createCards = () => {
  // console.log("tasks", tasks);
  tasksList.innerHTML = "";
  tasks.forEach((task) => {
    const { title, description, done, id } = task;
    const taskString = JSON.stringify(task);
    tasksList.innerHTML += `
      <div class="bg-gray-200 rounded-lg p-5 max-w-[300px]">
        <h3 class="text-xl font-bold">${title}</h3>
        <p>${description}</p>
        <button class="bg-red-500 text-white rounded-full px-1 delete-button" data-task-id='${id}'>Delete</button>
         <button class="bg-blue-500 text-white rounded-lg px-1 edit-button" data-task-id='${id}'>Edit</button>
        <button class="bg-green-500 text-white rounded-full px-1 done-button" data-task='${taskString}'>${
      done ? "Done" : "Do"
    }</button>
      </div>
    `;
  });
  addButtonsListener();
};
const addButtonsListener = () => {
  const editButtons = document.querySelectorAll(".edit-button");
  const deleteButtons = document.querySelectorAll(".delete-button");
  const doneButtons = document.querySelectorAll(".done-button");

  editButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const { taskId } = button.dataset;
      const task = tasks.find((task) => task.id === Number(taskId));
      console.log("task", task);
      const { title, description } = task;
      const newTitle = prompt("New title", title);
      if (!newTitle) return alert("Update canceled");
      const newDescription = prompt("New description", description);
      if (!newDescription) return alert("Update canceled");
      const newValues = {
        title: newTitle,
        description: newDescription,
      };
      await updateTask(taskId, newValues);
      const updatedTasks = tasks.map((task) => {
        if (task.id === Number(taskId)) {
          return { ...task, ...newValues };
        }
        return task;
      });
      tasks = updatedTasks;
      alert("Task updated");
      createCards();
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const { taskId } = button.dataset;
      await deleteTask(taskId);
      tasks = tasks.filter((task) => task.id !== Number(taskId));
      alert("Task deleted");
      createCards();
    });
  });

  doneButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const { task } = button.dataset;
      const { id, done } = JSON.parse(task);
      const newValues = { done: !done };
      await updateTask(id, newValues);
      const updatedTasks = tasks.map((task) => {
        if (task.id === id) {
          return { ...task, ...newValues };
        }
        return task;
      });
      tasks = updatedTasks;
      // alert("Task updated");
      createCards();
    });
  });
};
