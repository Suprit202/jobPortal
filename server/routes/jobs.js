const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, editJob, deleteJob } = require('../controllers/job.js');
const { authenticate } = require('../middleware/auth.js');

router.post('/createJob', authenticate, createJob);

// router.post('/authenticate', authenticate, (req, res) => {
//   res.json({ message: 'Authenticated', user: req.user});
// });

router.get('/getJobs', getJobs);
router.get('/getJobById/:id', getJobById);
router.put('/editJob/:id', editJob);
router.delete('/deleteJob/:id', deleteJob);

module.exports = router;