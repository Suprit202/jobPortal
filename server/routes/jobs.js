const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.js');
const { createJob, getJobs, getJobById } = require('../controllers/job.js');

router.post('/createJob',  authenticate, createJob);
router.get('/getJobs', getJobs);
router.get('/getJobById/:title', getJobById);

module.exports = router;