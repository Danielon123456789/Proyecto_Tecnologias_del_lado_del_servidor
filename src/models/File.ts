import { Schema, model, Document, Types } from 'mongoose';

interface IFile extends Document {
  owner: Types.ObjectId;
  filename: string;
  s3Key: string;
  url: string;
  visibility: 'private' | 'public';
  sharedWith: Types.ObjectId[];
}

const fileSchema = new Schema<IFile>({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  s3Key: { type: String, required: true },
  url: { type: String, required: true },
  visibility: { type: String, enum: ['private', 'public'], default: 'private' },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default model<IFile>('File', fileSchema);
