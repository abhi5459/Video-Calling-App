import React, { useContext } from 'react';
import { Grid, Typography, Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { VolumeUp, VolumeOff, Videocam, VideocamOff, ScreenShare, StopScreenShare, PanTool } from '@material-ui/icons';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
    video: {
      width: '550px',
      [theme.breakpoints.down('xs')]: {
        width: '300px',
      },
    },
    gridContainer: {
      justifyContent: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    paper: {
      padding: '10px',
      border: '2px solid black',
      margin: '10px',
      
    },
    feature: {
      display: "flex",
      // justifyContent: "center", 
      alignItems: "center"
    },
    margin: {
      marginTop: 20,
    },
    buttons: {
      borderRadius: '25%',
      margin: '4px',
      height: '20%',
      width: '10%',
      alignContent: 'center'
  }
  }));

const VideoPlayer = () =>{
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call, mutevideo, muteaudio, toggleaudio, togglevideo, screen, screenshare,stopscreenshare, raised, toggleRaiseHand} = useContext(SocketContext);
    const classes = useStyles();

    return (
       <Grid container className={classes.gridContainer}>
           {
               stream && (
                    <Paper className = {classes.paper}>
                        <Grid item xs = {12} md = {6}>
                            <Typography variant="h5" gutterBottom>
                                    {name || 'Name'}
                            </Typography>
                            <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
                              <div className={classes.feature}>
                                      {mutevideo ? (
                                          <Button variant="contained" color="primary" startIcon={<Videocam fontSize="large" />} fullWidth onClick={togglevideo} className={classes.margin, classes.buttons}>
                                          </Button>
                                      ) : (
                                          <Button variant="contained" color="secondary" startIcon={<VideocamOff fontSize="large" />} fullWidth onClick={togglevideo} className={classes.margin, classes.buttons} >
                                          </Button>
                                      )}
                                      {muteaudio ? (
                                          <Button variant="contained" color="primary" startIcon={<VolumeUp fontSize="large" />} fullWidth onClick={toggleaudio} className={classes.margin, classes.buttons}>
                                          </Button>
                                      ) : (
                                          <Button variant="contained" color="secondary" startIcon={<VolumeOff fontSize="large" />} fullWidth onClick={toggleaudio} className={classes.margin, classes.buttons} >
                                          </Button>
                                      )}
                                      {callAccepted && screen ? (
                                          <Button variant="contained" color="secondary" startIcon={<StopScreenShare fontSize="large" />} fullWidth onClick={stopscreenshare} className={classes.margin, classes.buttons}>
                                          </Button>
                                      ) : (
                                          <Button variant="contained" color="primary" startIcon={<ScreenShare fontSize="large" />} fullWidth onClick={screenshare} className={classes.margin, classes.buttons} >
                                          </Button>
                                      )}
                                  </div>
                        </Grid>
                    </Paper>
               )
           }
           
           {
               callAccepted && !callEnded && (
                    <Paper className = {classes.paper}>
                        <Grid item xs = {12} md = {6}>
                            <Typography variant="h5" gutterBottom>
                                {call.name || 'Name'}
                            </Typography>
                            <video playsInline ref={userVideo} autoPlay className={classes.video} />
                        </Grid>
                    </Paper>
               )
           }
           
       </Grid>
    );
}

export default VideoPlayer