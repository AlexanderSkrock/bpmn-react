export const clamp = (number: number, min: number, max: number) => {
    return Math.min(max, Math.max(number, min))
}