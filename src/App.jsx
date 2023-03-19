import GridButton from "./GridButton";
import React, { Component } from 'react';
import axios from "axios";

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
     console.log(newState);
    //loop through each light in json and see if the coordinate exists
    newState.article.lights.forEach( (light, index) => {
      if(JSON.stringify(light.lightNum) == JSON.stringify(LightNum))
        {
          //light arleady in Array
          addlight =false
          newState.article.lights.splice(index,1); //Remove coordinate from array
          //set the incoming RGB to 0,0,0 so we can turn off the light
          RGB[0] = 0
          RGB[1] = 0
          RGB[2] = 0
        }
    });
    //add the light to the array if its not in there yet
    if(addlight){        
      newState.article.lights.push({"lightNum":LightNum,"RGB": RGB})

    }

    //build single light json for that api
    let apicall = {RGB:[],LightNum:0}
    apicall.RGB = RGB
    apicall.LightNum = LightNum

  //Call API to set the specific light
  axios.post('http://192.168.1.246/setLED', apicall)
      .catch(error => {
          console.error('There was an error!', error);
      });

      //update state with current json
      this.setState(newState)
   }

componentDidMount()
{
  axios.get('http://192.168.1.246/getLights').then ((response) => {
    let newState = this.state; 
    newState.article = response.data.article;
    let LedNum = 50
   if (newState.LightsLoaded == undefined)
   {


    for (var x=11; x> 0; x--) {

      if ( x % 2 == 0) //Even
      {
        for(var y=18; y >0; y--)
         {     
          newState.LEDS.push({"LightNum":LedNum,"x": x, "y":y})
          LedNum ++
         }
      }
      if ( x % 2 != 0) //Even
      {
        for(var y=1; y <19; y++)
         {     
          newState.LEDS.push({"LightNum":LedNum,"x": x, "y":y})
          LedNum ++
         }
      }
    }
    newState.LightsLoaded = 1;
    this.setState(newState)
  }
}
  );
}
render ()
{
 let  lightinfo = "" ;
 let grids= [] ;
 let light;
    



for (var i=18; i > 0; i--) {
    for(var j=1; j < 12; j++)
    {   
      lightinfo = this.state.LEDS.find(item => item.x === j && item.y === i);
      if(lightinfo != undefined)
      {
        let light = this.state.article.lights.find( item => item.lightNum === lightinfo.LightNum) ;
        let color =[0,0,0];
        if(light != undefined)
        {
          color = light.RGB;
        }
  
            grids.push({"colors": color, "coords":[j,i], "lightNum":lightinfo.LightNum});
      }

     
    };

  
};
  return(
    <div >
           {grids.map(({ colors, coords, lightNum }) => (
        <GridButton
          colors={colors}
          coords={coords}
          lightNum={lightNum}
          CallAPI={this.CallAPI.bind(this)}
        />
      ))}
    </div>
  )
           }       
}


export default App;
