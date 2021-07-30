import React, {createContext, useState, useRef, useEffect} from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import useSound from 'use-sound';

const SocketContext = createContext();

//const socket = io("http://localhost:5000");
const socket = io('https://my-video-chat-pragya.herokuapp.com/');

const ContextProvider = ({ children }) => {
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');
    const [userID, setUserID] = useState('');
    const [muteaudio, setaudio] = useState(false);
    const [mutevideo, setvideo] = useState(false);
    const [screen, setscreenshare] = useState(false);
  
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
  
    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
  
          myVideo.current.srcObject = currentStream;
        });
  
      socket.on('me', (id) => setMe(id));
  
      socket.on('callUser', ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
      });
    }, []);
  
    const answerCall = () => {
      setCallAccepted(true);
  
      const peer = new Peer({ initiator: false, trickle: false, stream });
  
      peer.on('signal', (data) => {
        socket.emit('answerCall', { signal: data, to: call.from });
        setUserID(call.from);
      });
  
      peer.on('stream', (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });
  
      peer.signal(call.signal);
  
      connectionRef.current = peer;
    };
  
    const callUser = (id) => {
      const peer = new Peer({ initiator: true, trickle: false, stream });
  
      peer.on('signal', (data) => {
        socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
      });
  
      peer.on('stream', (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });
  
      socket.on('callAccepted', (signal) => {
        setCallAccepted(true);
  
        peer.signal(signal);
      });
  
      connectionRef.current = peer;
    };
  
    const leaveCall = () => {
      setCallEnded(true);
  
      connectionRef.current.destroy();
  
      window.location.reload();
    };

    const toggleaudio = () => {
      if (stream) {
          setaudio(!muteaudio);
          stream.getAudioTracks()[0].enabled = muteaudio;
      }
    };
    const togglevideo = () => {
        if (stream) {
            setvideo(!mutevideo);
            stream.getVideoTracks()[0].enabled = mutevideo;
        }
    };
    const screenshare = () => {
        const share = navigator.mediaDevices.getDisplayMedia({
            cursor: true
        });
        share.then(screening => {
            setscreenshare(true);
            connectionRef.current.replaceTrack(stream.getVideoTracks()[0], screening.getTracks()[0], stream);
            myVideo.current.srcObject = screening;

            screening.getTracks()[0].onended = () => {
                setscreenshare(false);
                connectionRef.current.replaceTrack(screening.getTracks()[0], stream.getVideoTracks()[0], stream);
                myVideo.current.srcObject = stream;
            }
        });
    };

    const stopscreenshare = () => {
        if (screen) {
            const screening = myVideo.current.srcObject;
            setscreenshare(false);
            connectionRef.current.replaceTrack(screening.getTracks()[0], stream.getVideoTracks()[0], stream);
            myVideo.current.srcObject = stream;
        }
    };

    return (
      <SocketContext.Provider value={{
        call, 
        callAccepted, 
        myVideo, 
        userVideo, 
        stream, 
        name, 
        callEnded, 
        me, 
        userID, 
        muteaudio, 
        mutevideo, 
        screen, 
        callUser, 
        setName, 
        answerCall, 
        leaveCall, 
        toggleaudio, 
        togglevideo, 
        screenshare, 
        stopscreenshare
      }}
      >
        {children}
      </SocketContext.Provider>
    );
  };
  
  export { ContextProvider, SocketContext };