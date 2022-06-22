const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const requester = chai.request(server).keepOpen();

let firstId, secondId;

suite('Functional Tests', function () {
  test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
    requester
      .post('/api/issues/apitest/')
      .send({
        issue_title: 'Testing POST',
        issue_text: 'This is an example to test the post method',
        created_by: 'MatiasTK',
        assigned_to: 'MatiasTK',
        status_text: 'WIP',
      })
      .end((err, res) => {
        const { issue_title, issue_text, created_by, assigned_to, status_text, open, created_on, updated_on, _id } =
          res.body;

        assert.equal(res.status, 200);
        assert.equal('Testing POST', issue_title);
        assert.equal('This is an example to test the post method', issue_text);
        assert.equal('MatiasTK', created_by);
        assert.equal('MatiasTK', assigned_to);
        assert.equal('WIP', status_text);
        assert.isOk(created_on);
        assert.isOk(updated_on);
        assert.isOk(_id);
        assert.notEqual(created_on, '');
        assert.notEqual(updated_on, '');
        assert.notEqual(_id, '');
        assert.equal(true, open);
        firstId = _id;
        done();
      });
  });
  test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
    requester
      .post('/api/issues/apitest/')
      .send({
        issue_title: 'Testing POST 2',
        issue_text: 'This is an example to test the post method 2',
        created_by: 'MatiasTK 2',
      })
      .end((err, res) => {
        const { issue_title, issue_text, created_by, assigned_to, status_text, open, created_on, updated_on, _id } =
          res.body;

        assert.equal(res.status, 200);
        assert.equal('Testing POST 2', issue_title);
        assert.equal('This is an example to test the post method 2', issue_text);
        assert.equal('MatiasTK 2', created_by);
        assert.equal('', assigned_to);
        assert.equal('', status_text);
        assert.isOk(created_on);
        assert.isOk(updated_on);
        assert.isOk(_id);
        assert.notEqual(created_on, '');
        assert.notEqual(updated_on, '');
        assert.notEqual(_id, '');
        assert.equal(true, open);
        secondId = _id;
        done();
      });
  });
  test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
    requester
      .post('/api/issues/apitest/')
      .send({
        assigned_to: 'MatiasTK',
        status_text: 'WIP',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
  });
  test('View issues on a project: GET request to /api/issues/{project}', (done) => {
    requester.get('/api/issues/apitest/').end((err, res) => {
      assert.equal(res.status, 200);
      assert.isArray(res.body);
      assert.isAtLeast(res.body.length, 1);
      done();
    });
  });
  test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
    requester
      .get('/api/issues/apitest/')
      .query({ open: true, assigned_to: 'MatiasTK' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.map((issue) => {
          assert.equal(issue.open, true);
          assert.equal(issue.assigned_to, 'MatiasTK');
        });
        done();
      });
  });
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
    requester
      .get('/api/issues/apitest/')
      .query({ open: true, created_by: 'MatiasTK 2', issue_title: 'Testing POST 2' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        res.body.map((issue) => {
          assert.equal(issue.open, true);
          assert.equal(issue.created_by, 'MatiasTK 2');
          assert.equal(issue.issue_title, 'Testing POST 2');
        });
        done();
      });
  });
  test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
    requester
      .put('/api/issues/apitest/')
      .send({
        _id: firstId,
        issue_title: 'Title changed',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, firstId);
        done();
      });
  });
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
    requester
      .put('/api/issues/apitest/')
      .send({
        _id: secondId,
        issue_title: 'Testing PUT',
        issue_text: 'This is an example to test the put method',
        created_by: 'MatiasTKP',
        assigned_to: 'MatiasTKP',
        status_text: 'Finished',
        open: false,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, secondId);
        done();
      });
  });
  test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
    requester
      .put('/api/issues/apitest/')
      .send({
        issue_title: 'Testing PUT',
        issue_text: 'This is an example to test the put method',
        created_by: 'MatiasTKP',
        assigned_to: 'MatiasTKP',
        status_text: 'Finished',
        open: false,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
    requester
      .put('/api/issues/apitest/')
      .send({
        _id: firstId,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        assert.equal(res.body._id, firstId);
        done();
      });
  });
  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
    requester
      .put('/api/issues/apitest/')
      .send({
        _id: '000000000000000000000000',
        issue_text: 'This is an example to test the put method',
        created_by: 'MatiasTKP',
        assigned_to: 'MatiasTKP',
        status_text: 'Finished',
        open: false,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id, '000000000000000000000000');
        done();
      });
  });
  test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
    requester
      .del('/api/issues/apitest/')
      .send({
        _id: firstId,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, firstId);
        done();
      });
  });
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
    requester
      .del('/api/issues/apitest/')
      .send({
        _id: '000000000000000000000000',
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id, '000000000000000000000000');
        done();
      });
  });
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
    requester
      .del('/api/issues/apitest/')
      .send()
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
  test('Deleting created tests...', (done) => {
    requester
      .del('/api/issues/apitest/')
      .send({
        _id: secondId,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, secondId);
        done();
      });
  });
}).afterAll(() => requester.close());
