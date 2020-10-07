import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

export interface QuestionAttribute {
  readonly id: string;
  readonly user: string;
  readonly title: string;
  readonly content: string;
  like: number;
  readonly slideOrder: number;
  readonly slideImageURL: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const questionSchema: mongoose.Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: String,
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
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    required: true,
    default: new Date()
  }
}, {
  timestamps: true
});

export default questionSchema;
