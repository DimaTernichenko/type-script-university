// Анімація карток "Про сайт"
export function initCardsAnimation() {
    const cards = document.querySelectorAll(".card.observe");
    if (cards.length === 0)
        return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add("card--visible");
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.25
    });
    cards.forEach((card) => observer.observe(card));
}
