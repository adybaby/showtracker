import Mongoose from 'mongoose';

const show = Mongoose.Schema({
  dbId: {
    type: String,
    index: true,
    unique: true,
  },
  id: {
    type: String,
  },
  userId: {
    type: String,
  },
  name: {
    type: String,
    required: 'Show name is required',
  },
  Created_date: {
    type: Date,
    default: Date.now,
  },
});

export default Mongoose.model('show', show);
