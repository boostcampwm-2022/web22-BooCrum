export interface WorkspaceObjectInterface {
  objectId: string;
  type: ObjectType;
  left: number;
  top: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  color: string;
  text?: string;
  fontSize?: number;
  path?: number[][];
  creator: string;
}
