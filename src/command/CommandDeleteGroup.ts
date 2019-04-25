import { Command, Type, CommandCollection, CommandUngroup, CommandType } from '../imports';


@Type('CommandDeleteGroup')
export class CommandDeleteGroup extends Command {
  parent: any;
  group: any;
  canvas: any;
  batchDelete: any;

  constructor(group) {
    super("Delete shape")

    this.parent = group.getParent()
    this.group = group
    this.canvas = group.getCanvas()
    this.batchDelete = null
  }

  canExecute() {
    let children = this.group.getAssignedFigures()
    for (let i = 0; i < children.getSize(); i++) {
      if (children.get(i).isDeleteable() === false) {
        return false
      }
    }

    return this.group.getCanvas() !== null
  }

  execute() {
    this.redo();
  }


  undo() {
    this.batchDelete.undo()
    this.canvas.setCurrentSelection(this.group)
  }


  redo() {
    if (this.batchDelete === null) {
      this.batchDelete = new CommandCollection()

      this.batchDelete.add(new CommandUngroup(this.canvas, this.group))

      let children = this.group.getAssignedFigures()
      for (let i = 0; i < children.getSize(); i++) {
        let child = children.get(i)

        let cmd = child.createCommand(new CommandType(CommandType.DELETE))
        this.batchDelete.add(cmd)
      }
    }

    this.batchDelete.execute()
  }
}
