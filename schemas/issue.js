const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  assigned_to: { type: String, required: false, trim: true },
  status_text: { type: String, required: false },
  open: { type: Boolean, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  created_on: { type: String, required: true },
  updated_on: { type: String, required: true },
});

module.exports = mongoose.model('Project', issueSchema);
