import GridButton from "./GridButton";
import RouteDropdown from "./Routes";
import React, { Component } from 'react';
import axios from "axios";
import * as _ from "lodash";
import holdlist from './data/holds.json';
import routesList from './data/routes.json';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
                    route:{lights:[]},
                    Holds:[],
                    RouteDropdownList:[],      
                  };
  }
 

CallAPILoadRoute = (lights) =>{
    let lightlist =  {"lights":lights};
    axios.post('http://192.168.1.245/setLEDs',lightlist)
    .catch(error => {
      console.error('There was an error!', error);
    });
}
CallAPIGetlights = ()  =>  {
  let newState = this.state;
  axios.get('http://192.168.1.245/getLights').then ((response) => {  
      newState.route.lights =  response.data.article.lights
      console.log(response)
      this.setState(newState);
      this.setupGrid();
  })
}
CallAPISetLight = (light) => {
   //Call API to set the specific light
   axios.post('http://192.168.1.245/setLED', light)
   .catch(error => {
         console.error('There was an error!', error);
   });

}

updateLight = (light ) => {
  let newState = this.state; //Grab state which is where the JSON is saved
  let Hold = newState.Holds.find (el => el.light.LightNum === light.LightNum)
  Hold.light.color = light.color;
  let routeindex = newState.route.lights.findIndex (el => el.LightNum === light.LightNum)
  let RGBempty = [0,0,0]
  //loop through each light in json and see if the coordinate exists
  if(routeindex > -1 && JSON.stringify(light.color) == JSON.stringify(RGBempty)  )
  {
    newState.route.lights.splice(routeindex,1); //Remove coordinate from array
  }
  else if(routeindex > 1 && JSON.stringify(light.color) != JSON.stringify(RGBempty)  )
  {
    newState.route.lights[routeindex].color = light.color;
  }
  else 
  {
    newState.route.lights.push(light)
  }    
  //build single light json for that api
  this.CallAPISetLight(light)
      //update state with current json
  this.setState(newState);
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

loadRoute = (Routename) =>
{
  let newState = this.state 
  let Route = routesList.find( ({RouteId}) =>RouteId === Routename)
  this.CallAPILoadRoute(Route.Lights)
  newState.route.lights = Route.Lights;
  this.setupGrid();
  this.setState(newState);
}
 
mirrorRoute = ()  =>  {
  this.state.route.lights.forEach(light => {
     let Hold =  this.state.Holds.find(item => item.light.LightNum === light.LightNum)
     let x = Hold.x 
     if(x != 6)
     {
      x = 11-x+1
      let NewHold= this.state.Holds.find(item => item.x  === x && item.y == Hold.y)
      light.LightNum = NewHold.light.LightNum;
     }
   });
   this.setupGrid();
   this.CallAPILoadRoute(this.state.route.lights)
}

setupGrid = ()  => {
  let newState = this.state;
  newState.Holds= []
     
  holdlist.forEach( hold => {
    let color =[0,0,0];
    let lightdata = this.state.route.lights.find(light => light.LightNum == hold.LightNum)
    if (lightdata != undefined)
    {
      color = lightdata.color;
    }
    let newHold = {"light":{"LightNum":hold.LightNum,"color":color},"x": hold.x, "y":hold.y, }
    if (hold.holdimg != "")
    {
      newHold.holdimg = 'https://raw.githubusercontent.com/BrianDCraw/ClimbingWallWebUI/main/src/images/'+hold.holdimg ;
      newHold.degree= hold.degree;
    }
    newState.Holds.push(newHold)
  });
  
  //order lights by coordinates to set the order the UI willend up using
   newState.Holds = _.orderBy(newState.Holds, ['y','x'],['desc','asc']);
  this.setState(newState)
}

componentDidMount()
{
    this.CallAPIGetlights();
    this.getroutes();
}

render ()
{
  return(
  <div name ="root">
   <div className ="routes">
   <RouteDropdown LoadRoute={this.loadRoute.bind(this)} DropDownList={this.state.RouteDropdownList} />
   <div className="mirror" style={{ cursor: "pointer"}} onClick={() => this.mirrorRoute()} >MIRROR</div>
  </div>
    <div className ="holdlist">
    { this.state.Holds.map(({ light, degree,holdimg }) => (
 <GridButton key = {light.LightNum}
   light={light}
   degree={degree}
   holdimg={holdimg}
   updateLight={this.updateLight.bind(this)}
 />
    ))}
   </div>
</div>
  )
 }       
}

export default App;