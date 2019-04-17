export class CommandType {
  constructor(private policy: string) { }

  public static DELETE = "DELETE";
  public static MOVE = "MOVE"
  public static CONNECT = "CONNECT"
  public static MOVE_BASEPOINT = "MOVE_BASEPOINT"
  public static MOVE_VERTEX = "MOVE_VERTEX"
  public static MOVE_VERTICES = "MOVE_VERTICES"
  public static MOVE_GHOST_VERTEX = "MOVE_GHOST_VERTEX"
  public static RESIZE = "RESIZE"
  public static RESET = "RESET"
  public static ROTATE = "ROTATE"

  getPolicy() {
    return this.policy;
  }
}

