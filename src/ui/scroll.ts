// Прогрес прокрутки та кнопка "наверх"

function updateScrollState(): void {
    const progress: HTMLDivElement | null =
        document.querySelector("#headerProgress");
    const topBtn: HTMLButtonElement | null =
        document.querySelector("#scrollTopBtn");

    const scrollTop: number = window.scrollY;
    const maxScroll: number =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    if (progress) {
        const percent: number = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        progress.style.width = `${percent}%`;
    }

    if (topBtn) {
        if (scrollTop > 250) {
            topBtn.classList.add("scroll-top--visible");
        } else {
            topBtn.classList.remove("scroll-top--visible");
        }
    }
}

function scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

export function initScrollUi(): void {
    const topBtn: HTMLButtonElement | null =
        document.querySelector("#scrollTopBtn");

    window.addEventListener("scroll", updateScrollState);
    updateScrollState();

    if (topBtn) {
        topBtn.addEventListener("click", scrollToTop);
    }
}

export function initScrollToSection(): void {
    const buttons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-scroll-target]");

    buttons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => {
            const selector: string | null = btn.getAttribute("data-scroll-target");
            if (!selector) return;
            const target: HTMLElement | null = document.querySelector(selector);
            if (!target) return;
            target.scrollIntoView({ behavior: "smooth" });
        });
    });
}
