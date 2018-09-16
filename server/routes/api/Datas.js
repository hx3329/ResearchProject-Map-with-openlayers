const Data = require('../../models/Data');

module.exports = (app) => {
  app.post('/api/data', function (req, res, next) {
    const { body } = req;
    const {
      Name
    } = body;

    if (!Name) {
      return res.send({
        success: false,
        message: 'Error: Name cannot be blank.'
      });
    }

    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save
    Data.find({
      Name: Name
    }, (err, previousData) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousData.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Name already exist.'
        });
      }
      // Save the new user
      const newData = new Data();
      newData.Name = Name;
      newData.save((err, data) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'Saved'
        });
      });
    });
  });
};
