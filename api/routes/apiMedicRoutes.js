'use strict';
module.exports = function(app) {
  var apiMedicWrapper = require('../controllers/apiMedicController');

  app.route('/sublocations')
    .get(apiMedicWrapper.sublocations);

  app.route('/sublocation_symptoms')
    .get(apiMedicWrapper.sublocation_symptoms);

  app.route('/additional_symptoms')
    .get(apiMedicWrapper.additional_symptoms);

  app.route('/diagnosis')
    .get(apiMedicWrapper.diagnosis);
};
