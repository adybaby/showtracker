import Mongoose from 'mongoose';

const bannerUrl = Mongoose.Schema({
  id: {
    type: String,
  },
  bannerUrl: {
    type: String,
  },
  Created_date: {
    type: Date,
    default: Date.now,
  },
});

export default Mongoose.model('bannerUrl', bannerUrl);
