import { Type } from "../../TypeRegistry";
import { KeyboardPolicy } from "./KeyboardPolicy";
import { Canvas } from "../../Canvas";
import { CommandDelete } from "../../command/CommandDelete";


@Type('DefaultKeyboardPolicy')
export class DefaultKeyboardPolicy extends KeyboardPolicy {
  onKeyDown(canvas: Canvas, keyCode, shiftKey?: boolean, ctrlKey?: boolean) {
    if (keyCode === 46 && canvas.getPrimarySelection() !== null) {

      canvas.getCommandStack().startTransaction((figure) => new CommandDelete(figure))
      let selection = canvas.getSelection()
      selection.each((index, figure) => {
        // don't delete a connection if the source or target figure is part of the selection.
        // In this case the connection is deleted by the DeleteCommand itself and it is not allowed to
        // delete a figure twice.
        //
        if (figure instanceof.Connection) {
          if (selection.contains(figure.getSource(), true)) {
            return
          }
          if (selection.contains(figure.getTarget(), true)) {
            return
          }
        }
        let cmd = figure.createCommand(new.command.CommandType(.command.CommandType.DELETE))
        if (cmd !== null) {
          canvas.getCommandStack().execute(cmd)
        }
      })
      // execute all single commands at once.
      canvas.getCommandStack().commitTransaction()
    } else {
      this._super(canvas, keyCode, shiftKey, ctrlKey)
    }

  }
}


onKeyDown: function () 
})