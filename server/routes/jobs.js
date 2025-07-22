const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById } = require('../controllers/job.js');
const { authenticate } = require('../middleware/auth.js');

router.post('/createJob', authenticate, createJob);

// router.post('/authenticate', authenticate, (req, res) => {
//   res.json({ message: 'Authenticated', user: req.user});
// });

router.get('/getJobs', getJobs);
router.get('/getJobById/:title', getJobById);

module.exports = router;