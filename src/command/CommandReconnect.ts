import { Command } from "./Command";
import { Type } from "../TypeRegistry";

@Type('CommandReconnect')
export class CommandReconnect extends Command {
  con: any;
  oldSourcePort: any;
  oldTargetPort: any;
  newSourcePort: any;
  newTargetPort: any;
  constructor(conn) {
    super('Reconnet Port')
    this.con = conn
    this.oldSourcePort = conn.getSource()
    this.oldTargetPort = conn.getTarget()
  }


  canExecute() {
    return true
  }

  setNewPorts(source, target) {
    this.newSourcePort = source
    this.newTargetPort = target
  }


  setIndex(index) {

  }

  updatePosition(x, y) {
  }

  execute() {
    this.redo()
  }


  cancel() {
    this.con.setSource(this.oldSourcePort)
    this.con.setTarget(this.oldTargetPort)

    this.con.routingRequired = true
    this.con.repaint()
  }


  undo() {
    this.con.setSource(this.oldSourcePort)
    this.con.setTarget(this.oldTargetPort)
    this.con.routingRequired = true
    this.con.repaint()
  }


  redo() {
    this.con.setSource(this.newSourcePort)
    this.con.setTarget(this.newTargetPort)

    this.con.routingRequired = true
    this.con.repaint()
  }
}