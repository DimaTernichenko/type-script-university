type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
};

// --- Модальне вікно ---

function setModalState(open: boolean): void {
    const modal: HTMLDivElement | null = document.querySelector("#bookingModal");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    if (!modal || !backdrop) return;

    if (open) {
        modal.classList.add("modal--visible");
        backdrop.classList.add("backdrop--visible");
    } else {
        modal.classList.remove("modal--visible");
        backdrop.classList.remove("backdrop--visible");
    }
}

function initModal(): void {
    const openButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-open-modal]");
    const closeButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-close-modal]");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    openButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => setModalState(true));
    });

    closeButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => setModalState(false));
    });

    if (backdrop) {
        backdrop.addEventListener("click", (): void => setModalState(false));
    }
}

// --- Індикатор прокрутки + кнопка "наверх" ---

function updateScrollUi(): void {
    const progress: HTMLDivElement | null =
        document.querySelector("#headerProgress");
    const scrollTopBtn: HTMLButtonElement | null =
        document.querySelector("#scrollTopBtn");

    const scrollTop: number = window.scrollY;
    const maxScroll: number =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    if (progress) {
        const percent: number = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        progress.style.width = `${percent}%`;
    }

    if (scrollTopBtn) {
        if (scrollTop > 250) {
            scrollTopBtn.classList.add("scroll-top--visible");
        } else {
            scrollTopBtn.classList.remove("scroll-top--visible");
        }
    }
}

function initScrollUi(): void {
    const scrollTopBtn: HTMLButtonElement | null =
        document.querySelector("#scrollTopBtn");

    window.addEventListener("scroll", updateScrollUi);
    updateScrollUi();

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", (): void => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}

// --- Прокрутка до секції по кнопці ---

function initScrollToSection(): void {
    const buttons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-scroll-target]");

    buttons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => {
            const targetSelector: string | null = btn.getAttribute(
                "data-scroll-target"
            );
            if (!targetSelector) return;
            const target: HTMLElement | null = document.querySelector(
                targetSelector
            );
            if (!target) return;
            target.scrollIntoView({ behavior: "smooth" });
        });
    });
}

// --- Анімація карток "Про сайт" через IntersectionObserver ---

function initCardsObserver(): void {
    const cards: NodeListOf<HTMLDivElement> =
        document.querySelectorAll(".card.observe");

    if (cards.length === 0) return;

    const observer: IntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
            entries.forEach((entry: IntersectionObserverEntry): void => {
                if (entry.isIntersecting) {
                    const el: Element = entry.target;
                    el.classList.add("card--visible");
                    observer.unobserve(el);
                }
            });
        },
        {
            threshold: 0.25
        }
    );

    cards.forEach((card: HTMLDivElement): void => observer.observe(card));
}

// --- Завантаження задач з JSONPlaceholder ---

let currentPage: number = 1;
const TASKS_PER_PAGE: number = 5;

async function fetchTodos(page: number): Promise<Todo[]> {
    const url: string = `https://jsonplaceholder.typicode.com/todos?_limit=${TASKS_PER_PAGE}&_page=${page}`;
    const response: Response = await fetch(url);

    if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
    }

    const data: Todo[] = await response.json();
    return data;
}

function createTaskCard(todo: Todo): HTMLDivElement {
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

async function loadMoreTodos(): Promise<void> {
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
            const card: HTMLDivElement = createTaskCard(todo);
            container.appendChild(card);
        });

        currentPage++;
    } catch (error) {
        console.error("Не вдалося завантажити задачі:", error);
    }
}

function initTasksSection(): void {
    const button: HTMLButtonElement | null =
        document.querySelector("#loadMoreTasks");

    void loadMoreTodos();

    if (button) {
        button.addEventListener("click", (): void => {
            void loadMoreTodos();
        });
    }
}

// --- Ініціалізація всього додатку ---

function initApp(): void {
    initModal();
    initScrollUi();
    initScrollToSection();
    initCardsObserver();
    initTasksSection();
}

document.addEventListener("DOMContentLoaded", (): void => {
    initApp();
});
