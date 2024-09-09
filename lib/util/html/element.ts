export const insertAt = (container: HTMLElement, index: number, element: HTMLElement): void => {
    if (index >= container.children.length) {
        container.appendChild(element);
    } else {
        container.insertBefore(element, container.children[index])
    }
}
