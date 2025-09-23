const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testId; // will store issue _id for update/delete tests

suite('Functional Tests', function() {

  // 1. Create an issue with every field
  test('Create an issue with every field: POST request', function(done) {
    chai.request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Bug in login',
        issue_text: 'Login button not working',
        created_by: 'Hassan',
        assigned_to: 'Dev A',
        status_text: 'In progress'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Bug in login');
        assert.equal(res.body.issue_text, 'Login button not working');
        assert.equal(res.body.created_by, 'Hassan');
        assert.equal(res.body.assigned_to, 'Dev A');
        assert.equal(res.body.status_text, 'In progress');
        assert.property(res.body, '_id');
        testId = res.body._id; // save for later
        done();
      });
  });

  // 2. Create an issue with only required fields
  test('Create an issue with only required fields: POST request', function(done) {
    chai.request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Only required',
        issue_text: 'Just basics',
        created_by: 'Tester'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Only required');
        assert.equal(res.body.issue_text, 'Just basics');
        assert.equal(res.body.created_by, 'Tester');
        assert.property(res.body, '_id');
        done();
      });
  });

  // 3. Create an issue with missing required fields
  test('Create an issue with missing required fields: POST request', function(done) {
    chai.request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: '',
        issue_text: '',
        created_by: ''
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
  });

  // 4. View issues on a project
  test('View issues on a project: GET request', function(done) {
    chai.request(server)
      .get('/api/issues/apitest')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });

  // 5. View issues on a project with one filter
  test('View issues with one filter: GET request', function(done) {
    chai.request(server)
      .get('/api/issues/apitest')
      .query({ created_by: 'Hassan' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach(issue => {
          assert.equal(issue.created_by, 'Hassan');
        });
        done();
      });
  });

  // 6. View issues on a project with multiple filters
  test('View issues with multiple filters: GET request', function(done) {
    chai.request(server)
      .get('/api/issues/apitest')
      .query({ created_by: 'Hassan', open: true })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.forEach(issue => {
          assert.equal(issue.created_by, 'Hassan');
          assert.isTrue(issue.open);
        });
        done();
      });
  });

  // 7. Update one field on an issue
  test('Update one field on an issue: PUT request', function(done) {
    chai.request(server)
      .put('/api/issues/apitest')
      .send({
        _id: testId,
        issue_text: 'Updated text'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, testId);
        done();
      });
  });

  // 8. Update multiple fields on an issue
  test('Update multiple fields on an issue: PUT request', function(done) {
    chai.request(server)
      .put('/api/issues/apitest')
      .send({
        _id: testId,
        issue_title: 'Updated Title',
        issue_text: 'Updated Again'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, testId);
        done();
      });
  });

  // 9. Update an issue with missing _id
  test('Update an issue with missing _id: PUT request', function(done) {
    chai.request(server)
      .put('/api/issues/apitest')
      .send({ issue_text: 'No id here' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });

  // 10. Update an issue with no fields to update
  test('Update an issue with no fields to update: PUT request', function(done) {
    chai.request(server)
      .put('/api/issues/apitest')
      .send({ _id: testId })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        done();
      });
  });

  // 11. Update an issue with an invalid _id
  test('Update an issue with invalid _id: PUT request', function(done) {
    chai.request(server)
      .put('/api/issues/apitest')
      .send({
        _id: 'invalidid12345',
        issue_text: 'This should fail'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        done();
      });
  });

  // 12. Delete an issue
  test('Delete an issue: DELETE request', function(done) {
    chai.request(server)
      .delete('/api/issues/apitest')
      .send({ _id: testId })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, testId);
        done();
      });
  });

  // 13. Delete an issue with an invalid _id
  test('Delete an issue with invalid _id: DELETE request', function(done) {
    chai.request(server)
      .delete('/api/issues/apitest')
      .send({ _id: 'invalidid12345' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        done();
      });
  });

  // 14. Delete an issue with missing _id
  test('Delete an issue with missing _id: DELETE request', function(done) {
    chai.request(server)
      .delete('/api/issues/apitest')
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });

});
