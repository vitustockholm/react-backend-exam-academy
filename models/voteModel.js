import mongoose from 'mongoose';
const { Schema } = mongoose;

const voteSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  car_id: {
    type: String,
    required: true,
  },
  voters: {
    type: String,
    required: true,
  },
  deep: {
    type: Number,
    required: true,
  },
});

const Vote = mongoose.model('vote', voteSchema);
export default Vote;
