import { Command, Type, CommandStack } from '../imports';

@Type('CommandStackEvent')
export class CommandStackEvent {
  stack: CommandStack;
  command: Command;
  details: number;
  action: any;

  constructor(stack, command: Command, details: number, action) {
    this.stack = stack
    this.command = command
    this.details = details // deprecated
    this.action = action
  }

  getStack() {
    return this.stack;
  }

  getCommand() {
    return this.command;
  }

  getDetails() {
    return this.details;
  }

  isPostChangeEvent() {
    return 0 !== (this.getDetails() & CommandStack.POST_MASK)
  }

  isPreChangeEvent() {
    return 0 !== (this.getDetails() & CommandStack.PRE_MASK)
  }
}
