import GridButton from "./GridButton";
import React, { Component } from 'react';
import axios from "axios";
import * as _ from "lodash";

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
                    article:{lights:[]},
                    LEDS:[]                
                  };
  }
  
  CallAPI = (RGB,LightNum ) => {

    let newState = this.state; //Grab state which is where the JSON is saved
    var addlight = true; //Assume we are adding not removing a light

    //loop through each light in json and see if the coordinate exists
    newState.article.lights.forEach( (light, index) => {
      if(JSON.stringify(light.lightNum) == JSON.stringify(LightNum))
        {
          //light arleady in Array
          addlight =false
          newState.article.lights.splice(index,1); //Remove coordinate from array
          let lightindex = newState.LEDS.findIndex (el => el.LightNum === LightNum)
          //set the incoming RGB to 0,0,0 so we can turn off the light
          RGB[0] = 0
          RGB[1] = 0
          RGB[2] = 0
          newState.LEDS[lightindex].color = [0,0,0];
        }
    });
    //add the light to the array if its not in there yet
    if(addlight){        
      newState.article.lights.push({"lightNum":LightNum,"RGB": RGB})
      let lightindex = newState.LEDS.findIndex (el => el.LightNum === LightNum)
      newState.LEDS[lightindex].color = RGB;
    }

    //build single light json for that api
    let apicall = {RGB:[],LightNum:0}
    apicall.RGB = RGB
    apicall.LightNum = LightNum

  //Call API to set the specific light
  axios.post('http://192.168.1.245/setLED', apicall)
      .catch(error => {
          console.error('There was an error!', error);
      });

      //update state with current json
      this.setState(newState)
   }
 
 
getlights = ()  =>  {
    axios.get('http://192.168.1.245/getLights').then ((response) => {
     
      this.setupGrid(response);
    
    })


}
setupGrid = (response)  => {
  let newState = this.state; //Grab state which is where the JSON is saved
  newState.article =  response.data.article;
  let LedNum = 50
  let color =[0,0,0];
  let light;
  newState.article =  response.data.article;

  // only try to intialize
  if (newState.LightsLoaded == undefined)
   {
    for (var x=11; x> 0; x--) {

      if ( x % 2 == 0) //Even column
      {
        for(var y=18; y >0; y--)
         {     
          light = newState.article.lights.find( ({lightNum}) =>lightNum === LedNum) ;
          if(light != undefined && light.RGB != undefined)
          {
              color = light.RGB;
          }
          newState.LEDS.push({"LightNum":LedNum,"x": x, "y":y ,"color":color })
          LedNum ++
         }
      }
      if ( x % 2 != 0) //ODD column
      {
        for(var y=1; y <19; y++)
         {     
          light = newState.article.lights.find( item =>item.LightNum === LedNum) ;
          if(light != undefined && light.RGB != undefined)
          {
            color = light.RGB;
          }
          newState.LEDS.push({"LightNum":LedNum,"x": x, "y":y ,"color":color })
          LedNum ++
         }
      }
    }

    //order lights by coordinates to set the order the UI willend up using
    newState.LEDS = _.orderBy(newState.LEDS, ['y','x'],['desc','asc']);
    
    //randomized code to simulate final wall REMOVE once we define the holes / angles
    let degrees = 0;
    let holdNumber = 1;
    let counter = 1;
    newState.LEDS.forEach(LED => {
      if(counter % 5 == 0)
      {
          LED.holdimg = '../src/images/Hold'+holdNumber +'.png';
          LED.holdNumber = holdNumber;
          LED.coords = {"x":LED.x,"y":LED.y};
          holdNumber++;
          degrees = degrees +6;
          if (holdNumber == 37)
          {
           holdNumber = 1;
          }
      }
      counter++;
    })
    
    newState.LightsLoaded = 1;
    this.setState(newState)
  }
}


componentDidMount()
{
    this.getlights();
}
render ()
{
  return(
    <div >
           { this.state.LEDS.map(({ color, LightNum, degree,holdimg }) => (
        <GridButton
          colors={color}
          lightNum={LightNum}
          degree={degree}
          holdimg={holdimg}
          CallAPI={this.CallAPI.bind(this)}
        />
      ))}
    </div>
  )
           }       
}


export default App;
