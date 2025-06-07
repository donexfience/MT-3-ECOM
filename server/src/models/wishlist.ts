import { Schema, model, Document, Types } from "mongoose";

// Removed `quantity`
export interface IWishlistItem {
  product: Types.ObjectId;
}

export interface IWishlist extends Document {
  user: Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistItemSchema = new Schema<IWishlistItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
});

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

wishlistSchema.index({ user: 1 });
wishlistSchema.index({ "items.product": 1 });

export default model<IWishlist>("Wishlist", wishlistSchema);
