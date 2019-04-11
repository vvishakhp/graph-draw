import { Label } from '../shape/basic/Label';

export interface Listener {
    onStart?: Function,
    onCommit?: Function,
    onCancel?: Function,
    text?: string
}

export class LabelEditor {

    private configuration: Listener;

    constructor(listener: Listener) {
        this.configuration = {
            onStart: listener.onStart ? listener.onStart : () => { },
            onCancel: listener.onCancel ? listener.onCancel : () => { },
            onCommit: listener.onCommit ? listener.onCommit : () => { },
            text: listener.text ? listener.text : 'Value'
        };
    }

    start(label: Label) {
        this.configuration.onStart()
        var newText = prompt(this.configuration.text, label.getText());
        if (newText) {
            var cmd = new CommandAttr(label, { text: newText });
            label.getCanvas().getCommandStack().execute(cmd);
            this.configuration.onCommit(label.getText());
        }
        else {
            this.configuration.onCancel();
        }
    }
}
