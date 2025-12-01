// Прогрес прокрутки та кнопка "наверх"
function updateScrollState() {
    const progress = document.querySelector("#headerProgress");
    const topBtn = document.querySelector("#scrollTopBtn");
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    if (progress) {
        const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        progress.style.width = `${percent}%`;
    }
    if (topBtn) {
        if (scrollTop > 250) {
            topBtn.classList.add("scroll-top--visible");
        }
        else {
            topBtn.classList.remove("scroll-top--visible");
        }
    }
}
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
export function initScrollUi() {
    const topBtn = document.querySelector("#scrollTopBtn");
    window.addEventListener("scroll", updateScrollState);
    updateScrollState();
    if (topBtn) {
        topBtn.addEventListener("click", scrollToTop);
    }
}
export function initScrollToSection() {
    const buttons = document.querySelectorAll("[data-scroll-target]");
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const selector = btn.getAttribute("data-scroll-target");
            if (!selector)
                return;
            const target = document.querySelector(selector);
            if (!target)
                return;
            target.scrollIntoView({ behavior: "smooth" });
        });
    });
}
