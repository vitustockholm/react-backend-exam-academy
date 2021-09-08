import mongoose from 'mongoose';
const { Schema } = mongoose;

const carSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Car = mongoose.model('car', carSchema);
export default Car;
