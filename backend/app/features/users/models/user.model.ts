import { Schema, model } from 'mongoose';
import { User } from '../types/user.type';

const UserSchema = new Schema<User>(
 {
   name: {
     type: String,
     required: false,
     unique: true,
     sparse: true
   },
   email:  { 
     type: String, 
     required: true, 
     unique: true 
   },
   phone: {
     type: String,
     required: false,
     unique: false,
   },
   password:{ 
     type: String, 
     required: true,
     select: false
   },
   role: { 
     type: String, 
     enum: ['USER','ORGANIZER','ADMIN'], 
     default: 'USER' 
   },
   status: {
     type: String,
     enum: ['Active', 'Inactive'],
     default: null
   }
 },
 { timestamps: true }
);

// add new
UserSchema.index({ email: 1, status: 1 });
UserSchema.index({ role: 1, status: 1 });

export const UserModel = model<User>('User', UserSchema);