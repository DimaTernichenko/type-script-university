// Модальне вікно бронювання

function applyModalState(open: boolean): void {
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

export function initModalUi(): void {
    const openButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-open-modal]");
    const closeButtons: NodeListOf<HTMLButtonElement> =
        document.querySelectorAll("[data-close-modal]");
    const backdrop: HTMLDivElement | null = document.querySelector("#backdrop");

    openButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => applyModalState(true));
    });

    closeButtons.forEach((btn: HTMLButtonElement): void => {
        btn.addEventListener("click", (): void => applyModalState(false));
    });

    if (backdrop) {
        backdrop.addEventListener("click", (): void => applyModalState(false));
    }
}
