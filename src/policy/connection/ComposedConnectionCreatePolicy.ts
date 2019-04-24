import ArrayList from "../../util/ArrayList";
import { ConnectionCreatePolicy } from "./ConnectionCreatePolicy";

export class ComposedConnectionCreatePolicy extends ConnectionCreatePolicy {
    constructor(private policies: any[]) {
        super();
    }

    onMouseDown() {
        let _arg = arguments;
        this.policies.forEach((p) => {
            p.onMouseDown.apply(p, _arg);
        });
    }

    onMouseDrag() {
        let _arg = arguments;
        this.policies.forEach((p) => {
            p.onMouseDrag.apply(p, _arg);
        });
    }

    onMouseUp() {
        let _arg = arguments;
        this.policies.forEach((p) => {
            p.onMouseUp.apply(p, _arg);
        });
    }

    onClick() {
        let _arg = arguments;
        this.policies.forEach((p) => {
            p.onClick.apply(p, _arg);
        });
    }

    onMouseMove() {
        let _arg = arguments;
        this.policies.forEach((p) => {
            p.onMouseMove.apply(p, _arg);
        });
    }

    onKeyUp(canvas, keyCode, shiftKey, ctrlKey) {
        let _arg = arguments;
        this.policies.forEach((p) => {
            p.onKeyUp.apply(p, _arg);
        });
    }

    onKeyDown(canvas, keyCode, shiftKey, ctrlKey) {
        let _arg = arguments;
        this.policies.forEach((p) => {
            p.onKeyDown.apply(p, _arg);
        });
    }

    onInstall(canvas) {
        let _arg = arguments;
        this.policies.forEach((p) => {
            p.onInstall.apply(p, _arg);
        });
    }

    onUninstall(canvas) {
        let _arg = arguments;
        this.policies.forEach((p) => {
            p.onUninstall.apply(p, _arg);
        });
    }
}