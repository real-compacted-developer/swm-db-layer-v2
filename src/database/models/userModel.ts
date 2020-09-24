import mongoose from 'mongoose';

export interface UserAttribute extends mongoose.Document {
  readonly id: string;
  readonly nickname: string;
  readonly email: string;
  readonly profileImage: string;
  readonly isPremium: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const userSchema: mongoose.Schema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: true
  },
  isPremium: {
    type: Boolean,
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

const userModel = mongoose.model<UserAttribute>('user', userSchema);

export default userModel;
