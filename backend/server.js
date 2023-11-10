import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import csvParser from 'csv-parser';
import multer from 'multer';

const app = express();

app.use(cors());
app.use(express.json());

// Establish the MongoDB connection
mongoose.connect('mongodb://localhost:27017/csvload', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connected to database");
  })
  .catch(err => {
    console.error("Error connecting to database:", err);
  });

const StudentSchema = mongoose.Schema({
  name: String,
  admissionDate: String,
  age: { type: mongoose.Schema.Types.Number },
  course: String,
  grade: String
});

const Student = mongoose.model('Student', StudentSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/');
  },
  filename: (req, file, cb) => {
     console.log(file.originalname);
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/saveCSV', upload.single('csvfile'), async (req, res) => {
  try {
    const csvReadStream = fs.createReadStream('upload/' + req.file.filename);

    csvReadStream.on('error', (error) => {
      console.error('Error reading CSV file:', error);
      res.status(500).json({ error: 'Error reading CSV file' });
    });

    csvReadStream.pipe(csvParser())
      .on('data', async (row) => {
          console.log({row : row});
        try {
          const data = new Student({
            name: row.name,
            admissionDate: row.admissionDate,
            age: row.age,
            course: row.course,
            grade: row.grade
          });

          const response = await data.save();
          console.log(response);
        } catch (err) {
          console.log('Error Saving Data:', err);
        }
      })
      .on('end', () => {
        console.log('CSV data has been successfully stored in database');
        res.status(200).json({ message: 'CSV data has been successfully stored in database' });
      });
  } catch (err) {
    console.log('Error processing CSV:', err);
    res.status(500).json({ error: 'Error processing CSV' });
  }
});


app.get('/getStudents', async(req,res)=>{
   try{    
      const response = await Student.find();
      res.status(200).json({response});
   }catch(err){
        console.log({error : 'error fetching the data'});
        res.status(400).json({message: 'Some error occured'});
   }

    
});


app.listen(5000, () => {
  console.log(`Your server is started on http://localhost:5000`);
});
