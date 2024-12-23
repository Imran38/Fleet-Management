const mongoose = require("mongoose");

const BillingSchema = new mongoose.Schema({
  billingId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  tripId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["Paid", "Pending"], required: true },
  billingDate: { type: Date, required: true },
  dueDate: { type: Date },
  advanceAmount: { type: Number, default: 0 }, // New field
  breakUpList: [
    {
      chargeType: { type: String, required: true }, // New field
      amount: { type: Number, required: true }, // New field
    },
  ],
});

module.exports = mongoose.model("Billing", BillingSchema);
