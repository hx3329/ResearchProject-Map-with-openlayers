const mongoose = require('mongoose');

const AirlineSchema = new mongoose.Schema({
  AirSpaceClass: {
    type: String,
    default:''
  },
  From_City: {
    type: String,
    default:''
  },
  To_City: {
    type: String,
    default:''
  },
  Price: {
    type: Number,
    default: 0.00
  },
  AircraftModel: {
    type: String,
    default:''
  },
  EngineModel: {
    type: String,
    default:''
  }
});

module.exports = mongoose.model('Airline', AirlineSchema);
