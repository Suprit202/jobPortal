const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb');

exports.authenticate = async(req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({error: 'Not Authenticated!'});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = req.app.locals.db;
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });

    if (!user) throw new Error('User not found');

    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden: insufficient rights' });
    }
    next();
  };
};