import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { isUUID } from 'class-validator';
import { HydratedDocument } from 'mongoose';

type ObjectTypes = 'postit' | 'section' | 'draw';
type OptionalParam = 'text' | 'fontSize' | 'point';
type ParamsValidator = {
  [key in ObjectTypes]: {
    [key in OptionalParam]: (v?) => boolean;
  };
};

const REQUIRED_OPTONAL_PARAMS: { [key in ObjectTypes]: string[] } = {
  postit: ['text', 'fontSize'],
  section: ['text', 'fontSize'],
  draw: ['text', 'fontSize'],
};
const VALIDATION_FUNCTIONS: ParamsValidator = {
  postit: {
    text: () => true,
    fontSize: () => true,
    point: () => {
      throw new Error('Postit은 point 속성을 갖지 않습니다.');
    },
  },
  section: {
    text: (val: string) => {
      if (val.length > 50) throw new Error('Section의 Text 길이는 50자 이하입니다.');
      return true;
    },
    fontSize: () => true,
    point: () => {
      throw new Error('Section은 point 속성을 갖지 않습니다.');
    },
  },
  draw: {
    text: () => {
      throw new Error('Draw는 point 속성을 갖지 않습니다.');
    },
    fontSize: () => {
      throw new Error('Draw는 point 속성을 갖지 않습니다.');
    },
    point: () => true,
  },
};

@Schema({ _id: false })
export class WorkspaceObject {
  @Prop({
    type: String,
    validate: {
      validator: (v: string) => isUUID(v),
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
  type: string;

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
    required: function () {
      return REQUIRED_OPTONAL_PARAMS[this.type as ObjectTypes].indexOf('text') !== -1;
    },
    validate: {
      validator: function (val: string) {
        return VALIDATION_FUNCTIONS[this.type as ObjectTypes].text(val);
      },
      message: function (props) {
        return props.reason.message;
      },
    },
  })
  text: string;

  @Prop({
    type: Number,
    required: function () {
      return REQUIRED_OPTONAL_PARAMS[this.type as ObjectTypes].indexOf('fontSize') !== -1;
    },
    validate: {
      validator: function (val: string) {
        return VALIDATION_FUNCTIONS[this.type as ObjectTypes].fontSize(val);
      },
      message: 'Text가 요구되지 않거나 Validation Rule 위반입니다.',
    },
  })
  fontSize: number;
}

export const workspaceObjectSchema = SchemaFactory.createForClass(WorkspaceObject);
export type WorkspaceObjectDocument = HydratedDocument<WorkspaceObject>;
