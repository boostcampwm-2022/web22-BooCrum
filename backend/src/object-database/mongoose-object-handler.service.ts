import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { ObjectBucket, ObjectBucketDocument } from './schema/object-bucket.schema';

import { AbstractObjectHandlerService } from './abstract/object-handler.abstract';
import { WorkspaceObjectInterface } from './abstract/workspace-object.interface';
import { CreateObjectDTO } from './dto/create-object.dto';
import { UpdateObjectDTO } from './dto/update-object.dto';

const updateFormatter = (updateDto: UpdateObjectDTO) =>
  Object.fromEntries(Object.entries(updateDto).map(([key, val]) => [`objects.$.${key}`, val]));

@Injectable()
export class MongooseObjectHandlerService implements AbstractObjectHandlerService {
  constructor(
    @InjectModel(ObjectBucket.name)
    private objectBucketModel: Model<ObjectBucketDocument>,
  ) {}

  private async createOrFindDocument(workspaceId: string, options?: QueryOptions) {
    const workspace = await this.objectBucketModel.findOne({ workspaceId }, {}, options).exec();
    if (workspace) return workspace;
    const newBucket = new this.objectBucketModel({ workspaceId });
    return newBucket;
  }

  async createObject(workspaceId: string, createObjectDTO: CreateObjectDTO): Promise<boolean> {
    const bucket = await this.createOrFindDocument(workspaceId);
    bucket.objects.push(createObjectDTO);
    await bucket.save({ validateBeforeSave: true });
    return true;
  }

  async selectAllObjects(workspaceId: string): Promise<WorkspaceObjectInterface[]> {
    const { objects } = await this.createOrFindDocument(workspaceId, { lean: true });
    return objects;
  }

  async selectObjectById(workspaceId: string, objectId: string): Promise<WorkspaceObjectInterface> {
    const { objects } = await this.objectBucketModel.findOne(
      { workspaceId },
      {
        objects: {
          $elemMatch: { objectId },
        },
      },
      { lean: true },
    );
    return objects?.at(0) || null;
  }

  async updateObject(workspaceId: string, updateObjectDTO: UpdateObjectDTO): Promise<boolean> {
    // $set에 쓰기 위해 맞는 형식으로 전환.
    const newValue = updateFormatter(updateObjectDTO);

    const ret = await this.objectBucketModel.updateOne(
      {
        workspaceId: workspaceId,
        'objects.objectId': updateObjectDTO.objectId,
      },
      { $set: newValue },
      { runValidators: true, returnDocument: 'after', lean: true },
    );
    return ret.matchedCount > 0;
  }

  async deleteObject(workspaceId: string, objectId: string): Promise<boolean> {
    const ret = await this.objectBucketModel.findOneAndUpdate(
      { workspaceId },
      {
        $pull: {
          objects: { objectId },
        },
      },
      { runValidators: true, returnDocument: 'after' },
    );
    return ret !== null && ret !== undefined;
  }
}
