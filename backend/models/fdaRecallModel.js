// models/fdaRecallModel.js
const mongoose = require('mongoose')

const fdaRecallSchema = new mongoose.Schema({
  country: String,
  city: String,
  address_1: String,
  address_2: String,
  state: String,
  postal_code: String,

  reason_for_recall: String,
  product_quantity: String,
  code_info: String,
  more_code_info: String,

  center_classification_date: String,
  distribution_pattern: String,
  product_description: String,
  report_date: String,
  classification: String,
  product_type: String,

  recall_number: { type: String, unique: true }, // Ensure uniqueness
  recalling_firm: String,
  initial_firm_notification: String,
  event_id: String,
  recall_initiation_date: String,
  termination_date: String,

  voluntary_mandated: String,
  status: String,

  openfda: mongoose.Schema.Types.Mixed // Allow nested openfda field if needed
}, {
  timestamps: true
});

fdaRecallSchema.index({ report_date: -1 });


module.exports = mongoose.model('FdaRecall', fdaRecallSchema)
