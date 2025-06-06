import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String, select: false },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
  },
});

export default model<IUser>("User", userSchema);
