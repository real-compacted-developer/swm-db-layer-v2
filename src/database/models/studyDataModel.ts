import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { QuestionAttribute, questionSchema } from './questionModel';

export interface StudyDataAttribute extends mongoose.Document {
    readonly id: number;
    readonly week: number;
    readonly date: Date;
    readonly slideInfo: string[];
    readonly studyTitle: string;
    readonly questions: QuestionAttribute[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export const studyDataSchema: mongoose.Schema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  week: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  slideInfo: {
    type: Array,
    required: true
  },
  studyTitle: {
    type: String,
    required: true
  },
  questions: {
    type: [questionSchema],
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

studyDataSchema.plugin(autoIncrement.plugin, {
  model: 'studyData',
  field: 'id',
  startAt: 1,
  increment: 1
});

const studyDataModel = mongoose.model<StudyDataAttribute>('studyData', studyDataSchema);

export default studyDataModel;
