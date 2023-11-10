import './App.css';
import FileUpload from './Component/FileStore/FileUpload';
import Student from './Component/Queires/Student';
import {BrowserRouter ,Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      
       <BrowserRouter>
             <Routes>
                <Route path='/' element={ <FileUpload/>}/>
                <Route path='/std' element={<Student/>}/>
             </Routes>
         </BrowserRouter>
    </div>
  );
}

export default App;
