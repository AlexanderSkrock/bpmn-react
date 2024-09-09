export const applyCustomStyle = (styleRule: string): void => {
    const styleSheet = new CSSStyleSheet();
    styleSheet.insertRule(styleRule);

    document.adoptedStyleSheets.push(styleSheet);
}
