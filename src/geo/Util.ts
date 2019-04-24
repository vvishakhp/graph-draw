import { Point } from "./Point";

const Util: {
    insetPoint: (start: Point, end: Point, distanceFromStart: number) => Point
} = {
    insetPoint: function (start: Point, end: Point, distanceFromStart: number) {
        if (start.equals(end)) {
            return start;
        }
        var vx = start.getX() - end.getX();
        var vy = start.getY() - end.getY();
        var length = Math.sqrt(vx * vx + vy * vy);
        var localDistance = Math.min(length / 2, distanceFromStart);
        return new Point(end.getX() + vx / length * (length - localDistance),
            end.getY() + vy / length * (length - localDistance));
    }
};


export default Util;
