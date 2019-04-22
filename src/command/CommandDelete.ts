import { Figure } from "../Figure";
import { Command } from "./Command";
import { Canvas } from "../Canvas";
import ArrayList from "../util/ArrayList";

export class CommandDelete extends Command {

  private parent: Figure;
  private figure: Figure;
  private canvas: Canvas;
  private connections: ArrayList<Connection>;
  private removedParentEntry = null;
  private indexOfChild = -1;

  constructor(figure: Figure) {
    super('Delete item');

    this.parent = figure.getParent()
    this.figure = figure
    this.canvas = figure.getCanvas()
    this.connections = null
    this.removedParentEntry = null // can be null if the figure didn't have any parent shape assigned
    this.indexOfChild = -1
  }

  canExecute() {
    return this.figure.getCanvas() !== null;
  }

  execute() {
    this.redo();
  }

  undo() {
    if (this.parent !== null) {
      this.parent.add(this.removedParentEntry.figure, this.removedParentEntry.locator, this.indexOfChild)
      this.canvas.setCurrentSelection(this.parent)
    }
    else {
      this.canvas.add(this.figure)
      this.canvas.setCurrentSelection(this.figure)
    }

    if (this.figure instanceof Connection) {
      this.figure.reconnect()
    }


    for (let i = 0; i < this.connections.getSize(); ++i) {
      this.canvas.add(this.connections.get(i))
      this.connections.get(i).reconnect()
    }
  }

  redo() {
    this.canvas.setCurrentSelection(null)

    if (this.connections === null) {
      if (this.figure instanceof  Node) {
        this.connections = this.figure.getConnections()
      }
      else {
        this.connections = new.util.ArrayList()
      }
    }


    for (let i = 0; i < this.connections.getSize(); ++i) {
      this.canvas.remove(this.connections.get(i))
    }

    // remove this figure from the parent
    //
    if (this.parent !== null) {
      // determine the index of the child before remove
      this.indexOfChild = this.parent.getChildren().indexOf(this.figure)
      this.removedParentEntry = this.parent.remove(this.figure)
    }
    // or from the canvas
    else {
      this.canvas.remove(this.figure)
    }
  }

}
