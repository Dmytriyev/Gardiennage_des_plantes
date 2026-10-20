import mongoose from 'mongoose';

const commentarySchema = new mongoose.Schema({
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article"
    }
}, { timestamps: true });

export default mongoose.model('Commentary', commentarySchema);
