const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const summary = document.querySelector("#task-summary");
const feedback = document.querySelector("#feedback");
const emptyState = document.querySelector("#empty-state");
const emptyTitle = document.querySelector("#empty-title");
const emptyCopy = document.querySelector("#empty-copy");
const filterButtons = document.querySelectorAll(".filter-button");

let todos = [];
let activeFilter = "all";

async function requestTodos(url, options) {
  const response = await fetch(url, options);
  const responseText = await response.text();
  let result = {};

  if (responseText) {
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error("The server returned an unreadable response.");
    }
  }

  if (!response.ok) {
    throw new Error(
      result.message || "Something went wrong. Please try again.",
    );
  }

  return result;
}

function showFeedback(message = "") {
  feedback.textContent = message;
}

function updateSummary() {
  const remaining = todos.filter((todo) => todo.status !== "completed").length;
  const completed = todos.length - remaining;
  summary.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left · ${completed} done`;
}

function createTask(todo) {
  const item = document.createElement("li");
  item.className = "list-item";
  if (todo.status === "completed") {
    item.classList.add("is-complete");
  }

  const completeButton = document.createElement("button");
  completeButton.className = "complete-toggle";
  completeButton.type = "button";
  completeButton.disabled = todo.status === "completed";
  completeButton.setAttribute("aria-label", `Mark "${todo.title}" as complete`);
  completeButton.setAttribute(
    "aria-pressed",
    String(todo.status === "completed"),
  );
  if (todo.status === "completed") {
    completeButton.classList.add("is-complete");
    completeButton.innerHTML =
      '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="m2.5 6 2.2 2.2 4.8-4.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  const title = document.createElement("span");
  title.className = "todo-title";
  title.textContent = todo.title;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", `Delete "${todo.title}"`);
  deleteButton.innerHTML =
    '<svg aria-hidden="true" width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M4.5 6h11m-9.5 0 .6 9.1c.1.8.7 1.4 1.5 1.4h3.8c.8 0 1.4-.6 1.5-1.4L14 6M8 6V4.8c0-.7.5-1.3 1.2-1.3h1.6c.7 0 1.2.6 1.2 1.3V6m-3 2.5v5m3-5v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  completeButton.addEventListener("click", async () => {
    completeButton.disabled = true;
    showFeedback();
    try {
      await requestTodos(`/todos/${encodeURIComponent(todo.id)}`, {
        method: "PATCH",
      });
      todo.status = "completed";
      renderTodos();
    } catch (error) {
      completeButton.disabled = false;
      showFeedback(error.message);
    }
  });

  deleteButton.addEventListener("click", async () => {
    deleteButton.disabled = true;
    showFeedback();
    try {
      await requestTodos(`/todos/${encodeURIComponent(todo.id)}`, {
        method: "DELETE",
      });
      todos = todos.filter((current) => current !== todo);
      renderTodos();
    } catch (error) {
      deleteButton.disabled = false;
      showFeedback(error.message);
    }
  });

  item.append(completeButton, title, deleteButton);
  return item;
}

function renderTodos() {
  const visibleTodos = todos.filter((todo) => {
    if (activeFilter === "active") return todo.status !== "completed";
    if (activeFilter === "completed") return todo.status === "completed";
    return true;
  });

  list.replaceChildren(...visibleTodos.map(createTask));
  updateSummary();

  const isEmpty = visibleTodos.length === 0;
  list.hidden = isEmpty;
  emptyState.hidden = !isEmpty;
  if (todos.length === 0) {
    emptyTitle.textContent = "A clear list, a clear mind.";
    emptyCopy.textContent = "Add a task above and get your momentum going.";
  } else {
    emptyTitle.textContent = "Nothing to see here.";
    emptyCopy.textContent =
      "Try another filter to find what you’re looking for.";
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const selected = filterButton === button;
      filterButton.classList.toggle("is-selected", selected);
      filterButton.setAttribute("aria-pressed", String(selected));
    });
    renderTodos();
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) {
    input.focus();
    return;
  }

  const addButton = form.querySelector("button[type='submit']");
  addButton.disabled = true;
  showFeedback();
  try {
    const result = await requestTodos("/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    todos.push(result.todo);
    input.value = "";
    activeFilter = "all";
    filterButtons.forEach((button) => {
      const selected = button.dataset.filter === activeFilter;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    renderTodos();
    input.focus();
  } catch (error) {
    showFeedback(error.message);
  } finally {
    addButton.disabled = false;
  }
});

async function loadTodos() {
  try {
    const result = await requestTodos("/todos");
    todos = result.todos;
    renderTodos();
  } catch (error) {
    summary.textContent = "Unable to load tasks";
    showFeedback(error.message);
    emptyTitle.textContent = "We couldn’t load your tasks.";
    emptyCopy.textContent =
      "Check your connection and refresh the page to try again.";
    list.hidden = true;
    emptyState.hidden = false;
  } finally {
    list.setAttribute("aria-busy", "false");
  }
}

loadTodos();
