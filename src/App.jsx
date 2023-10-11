import GridButton from "./GridButton";
import RouteDropdown from "./RouteDropdown";
import RouteEditorModal from "./RouteEditorModal";
import React, { Component } from 'react';
import axios from "axios";
import * as _ from "lodash";
import holdlist from './data/holds.json';
import { Button, ButtonToolbar } from "react-bootstrap";

class App extends Component { 
  constructor(props) {
      super(props);
      this.state = {
                    route:{RouteName:"",RouteId:0,Difficulty:"", Lights:[]},
                    Holds:[],
                    RouteDropdownList:[],  
                    RouteList:{routes:[]}, 
                    editRouteModalShow:false
                  };
  }


CallAPILoadRoute = (Lights) =>{
    let lightlist =  {"lights":Lights};
    axios.post('http://192.168.1.245/setLEDs',lightlist)
    .catch(error => {
      console.error('There was an error!', error);
    });
}
CallAPIGetlights = ()  =>  {
  let newState = this.state;
  axios.get('http://192.168.1.245/getLights').then ((response) => {  
      newState.route.Lights =  response.data.article.lights
      this.setState(newState);
      this.setupGrid();
  })
}

CallAPIGetRoutes = ()  =>  {
  let newState = this.state;
  axios.get('http://192.168.1.245/getRoutes').then ((response) => {  
      newState.RouteList.routes =  response.data;
      this.setState(newState);
      this.LoadRouteList()
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
  let routeindex = newState.route.Lights.findIndex (el => el.LightNum === light.LightNum)
  let RGBempty = [0,0,0]
  //loop through each light in json and see if the coordinate exists
  if(routeindex > -1 && JSON.stringify(light.color) == JSON.stringify(RGBempty)  )
  {
    newState.route.Lights.splice(routeindex,1); //Remove coordinate from array
  }
  else if(routeindex > -1 && JSON.stringify(light.color) != JSON.stringify(RGBempty)  )
  {
    newState.route.Lights[routeindex].color = light.color;
  }
  else 
  {
    newState.route.Lights.push(light)
  }    
  //build single light json for that api
  this.CallAPISetLight(light)
      //update state with current json
  this.setState(newState);
}

saveRoute =(route) => {
  let maxRouteId = _.maxBy(this.state.RouteList.routes, 'RouteId').RouteId
  let newState = this.state;
  newState.editRouteModalShow = false;

  if(route != undefined && this.state.route.Lights[0] !== undefined )  
  {
    route.Lights = this.state.route.Lights
    newState.route = route;

    if(route.RouteId == 0)
    {
      maxRouteId ++
      newState.route.RouteId =maxRouteId ;
      newState.RouteList.routes.push(_.cloneDeep(newState.route))
      newState.RouteDropdownList.push(
      { 
        "value": maxRouteId,  
        "label":  newState.route.RouteName+ " "+  newState.route.Difficulty
      }) 
      newState.selectedIndex = newState.RouteDropdownList.findIndex(el => el.value == newState.route.RouteId)
    }
    else
    {
       newState.RouteDropdownList[newState.selectedIndex].label = newState.route.RouteName+ " "+  newState.route.Difficulty
       let updateRoute = newState.RouteList.routes.find(el => el.RouteId == newState.route.RouteId)
       updateRoute.RouteName =newState.route.RouteName ;
       updateRoute.Difficulty =newState.route.Difficulty;
       updateRoute.Lights = _.cloneDeep(newState.route.Lights)
    }
  }
 this.setState(newState);

}

LoadRouteList = () => {
  let newState = this.state; //Grab state which is where the JSON is saved
  if (this.state.RouteDropdownList.length == 0)
  {
    newState.RouteList.routes.forEach(Route => {
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
  let Route = newState.RouteList.routes.find( ({RouteId}) =>RouteId === Routename)
  newState.selectedIndex = newState.RouteDropdownList.findIndex(el => el.value === Routename)
  newState.route.RouteId = Route.RouteId;
  newState.route.RouteName  = Route.RouteName;
  newState.route.Lights = _.cloneDeep(Route.Lights);
  newState.route.Difficulty = Route.Difficulty;
  this.CallAPILoadRoute(Route.Lights)
  this.setupGrid();
  this.setState(newState);
}
 
mirrorRoute = ()  =>  {
  this.state.route.Lights.forEach(light => {
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
   let newState = this.state
   newState.route.RouteName =""
   newState.route.RouteId = 0
   newState.route.Difficulty = ""
   newState.selectedIndex = -1
   this.setState(newState)
   this.CallAPILoadRoute(this.state.route.Lights)
}

setupGrid = ()  => {
  let newState = this.state;
  newState.Holds= []
    
  holdlist.forEach( hold => {
    let color =[0,0,0];
    let lightdata = this.state.route.Lights.find(light => light.LightNum == hold.LightNum)
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
    this.CallAPIGetRoutes();
}

render ()
{
  let  buttontext = "Create Route" 

  if (this.state.route.RouteId != 0)
  {
    buttontext = 'Edit Route';
  }
  let disabled  = false;
  if (this.state.route.Lights[0] == undefined)
  {
    disabled = true;
  }

  return(
  <div name ="root">
    <div className="TopNav">
    <Button size="lg" onClick={()=> this.setState({editRouteModalShow:true})} disabled={disabled} > {buttontext}</Button> {" "}
    <Button size="lg" onClick={()=>this.mirrorRoute()}> Mirror Route</Button>

    <RouteEditorModal 
                    show= {this.state.editRouteModalShow}
                    onHide = {this.saveRoute.bind(this)}
                    route = {this.state.route} 
    />
      <div className ="routes">
  <RouteDropdown  LoadRoute={this.loadRoute.bind(this)} DropDownList={this.state.RouteDropdownList} selectedIndex={this.state.selectedIndex}  />
  </div>
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