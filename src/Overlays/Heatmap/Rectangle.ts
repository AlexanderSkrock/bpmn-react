import Point from "./Point";

export default class Rectangle {

    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains = ({ x, y }: Point) => {
        return x >= this.x
            && x <= this.x + this.width
            && y >= this.y
            && y <= this.y + this.height;
    }

    intersects = ({ x, y, width, height }: Rectangle) => {
        return !(
            x > this.x + this.width
            || x + width < this.x
            || y > this.y + this.height
            || y + height < this.y
        );
    }
}