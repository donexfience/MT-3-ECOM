import { Schema, model, Document, Types } from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  category: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subCategorySchema = new Schema<ISubCategory>(
  {
    name: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

export default model<ISubCategory>("SubCategory", subCategorySchema);
