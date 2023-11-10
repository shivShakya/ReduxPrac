import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './file.css';

function FileUpload(){

       const [file , setFile] = useState(null);
    
        const nav = useNavigate();

const handleFileInput = (e) =>{
             const file = e.target.files[0];
             setFile(file);
      }


 async function handleUpload(){
         if(file){
                const formData = new FormData();
                formData.append('csvfile', file);

                try{
                     const data =  await axios.post('http://localhost:5000/saveCSV', formData);
                     console.log({ message : 'csv file uploaded successfully' , data : data});
                     
                }catch(err){
                       console.log({error : err});
                }
         }
           nav('/std');
      }

       return(
        <div className='file'>
            <div className='file-div'>
             <input type='file' placeholder='Upload Your file'  onChange={handleFileInput} className='input-file' />
             <button onClick={handleUpload} className='file-btn'>Upload</button>
             </div>

             <h1><b>Upload Your File</b></h1>

             <p>
                 <h1>Assignment </h1> 

                 <h3> Submitted By : <b> Shivam Shakya</b></h3>

                 <img src='https://img.freepik.com/free-vector/college-university-students-group-young-happy-people-standing-isolated-white-background_575670-66.jpg?w=2000' alt='img' className='img-main'/>
             </p>

        </div>
       )
}

export default FileUpload;