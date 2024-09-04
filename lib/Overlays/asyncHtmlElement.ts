export default (futureElement: Promise<HTMLElement | string>): HTMLElement => {
    const containerNode = document.createElement("div");

    futureElement.then(element => {
        if (typeof element === "string") {
            containerNode.innerHTML = element;
        } else {
            containerNode.appendChild(element);
        }
    })

    return containerNode;
}