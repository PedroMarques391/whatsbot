import { Document, model, Schema } from "mongoose";

export interface IRevokeMessage extends Document {
  groupId: string;
  userId: string;
  userName: string;
  message: string;
  sendAt: number;
  revokedAt: Date;
}

const RevokedMessageSchema = new Schema<IRevokeMessage>(
  {
    groupId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true, default: "Desconhecido" },
    message: { type: String, required: true },
    sendAt: { type: Number, required: true },
    revokedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

RevokedMessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1296000 });

const RevokedMessageModel = model<IRevokeMessage>(
  "RevokedMessage",
  RevokedMessageSchema,
);

export default RevokedMessageModel;
