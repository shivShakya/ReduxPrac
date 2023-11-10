import { MongoClient } from 'mongodb';
import fs from 'fs';
import csvParser from "csv-parser";




async function sendToDataBase(csvfilePath , url , DBname , collect){
        
     const client = new MongoClient(url, {useNewUrlParser : true, useUnifiedTopology : true });
     if(client){
           console.log("connected succesfully");
     }
     try{
           await client.connect();

           const db = client.db(DBname);
           console.log({db : collect});
           const collect = db.collection(collect);
          
           const csvStream = fs.createReadStream(csvfilePath).pipe(csvParser());

           csvStream.on('student', async (row)=> {
                 await collect.insertOne(row);
           });

           await new Promise((resolve)=> csvStream.on('end', resolve));

           console.log("CSV file uploaded successfully");
     }catch(err){
           console.error({error : "Some error occured"});
     }
} 

const url = "mongodb://localhost:27017";
const DBname = "Assignment";
const collect = "student";
const csvfilePath = "/Users/jyoti-alok/Desktop/Assignment/backend/upload/student.csv";

sendToDataBase(csvfilePath,url,DBname,collect);