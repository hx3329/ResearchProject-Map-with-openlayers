const RateLimit = require('express-rate-limit');
const stringCapitalizeName = require('string-capitalize-name');

const Data = require('../../models/Data');
// const Test = require('../../models/Test');


// Attempt to limit spam post requests for inserting data
const minutes = 5;
const postLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000, // milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs
  delayMs: 0, // Disable delaying - full speed until the max limit is reached
  handler: (req, res) => {
    res.status(429).json({ success: false, msg: `You made too many requests. Please try again after ${minutes} minutes.` });
  }
});

module.exports = (app) => {


// READ (ONE)
  app.get('/api/datas/:id', (req, res) => {
    Data.findById(req.params.id)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(404).json({ success: false, msg: `No such data.` });
      });
  });

// READ (ALL)
  app.get('/api/datas', (req, res) => {
    Data.find({})
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
      });
  });

// CREATE
  app.post('/api/datas', postLimiter, (req, res) => {
    // console.log(req);

    let newData = new Data({
      name: sanitizeName(req.body.name),
      email: sanitizeName(req.body.email),
      age: sanitizePrice(req.body.age),
      gender: sanitizeName(req.body.gender),
      AircraftModel: req.body.AircraftModel,
      EngineModel: req.body.EngineModel
    });

    newData.save()
      .then((result) => {
        res.json({
          success: true,
          msg: `Successfully added!`,
          result: {
            _id: result._id,
            name: result.name,
            email: result.email,
            age: result.age,
            gender: result.gender,
            AircraftModel: result.AircraftModel,
            EngineModel: result.EngineModel
          }
        });
      })
      .catch((err) => {
        if (err.errors) {
          if (err.errors.name) {
            res.status(400).json({ success: false, msg: err.errors.name.message });
            return;
          }
          if (err.errors.email) {
            res.status(400).json({ success: false, msg: err.errors.email.message });
            return;
          }
          if (err.errors.age) {
            res.status(400).json({ success: false, msg: err.errors.age.message });
            return;
          }
          if (err.errors.gender) {
            res.status(400).json({ success: false, msg: err.errors.gender.message });
            return;
          }
          // Show failed if all else fails for some reasons
          res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
        }
      });
  });

// UPDATE
  app.put('/api/datas/:id', (req, res) => {
    let updatedData = {
      name: sanitizeName(req.body.name),
      email: sanitizeName(req.body.email),
      age: sanitizePrice(req.body.age),
      gender: sanitizeName(req.body.gender),
      AircraftModel: req.body.AircraftModel,
      EngineModel: req.body.EngineModel
    };

    Data.findOneAndUpdate({ _id: req.params.id }, updatedData, { runValidators: true, context: 'query' })
      .then((oldResult) => {
        Data.findOne({ _id: req.params.id })
          .then((newResult) => {
            res.json({
              success: true,
              msg: `Successfully updated!`,
              result: {
                _id: newResult._id,
                name: newResult.name,
                email: newResult.email,
                age: newResult.age,
                gender: newResult.gender,
                AircraftModel: newResult.AircraftModel,
                EngineModel: newResult.EngineModel
              }
            });
          })
          .catch((err) => {
            res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
            return;
          });
      })
      .catch((err) => {
        if (err.errors) {
          if (err.errors.name) {
            res.status(400).json({ success: false, msg: err.errors.name.message });
            return;
          }
          if (err.errors.email) {
            res.status(400).json({ success: false, msg: err.errors.email.message });
            return;
          }
          if (err.errors.age) {
            res.status(400).json({ success: false, msg: err.errors.age.message });
            return;
          }
          if (err.errors.gender) {
            res.status(400).json({ success: false, msg: err.errors.gender.message });
            return;
          }
          if (err.errors.AircraftModel){
            res.status(400).json({success: false, msg: err.errors.AircraftModel.message});
          }

          if(err.errors.EngineModel){
            res.status(400).json({success:false,msg:err.errors.EngineModel.message});
          }
          // Show failed if all else fails for some reasons
          res.status(500).json({ success: false, msg: `Something went wrong. ${err}` });
        }
      });
  });

// DELETE
  app.delete('/api/datas/:id', (req, res) => {

    Data.findByIdAndRemove(req.params.id)
      .then((result) => {
        res.json({
          success: true,
          msg: `It has been deleted.`,
          result: {
            _id: result._id,
            name: result.name,
            email: result.email,
            age: result.age,
            gender: result.gender,
            AircraftModel:result.AircraftModel,
            EngineModel: result.EngineModel
          }
        });
      })
      .catch((err) => {
        res.status(404).json({ success: false, msg: 'Nothing to delete.' });
      });
  });
}

// Minor sanitizing to be invoked before reaching the database
sanitizeName = (name) => {
  return stringCapitalizeName(name);
}
// sanitizeEmail = (email) => {
//   return email.toLowerCase();
// }
sanitizePrice = (price) => {
  // Return empty if price is non-numeric
  if (isNaN(price) && price != '') return '';
  return (price === '') ? price : parseFloat(price);
}
// sanitizeGender = (gender) => {
//   // Return empty if it's neither of the two
//   return (gender === 'm' || gender === 'f') ? gender : '';
// }
