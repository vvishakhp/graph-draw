import { Command } from "./Command";
import ArrayList from "../util/ArrayList";

export class CommandCollection extends Command {
  commands: ArrayList<Command>;
  constructor(commandLabel: string = "Execute Commands") {
    super(commandLabel);

    this.commands = new ArrayList<Command>()
  }


  getLabel(): string {
    if (this.commands.getSize() === 1) {
      return this.commands.first().getLabel()
    }

    if (this.commands.getSize() > 1) {
      let labels: ArrayList<string> = (this.commands.clone().map(function (e) {
        return e.getLabel();
      }) as unknown as ArrayList<string>);

      labels.unique()
      if (labels.getSize() === 1) {
        return labels.first();
      }
    }

    return this.label;
  }

  add(command: Command) {
    this.commands.add(command)
  }

  canExecute(): boolean {
    let canExec = false
    this.commands.each(function (i, cmd) {
      canExec = canExec || cmd.canExecute()
    })
    return canExec
  }

  execute() {
    this.commands.each(function (i, cmd) {
      cmd.execute()
    })
  }

  redo() {
    this.commands.each(function (i, cmd) {
      cmd.redo()
    })
  }


  undo() {

    this.commands.reverse()
    this.commands.each(function (i, cmd) {
      cmd.undo()
    })

    this.commands.reverse()
  }

  cancel() {
    return null;
  }
}
