const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema({
  status: { type: String, default: "closed", enum: ["closed", "open"] },
  times: {
    open: { type: Date, required: "Applications must have an open time" },
    closed: { type: Date, required: "Applications must have a closed time" },
    initial_decisions: { type: Date, required: "Event must have an inital decisions time" },
    final_decisions: { type: Date, required: "Event must have a final decisions time" },
    event_start: { type: Date, required: "Event must have a start time" },
    event_end: { type: Date, required: "Event must have an end time" }
  }
}, { versionKey: false } );

module.exports = mongoose.model("Settings", settingsSchema);
