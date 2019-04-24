import { Type } from "../../TypeRegistry";
import { KeyboardPolicy } from "./KeyboardPolicy";
import { Canvas } from "../../Canvas";
import { CommandDelete } from "../../command/CommandDelete";
import { Connection } from "../../Connection";
import { CommandType } from "../../command/CommandType";


@Type('DefaultKeyboardPolicy')
export class DefaultKeyboardPolicy extends KeyboardPolicy {
  onKeyDown(canvas: Canvas, keyCode, shiftKey?: boolean, ctrlKey?: boolean) {
    if (keyCode === 46 && canvas.getPrimarySelection() !== null) {

      canvas.getCommandStack().startTransaction((figure) => new CommandDelete(figure))
      let selection = canvas.getSelection()
      selection.each((index, figure) => {
        if (figure instanceof Connection) {
          if (selection.contains(figure.getSource(), true)) {
            return
          }
          if (selection.contains(figure.getTarget(), true)) {
            return
          }
        }
        let cmd = figure.createCommand(new CommandType(CommandType.DELETE))
        if (cmd !== null) {
          canvas.getCommandStack().execute(cmd)
        }
      })
      // execute all single commands at once.
      canvas.getCommandStack().commitTransaction()
    } else {
      super.onKeyDown(canvas, keyCode, shiftKey, ctrlKey)
    }

  }
}