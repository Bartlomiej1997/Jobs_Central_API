const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobOfferSchema = new Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  firm: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  dimensions: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: [
    {
      type: String,
      required: true
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = JobOffer = mongoose.model("jobOffer", JobOfferSchema);
