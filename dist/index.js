"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// --- Модальне вікно ---
function setModalState(open) {
    const modal = document.querySelector("#bookingModal");
    const backdrop = document.querySelector("#backdrop");
    if (!modal || !backdrop)
        return;
    if (open) {
        modal.classList.add("modal--visible");
        backdrop.classList.add("backdrop--visible");
    }
    else {
        modal.classList.remove("modal--visible");
        backdrop.classList.remove("backdrop--visible");
    }
}
function initModal() {
    const openButtons = document.querySelectorAll("[data-open-modal]");
    const closeButtons = document.querySelectorAll("[data-close-modal]");
    const backdrop = document.querySelector("#backdrop");
    openButtons.forEach((btn) => {
        btn.addEventListener("click", () => setModalState(true));
    });
    closeButtons.forEach((btn) => {
        btn.addEventListener("click", () => setModalState(false));
    });
    if (backdrop) {
        backdrop.addEventListener("click", () => setModalState(false));
    }
}
// --- Індикатор прокрутки + кнопка "наверх" ---
function updateScrollUi() {
    const progress = document.querySelector("#headerProgress");
    const scrollTopBtn = document.querySelector("#scrollTopBtn");
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    if (progress) {
        const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        progress.style.width = `${percent}%`;
    }
    if (scrollTopBtn) {
        if (scrollTop > 250) {
            scrollTopBtn.classList.add("scroll-top--visible");
        }
        else {
            scrollTopBtn.classList.remove("scroll-top--visible");
        }
    }
}
function initScrollUi() {
    const scrollTopBtn = document.querySelector("#scrollTopBtn");
    window.addEventListener("scroll", updateScrollUi);
    updateScrollUi();
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}
// --- Прокрутка до секції по кнопці ---
function initScrollToSection() {
    const buttons = document.querySelectorAll("[data-scroll-target]");
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetSelector = btn.getAttribute("data-scroll-target");
            if (!targetSelector)
                return;
            const target = document.querySelector(targetSelector);
            if (!target)
                return;
            target.scrollIntoView({ behavior: "smooth" });
        });
    });
}
// --- Анімація карток "Про сайт" через IntersectionObserver ---
function initCardsObserver() {
    const cards = document.querySelectorAll(".card.observe");
    if (cards.length === 0)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add("card--visible");
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.25
    });
    cards.forEach((card) => observer.observe(card));
}
// --- Завантаження задач з JSONPlaceholder ---
let currentPage = 1;
const TASKS_PER_PAGE = 5;
function fetchTodos(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://jsonplaceholder.typicode.com/todos?_limit=${TASKS_PER_PAGE}&_page=${page}`;
        const response = yield fetch(url);
        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }
        const data = yield response.json();
        return data;
    });
}
function createTaskCard(todo) {
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
function loadMoreTodos() {
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
                const card = createTaskCard(todo);
                container.appendChild(card);
            });
            currentPage++;
        }
        catch (error) {
            console.error("Не вдалося завантажити задачі:", error);
        }
    });
}
function initTasksSection() {
    const button = document.querySelector("#loadMoreTasks");
    void loadMoreTodos();
    if (button) {
        button.addEventListener("click", () => {
            void loadMoreTodos();
        });
    }
}
// --- Ініціалізація всього додатку ---
function initApp() {
    initModal();
    initScrollUi();
    initScrollToSection();
    initCardsObserver();
    initTasksSection();
}
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});
