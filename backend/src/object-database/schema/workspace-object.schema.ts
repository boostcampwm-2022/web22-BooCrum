import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { isUUID } from 'class-validator';
import { HydratedDocument } from 'mongoose';

type OptionalParam = 'text' | 'fontSize' | 'point';

@Schema({ _id: false })
export class WorkspaceObject {
  @Prop({
    type: String,
    validate: {
      validator: (v: string) => isUUID(v),
      message: 'Object의 ID는 UUID여야 합니다.',
    },
    required: true,
    immutable: true,
  })
  objectId: string;

  @Prop({
    type: String,
    enum: {
      values: ['postit', 'section', 'draw'],
      message: '{VALUE}는 존재하지 않는 타입입니다.',
    },
    required: true,
    immutable: true,
  })
  type: ObjectType;

  @Prop({
    type: Number,
    required: true,
  })
  left: number;

  @Prop({
    type: Number,
    required: true,
  })
  top: number;

  @Prop({
    type: Number,
    required: true,
  })
  width: number;

  @Prop({
    type: Number,
    required: true,
  })
  height: number;

  @Prop({
    type: Number,
    required: true,
  })
  scaleX: number;

  @Prop({
    type: Number,
    required: true,
  })
  scaleY: number;

  @Prop({
    type: String,
    required: true,
  })
  color: string;

  @Prop({
    type: String,
    required: true,
  })
  creator: string;

  @Prop({
    type: String,
  })
  text: string;

  @Prop({
    type: Number,
  })
  fontSize: number;

  @Prop({
    type: [[Number, Number]],
  })
  path: number[][];
}

export const workspaceObjectSchema = SchemaFactory.createForClass(WorkspaceObject);
export type WorkspaceObjectDocument = HydratedDocument<WorkspaceObject>;
