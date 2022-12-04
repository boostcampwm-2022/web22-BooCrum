import { CreateObjectDTO } from '../dto/create-object.dto';
import { UpdateObjectDTO } from '../dto/update-object.dto';
import { WorkspaceObject } from '../entity/workspace-object.entity';

export abstract class AbstractObjectHandlerService {
  abstract createObject(workspaceId: string, createObjectDTO: CreateObjectDTO): Promise<boolean>;
  abstract selectAllObjects(workspaceId: string): Promise<WorkspaceObject[]>;
  abstract selectObjectById(workspaceId: string, objectId: string): Promise<WorkspaceObject>;
  abstract updateObject(workspaceId: string, updateObjectDTO: UpdateObjectDTO): Promise<boolean>;
  abstract deleteObject(workspaceId: string, objectId: string): Promise<boolean>;
}
