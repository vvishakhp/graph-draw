import { Type } from "../TypeRegistry";
import ArrayList from "../util/ArrayList";
import { Command } from "./Command";
import { CommandCollection } from "./CommandCollection";
import { CommandStackEventListener } from "./CommandStackEventListener";
import { CommandStackEvent } from "./CommandStackEvent";

@Type('CommandStack')
export class CommandStack {
  undostack: any[];
  redostack: any[];
  maxundo: number;
  transactionCommand: any;
  eventListeners: any;

  public static PRE_EXECUTE = 1;
  public static PRE_REDO = 2;
  public static PRE_UNDO = 4
  public static POST_EXECUTE = 8
  public static POST_REDO = 16
  public static POST_UNDO = 32
  public static POST_INIT = 64

  public static POST_MASK = CommandStack.POST_EXECUTE | CommandStack.POST_REDO | CommandStack.POST_UNDO;
  public static PRE_MASK = CommandStack.PRE_EXECUTE | CommandStack.PRE_REDO | CommandStack.PRE_UNDO;

  constructor() {
    this.undostack = []
    this.redostack = []
    this.maxundo = 50
    this.transactionCommand = null
    this.eventListeners = new ArrayList()
  }



  setUndoLimit(count) {
    this.maxundo = count

    return this
  }

  markSaveLocation() {
    this.undostack = []
    this.redostack = []

    this.notifyListeners(new Command(), CommandStack.POST_EXECUTE)

    return this
  }

  execute(command) {
    if (typeof command === "undefined")
      throw "Missing parameter [command] for method call CommandStack.execute"

    // nothing to do
    if (command === null)
      return //silently

    // return if the command can't execute or it doesn't change the model
    // => Empty command
    if (command.canExecute() === false)
      return

    // A command stack transaction is open.
    // The execution will be postpone until the transaction will commit
    //
    if (this.transactionCommand !== null) {
      this.transactionCommand.add(command)
      return
    }

    this.notifyListeners(command, CommandStack.PRE_EXECUTE, "PRE_EXECUTE")

    this.undostack.push(command)
    command.execute()

    // cleanup the redo stack if the user execute a new command.
    // I think this will create a "clean" behaviour of the unde/redo mechanism.
    //
    this.redostack = []

    // monitor only the max. undo stack size
    //
    if (this.undostack.length > this.maxundo) {
      this.undostack = this.undostack.slice(this.undostack.length - this.maxundo)
    }
    this.notifyListeners(command, CommandStack.POST_EXECUTE, "POST_EXECUTE")

    return this
  }

  startTransaction(commandLabel) {
    if (this.transactionCommand !== null) {
      debugger
      throw "CommandStack is already within transactional mode. Don't call 'startTransaction"
    }

    this.transactionCommand = new CommandCollection(commandLabel)

    return this
  }

  isInTransaction() {
    return this.transactionCommand !== null
  }

  commitTransaction() {
    if (this.transactionCommand === null) {
      return//silently
    }

    let cmd = this.transactionCommand
    this.transactionCommand = null
    // we can drop the CommandCollection if the collection contains only one command.
    if (cmd.commands.getSize() === 1) {
      this.execute(cmd.commands.first())
    }
    else {
      this.execute(cmd)
    }

    return this
  }

  undo() {
    let command = this.undostack.pop()
    if (command) {
      this.notifyListeners(command, CommandStack.PRE_UNDO)
      this.redostack.push(command)
      command.undo()
      this.notifyListeners(command, CommandStack.POST_UNDO)
    }

    return this
  }

  redo() {
    let command = this.redostack.pop()

    if (command) {
      this.notifyListeners(command, CommandStack.PRE_REDO)
      this.undostack.push(command)
      command.redo()
      this.notifyListeners(command, CommandStack.POST_REDO)
    }

    return this
  }

  getRedoLabel() {
    if (this.redostack.length === 0)
      return ""

    let command = this.redostack[this.redostack.length - 1]

    if (command) {
      return command.getLabel()
    }
    return ""
  }

  getUndoLabel() {
    if (this.undostack.length === 0)
      return ""

    let command = this.undostack[this.undostack.length - 1]

    if (command) {
      return command.getLabel()
    }
    return ""
  }

  canRedo() {
    return this.redostack.length > 0
  }

  canUndo() {
    return this.undostack.length > 0
  }

  addEventListener(listener) {
    return this.on("change", listener)
  }


  on(event, listener) {
    if (event !== "change")
      throw "only event of kind 'change' is supported"

    if (listener instanceof CommandStackEventListener) {
      this.eventListeners.add(listener)
    }
    else if (typeof listener.stackChanged === "function") {
      this.eventListeners.add(listener)
    }
    else if (typeof listener === "function") {
      this.eventListeners.add({ stackChanged: listener })
    }
    else {
      throw "Object doesn't implement required callback interface [ .command.CommandStackListener]"
    }

    return this
  }

  removeEventListener(listener) {
    this.off(listener)
  }

  off(listener) {
    console.log(listener)
    this.eventListeners.grep(entry => (entry === listener || entry.stackChanged === listener))
    /*
    let size = this.eventListeners.getSize()
    for (let i = 0; i < size; i++) {
      let entry = this.eventListeners.get(i)
      if (entry === listener || entry.stackChanged === listener) {
        this.eventListeners.remove(entry)
        return
      }
    }
    */
    return this
  }

  notifyListeners(command, state, action?) {
    let event = new CommandStackEvent(this, command, state, action)
    let size = this.eventListeners.getSize()

    for (let i = 0; i < size; i++) {
      this.eventListeners.get(i).stackChanged(event)
    }
  }

}
