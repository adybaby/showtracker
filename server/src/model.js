import Mongoose from 'mongoose';

const showSchema = Mongoose.Schema({
  id: {
    type: String,
    index: true,
    unique: true,
  },
  name: {
    type: String,
    required: 'Name is required',
  },
  Created_date: {
    type: Date,
    default: Date.now,
  },
});

export default Mongoose.model('showtracker', showSchema);
