import { Type } from '../TypeRegistry';

@Type('command.Command')
export abstract class Command {
  label: string;

  constructor(label: string) {
    this.label = label;
  }

  getLabel(): string {
    return this.label;
  }

  abstract canExecute(): boolean;

  abstract execute();

  abstract cancel();

  abstract undo();

  abstract redo();
}