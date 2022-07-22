import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import LoadingBar from 'react-top-loading-bar'
import Avatar from "./pages/Avatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [progress,setProgress]=useState(0);

  useEffect(()=>{
    showLoader()
  },[]);
  
   const showLoader = () =>{
      setProgress(50);
      setTimeout(()=>{
        setProgress(100);
      },500)
   }

  return (
    <div className="App bg-slate-600 h-[100vh]">
    <LoadingBar color='white' className="mt-1"  progress={progress} />
    <Router> 
      <Routes>
          <Route exact path="/" element={<Chat showLoader={showLoader}/>}></Route>
          <Route exact path="/avatar" element={<Avatar showLoader={showLoader}/>}></Route>
          <Route exact path="/login" element={<Login showLoader={showLoader} />}> </Route>
          <Route exact path="/signup" element={<Signup showLoader={showLoader} />}> </Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
