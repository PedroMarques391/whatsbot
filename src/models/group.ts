import { Document, Schema, model } from "mongoose";
export interface IGroup extends Document {
  groupId: string;
  name: string;
  description?: string;
  members: string[];
  blockedCommands: string[];
  createdAt: Date;
  updatedAt: Date | null;
}
const GroupSchema = new Schema<IGroup>({
  groupId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  members: [{ type: String, default: [] }],
  blockedCommands: [{ type: String, default: [] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});
const GroupModel = model<IGroup>("Group", GroupSchema);
export default GroupModel;
