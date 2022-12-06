declare type ObjectType = 'postit' | 'section' | 'draw';

declare class AbstractWorkspaceObject {
  objectId: string;
  type: ObjectType;
  left: number;
  top: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  color: string;
  text: string;
  fontSize: number;
  path: string;
  creator: string;
}

declare class AbstractPartialWorkspaceObject {
  objectId: string;
  type: ObjectType;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  color?: string;
  text?: string;
  fontSize?: number;
  path?: string;
  creator?: string;
}
