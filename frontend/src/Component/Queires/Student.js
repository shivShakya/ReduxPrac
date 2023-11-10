import React, {useState, useEffect} from 'react';
import './std.css';


function Student(){

    const [loading ,setLoading] = useState(true);
    const [students, setStudents] = useState('');

    const [searchName ,setSearchName] = useState('');

    const [minAge ,setMinAge] = useState('');
    const [maxAge ,setMaxAge] = useState('');

    
     const handleAge = () => {
           const filtered = students.filter( student => 
                (minAge === '' || student.age >= parseInt(minAge ,10)) &&
                (maxAge === '' || student.age <= parseInt(maxAge,10))
            );
            setStudents(filtered);
     }

   
useEffect(()=>{
        getData();
   },[]);

   
const getData = async() =>{
   try{
       
       const response = await fetch('http://localhost:5000/getStudents');

       if(!response.ok){
            console.log("Some error occured", response);
            
       }
      const data = await response.json();
      //console.log(data.response);
      setStudents(data.response);
      setLoading(false);

      
     
   }catch(err){
        
   }
}   
console.log(searchName);

const handleSearch = (text) => {
     setSearchName(text);
     const searchRegex = new RegExp(text, 'i');
     const filtered = students.filter( std => 
            searchRegex.test(std.name)
      );

      setStudents(filtered);
}

const handleSort = () => {
       const sortStudents = [...students].sort((a,b)=> a.age - b.age);
       setStudents(sortStudents);
}



//console.log({"data" : students});
       
      return(
        <div className="std">
              <h1>Student Page</h1>

              {
                 loading ? (
                       <h1>Loading...</h1>
                 ) : (
                      <div>

                        <div>
                          <input type='text' placeholder='Search By Name' className='box-1' value={searchName} onChange={e => handleSearch(e.target.value)}/>
                         
                         </div>

       
                         <div>
                                <input type='number' placeholder='min age' value={minAge} className='input box-2' onChange={e => setMinAge(e.target.value)} />
                                <input type='number' placeholder='max age' value={maxAge} className='input box-3' onChange={e => setMaxAge(e.target.value)} />
                                <button onClick={handleAge} className='btn-age'>Apply filter</button>
                         </div>


                         <button onClick={handleSort} className='sort'>Sort By Age</button>
                       
                         {
                              students.map((student)=> {
                                  return <div className='std-details' key={student._id}>
                                             <div className='nm-div'>
                                                 <h3 className='nm'>{student.name}</h3>
                                                 <h5  > Admission Date : {student.admissionDate}</h5>
                                                 <h5>Age : {student.age}</h5>
                                             </div>
                                              <div className='c-div'> 
                                                 <h5>Course : {student.course}</h5>
                                                 <h5>Grade : {student.grade}</h5>
                                             </div>
                                         </div>
                              })
                         }
                      </div>
                 )
              }
        </div>
      )
}

export default Student;