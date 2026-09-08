import bcrypt from 'bcryptjs';
import mongoose, { Document, Model, Types } from 'mongoose';
import type { Role } from '../types/index.js';

export interface IUser extends Document<Types.ObjectId> {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  employeeId?: string;
  department?: string;
  supervisorId: Types.ObjectId | null;
  isActive: boolean;
  tokenVersion: number;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxLength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxLength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters'],
    select: false // never returned in queries by default
  },
  role: {
    type: String,
    enum: ['employee', 'supervisor', 'admin'],
    default: 'employee'
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tokenVersion: {
    type: Number,
    default: 0 // bump to revoke all outstanding refresh tokens
  },
  passwordResetToken: {
    type: String,
    select: false // sha256 hash of the emailed token
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// email index already created by `unique: true` on the field
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ supervisorId: 1 });

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
