import { Command } from "./Command";
import { Canvas } from "../Canvas";
import { Port } from "../Port";
import { Connection } from "../Connection";
export class CommandConnect extends Command {

  canvas: Canvas;
  source: any;
  target: any;
  connection: any;
  dropTarget: any;

  constructor(source: Port, target: Port, dropTarget?: Port) {
    super("Create connection")
    this.canvas = target.getCanvas()
    this.source = source
    this.target = target
    this.connection = null
    this.dropTarget = dropTarget
  }

  setConnection(connection) {
    this.connection = connection
  }



  getConnection() {
    return this.connection
  }


  execute() {
    let optionalCallback = conn => {
      this.connection = conn
      this.connection.setSource(this.source)
      this.connection.setTarget(this.target)
      this.canvas.add(this.connection)
    }


    if (this.connection === null) {
      // deprecated call!!!!
      //
      let result = new Connection()
      debugger
      // will be handled by the optional callback
      if (typeof result === "undefined") {
        return
      }

      this.connection = result
    }

    optionalCallback(this.connection)
  }


  redo() {
    this.canvas.add(this.connection)
    this.connection.reconnect()
  }


  undo() {
    this.canvas.remove(this.connection)
  }
}
