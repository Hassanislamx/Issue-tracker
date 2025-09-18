'use strict';

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const issueSchema = new mongoose.Schema({
  project: String,
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: "" },
  status_text: { type: String, default: "" },
  created_on: { type: Date, default: new Date() },
  updated_on: { type: Date, default: new Date() },
  open: { type: Boolean, default: true }
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')

    // GET (View issues with/without filters)
    .get(async function (req, res) {
      let project = req.params.project;
      let query = req.query;
      query.project = project;
      try {
        let issues = await Issue.find(query).exec();
        res.json(issues);
      } catch (err) {
        res.json({ error: 'could not fetch issues' });
      }
    })

    // POST (Create an issue)
    .post(async function (req, res) {
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      try {
        let newIssue = new Issue({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to: assigned_to || "",
          status_text: status_text || ""
        });

        let savedIssue = await newIssue.save();
        res.json(savedIssue);
      } catch (err) {
        res.json({ error: 'could not create issue' });
      }
    })

    // PUT (Update issue)
    .put(async function (req, res) {
      let project = req.params.project;
      let { _id, ...updateFields } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      let fieldsToUpdate = {};
      Object.keys(updateFields).forEach(key => {
        if (updateFields[key] !== "") fieldsToUpdate[key] = updateFields[key];
      });

      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.json({ error: 'no update field(s) sent', '_id': _id });
      }

      fieldsToUpdate.updated_on = new Date();

      try {
        let updated = await Issue.findByIdAndUpdate(_id, fieldsToUpdate, { new: true });
        if (!updated) {
          return res.json({ error: 'could not update', '_id': _id });
        }
        res.json({ result: 'successfully updated', '_id': _id });
      } catch (err) {
        res.json({ error: 'could not update', '_id': _id });
      }
    })

    // DELETE (Delete issue)
    .delete(async function (req, res) {
      let project = req.params.project;
      let { _id } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      try {
        let deleted = await Issue.findByIdAndDelete(_id);
        if (!deleted) {
          return res.json({ error: 'could not delete', '_id': _id });
        }
        res.json({ result: 'successfully deleted', '_id': _id });
      } catch (err) {
        res.json({ error: 'could not delete', '_id': _id });
      }
    });

};
