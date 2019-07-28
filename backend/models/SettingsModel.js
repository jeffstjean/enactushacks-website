const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // place for a unique id
  status: { type: String, default: "closed", enum: ["closed", "open"] },
  times: {
    open: { type: Date, required: "Event must have an open time" },
    closed: { type: Date, required: "Event must have a closed time" },
    inital_decisions: {
      type: Date,
      required: "Event must have an inital decisions time"
    },
    final_decisions: {
      type: Date,
      required: "Event must have a final decisions time"
    },
    event_start: { type: Date, required: "Event must have a start time" },
    event_end: { type: Date, required: "Event must have an end time" }
  }
}, { versionKey: false } );

module.exports = mongoose.model("Settings", settingsSchema);
