import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { isUUID } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { WorkspaceObjectInterface } from '../abstract/workspace-object.interface';
import { workspaceObjectSchema } from './workspace-object.schema';

@Schema({ collection: 'boocrum-objects', timestamps: true, skipVersioning: { objects: true } })
export class ObjectBucket {
  @Prop({
    type: String,
    unique: true,
    immutable: true,
    validate: {
      validator: (v: string) => isUUID(v),
      message: 'Workspace의 ID는 항상 UUID여야 합니다.',
    },
  })
  workspaceId: string;

  @Prop({
    type: [workspaceObjectSchema],
    default: [],
  })
  objects: WorkspaceObjectInterface[];
}

export type ObjectBucketDocument = HydratedDocument<ObjectBucket>;
export const ObjectBucketSchema = SchemaFactory.createForClass(ObjectBucket);
