var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var trackSchema = new Schema({  
  name: { type: String },
  country: { type: String },
  sectors: [{
    length: { type: Number },
    speed: {
      type: String,
      enum: ['Very Slow', 'Slow', 'Normal', 'Fast', 'Very Fast']
    }
  }] 
});

module.exports = mongoose.model('Track', trackSchema);