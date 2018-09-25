const Airline = require('../../models/Airline');

module.exports = (app) => {
  /*
   * add airline
   */
  app.post('/api/airline', (req, res, next) => {
    const { body } = req;
    const {
      AirSpaceClass,
      From_City,
      To_City,
      Price,
      AircraftModel,
      EngineModel
    }= body;

    if (!AirSpaceClass) {
      return res.send({
        success: false,
        message: 'Error: AirSpace cannot be blank.'
      });
    }


    if (!From_City) {
      return res.send({
        success: false,
        message: 'Error: From_City cannot be blank.'
      });
    }

    if (!To_City) {
      return res.send({
        success: false,
        message: 'Error: To_City cannot be blank.'
      });
    }

    if (!Price) {
      return res.send({
        success: false,
        message: 'Error: Price cannot be blank.'
      });
    }

    if (!AircraftModel) {
      return res.send({
        success: false,
        message: 'Error: AircraftModel cannot be blank.'
      });
    }

    if (!EngineModel) {
      return res.send({
        success: false,
        message: 'Error: EngineModel cannot be blank.'
      });
    }

    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save
    Airline.find({
      AirSpaceClass:AirSpaceClass,
      From_City: From_City,
      To_City: To_City,
      Price:Price,
      AircraftModel:AircraftModel,
      EngineModel:EngineModel
    }, (err, previousAirlines) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousAirlines.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Airline already exist.'
        });
      }
      // Save the new user
      const newAirline = new Airline();
      newAirline.AirSpaceClass = AirSpaceClass;
      newAirline.From_City = From_City;
      newAirline.To_City = To_City;
      newAirline.Price = Price;
      newAirline.AircraftModel = AircraftModel;
      newAirline.EngineModel = EngineModel;
      newAirline.save((err, airline) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'add airline success'
        });
      });
    });
  }); // end of add airline endpoint

  /*
  *  get Airiline
  * */

  app.get('/api/airline', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;

    Airline.find()
      .exec()
      .then((airline) => res.json(airline))
      .catch((err) => next(err));
  });
};
