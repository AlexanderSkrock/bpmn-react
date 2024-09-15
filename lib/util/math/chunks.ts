export const chunks2D = ({ width, height, chunkWidth, chunkHeight }: { width: number, height: number, chunkWidth: number, chunkHeight: number }) => {
    const chunks = [];
    for (let y = 0; y < height; y += chunkHeight) {
        for (let x = 0; x < width; x += chunkWidth) {
            chunks.push({
                startX: x,
                endX: Math.min(x + chunkWidth, width),
                startY: y,
                endY: Math.min(y + chunkHeight, height),
            });
        }
    }
    return chunks;
}