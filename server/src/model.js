import Mongoose from 'mongoose';

const showSchema = Mongoose.Schema({
  id: {
    type: String,
    required: 'Id is required',
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
