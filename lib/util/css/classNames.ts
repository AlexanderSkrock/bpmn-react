export const joinClassNames = (...classNames: (string | undefined | null)[]): string => {
    if (!classNames) {
        return "";
    }
    const classNamesWithContent = classNames
        .map(className => className?.trim())
        .filter(className => !!className);

    return classNamesWithContent.length > 0 ? classNamesWithContent.join("") : "";
}