var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let currentPage = 1;
const PER_PAGE = 5;
function fetchTodos(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://jsonplaceholder.typicode.com/todos?_limit=${PER_PAGE}&_page=${page}`;
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        const data = yield response.json();
        return data;
    });
}
function buildTodoCard(todo) {
    const card = document.createElement("div");
    card.className = "task-card";
    const title = document.createElement("h3");
    title.textContent = todo.title;
    const status = document.createElement("span");
    status.textContent = todo.completed ? "Виконано" : "В процесі";
    card.appendChild(title);
    card.appendChild(status);
    return card;
}
export function loadNextTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.querySelector("#tasksContainer");
        const button = document.querySelector("#loadMoreTasks");
        if (!container)
            return;
        try {
            const todos = yield fetchTodos(currentPage);
            if (todos.length === 0 && button) {
                button.disabled = true;
                button.textContent = "Більше задач немає";
                return;
            }
            todos.forEach((todo) => {
                const card = buildTodoCard(todo);
                container.appendChild(card);
            });
            currentPage++;
        }
        catch (error) {
            console.error("Помилка завантаження задач:", error);
        }
    });
}
export function initTodosSection() {
    const button = document.querySelector("#loadMoreTasks");
    void loadNextTodos();
    if (button) {
        button.addEventListener("click", () => {
            void loadNextTodos();
        });
    }
}
