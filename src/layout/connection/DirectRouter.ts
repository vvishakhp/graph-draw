import { ConnectionRouter } from "./ConnectionRouter";
import { Type } from "../../TypeRegistry";
import { LineSelectionFeedbackPolicy } from "../../policy/line/LineSelectionFeedbackPolicy";

@Type('DirectRouter')
export class DirectRouter extends ConnectionRouter {
  onInstall(connection) {
    connection.installEditPolicy(new LineSelectionFeedbackPolicy())
  }

  invalidate() {

  }

  route(connection, routingHints) {
    let start = connection.getStartPosition()
    let end = connection.getEndPosition()

    connection.addPoint(start)
    connection.addPoint(end)

    let path = ["M", start.x, " ", start.y]
    path.push("L", end.x, " ", end.y)

    connection.svgPathString = path.join("")
  }
}
