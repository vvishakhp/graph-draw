import $ from 'jquery';
import ArrayList from './util/ArrayList';

export interface AttributeCollection {
    [key: string]: any;
}

export class Canvas {

    private scrollArea: JQuery;
    private canvasId: string | HTMLElement;
    private html: JQuery;

    constructor(canvasId: string | HTMLElement, width: number, height: number) {
        this.setScrollArea(document.body);
        this.canvasId = canvasId;
        this.html = $(canvasId as any);
        if (!isNaN(parseFloat(width)) && !isNaN(parseFloat(height))) {
            this.initialWidth = width
            this.initialHeight = height
        } else {
            this.initialWidth = this.getWidth();
            this.initialHeight = this.getHeight();
        }

        this.html.css({ "-webkit-tap-highlight-color": "rgba(0,0,0,0)" });

        $(this.html).droppable({
            accept: '.draw2d_droppable',
            over: (event, ui) => {
                this.onDragEnter(ui.draggable)
            },
            out: (event, ui) => {
                this.onDragLeave(ui.draggable)
            },
            drop: (event, ui) => {
                event = this._getEvent(event)
                let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
                this.onDrop(ui.draggable, pos.getX(), pos.getY(), event.shiftKey, event.ctrlKey)
            }
        });
    }

    public setScrollArea(el: string | HTMLElement) {
        this.scrollArea = $(el as any)
        return this
    }
}