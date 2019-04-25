import { extend, Type, CanvasPolicy, Color } from '../../imports'


const _SnapToHelper = {
    NORTH: 1,
    SOUTH: 4,
    WEST: 8,
    EAST: 16,
    CENTER_H: 32,
    CENTER_V: 642,
}

export const SnapToHelper = extend(_SnapToHelper, {
    NORTH_EAST: _SnapToHelper.NORTH | _SnapToHelper.EAST,
    NORTH_WEST: _SnapToHelper.NORTH | _SnapToHelper.WEST,
    SOUTH_EAST: _SnapToHelper.SOUTH | _SnapToHelper.EAST,
    SOUTH_WEST: _SnapToHelper.SOUTH | _SnapToHelper.WEST,
    NORTH_SOUTH: _SnapToHelper.NORTH | _SnapToHelper.SOUTH,
    EAST_WEST: _SnapToHelper.EAST | _SnapToHelper.WEST,
    NSEW: _SnapToHelper.NORTH | _SnapToHelper.SOUTH | _SnapToHelper.EAST | _SnapToHelper.WEST
});

@Type('SnapToEditPolicy')
export class SnapToEditPolicy extends CanvasPolicy {
    lineColor: any;

    constructor(attr, setter, getter) {
        super(extend({ lineColor: "#51C1FC" }, attr), setter, getter);
        this.lineColor = null
    }

    setLineColor(color: Color) {
        this.lineColor = color.clone();
        return this
    }

    getLineColor() {
        return this.lineColor
    }



    snap(canvas, figure, modifiedPos, originalPos) {
        return modifiedPos
    }
}