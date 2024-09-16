import Rectangle from "./Rectangle";
import { Geometry } from "./geometry.types";
import { contains } from "./contains";
import { intersectsRectangleRectangle } from "./intersections";

export default class PointMap<T> {

    boundary: Rectangle;
    capacity: number;

    geometries: { geometry: Geometry, value: T }[];

    northwest?: PointMap<T>;
    northeast?: PointMap<T>;
    southwest?: PointMap<T>;
    southeast?: PointMap<T>;

    constructor(boundary: Rectangle, capacity: number) {
        this.boundary = boundary;
        this.capacity = capacity;

        this.geometries = [];
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

    insert = (geometry: Geometry, value: T): boolean => {
        if (!contains(this.boundary, geometry)) {
            return false;
        }

        if (this.geometries.length < this.capacity) {
            this.geometries.push({ geometry, value });
            return true;
        } else {
            if (!this.isAreadyDivided()) {
                this.subdivide();
            }

            const nwResult = this.northwest?.insert(geometry, value);
            const neResult = this.northeast?.insert(geometry, value);
            const swResult = this.southwest?.insert(geometry, value);
            const seResult = this.southeast?.insert(geometry, value);

            return nwResult ?? neResult ?? swResult ?? seResult ?? false;
        }
    }

    query(range: Rectangle, found: { geometry: Geometry, value: T }[] = []): { geometry: Geometry, value: T }[] {
        if (!intersectsRectangleRectangle(this.boundary, range)) {
            return found;
        }

        for (const point of this.geometries) {
            if (contains(range, point.geometry)) {
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
