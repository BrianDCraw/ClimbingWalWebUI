import GridButton from "./GridButton";
import RouteDropdown from "./Routes";
import React, { Component } from 'react';
import axios from "axios";
import * as _ from "lodash";
import holds from './data/holds.json';
import routesList from './data/routes.json';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
                    article:{lights:[]},
                    LEDS:[],
                    RouteDropdownList:[],      
                  };
  }
 

CallAPI = (RGB,LightNum ) => {
  let newState = this.state; //Grab state which is where the JSON is saved
  let lightindex = newState.LEDS.findIndex (el => el.LightNum === LightNum)
  let routeindex = newState.article.lights.findIndex (el => el.LightNum === LightNum)
  let RGBempty = [0,0,0]
  //loop through each light in json and see if the coordinate exists
  if(routeindex > -1 && JSON.stringify(RGB) == JSON.stringify(RGBempty)  )
  {
    newState.article.lights.splice(routeindex,1); //Remove coordinate from array
    newState.LEDS[lightindex].color = [0,0,0];
  }
  else if(routeindex > 1 && JSON.stringify(RGB) != JSON.stringify(RGBempty)  )
  {
    newState.article.lights[routeindex].RGB = RGB;
    newState.LEDS[lightindex].color = RGB;
  }
  else 
  {
    newState.article.lights.push({"LightNum":LightNum,"RGB": RGB})
    newState.LEDS[lightindex].color = RGB;
  }    

  //build single light json for that api
  let apicall = {"RGB":newState.LEDS[lightindex].color ,"LightNum": LightNum}

  //Call API to set the specific light
  axios.post('http://192.168.1.245/setLED', apicall)
    .catch(error => {
          console.error('There was an error!', error);
    });

      //update state with current json
    this.setState(newState);
}

CallAPILoadRoute = (lights) =>{
    let lightlist =  {"lights":lights};
    axios.post('http://192.168.1.245/setLEDs',lightlist)
    .catch(error => {
      console.error('There was an error!', error);
    });
}

getroutes = () => {
  let newState = this.state; //Grab state which is where the JSON is saved
  if (this.state.RouteDropdownList.length == 0)
  {
    routesList.forEach(Route => {
      newState.RouteDropdownList.push(
              { 
                "value": Route.RouteId,  
                "label": Route.RouteName+ " "+ Route.Difficulty
              }) 
     });
     this.setState(newState);
  }
}
 
getlights = ()  =>  {
    let newState = this.state;
    axios.get('http://192.168.1.245/getLights').then ((response) => {  
        newState.article.lights =  response.data.article.lights
        this.setState(newState);
        this.setupGrid();
    })
}

loadRoute = (Routename) =>
{
  let newState = this.state 
  let Route = routesList.find( ({RouteId}) =>RouteId === Routename)
  this.CallAPILoadRoute(Route.Lights)
  newState.article.lights = Route.Lights;
  this.setupGrid();
  this.setState(newState);
}

setupGrid = ()  => {
  let newState = this.state;
  newState.LEDS= []
     
  holds.forEach( hold => {
    let color =[0,0,0];
    let lightdata = this.state.article.lights.find(light => light.LightNum == hold.LightNum)
    if (lightdata != undefined)
    {
      color = lightdata.RGB;
    }
    let LED = {"LightNum":hold.LightNum,"x": hold.x, "y":hold.y,"color":color }
    if (hold.holdimg != "")
    {
      LED.holdimg = 'https://raw.githubusercontent.com/BrianDCraw/ClimbingWallWebUI/main/src/images/'+hold.holdimg ;
      LED.degree= hold.degree;
    }
    newState.LEDS.push(LED)
  });
  
  //order lights by coordinates to set the order the UI willend up using
   newState.LEDS = _.orderBy(newState.LEDS, ['y','x'],['desc','asc']);
  this.setState(newState)
}

 mirrorHolds = ()  =>  {
  this.state.article.lights.forEach(light => {
     let LED =  this.state.LEDS.find(item => item.LightNum === light.LightNum)
     let x = LED.x 
     if(x != 6)
     {
      x = 11-x+1
      let NEWLED = this.state.LEDS.find(item => item.x  === x && item.y == LED.y)
      light.LightNum = NEWLED.LightNum;
     }
   });
   this.setupGrid();
   this.CallAPILoadRoute(this.state.article.lights)
}

componentDidMount()
{
    this.getlights();
    this.getroutes();
}

render ()
{
  return(

  <div name ="root">
   <div className ="routes">
   <RouteDropdown LoadRoute={this.loadRoute.bind(this)} DropDownList={this.state.RouteDropdownList} />
   <div className="mirror" style={{ cursor: "pointer"}} onClick={() => this.mirrorHolds()} >MIRROR</div>
  </div>

    <div className ="leds">
    { this.state.LEDS.map(({ color, LightNum, degree,holdimg }) => (
 <GridButton key = {LightNum}
   colors={color}
   LightNum={LightNum}
   degree={degree}
   holdimg={holdimg}
   CallAPI={this.CallAPI.bind(this)}
 />
    ))}
   </div>

</div>

  )
 }       
}

export default App;