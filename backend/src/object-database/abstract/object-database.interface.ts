import { WorkspaceObjectInterface } from './workspace-object.interface';

export interface ObjectDatabaseInterface {
  workspaceId: string;
  objects: WorkspaceObjectInterface[];
}
