import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  publishedDate: Date;
}

const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  publishedDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

bookSchema.index({ title: 'text' });
bookSchema.index({ author: 1 });
bookSchema.index({ category: 1 });
bookSchema.index({ rating: 1 });

export const Book = mongoose.model<IBook>('Book', bookSchema); 