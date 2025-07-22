const express = require("express");;
const cors = require("cors");
const cookieParser = require("cookie-parser")
const {connectDB,getDB} = require("./config/db.js")
const authRoutes = require('./routes/auth.js');
const jobRoutes = require('./routes/jobs.js');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

//middleware
app.use(cors({
  // origin: 'http://127.0.0.1:5500',
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(cookieParser());

//database
connectDB().then(()=>{
  app.locals.db = getDB();
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, (req,res) =>{
  console.log(`Server running on port: http://127.0.0.1:${PORT}`);
});