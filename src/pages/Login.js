import React, { useEffect,useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const host = "https://chatmonkey.herokuapp.com/";
//const host = "http://localhost:5000/";

function Login(props) {
let navigate = useNavigate();

  useEffect(()=>{
    props.showLoader();
    if(localStorage.getItem('chatmonkeytoken')){
      navigate('/');
    }
  },[]);
  
  
  const [credentials,setCredentials] = useState({name:"",password:""});

  const handleChange = (e) =>{
    setCredentials({...credentials,[e.target.name]:e.target.value});
  }
  const login = (e) =>{
    e.preventDefault();
    
      axios.post(host+'api/auth/login',credentials)
      .then(res => {
          localStorage.setItem('chatmonkeytoken',res.data.authToken);
          navigate('/');
      })
      .catch(err => {console.log(err)});

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
                <h1 className='text-yellow-300 font-serif text-center md:text-xl'>Login Now</h1>
             </div>
             <form onSubmit={login}>
             <div className='my-5'>
                <label htmlFor='name'></label>
                <input placeholder='User Name' name='name' id='name' onChange={handleChange} value={credentials.name} type='text' autoComplete='off' className='w-full rounded-md h-10 p-2 font-semibold bg-yellow-100'/>
             </div>
             <div className='my-5'>
                <label htmlFor='password'></label>
                <input placeholder='Password' name='password' id='password' onChange={handleChange} value={credentials.password} type='password' autoComplete='off' className='w-full rounded-md h-10 p-2 font-semibold bg-yellow-100'/>
             </div>
             <div className='my-7'>
                <label htmlFor='loginBtn'></label>
                <button type='submit' className='btn w-full md:w-1/2 relative left-1/2 py-2 px-6 -translate-x-1/2 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-md text-gray-900 font-bold hover:to-yellow-400 hover:from-orange-400 hover:text-white transition-all ease-in-out duration-500'>Login Now</button>
             </div>
             </form>
           </div>

           <div>
            <div className='text-center text-yellow-200'>Not A Member ?  &nbsp;<Link to="/signup" className='hover:underline text-orange-400 hover:text-blue-400'>Register Now</Link></div>
           </div>
        </div>
    </div>
  )
}

export default Login
