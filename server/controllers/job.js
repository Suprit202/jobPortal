const { ObjectId } = require('mongodb');

//Create Job
exports.createJob = async (req, res) => {

  const { title, description, salary, skills, location } = req.body;
  const db = req.app.locals.db;
  const jobs = db.collection('jobs');

  try {
    // console.log('User in request:', req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const result = await jobs.insertOne({
      title,
      description,
      salary,
      skills,
      location,
      postedBy: new ObjectId(req.user._id),
      createdAt: new Date()
    });

    const insertedJob = await jobs.findOne({_id: result.insertedId});
    res.json(insertedJob);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//getJobs
exports.getJobs = async (req, res) => {
  const db = req.app.locals.db;
  try {
    const jobs = await db.collection('jobs').find().toArray();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//getJob By ID
exports.getJobById = async (req, res) => {
  const db = req.app.locals.db;
  try {
    const job = await db.collection('jobs').findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Remove sensitive data if needed
    res.json(job);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Edit Job
exports.editJob = async (req, res) => {

  const { title, description, salary, skills, location } = req.body;
  const db = req.app.locals.db;
  const id =  new ObjectId(req.params.id)
  const jobs = db.collection('jobs');

  try {
    // console.log('User in request:', req.user);

    const result = await jobs.updateOne({_id: id},{$set:{
      title,
      description,
      salary,
      skills,
      location,
      createdAt: new Date()
    }});

    const insertedJob = await jobs.findOne({_id: id});
    res.json(insertedJob);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Delete Job
exports.deleteJob = async (req, res) => {
  const db = req.app.locals.db;
  const id =  new ObjectId(req.params.id);
  const jobs = db.collection('jobs');

  try {
    // console.log('User in request:', req.user);

    const result = await jobs.deleteOne({_id: id});

    res.send({"success":"Deleted Successfully!"})

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};