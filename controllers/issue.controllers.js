const mongoose = require('mongoose');
const issue = require('../schemas/issue.js');

const createIssue = async (req, res) => {
  const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
  let project = req.params.project;

  if (!issue_title || !issue_text || !created_by) {
    return res.json({ error: 'required field(s) missing' });
  }

  const newIssue = new issue({
    project_name: project,
    issue_title: issue_title,
    issue_text: issue_text,
    created_by: created_by,
    assigned_to: assigned_to || '',
    status_text: status_text || '',
    open: true,
    created_on: new Date().toISOString(),
    updated_on: new Date().toISOString(),
  });

  await newIssue.save();

  return res.json(newIssue);
};

const getIssues = async (req, res) => {
  let project = req.params.project;

  let issues;
  if (req.query) {
    issues = await issue.find({ project_name: project, ...req.query });
  } else {
    issues = await issue.find({ project_name: project });
  }

  return res.json(issues);
};

const updateIssue = async (req, res) => {
  if (!req.body._id || req.body._id.trim() == '') {
    return res.json({ error: 'missing _id' });
  }

  // Removing empty values.
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] === '') {
      delete req.body[key];
    }
  });

  const updated = await issue.findByIdAndUpdate(req.body._id, { ...req.body, updated_on: new Date().toISOString() });
  if (Object.keys(req.body).length === 1) {
    return res.json({ error: 'no update field(s) sent', _id: req.body._id });
  }

  if (!updated) {
    return res.json({ error: 'could not update', _id: req.body._id });
  }

  res.json({ result: 'successfully updated', _id: req.body._id });
};

const deleteIssue = async (req, res) => {
  if (!req.body._id) {
    return res.json({ error: 'missing _id' });
  }

  const deleted = await issue.findByIdAndDelete(req.body._id);

  if (!deleted) {
    return res.json({ error: 'could not delete', _id: req.body._id });
  }

  res.json({ result: 'successfully deleted', _id: req.body._id });
};

module.exports = { createIssue, getIssues, updateIssue, deleteIssue };
