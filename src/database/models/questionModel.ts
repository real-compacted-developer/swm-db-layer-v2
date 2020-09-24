import mongoose from 'mongoose';

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
    unique: true
  },
  studyDataId: {
    type: Number,
    required: true
  },
  userId: {
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
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const questionModel = mongoose.model<QuestionAttribute>('question', questionSchema);

export default questionModel;
