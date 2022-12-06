import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { isURL } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { WorkspaceObjectInterface } from '../abstract/workspace-object.interface';
import { workspaceObjectSchema } from './workspace-object.schema';

@Schema({ collection: 'boocrum-template', timestamps: true, skipVersioning: { objects: true } })
export class TemplateBucket {
  @Prop({
    type: String,
    unique: true,
    immutable: true,
  })
  templateId: string;

  @Prop({
    type: String,
  })
  templateName: string;

  @Prop({
    type: String,
    validate: (v: string) => !v || isURL(v),
  })
  templateThumbnailUrl: string;

  @Prop({
    type: [workspaceObjectSchema],
    default: [],
  })
  objects: WorkspaceObjectInterface[];
}

export type TemplateBucketDocument = HydratedDocument<TemplateBucket>;
export const TemplateBucketSchema = SchemaFactory.createForClass(TemplateBucket);
