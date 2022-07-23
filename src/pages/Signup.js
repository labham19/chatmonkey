import axios from 'axios';
import React,{useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';

 const host = "https://chatmonkey.herokuapp.com/";
// const host = "http://localhost:5000/";

function Signup(props) {
let navigate = useNavigate();

  useEffect(()=>{
    props.showLoader();
    if(localStorage.getItem('chatmonkeytoken')){
      navigate('/');
    }
  },[]);
  
  const [credentials,setCredentials] = useState({name:"",password:"",confPassword:""});

  const handleChange = (e) =>{
    setCredentials({...credentials,[e.target.name]:e.target.value});
  }

  const signup = (e) =>{
    e.preventDefault();
    
    if(credentials.password === credentials.confPassword){
      axios.post(host+'api/auth/createUser',credentials)
      .then(res => {
          console.log(res);
          localStorage.setItem('chatmonkeytoken',res.data.authToken);
          navigate('/');
      })
      .catch(err => {console.log(err)})
    }
    else
      alert("Password Does Not Match");
    
    
  }

  return (
    <div>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-1/2 lg:w-2/5 bg-slate-800 shadow-lg shadow-black p-4'>
           <div className='flex flex-row justify-center items-center'>
             <img src="/images/logo.png" className='w-1/3 md:w-1/5'/>
             <h1 className='font-bold font-serif bg-gradient-to-tr from-yellow-400 to-orange-400 text-center text-xl md:text-2xl lg:text-4xl text-transparent bg-clip-text'>Chat Monkey</h1>
           </div> 

           <div className='lg:w-2/3 relative left-1/2 -translate-x-1/2'>
             <div className='my-5'>
                <h1 className='text-yellow-300 font-serif text-center md:text-xl'>Create an account</h1>
             </div>
             <form onSubmit={signup}>
             <div className='my-5'>
                <label htmlFor='name'></label>
                <input placeholder='User Name' name='name' id='name' onChange={handleChange} value={credentials.name} type='text' autoComplete='off' className='w-full rounded-md h-10 p-2 font-semibold bg-yellow-100'/>
             </div>
             <div className='my-5'>
                <label htmlFor='password'></label>
                <input placeholder='Password' name='password' onChange={handleChange} value={credentials.password} id='password' type='password' autoComplete='off' className='w-full rounded-md h-10 p-2 font-semibold bg-yellow-100'/>
             </div>
             <div className='my-5'>
                <label htmlFor='confPassword'></label>
                <input placeholder='Confirm Password' onChange={handleChange} value={credentials.confPassword} name='confPassword' id='confPassword' type='password' autoComplete='off' className='w-full rounded-md h-10 p-2 font-semibold bg-yellow-100'/>
             </div>
             <div className='my-7'>
                <label htmlFor='signupBtn'></label>
                <button type='submit' className='btn w-full md:w-1/2 relative left-1/2 py-2 px-6 -translate-x-1/2 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-md text-gray-900 font-bold hover:to-yellow-400 hover:from-orange-400 hover:text-white transition-all ease-in-out duration-500'>Register Now</button>
             </div>
             </form>
           </div>

           <div>
            <div className='text-center text-yellow-200'>Already A Member ?  &nbsp;<Link to="/login" className='hover:underline text-orange-400 hover:text-blue-400'>Login Now</Link></div>
           </div>
        </div>
      
    </div>
  )
}

export default Signup
