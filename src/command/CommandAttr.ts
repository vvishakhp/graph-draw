import { Command, Figure } from "../imports";


export class CommandAttr extends Command {
  figure: Figure;
  newAttributes: object;
  oldAttributes: object;

  constructor(figure: Figure, newAttributes: any) {
    super('Change Attributes');

    this.figure = figure
    this.newAttributes = newAttributes
    this.oldAttributes = {}
    // Get the current attributes from the shape before we modify them.
    // Required for undo/redo
    Object.keys(newAttributes).forEach((key) => {
      this.oldAttributes[key] = figure.attr(key)
    });
  }

  canExecute(): boolean {
    return true;
  }

  execute() {
    this.redo()
  }

  cancel() {
    return null;
  }

  undo() {
    this.figure.attr(this.oldAttributes)
  }

  redo() {
    this.figure.attr(this.newAttributes)
  }
}