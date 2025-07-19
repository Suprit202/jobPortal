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
app.use(cors({credentials:true}));
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