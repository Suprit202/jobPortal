const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {ObjectId} = require("mongodb");


exports.register = async (req,res) => {
  const {name, email, password, role} = req.body;
  const db = req.app.locals.db;
  const users = db.collection('users');

  try {
    //check existing user
    const existingUser = await users.findOne({email});
    if(existingUser) return res.status(400).json({error: 'Email already in use'});
  
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Insert user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      createdAt: new Date()
    });

    const user = await users.findOne({ _id: result.insertedId });

    //JWT Token
    const token = jwt.sign({ id: user._id.toString(), role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.cookie('token', token, {
      httpOnly: true, //Prevents JavaScript on the client side from accessing the cookie via (document.cookie); Helps protect against XSS attacks.
      secure: false, // Use `true` in production (HTTPS only)
      sameSite: 'Lax', // Use 'None' if frontend/backend are on different domains
      path:'/', //'/' means the cookie is valid for entire domain.
      maxAge: 3600000 
    }).json({success:"true"});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;
  const db = req.app.locals.db;
  const users = db.collection('users');

  try {
    const user = await users.findOne({ email });
    
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });


    //JWT Token
    const token = jwt.sign({ id: user._id.toString(),role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Use `true` in production (HTTPS only)
      sameSite: 'Lax', // Use 'None' if frontend/backend are on different domains
      path:'/',
      maxAge: 3600000 
    }).json({user, token});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkAuth = async (req, res) =>{
  try {
    const db = req.app.locals.db;

    const user = await db.collection('users').findOne({_id:new ObjectId(req.user._id)});

    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({user
      // email: user.email,
      // name: user.name,
      // role: user.role
    });

  } catch (error) {
    res.status(500).json({ error: err.message });
  }
}