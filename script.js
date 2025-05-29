const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const categoryInput = document.getElementById("category-input");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const progressFill = document.getElementById("progress-fill");
const successMessage = document.getElementById("success-message");

const categoryFilter = document.getElementById("category-filter");
const filterButtons = document.querySelectorAll(".filter-buttons button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let currentCategory = "";

function renderTasks() {
  taskList.innerHTML = "";

  const search = searchInput.value.toLowerCase();

  const filtered = tasks.filter(task => {
    const matchText = task.text.toLowerCase().includes(search);
    const matchCategory = !currentCategory || task.category === currentCategory;
    const matchStatus =
      currentFilter === "all" ||
      (currentFilter === "active" && !task.done) ||
      (currentFilter === "completed" && task.done);
    return matchText && matchCategory && matchStatus;
  });

  filtered.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " completed" : "");
    li.innerHTML = \`
      <span><i class="fas fa-dumbbell"></i> \${task.text} [\${task.category}]</span>
      <div>
        <i class="fas fa-check" onclick="toggleTask(\${i})" title="Mark as done"></i>
        <i class="fas fa-trash" onclick="deleteTask(\${i})" title="Delete"></i>
      </div>
    \`;
    taskList.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const percent = total ? (done / total) * 100 : 0;

  progressFill.style.width = percent + "%";

  if (done === total && total > 0) {
    successMessage.style.display = "block";
    launchConfetti();
  } else {
    successMessage.style.display = "none";
  }
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  saveAndRender();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  const category = categoryInput.value;

  if (text && category) {
    tasks.push({ text, category, done: false });
    input.value = "";
    categoryInput.value = "";
    saveAndRender();
  }
});

searchInput.addEventListener("input", renderTasks);

categoryFilter.addEventListener("change", (e) => {
  currentCategory = e.target.value;
  renderTasks();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

function launchConfetti() {
  // Placeholder confetti effect
  alert("🎉 Confetti! All tasks complete!");
}

renderTasks();
