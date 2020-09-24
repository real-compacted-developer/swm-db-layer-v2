import mongoose from 'mongoose';

export interface StudyGroupAttribute extends mongoose.Document {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly password: string;
  readonly salt: string;
  readonly people: string[];
  readonly owner: string;
  readonly maxPeople: number;
  readonly isPremium: boolean;
}

export const studyGroupSchema: mongoose.Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  people: {
    type: Array,
    required: true
  },
  maxPeople: {
    type: Number,
    required: true
  },
  isPremium: {
    type: Boolean,
    required: true
  }
});

const studyGroupModel = mongoose.model<StudyGroupAttribute>('studyGroup', studyGroupSchema);

export default studyGroupModel;
