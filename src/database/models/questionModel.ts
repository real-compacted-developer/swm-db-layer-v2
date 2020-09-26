import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { userSchema } from './userModel';

export interface QuestionAttribute extends mongoose.Document {
    readonly id: number;
    readonly studyDataId: number;
    readonly userId: string;
    readonly title: string;
    readonly content: string;
    readonly like: number;
    readonly slideOrder: number;
    readonly slideImageURL: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const questionSchema: mongoose.Schema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: userSchema,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  like: {
    type: Number,
    required: true
  },
  slideOrder: {
    type: Number,
    required: true
  },
  slideImageURL: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

autoIncrement.initialize(mongoose.connection);

questionSchema.plugin(autoIncrement.plugin, {
  model: 'question',
  field: 'id',
  startAt: 1,
  increment: 1
});

const questionModel = mongoose.model<QuestionAttribute>('question', questionSchema);

export default questionModel;
