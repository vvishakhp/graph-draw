import { Type } from '../TypeRegistry';

@Type('command.Command')
export class Command {
  label: string;

  constructor(label?: string) {
    this.label = label;
  }

  getLabel(): string {
    return this.label;
  }

  canExecute(): boolean {
    return true;
  }

  execute() {
  }

  cancel() {

  }

  undo() { }

  redo() { }
}