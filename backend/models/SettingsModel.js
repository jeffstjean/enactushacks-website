const mongoose = require("mongoose");
const { validateEmailAddress } = require("../services/validators");

const settingsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // place for a unique id
  status: { type: string, default: "closed", enum: ["closed", "open"] },
  times: {
    open: { type: date, required: "Event must have an open time" },
    closed: { type: date, required: "Event must have a closed time" },
    inital_decisions: {
      type: date,
      required: "Event must have an inital decisions time"
    },
    final_decisions: {
      type: date,
      required: "Event must have a final decisions time"
    },
    event_start: { type: date, required: "Event must have a start time" },
    event_end: { type: date, required: "Event must have an end time" }
  }
});

module.exports = mongoose.model("Settings", settingsSchema);
