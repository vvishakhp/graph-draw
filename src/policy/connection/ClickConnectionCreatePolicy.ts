import { Type, DirectRouter, ConnectionCreatePolicy, Port, Figure, Point, LineShape, PolyLine, CommandType, InputPort, VertexRouter } from '../../imports';


@Type('ClickConnectionCreatePolicy')
export class ClickConnectionCreatePolicy extends ConnectionCreatePolicy {

    private port1: Port;
    private beeline;
    private pulse;
    private tempConnection;
    private vertices = [];

    constructor(attr?, setter?, getter?) {
        super(attr, setter, getter);
        this.port1 = null;
        this.beeline = null;
        this.pulse = null;
        this.tempConnection = null;
    }

    onClick(figure: Figure, x: number, y: number, shiftKey: boolean = null, ctrlKey: boolean = null) {
        var port = figure;
        if (port === null && this.port1 === null) {
            return;
        }
        if (port === null) {
            this.vertices.push(new Point(x, y));
            this.beeline.setStartPosition(x, y);
            this.tempConnection.setVertices(this.vertices);
            if (this.pulse !== null) {
                this.pulse.remove();
                this.pulse = null;
            }
            this.ripple(x, y, 0);
            return;
        }

        //just consider ports
        //
        if (!(port instanceof Port)) {
            return;
        }

        // start connection create by selection the start port
        //
        if (this.port1 === null) {
            var canvas = port.getCanvas();
            this.port1 = port;
            this.vertices.push(port.getAbsolutePosition());
            this.beeline = new LineShape({
                start: this.port1.getAbsolutePosition(),
                end: this.port1.getAbsolutePosition(),
                dasharray: "- ",
                color: "#2C70FF"
            }, {}, {});

            this.beeline.hide = () => {
                this.beeline.setCanvas(null);
            };

            this.beeline.show = (canvas) => {
                this.beeline.setCanvas(canvas);
                this.beeline.shape.toFront();
            };
            this.beeline.show(canvas);

            this.tempConnection = new PolyLine({
                start: this.port1.getAbsolutePosition(),
                end: this.port1.getAbsolutePosition(),
                stroke: 2,
                color: "#2C70FF"
            }, {}, {});

            this.tempConnection.hide = () => {
                this.tempConnection.setCanvas(null);
            };

            this.tempConnection.show = (canvas) => {
                this.tempConnection.setCanvas(canvas);
                this.tempConnection.shape.toFront();
            };

            this.tempConnection.show(canvas);
            this.tempConnection.setVertices([this.port1.getAbsolutePosition(), this.port1.getAbsolutePosition()]);

            var a = () => {
                this.tempConnection.shape.animate({ "stroke-width": 2 }, 800, b);
            };

            var b = () => {
                this.tempConnection.shape.animate({ "stroke-width": 1 }, 800, a);
            };

            a();

            var pos = port.getAbsolutePosition();
            this.pulse = this.ripple(pos.getX(), pos.getY(), 1);
            return;
        }


        var possibleTarget = port.delegateTarget(this.port1);

        if (!(possibleTarget instanceof Port)) {
            return;
        }

        var request: any = new CommandType(CommandType.CONNECT);
        request.source = this.port1;
        request.target = port;

        var command = null;
        if (this.port1 instanceof InputPort) {
            command = this.port1.createCommand(request);
        }
        else {
            command = port.createCommand(request);
        }

        if (command !== null) {
            this.vertices.push(port.getPosition());
            command.setConnection(this.createConnection());
            figure.getCanvas().getCommandStack().execute(command);
            this.beeline.hide();
            this.tempConnection.hide();
            if (this.pulse !== null) {
                this.pulse.remove();
                this.pulse = null;
            }
            this.beeline = null;
            this.port1 = null;
            this.vertices = [];
        }
    }

    onMouseMove(canvas: Figure, x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
        if (this.beeline !== null) {
            this.beeline.setEndPosition(x, y);
        }
    }
    onKeyDown(canvas, keyCode, shiftKey, ctrlKey) {
        var KEYCODE_ENTER = 13;
        var KEYCODE_ESC = 27;
        if (keyCode === KEYCODE_ESC && this.beeline !== null) {
            this.beeline.hide();
            this.tempConnection.hide();
            this.beeline = null;
            this.port1 = null;
            this.vertices = [];
            if (this.pulse != null) {
                this.pulse.remove();
                this.pulse = null;
            }
        }
    }

    createConnection() {
        var connection = super.createConnection();
        if (this.vertices.length === 2) {
            connection.setRouter(new DirectRouter());
        }
        else {
            connection.setRouter(new VertexRouter());
            connection.setVertices(this.vertices);
        }
        connection.setRadius(10);
        return connection;
    }
}

