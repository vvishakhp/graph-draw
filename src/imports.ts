import { Type, createInstenceFromType } from './TypeRegistry';
import extend from './util/extend';
import $ = require('./util/jquery_extentions');
import Raphael from './util/SVGUtil';
import Base64Util from './util/Base64';
import { Color } from './util/Color';
import ArrayList from './util/ArrayList';
import UUID from './util/UUID';
import { Spline } from './util/spline/Spline';
import { CubicSpline } from './util/spline/CubicSpline';
import { BezierSpline } from './util/spline/BezierSpline';
import { PositionConstant } from './geo/PositionConstants';
import { Point } from './geo/Point';
import { Rectangle } from './geo/Rectangle';
import Util from './geo/Util';
import { Ray } from './geo/Ray';
import Line from './geo/Line';
import { Command } from './command/Command';
import { CommandType } from './command/CommandType';
import { CommandCollection } from './command/CommandCollection';
import { CommandStack } from './command/CommandStack';
import { CommandStackEvent } from './command/CommandStackEvent';
import { CommandStackEventListener } from './command/CommandStackEventListener';
import { CommandMove } from './command/CommandMove';
import { CommandAttr } from './command/CommandAttr';
import { CommandMoveLine } from './command/CommandMoveLine';
import { CommandMoveConnection } from './command/CommandMoveConnection';
import { CommandMoveVertex } from './command/CommandMoveVertex';
import { CommandMoveVertices } from './command/CommandMoveVertices';
import { CommandResize } from './command/CommandResize';
import { CommandRotate } from './command/CommandRotate';
import { CommandConnect } from './command/CommandConnect';
import { CommandReconnect } from './command/CommandReconnect';
import { CommandDelete } from './command/CommandDelete';
import { CommandDeleteGroup } from './command/CommandDeleteGroup';
import { CommandGroup } from './command/CommandGroup';
import { CommandUngroup } from './command/CommandUngroup';
import { CommandAddVertex } from './command/CommandAddVertex';
import { CommandAssignFigure } from './command/CommandAssignFigure';
import { CommandBoundingBox } from './command/CommandBoundingBox';
import { CommandRemoveVertex } from './command/CommandRemoveVertex';
import { CommandReplaceVertices } from './command/CommandReplaceVertices';
import { CommandAdd } from './command/CommandAdd';
import { ConnectionRouter } from './layout/connection/ConnectionRouter';
import { DirectRouter } from './layout/connection/DirectRouter';
import { VertexRouter } from './layout/connection/VertexRouter';
import { ManhattanConnectionRouter } from './layout/connection/ManhattanConnectionRouter';
import { SplineConnectionRouter } from './layout/connection/SplineConnectionRouter';
import { Locator } from './layout/locator/Locator';
import { PortLocator } from './layout/locator/PortLocator';
import { DraggableLocator } from './layout/locator/DraggableLocator';
import { SmartDraggableLocator } from './layout/locator/SmartDraggableLocator';
import { XYAbsPortLocator } from './layout/locator/XYAbsPortLocator';
import { XYRelPortLocator } from './layout/locator/XYRelPortLocator';
import { InputPortLocator } from './layout/locator/InputPortLocator';
import { OutputPortLocator } from './layout/locator/OutputPortLocator';
import { ConnectionLocator } from './layout/locator/ConnectionLocator';
import { ManhattanMidpointLocator } from './layout/locator/ManhattanMidpointLocator';
import { PolylineMidpointLocator } from './layout/locator/PolylineMidpointLocator';
import { ParallelMidpointLocator } from './layout/locator/ParallelMidpointLocator';
import { TopLocator } from './layout/locator/TopLocator';
import { BottomLocator } from './layout/locator/BottomLocator';
import { LeftLocator } from './layout/locator/LeftLocator';
import { RightLocator } from './layout/locator/RightLocator';
import { CenterLocator } from './layout/locator/CenterLocator';
import { EditPolicy } from './policy/EditPolicy';
import { CanvasPolicy } from './policy/canvas/CanvasPolicy';
import { ZoomPolicy } from './policy/canvas/ZoomPolicy';
import { WheelZoomPolicy } from './policy/canvas/WheelZoomPolicy';
import { KeyboardPolicy } from './policy/canvas/KeyboardPolicy';
import { DefaultKeyboardPolicy } from './policy/canvas/DefaultKeyboardPolicy';
import { FigureSelectionPolicy } from './policy/figure/SelectionPolicy';
import { SingleSelectionPolicy } from './policy/canvas/SingleSelectionPolicy';
import { BoundingboxSelectionPolicy } from './policy/canvas/BoundingboxSelectionPolicy';
import { SnapToEditPolicy, SnapToHelper } from './policy/canvas/SnapToEditPolicy';
import { DropInterceptorPolicy } from './policy/canvas/DropInterceptorPolicy';
import { ConnectionCreatePolicy } from './policy/connection/ConnectionCreatePolicy';
import { ComposedConnectionCreatePolicy } from './policy/connection/ComposedConnectionCreatePolicy';
import { ClickConnectionCreatePolicy } from './policy/connection/ClickConnectionCreatePolicy';
import { DragConnectionCreatePolicy } from './policy/connection/DragConnectionCreatePolicy';
import { FigureEditPolicy } from './policy/figure/FigureEditPolicy';
import { DragDropEditPolicy } from './policy/figure/DragDropEditPolicy';
import { RegionEditPolicy } from './policy/figure/RegionEditPolicy';
import { SelectionFeedbackPolicy } from './policy/figure/SelectionFeedbackPolicy';
import { RectangleSelectionFeedbackPolicy } from './policy/figure/RectangleSelectionFeedbackPolicy';
import { AntSelectionFeedbackPolicy } from './policy/figure/AntSelectionFeedbackPolicy';
import { VertexSelectionFeedbackPolicy } from './policy/line/VertexSelectionFeedbackPolicy';
import { CanvasSelectionPolicy } from './policy/canvas/SelectionPolicy';
import { LineSelectionFeedbackPolicy } from './policy/line/LineSelectionFeedbackPolicy';
import { ElasticStrapFeedbackPolicy } from './policy/port/ElasticStrapFeedbackPolicy';
import { PortFeedbackPolicy } from './policy/port/PortFeedbackPolicy';
import { IntrusivePortsFeedbackPolicy } from './policy/port/IntrusivePortsFeedbackPolicy';
import { Selection } from './Selection';
import { Canvas } from './Canvas';
import { Figure } from './Figure';
import { Node } from './shape/node/Node';
import { VectorFigure } from './VectorFigure';
import { RectangleShape } from './shape/basic/Rectangle';
import { SetFigure } from './SetFigure';
import { Hub } from './shape/node/Hub';
import { Oval } from './shape/basic/Oval';
import { Circle } from './shape/basic/Circle';
import { Label } from './shape/basic/Label';
import { LineShape } from './shape/basic/Line';
import { PolyLine } from './shape/basic/PolyLine';
import { Composite } from './shape/composite/Composite';
import { StrongComposite } from './shape/composite/StrongComposite';
import { Group } from './shape/composite/Group';
import { Connection } from './Connection';
import { ResizeHandle } from './ResizeHandle';
import { LineResizeHandle } from './shape/basic/LineResizeHandle';
import { GhostVertexResizeHandle } from './shape/basic/GhostVertexResizeHandle';
import { LineStartResizeHandle } from './shape/basic/LineStartResizeHandle';
import { LineEndResizeHandle } from './shape/basic/LineEndResizeHandle';
import { VertexResizeHandle } from './shape/basic/VertexResizeHandle';
import { Port } from './Port';
import { InputPort } from './InputPort';
import { OutputPort } from './OutputPort';
import { HybridPort } from './HybridPort';
import { ConnectionAnchor } from './layout/anchor/ConnectionAnchor';
import { ShortesPathConnectionAnchor } from './layout/anchor/ShortesPathConnectionAnchor';

