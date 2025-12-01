import { initModalUi } from "./ui/modal.js";
import { initScrollUi, initScrollToSection } from "./ui/scroll.js";
import { initCardsAnimation } from "./ui/cards.js";
import { initTodosSection } from "./data/todos.js";
function bootstrap() {
    initModalUi();
    initScrollUi();
    initScrollToSection();
    initCardsAnimation();
    initTodosSection();
}
document.addEventListener("DOMContentLoaded", () => {
    bootstrap();
});
