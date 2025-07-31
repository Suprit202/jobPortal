const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, editJob, deleteJob } = require('../controllers/job.js');
const { authenticate, authorizeRoles } = require('../middleware/auth.js');

router.post('/createJob', authenticate, authorizeRoles('admin'), createJob);

// router.post('/authenticate', authenticate, (req, res) => {
//   res.json({ message: 'Authenticated', user: req.user});
// });

router.get('/getJobs',authenticate, authorizeRoles('admin','user'), getJobs);
router.get('/getJobById/:id', authenticate, authorizeRoles('admin','user'), getJobById);
router.put('/editJob/:id', authenticate, authorizeRoles('admin'), editJob);
router.delete('/deleteJob/:id', authenticate, authorizeRoles('admin'), deleteJob);

module.exports = router;