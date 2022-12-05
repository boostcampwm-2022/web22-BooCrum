import { CreateObjectDTO } from '../dto/create-object.dto';
import { UpdateObjectDTO } from '../dto/update-object.dto';
import { WorkspaceObjectInterface } from './workspace-object.interface';

export abstract class AbstractObjectHandlerService {
  abstract createObject(workspaceId: string, createObjectDTO: CreateObjectDTO): Promise<boolean>;
  abstract selectAllObjects(workspaceId: string): Promise<WorkspaceObjectInterface[]>;
  abstract selectObjectById(workspaceId: string, objectId: string): Promise<WorkspaceObjectInterface>;
  abstract updateObject(workspaceId: string, updateObjectDTO: UpdateObjectDTO): Promise<boolean>;
  abstract deleteObject(workspaceId: string, objectId: string): Promise<boolean>;
}
