import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import router from './routes/auth_routes'

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());
//allow friont to propose back for data
// app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello from Monetra Backend!');
});

//for now nothing is being authenticated 
app.use('/auth',router)


//mongo
mongoose.connect("mongodb://localhost:27017/oasis")
  .then(() => {
    console.log("----------connected to database---------")
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    })

  })
  .catch(() => {
    console.log("Connection failed")
  })
