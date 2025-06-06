import { Schema, model, Document, Types } from "mongoose";

export interface IProductVariant {
  ram: string;
  price: number;
  quantity: number;
}

export interface IProduct extends Document {
  title: string;
  variants: IProductVariant[];
  subcategory: Types.ObjectId;
  description: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productVariantSchema = new Schema<IProductVariant>({
  ram: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    variants: [productVariantSchema],
    subcategory: { type: Schema.Types.ObjectId, ref: "SubCategory", required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default model<IProduct>("Product", productSchema);