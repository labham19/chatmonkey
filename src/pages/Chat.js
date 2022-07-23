import React,{useEffect, useRef, useState} from 'react'
import { useNavigate } from 'react-router';
import Picker from 'emoji-picker-react';
import axios from 'axios';
import io from 'socket.io-client';

 const host = "https://chatmonkey.herokuapp.com/";
 const socket = io.connect("https://chatmonkey.herokuapp.com");

//const host = "http://localhost:5000/";
//const socket = io.connect("http://localhost:5000/");

function Chat(props) {
  
  let navigate = useNavigate();
  const messageEnd = useRef(null);

  const [activeChatIndex,setActiveChatIndex] = useState(null);

  const [showPicker,setShowPicker] = useState(false);
  
  const [currentUser,setCurrentUser] = useState({});

  const [currentChat,setCurrentChat] = useState();

  const [contacts,setContacts] = useState([]);

  const [messages,setMessages] = useState([]);
  
  const [text,setText] = useState("");

  const [arrivalMsg,setArrivalMsg] = useState("");
 
  useEffect(()=>{
     socket.on("recieve_message",async (data)=>{
        setArrivalMsg(data);
     })
  },[socket]);

  useEffect(()=>{
     setMessages((prev)=>[...prev,arrivalMsg]);
  },[arrivalMsg]);

  useEffect(()=>{
    scrollToBottom();
  },[messages]);

  

  useEffect(()=>{
    props.showLoader();
    if(!localStorage.getItem('chatmonkeytoken')){
      navigate('/login');
    }
    

    axios.post(host+'api/auth/getUser',{},{headers:{'auth-token':localStorage.getItem('chatmonkeytoken')}})
    .then(async (res)=>{
       await setCurrentUser(res.data);
       if(!res.data.vector){
        navigate('/avatar');
       }
       socket.emit('new-user-add',res.data._id);
    })
    .catch(err=>{
      console.log(err);
      if(err.response.data.error='Unauthorized')
      logout();
    });

    axios.post(host+'api/auth/getUsers',{},{headers:{'auth-token':localStorage.getItem('chatmonkeytoken')}})
    .then(res=>{
      setContacts(res.data);
    })
    .catch(err=>{
      console.log(err);
      if(err.response.data.error='Unauthorized')
      logout();
    });

  },[]);
  

  

  const logout = () =>{
    localStorage.removeItem('chatmonkeytoken');
    socket.emit('disconnected');
    navigate('/login');
  }

  const loadChat =  async (index) =>{
    setActiveChatIndex(index);
    setCurrentChat(contacts[index]);
    setText("");
    setShowPicker(false);


    try{
       let res = await axios.post(host+'api/chats/fetchallchats',{recieverId:contacts[index]._id},{headers:{'auth-token':localStorage.getItem('chatmonkeytoken')}});
       if(res){
         setMessages(res.data);
       }
    }
    catch(err){
      console.log(err);
      if(err.response.data.error='Unauthorized')
      logout();
    }
  
  }

  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject);
    let tex = text+emojiObject.emoji;
    setText(tex);
  };

  const changeHandler = (event) => {
    setText(event.target.value);
  };

  const submitText = async (event) => {
    event.preventDefault();

    axios.post(host+'api/chats/createChat',{msg:text,recieverId:currentChat._id},{headers:{'auth-token':localStorage.getItem('chatmonkeytoken')}})
    .then(async(res)=>{
      socket.emit('send_message',{msg:text,recieverId:currentChat._id,senderId:currentUser._id,_id:res.data._id});

      
       setText("");
       setMessages((prev)=>[...prev,{msg:text,recieverId:currentChat._id,senderId:currentUser._id,_id:res.data._id}]);
    })
    .catch(err=>{
      console.log(err);
      if(err.response.data.error='Unauthorized')
      logout();
    });
  };

  const scrollToBottom = () =>{
    messageEnd.current?.scrollIntoView();
  }


  return (
    <div>
        <div className='absolute flex flex-row space-x-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[80%] w-10/12 lg:w-2/3 bg-slate-800 shadow-lg shadow-black p-4'>
           <div className='w-2/5 flex flex-col space-y-5 p-3'>
                <div className='flex flex-row justify-center items-center bg-slate-700 p-2'>
                    <img src="/images/logo.png" className='md:w-2/5 lg:w-1/5'/>
                    <h1 className='font-bold font-serif bg-gradient-to-tr from-yellow-400 to-orange-400 text-center md:text-xl lg:text-2xl text-transparent bg-clip-text'>Chat Monkey</h1>
                </div> 

                <div className='bg-slate-700 max-h-[24rem] overflow-y-scroll overflow-x-hidden'>

                    {
                        contacts.map((contact,i)=>{
                            return contact._id!==currentUser._id ? <div key={i} className={`cursor-pointer transition-all ease-in-out duration-200 flex flex-row items-center p-3 active:bg-slate-600 hover:bg-slate-500 ${activeChatIndex===i?'bg-slate-500':''}`} onClick={()=>{loadChat(i);}}>
                                <img src={contact.vector} className='w-1/5 lg:w-1/6'/>
                                <h1 className='mx-5 font-bold font-serif text-yellow-400 text-center md:text-lg lg:text-xl text-transparent bg-clip-text'>{contact.name}</h1>
                               </div> : ''
                        })
                    }
                    

                </div>


                 
                <div className='flex flex-col lg:flex-row justify-center p-2 items-center bg-slate-700 rounded-md'>
                    <div className='flex flex-row items-center lg:w-2/3 w-full justify-center'>
                      <img src={currentUser.vector} className='w-1/6'/>
                      <h1 className='mx-5 font-bold font-serif text-yellow-400 text-center text-xl text-transparent bg-clip-text'>{currentUser.name}</h1>
                    </div>
                    
                    <div className='p-3'>
                        <button onClick={logout} className='hover:underline text-red-400'> <i className="fa fa-sign-out" aria-hidden="true"></i> Logout</button>
                    </div>
                </div> 
           </div>
           
           <div className='relative w-3/5 bg-[url("https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/Desktop.png")]'>
             {
                
                (currentChat) && 
                  <div className='h-full w-full'>
                    <div className='p-2 absolute top-0 z-50  bg-slate-700'>
                      <div className='flex flex-row items-center w-2/3'>
                        <img src={currentChat.vector} className='w-[13%]'/>
                        <h1 className='mx-5 font-bold font-serif text-yellow-400 text-center text-xl text-transparent bg-clip-text'>{currentChat.name}</h1>
                      </div>
                    </div>
                    
                    <div id='chatWindow' className='chatWindow p-4 max-h-full overflow-y-scroll overflow-x-hidden absolute top-12 left-0 right-0 bottom-16'>
                          {
                            messages.map((msg,i)=>{
                              return <div key={i} className={`my-2 flex ${msg.senderId===currentUser._id?'justify-end':''}`}>
                                  <p className={`p-2 rounded-lg w-fit ${msg.senderId===currentUser._id?'bg-gradient-to-tr from-slate-200 to-yellow-500':'bg-slate-300'}`}>{msg.msg}</p>
                              </div>   
                            })
                          }
                          <div ref={messageEnd}></div>
                    </div>

                    <div className='absolute bottom-0 p-2 h-14 bg-slate-500 w-full'>
                       <div className='flex flex-row space-x-2 items-center h-full'>
                         <button onClick={()=>{setShowPicker(!showPicker)}}> <i className="fas fa-smile fa-xl text-slate-200 hover:text-slate-400 cursor-pointer" ></i></button>
                          { showPicker && <div className='fixed -translate-y-52 -translate-x-2'> <Picker className="" onEmojiClick={onEmojiClick} /></div> }
                          
                          <form onSubmit={submitText} className="w-full flex">
                            <input onClick={()=>{setShowPicker(false)}} required value={text} onChange={changeHandler} placeholder='Type your message here' name='message' id='message' type='text' autoComplete='off' className='text-white w-full mx-2 rounded-md h-10 p-2 font-semibold bg-transparent'/>
                         
                            <button type='submit'> <i className="fa fa-paper-plane fa-xl text-slate-200 hover:text-slate-400 cursor-pointer" aria-hidden="true"></i></button>
                          </form>
                       </div>
                    </div>
                  </div>
                  
             } 

             {
                
                (!currentChat) && <div className='h-full w-full flex justify-center items-center'> 
                       <h1 className='text-transparent bg-clip-text bg-gradient-to-tr from-yellow-400 to-orange-400 text-lg lg:text-xl font-serif font-semibold'>Hey There Mate!</h1>
                  </div>
             } 
           </div>          
        </div>
    </div>
  )
}


export default Chat
