import Point from "./Point";
import Rectangle from "./Rectangle";

export default class PointMap<T> {

    boundary: Rectangle;
    capacity: number;

    points: { point: Point, value: T }[];

    northwest?: PointMap<T>;
    northeast?: PointMap<T>;
    southwest?: PointMap<T>;
    southeast?: PointMap<T>;

    constructor(boundary: Rectangle, capacity: number) {
        this.boundary = boundary;
        this.capacity = capacity;

        this.points = [];
    }

    isAreadyDivided = (): boolean => {
        return !!this.northwest || !!this.northeast || !!this.southwest || !!this.southeast;
    }

    subdivide = (): void => {
        const { x, y, width, height } = this.boundary;
        const nw = new Rectangle(x, y, width / 2, height / 2);
        const ne = new Rectangle(x + width / 2, y, width / 2, height / 2);
        const sw = new Rectangle(x, y + height / 2, width / 2, height / 2);
        const se = new Rectangle(x + width / 2, y + height / 2, width / 2, height / 2);
        this.northwest = new PointMap(nw, this.capacity);
        this.northeast = new PointMap(ne, this.capacity);
        this.southwest = new PointMap(sw, this.capacity);
        this.southeast = new PointMap(se, this.capacity);
    }

    insert = (point: Point, value: T): boolean => {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push({ point, value });
            return true;
        } else {
            if (!this.isAreadyDivided()) {
                this.subdivide();
            }

            return this.northwest?.insert(point, value)
                || this.northeast?.insert(point, value)
                || this.southwest?.insert(point, value)
                || this.southeast?.insert(point, value)
                || false;
        }
    }

    query(range: Rectangle, found: { point: Point, value: T }[] = []): { point: Point, value: T }[] {
        if (!this.boundary.intersects(range)) {
            return found;
        } else {
            for (const point of this.points) {
                if (range.contains(point.point)) {
                    found.push(point);
                }
            }
            if (this.isAreadyDivided()) {
                this.northwest?.query(range, found);
                this.northeast?.query(range, found);
                this.southwest?.query(range, found);
                this.southeast?.query(range, found);
            }
            return found;
        }
    }
}