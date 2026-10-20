import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    }],
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
}, { timestamps: true });

articleSchema.virtual("commentaries", {
  ref: "Commentary",
  localField: "_id",
  foreignField: "article"
})

articleSchema.set("toJSON", { virtuals: true })
articleSchema.set("toObject", { virtuals: true })

export default mongoose.model('Article', articleSchema);
