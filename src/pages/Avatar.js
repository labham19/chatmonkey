import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios';

const host = "https://chatmonkey.herokuapp.com/";
function Avatar(props) {
    const [avatars,setAvatars] = useState([]);
    const [active,setActive] = useState(null);

    useEffect(()=>{
        props.showLoader();
        let array = [];
         for(let i=0;i<8;i++){
           array.push("https://api.multiavatar.com/"+Math.floor(Math.random() * (100 - 0 + 1) + 0)+".png");
         }
        
         setAvatars(array);
    },[]);

      let navigate = useNavigate();
      
      const avatarSelected = () =>{
        let selected = avatars[active];
        
        axios.post(host+'api/auth/avatarselected',{vector:selected},{headers:{'auth-token':localStorage.getItem('chatmonkeytoken')}})
        .then(res => {
            navigate('/');
        })
        .catch(err => {
          console.log(err);
        });

      }
    
      return (
        <div>
            <div className='absolute  space-x-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-2/3 bg-slate-800 shadow-lg shadow-black p-4'>
              <h1 className='text-center my-5 text-white font-bold'>Select an avatar</h1>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-7'>
                { 
                    avatars.map((avt,i)=>{
                        return <div key={avt} className={`flex p-2 justify-center transition-all ease-out duration-500 ${active==i?'bg-slate-500':''}`} onClick={()=>{setActive(i)}}>
                             <div className='w-2/3 md:w-1/2 cursor-pointer'>
                             <img src={avt}/>
                            </div>
                        </div>
                    })     
                }
              </div>
              <div>
                <button disabled={active==null} onClick={avatarSelected} className='btn w-full disabled:hidden md:w-1/2 absolute left-1/2 py-2 px-6 -translate-x-1/2 my-10 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-md text-gray-900 font-bold hover:to-yellow-400 hover:from-orange-400 hover:text-white transition-all ease-in-out duration-500'>Set Avatar</button>
              </div>
            </div>  
            
        </div>
  )
}

export default Avatar
