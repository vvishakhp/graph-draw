import { KeyboardPolicy } from "../canvas/KeyboardPolicy";
import { Type } from "../../TypeRegistry";
import { Connection } from "../../Connection";

@Type('ConnectionCreatePolicy')
export class ConnectionCreatePolicy extends KeyboardPolicy {
    createConnection() {
        return new Connection({
            router: new DirectRouter()
        });
    }


    ripple(x: number, y: number, type: number) {
        switch (type) {
            case 0:
                var circle = this.canvas.paper.circle(x, y, 3, 3).attr({ fill: null, stroke: "#d0d0ff" });
                var anim = Raphael.animation(
                    { transform: "s6", opacity: 0.0, "stroke-width": 3 },
                    500,
                    "linear",
                    function () { circle.remove() }
                );
                circle.animate(anim);

                return this.canvas.paper.set();
                break;
            case 1:
                var circle1 = this.canvas.paper.circle(x, y, 3, 3).attr({ fill: null, stroke: "#3f72bf" });
                var circle2 = this.canvas.paper.circle(x, y, 3, 3).attr({ fill: null, stroke: "#ff0000" });
                var anim1 = Raphael.animation(
                    { transform: "s6", opacity: 0.0, "stroke-width": 1 },
                    1200,
                    "linear"
                ).repeat(Infinity);
                circle1.animate(anim1);
                var anim2 = Raphael.animation(
                    { transform: "s12", opacity: 0.0, "stroke-width": 4 },
                    500,
                    "linear",
                    function () { circle2.remove() }
                );
                circle2.animate(anim2);

                return circle1;
                break;
        }

    }

}
