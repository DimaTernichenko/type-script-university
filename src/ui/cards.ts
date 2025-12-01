// Анімація карток "Про сайт"

export function initCardsAnimation(): void {
    const cards: NodeListOf<HTMLDivElement> =
        document.querySelectorAll(".card.observe");

    if (cards.length === 0) return;

    const observer: IntersectionObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
            entries.forEach((entry: IntersectionObserverEntry): void => {
                if (entry.isIntersecting) {
                    const element: Element = entry.target;
                    element.classList.add("card--visible");
                    observer.unobserve(element);
                }
            });
        },
        {
            threshold: 0.25
        }
    );

    cards.forEach((card: HTMLDivElement): void => observer.observe(card));
}
