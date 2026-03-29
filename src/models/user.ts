import { Document, model, Schema } from "mongoose";

type Stickers = {
  dynamic: number;
  static: number;
};

interface IUser extends Document {
  userId: string;
  name: string;
  phone: string;
  isBanned: boolean;
  createdAt: Date;
  xp: number;
  sticker: Stickers;
  type: "common" | "premium";
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    isBanned: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    xp: { type: Number, default: 0 },
    sticker: {
      dynamic: { type: Number, default: 0 },
      static: { type: Number, default: 0 },
    },
    type: { type: String, enum: ["common", "premium"], default: "common" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

UserSchema.virtual("sticker.total").get(function () {
  return (this.sticker.dynamic || 0) + (this.sticker.static || 0);
});

const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
