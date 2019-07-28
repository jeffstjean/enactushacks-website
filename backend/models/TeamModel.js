const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // place for a unique id
  name: { type: String, default: null },
  //members: [(type: mongoose.Schema.Types.ObjectId)],
  hack_name: { type: String, default: null },
  hack_link: { type: String, default: null }
}, { versionKey: false } );

module.exports = mongoose.model("Team", teamSchema);
