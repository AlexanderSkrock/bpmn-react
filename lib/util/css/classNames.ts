export const joinClassNames = (...classNames: string[]): string => {
    if (!classNames) {
        return "";
    }
    return classNames.reduce((acc, current) => acc ? `${current} ${acc}` : current, "");
}