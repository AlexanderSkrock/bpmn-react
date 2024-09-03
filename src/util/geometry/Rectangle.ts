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

    center = () => {
        return new Point(this.x + (this.width / 2), this.y + (this.height / 2));
    }

    upperLeft = () => {
        return new Point(this.x, this.y);
    }

    upperRight = () => {
        return new Point(this.x + this.width, this.y);
    }

    bottomLeft = () => {
        return new Point(this.x, this.y + this.height);
    }

    bottomRight = () => {
        return new Point(this.x + this.width, this.y + this.height);
    }
}
