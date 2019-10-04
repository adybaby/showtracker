import Background from '../images/movie-film-video-production-ss-1920.jpg';

const drawerWidth = 260;

export const styles = theme => ({
//main

background: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  width: "100%",
  height: "100%",  
  backgroundImage: `url(${Background})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover"  
},

introBox: {   
  display: 'flex',
  flexDirection: "column",
  alignItems: 'left',    
  justifyContent: "top",
  marginTop: "10%",
  height:"100%",
  "& *":{
    margin: theme.spacing(2)
  }
},  
  //drawer
  root: {
    display: "flex",
    height:"60%"
  },

  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerToolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  drawerContent: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },

  // fetch episodes status
  fetchEpisodesStatus: {   
    display: 'flex',
    alignItems: 'center',    
    justifyContent: "center",
    height:"100%",
    "& *":{
      margin: theme.spacing(1)
    }
  },  

  //appbar
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  appBarMenuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  appBarTitle: {
    flexGrow: 1
  },

  //show card
  showCard: {
    width: "100%",
    maxWidth: 345
  },
  showCardMedia: {
    height: 140
  },  
  showCardBodyText: {
    marginLeft: 8,
    marginTop: 2,
    marginBottom: 2,
    fontSize: 13
  },
  showCardButtonStyle: {
    float: "right"
  },
  showCardControls: {
    color: 'red',
    align: 'center',
    justifyContent: 'center'
  },

  //episode card
  episodeCard: {
    width:"100%"
  },
  episodeCardBodyText: {
    fontSize: 14
  },
  episodeCardDialogContent: {
    minHeight: 250
  }
});

export default styles;
