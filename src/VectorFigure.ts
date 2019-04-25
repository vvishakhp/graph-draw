import { Type, Node, Color, extend } from "./imports";
import jsonUtil from "./util/JSONUtil";


@Type('VectorFigure')
export class VectorFigure extends Node {
    stroke: number;
    radius: number;
    bgColor: any;
    color: Color;
    dasharray: any;
    strokeBeforeGlow: number;
    glowIsActive: boolean;

    constructor(attr, setter, getter) {
        super(attr, setter, getter);
        this.stroke = 1;
        this.radius = 0;
        this.bgColor = new Color(255, 255, 255);
        this.color = new Color(48, 48, 48);
        this.dasharray = null;

        this.strokeBeforeGlow = this.stroke;
        this.glowIsActive = false;


        this.setterWhitelist = extend({
            dasharray: this.setDashArray,
            radius: this.setRadius,
            bgColor: this.setBackgroundColor,
            color: this.setColor,
            stroke: this.setStroke
        }, this.setterWhitelist);

        this.getterWhitelist = extend({
            dasharray: this.getDashArray,
            radius: this.getRadius,
            bgColor: this.getBackgroundColor,
            color: this.getColor,
            stroke: this.getStroke
        }, this.getterWhitelist);
    }


    setRadius(radius) {
        this.radius = radius;
        this.repaint({});
        this.fireEvent("change:radius", { value: this.radius });

        return this;
    }

    getRadius() {
        return this.radius;
    }

    setDashArray(dashPattern) {
        this.dasharray = dashPattern;
        this.repaint({});

        this.fireEvent("change:dashArray", { value: this.dasharray });

        return this;
    }

    getDashArray() {
        return this.dasharray;
    }

    setGlow(flag) {

        if (flag === this.glowIsActive) {
            return this;
        }

        this.glowIsActive = flag;
        if (flag === true) {
            this.strokeBeforeGlow = this.getStroke();
            this.setStroke(this.strokeBeforeGlow * 2.5);
        }
        else {
            this.setStroke(this.strokeBeforeGlow);
        }

        return this;
    }

    repaint(attributes) {
        if (this.repaintBlocked === true || this.shape === null) {
            return;
        }

        attributes = attributes || {};

        attributes.x = this.getAbsoluteX();
        attributes.y = this.getAbsoluteY();

        if (typeof attributes.stroke === "undefined") {
            if (this.color === null || this.stroke === 0) {
                attributes.stroke = "none";
            }
            else {
                attributes.stroke = this.color.hash();
            }
        }

        jsonUtil.ensureDefault(attributes, "stroke-width", this.stroke);
        jsonUtil.ensureDefault(attributes, "fill", this.bgColor.hash());
        jsonUtil.ensureDefault(attributes, "dasharray", this.dasharray);

        super.repaint(attributes);

        return this;
    }

    setBackgroundColor(color: Color) {
        this.bgColor = color.clone()

        this.repaint({});
        this.fireEvent("change:bgColor", { value: this.bgColor });

        return this;
    }

    getBackgroundColor() {
        return this.bgColor;
    }

    setStroke(w) {
        this.stroke = w;
        this.repaint({});
        this.fireEvent("change:stroke", { value: this.stroke });

        return this;
    }

    getStroke() {
        return this.stroke;
    }

    setColor(color: Color) {
        this.color = color.clone();
        this.repaint({});
        this.fireEvent("change:color", { value: this.color });

        return this;
    }

    getColor() {
        return this.color;
    }

    getPersistentAttributes() {
        var memento = extend(super.getPersistentAttributes(), {
            bgColor: this.bgColor.hash(),
            color: this.color.hash(),
            stroke: this.stroke,
            radius: this.radius,
            dasharray: this.dasharray
        });

        return memento;
    }

    setPersistentAttributes(memento) {
        super.setPersistentAttributes(memento);

        if (typeof memento.radius !== "undefined") {
            this.setRadius(memento.radius);
        }

        if (typeof memento.bgColor !== "undefined") {
            this.setBackgroundColor(memento.bgColor);
        }

        if (typeof memento.color !== "undefined") {
            this.setColor(memento.color);
        }

        if (typeof memento.stroke !== "undefined") {
            this.setStroke(memento.stroke === null ? 0 : parseFloat(memento.stroke));
        }

        if (typeof memento.dasharray === "string") {
            this.dasharray = memento.dasharray;
        }


        return this;
    }

}