export {
    Type,
    createInstenceFromType,
    $,
    extend,
    Raphael,
    Base64Util,
    Color,
    ArrayList,
    UUID,
    Spline,
    CubicSpline,
    BezierSpline,
    PositionConstant,
    Point,
    Rectangle,
    Util,
    Ray,
    Line,
    CommandType,
    Command,
    CommandCollection,
    CommandStack,
    CommandStackEvent,
    CommandStackEventListener,
    CommandMove,
    CommandAttr,
    CommandMoveLine,
    CommandMoveConnection,
    CommandMoveVertex,
    CommandMoveVertices,
    CommandResize,
    CommandRotate,
    CommandConnect,
    CommandReconnect,
    CommandDelete,
    CommandDeleteGroup,
    CommandAdd,
    CommandGroup,
    CommandUngroup,
    CommandAddVertex,
    CommandAssignFigure,
    CommandBoundingBox,
    CommandRemoveVertex,
    CommandReplaceVertices,
    ConnectionRouter,
    DirectRouter,
    VertexRouter,
    ManhattanConnectionRouter,
    SplineConnectionRouter,
    Locator,
    PortLocator,
    DraggableLocator,
    SmartDraggableLocator,
    XYAbsPortLocator,
    XYRelPortLocator,
    InputPortLocator,
    OutputPortLocator,
    ConnectionLocator,
    ManhattanMidpointLocator,
    PolylineMidpointLocator,
    ParallelMidpointLocator,
    TopLocator,
    BottomLocator,
    LeftLocator,
    RightLocator,
    CenterLocator,
    EditPolicy,
    CanvasPolicy,
    ZoomPolicy,
    WheelZoomPolicy,
    KeyboardPolicy,
    DefaultKeyboardPolicy,
    FigureSelectionPolicy,
    SingleSelectionPolicy,
    BoundingboxSelectionPolicy,
    SnapToEditPolicy,
    DropInterceptorPolicy,
    ConnectionCreatePolicy,
    ComposedConnectionCreatePolicy,
    ClickConnectionCreatePolicy,
    DragConnectionCreatePolicy,
    FigureEditPolicy,
    DragDropEditPolicy,
    RegionEditPolicy,
    CanvasSelectionPolicy,
    SelectionFeedbackPolicy,
    RectangleSelectionFeedbackPolicy,
    AntSelectionFeedbackPolicy,
    LineSelectionFeedbackPolicy,
    VertexSelectionFeedbackPolicy,
    PortFeedbackPolicy,
    ElasticStrapFeedbackPolicy,
    IntrusivePortsFeedbackPolicy,
    Canvas,
    Selection,
    Figure,
    Node,
    VectorFigure,
    RectangleShape,
    SetFigure,
    Hub,
    Oval,
    Circle,
    Label,
    LineShape,
    PolyLine,
    Composite,
    StrongComposite,
    Group,
    Connection,
    ResizeHandle,
    LineResizeHandle,
    LineStartResizeHandle,
    LineEndResizeHandle,
    VertexResizeHandle,
    GhostVertexResizeHandle,
    Port,
    InputPort,
    OutputPort,
    HybridPort,
    ConnectionAnchor,
    ShortesPathConnectionAnchor,
    SnapToHelper
}

/*

require('./shape/node/Start');
require('./shape/node/End');
require('./shape/node/Between');
require('./shape/note/PostIt');
require('./shape/layout/Layout');
require('./shape/layout/HorizontalLayout');
require('./shape/layout/VerticalLayout');
require('./shape/layout/TableLayout');
require('./shape/layout/FlexGridLayout');
require('./shape/layout/StackLayout');
require('./shape/pert/Activity');
require('./shape/pert/Start');
require('./shape/state/Start');
require('./shape/state/End');
require('./shape/state/State');
require('./shape/state/Connection');
require('./ui/LabelEditor');
require('./ui/LabelInplaceEditor');
require('./decoration/connection/Decorator');
require('./decoration/connection/ArrowDecorator');
require('./decoration/connection/DiamondDecorator');
require('./decoration/connection/CircleDecorator');
require('./decoration/connection/BarDecorator');
require('./io/Reader');
require('./io/Writer');
require('./io/svg/Writer');
require('./io/png/Writer');
require('./io/json/Writer');
require('./io/json/Reader');
*/