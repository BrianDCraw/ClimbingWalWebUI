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
      if (this.state.LightsLoaded == undefined)
      {
        newState.article.lights = []
        response.data.article.lights.forEach(light => {
          newState.article.lights.push({"LightNum":light.LightNum, "RGB":light.RGB})
          this.setState(newState);
       });
       this.setupGrid();
      }
    })

}

loadRoute = (Routename) =>
{
  let newState = this.state 
  let Route = routesList.find( ({RouteId}) =>RouteId === Routename)
   this.CallAPILoadRoute(Route.Lights)
  newState.article.lights = [];
  newState.LEDS.forEach(LED => {
    let lightindex = Route.Lights.find (el => el.LightNum === LED.LightNum)
    //loop through each light in json and see if the coordinate exists
    if (lightindex != undefined && lightindex.RGB != LED.RGB)
    {
      LED.color = lightindex.RGB;
      newState.article.lights.push({"LightNum":lightindex.LightNum, "RGB":lightindex.RGB})
    }
    else 
    { 
      LED.color = [0,0,0];
    }
  });
  this.setState(newState);
}
updateAllLights = () =>
{


}



setupGrid = ()  => {
  let newState = this.state;
  newState.LEDS= []
  let LedNum = 50 //first LED starts at 50
  let color =[0,0,0];
  let light;

  for (var x=11; x> 0; x--) {

    if ( x % 2 == 0) //Even column
    {
      for(var y=18; y >0; y--)
      {     
        light = this.state.article.lights.find( ({LightNum}) =>LightNum === LedNum) ;
        if(light != undefined && light.RGB != undefined)
        {
          color = light.RGB;
        }
        else {
           color = [0,0,0];
        }
        newState.LEDS.push({"LightNum":LedNum,"x": x, "y":y,"color":color })
        LedNum ++
  
      }
    }
    if ( x % 2 != 0) //ODD column
    {
      for(var y=1; y <19; y++)
      {     
        light = this.state.article.lights.find( item =>item.LightNum === LedNum) ;
        if(light != undefined && light.RGB != undefined)
        {
          color = light.RGB;
        }
        else {
          color = [0,0,0];
       }
        newState.LEDS.push({"LightNum":LedNum,"x": x, "y":y,"color":color })
        LedNum ++
      }
    }
  }
  //order lights by coordinates to set the order the UI willend up using
  newState.LEDS = _.orderBy(newState.LEDS, ['y','x'],['desc','asc']);
  newState.LEDS.forEach(LED => {
       let hold = holds.find( item =>item.LightNum == LED.LightNum)
       if (hold != undefined && hold.holdimg != "" )
       {
        LED.holdimg = 'https://raw.githubusercontent.com/BrianDCraw/ClimbingWallWebUI/main/src/images/'+hold.holdimg ;
        LED.degree= hold.degree;
       }
  })  
  console.log( newState.LEDS)
  newState.LightsLoaded = 1;
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
