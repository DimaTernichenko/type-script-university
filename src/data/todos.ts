import type { Todo } from "../types/todo.js";

let currentPage: number = 1;
const PER_PAGE: number = 5;

async function fetchTodos(page: number): Promise<Todo[]> {
    const url: string = `https://jsonplaceholder.typicode.com/todos?_limit=${PER_PAGE}&_page=${page}`;
    const response: Response = await fetch(url);

    if (!response.ok) {
        throw new Error("HTTP error " + response.status);
    }

    const data: Todo[] = await response.json();
    return data;
}

function buildTodoCard(todo: Todo): HTMLDivElement {
    const card: HTMLDivElement = document.createElement("div");
    card.className = "task-card";

    const title: HTMLHeadingElement = document.createElement("h3");
    title.textContent = todo.title;

    const status: HTMLSpanElement = document.createElement("span");
    status.textContent = todo.completed ? "Виконано" : "В процесі";

    card.appendChild(title);
    card.appendChild(status);
    return card;
}

export async function loadNextTodos(): Promise<void> {
    const container: HTMLDivElement | null =
        document.querySelector("#tasksContainer");
    const button: HTMLButtonElement | null =
        document.querySelector("#loadMoreTasks");

    if (!container) return;

    try {
        const todos: Todo[] = await fetchTodos(currentPage);
        if (todos.length === 0 && button) {
            button.disabled = true;
            button.textContent = "Більше задач немає";
            return;
        }

        todos.forEach((todo: Todo): void => {
            const card: HTMLDivElement = buildTodoCard(todo);
            container.appendChild(card);
        });

        currentPage++;
    } catch (error) {
        console.error("Помилка завантаження задач:", error);
    }
}

export function initTodosSection(): void {
    const button: HTMLButtonElement | null =
        document.querySelector("#loadMoreTasks");

    void loadNextTodos();

    if (button) {
        button.addEventListener("click", (): void => {
            void loadNextTodos();
        });
    }
}
