import { Document, model, Schema } from "mongoose";

interface IUser extends Document {
  userId: string;
  name: string;
  phone: string;
  isBanned: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
