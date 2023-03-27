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
  let lightindex = newState.LEDS.findIndex (el => el.LightNum === LightNum)
  let routeindex = newState.article.lights.findIndex (el => el.lightNum === LightNum)

  //loop through each light in json and see if the coordinate exists
  if(routeindex > -1)
  {
    newState.article.lights.splice(routeindex,1); //Remove coordinate from array
    newState.LEDS[lightindex].color = [0,0,0];
  }
  else
  {
    newState.article.lights.push({"lightNum":LightNum,"RGB": RGB})
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
    this.setState(newState)
}
 
 
getlights = ()  =>  {
    axios.get('http://192.168.1.245/getLights').then ((response) => {  
      if (this.state.LightsLoaded == undefined)
      {
       this.setupGrid(response);
      }
    })
  
}

setupGrid = (response)  => {
  let newState = this.state; //Grab state which is where the JSON is saved
  newState.article =  response.data.article;
  let LedNum = 50
  let color =[0,0,0];
  let light;
  console.log(response);
  // only try to intialize
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
        light = undefined;
        color = [0,0,0];
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
        light = undefined;
        color = [0,0,0];
      }
    }
  }

  //order lights by coordinates to set the order the UI willend up using
  newState.LEDS = _.orderBy(newState.LEDS, ['y','x'],['desc','asc']);
    
  //randomized code to simulate final wall REMOVE once we define the holes / angles
  let holdsetup = [
    { x:1,y:18,holdimg:"",degree:0},
    { x:2,y:18,holdimg:"Hold80.png",degree:-5},
    { x:3,y:18,holdimg:"",degree:0},
    { x:4,y:18,holdimg:"Hold85.png",degree:0},
    { x:5,y:18,holdimg:"",degree:0},
    { x:6,y:18,holdimg:"Hold86.png",degree:0},
    { x:7,y:18,holdimg:"",degree:0},
    { x:8,y:18,holdimg:"Hold53.png",degree:5},
    { x:9,y:18,holdimg:"Hold37.png",degree:-20},
    { x:10,y:18,holdimg:"Hold64.png",degree:0},
    { x:11,y:18,holdimg:"",degree:0},
    { x:1,y:17,holdimg:"Hold1.png",degree:0},
    { x:2,y:17,holdimg:"",degree:0},
    { x:3,y:17,holdimg:"Hold4.png",degree:10},
    { x:4,y:17,holdimg:"",degree:0},
    { x:5,y:17,holdimg:"Hold81.png",degree:0},
    { x:6,y:17,holdimg:"Hold78.png",degree:-5},
    { x:7,y:17,holdimg:"Hold15.png",degree:0},
    { x:8,y:17,holdimg:"",degree:0},
    { x:9,y:17,holdimg:"Hold18.png",degree:-10},
    { x:10,y:17,holdimg:"",degree:0},
    { x:11,y:17,holdimg:"Hold23.png",degree:0},
    { x:1,y:16,holdimg:"",degree:0},
    { x:2,y:16,holdimg:"Hold65.png",degree:0},
    { x:3,y:16,holdimg:"",degree:0},
    { x:4,y:16,holdimg:"Hold63.png",degree:135},
    { x:5,y:16,holdimg:"Hold70.png",degree:-10},
    { x:6,y:16,holdimg:"",degree:0},
    { x:7,y:16,holdimg:"Hold72.png",degree:-120},
    { x:8,y:16,holdimg:"Hold79.png",degree:10},
    { x:9,y:16,holdimg:"",degree:0},
    { x:10,y:16,holdimg:"Hold58.png",degree:0},
    { x:11,y:16,holdimg:"",degree:0},
    { x:1,y:15,holdimg:"Hold66.png",degree:-35},
    { x:2,y:15,holdimg:"",degree:0},
    { x:3,y:15,holdimg:"Hold84.png",degree:-90},
    { x:4,y:15,holdimg:"Hold71.png",degree:-2},
    { x:5,y:15,holdimg:"",degree:0},
    { x:6,y:15,holdimg:"Hold60.png",degree:-40},
    { x:7,y:15,holdimg:"",degree:0},
    { x:8,y:15,holdimg:"Hold59.png",degree:0},
    { x:9,y:15,holdimg:"Hold22.png",degree:0},
    { x:10,y:15,holdimg:"",degree:0},
    { x:11,y:15,holdimg:"Hold73.png",degree:-150},
    { x:1,y:14,holdimg:"",degree:0},
    { x:2,y:14,holdimg:"Hold13.png",degree:0},
    { x:3,y:14,holdimg:"Hold3.png",degree:-45},
    { x:4,y:14,holdimg:"",degree:0},
    { x:5,y:14,holdimg:"Hold83.png",degree:178},
    { x:6,y:14,holdimg:"Hold11.png",degree:0},
    { x:7,y:14,holdimg:"Hold47.png",degree:182},
    { x:8,y:14,holdimg:"",degree:0},
    { x:9,y:14,holdimg:"Hold62.png",degree:45},
    { x:10,y:14,holdimg:"Hold21.png",degree:0},
    { x:11,y:14,holdimg:"",degree:0},
    { x:1,y:13,holdimg:"Hold38.png",degree:90},
    { x:2,y:13,holdimg:"Hold25.png",degree:0},
    { x:3,y:13,holdimg:"",degree:0},
    { x:4,y:13,holdimg:"Hold82.png",degree:0},
    { x:5,y:13,holdimg:"Hold67.png",degree:45},
    { x:6,y:13,holdimg:"",degree:0},
    { x:7,y:13,holdimg:"Hold39.png",degree:135},
    { x:8,y:13,holdimg:"Hold44.png",degree:0},
    { x:9,y:13,holdimg:"",degree:0},
    { x:10,y:13,holdimg:"Hold46.png",degree:-45},
    { x:11,y:13,holdimg:"Hold56.png",degree:0},
    { x:1,y:12,holdimg:"Hold26.png",degree:180},
    { x:2,y:12,holdimg:"",degree:0},
    { x:3,y:12,holdimg:"Hold29.png",degree:0},
    { x:4,y:12,holdimg:"Hold2.png",degree:0},
    { x:5,y:12,holdimg:"",degree:0},
    { x:6,y:12,holdimg:"Hold36.png",degree:0},
    { x:7,y:12,holdimg:"",degree:0},
    { x:8,y:12,holdimg:"Hold28.png",degree:0},
    { x:9,y:12,holdimg:"Hold51.png",degree:0},
    { x:10,y:12,holdimg:"",degree:0},
    { x:11,y:12,holdimg:"Hold54.png",degree:0},
    { x:1,y:11,holdimg:"",degree:0},
    { x:2,y:11,holdimg:"Hold6.png",degree:0},
    { x:3,y:11,holdimg:"Hold34.png",degree:-45},
    { x:4,y:11,holdimg:"",degree:0},
    { x:5,y:11,holdimg:"Hold40.png",degree:45},
    { x:6,y:11,holdimg:"Hold24.png",degree:-90},
    { x:7,y:11,holdimg:"Hold41.png",degree:45},
    { x:8,y:11,holdimg:"",degree:0},
    { x:9,y:11,holdimg:"Hold35.png",degree:-45},
    { x:10,y:11,holdimg:"Hold69.png",degree:0},
    { x:11,y:11,holdimg:"",degree:0},
    { x:1,y:10,holdimg:"Hold31.png",degree:0},
    { x:2,y:10,holdimg:"Hold7.png",degree:0},
    { x:3,y:10,holdimg:"",degree:0},
    { x:4,y:10,holdimg:"Hold100.png",degree:-100},
    { x:5,y:10,holdimg:"Hold5.png",degree:0},
    { x:6,y:10,holdimg:"",degree:0},
    { x:7,y:10,holdimg:"Hold17.png",degree:0},
    { x:8,y:10,holdimg:"Hold68.png",degree:0},
    { x:9,y:10,holdimg:"",degree:0},
    { x:10,y:10,holdimg:"Hold9.png",degree:0},
    { x:11,y:10,holdimg:"Hold32.png",degree:0},
    { x:1,y:9,holdimg:"Hold48.png",degree:0},
    { x:2,y:9,holdimg:"",degree:0},
    { x:3,y:9,holdimg:"Hold27.png",degree:0},
    { x:4,y:9,holdimg:"Hold52.png",degree:0},
    { x:5,y:9,holdimg:"",degree:0},
    { x:6,y:9,holdimg:"Hold33.png",degree:0},
    { x:7,y:9,holdimg:"",degree:0},
    { x:8,y:9,holdimg:"Hold89.png",degree:0},
    { x:9,y:9,holdimg:"Hold30.png",degree:0},
    { x:10,y:9,holdimg:"",degree:0},
    { x:11,y:9,holdimg:"Hold55.png",degree:0},
    { x:1,y:8,holdimg:"",degree:0},
    { x:2,y:8,holdimg:"Hold50.png",degree:-60},
    { x:3,y:8,holdimg:"",degree:0},
    { x:4,y:8,holdimg:"",degree:0},
    { x:5,y:8,holdimg:"",degree:0},
    { x:6,y:8,holdimg:"Hold10.png",degree:0},
    { x:7,y:8,holdimg:"",degree:0},
    { x:8,y:8,holdimg:"",degree:0},
    { x:9,y:8,holdimg:"",degree:0},
    { x:10,y:8,holdimg:"Hold8.png",degree:180},
    { x:11,y:8,holdimg:"",degree:0},
    { x:1,y:7,holdimg:"",degree:0},
    { x:2,y:7,holdimg:"",degree:0},
    { x:3,y:7,holdimg:"Hold61.png",degree:0},
    { x:4,y:7,holdimg:"",degree:0},
    { x:5,y:7,holdimg:"Hold16.png",degree:0},
    { x:6,y:7,holdimg:"",degree:0},
    { x:7,y:7,holdimg:"Hold14.png",degree:-20},
    { x:8,y:7,holdimg:"",degree:0},
    { x:9,y:7,holdimg:"Hold45.png",degree:0},
    { x:10,y:7,holdimg:"",degree:0},
    { x:11,y:7,holdimg:"",degree:0},
    { x:1,y:6,holdimg:"Hold20.png",degree:-135},
    { x:2,y:6,holdimg:"",degree:0},
    { x:3,y:6,holdimg:"",degree:0},
    { x:4,y:6,holdimg:"Hold108.png",degree:0},
    { x:5,y:6,holdimg:"",degree:0},
    { x:6,y:6,holdimg:"Hold95.png",degree:0},
    { x:7,y:6,holdimg:"",degree:0},
    { x:8,y:6,holdimg:"Hold106.png",degree:0},
    { x:9,y:6,holdimg:"",degree:0},
    { x:10,y:6,holdimg:"",degree:0},
    { x:11,y:6,holdimg:"Hold57.png",degree:135},
    { x:1,y:5,holdimg:"Hold90.png",degree:0},
    { x:2,y:5,holdimg:"",degree:0},
    { x:3,y:5,holdimg:"Hold49.png",degree:90},
    { x:4,y:5,holdimg:"",degree:0},
    { x:5,y:5,holdimg:"Hold114.png",degree:0},
    { x:6,y:5,holdimg:"",degree:0},
    { x:7,y:5,holdimg:"Hold91.png",degree:180},
    { x:8,y:5,holdimg:"",degree:0},
    { x:9,y:5,holdimg:"Hold105.png",degree:5},
    { x:10,y:5,holdimg:"",degree:0},
    { x:11,y:5,holdimg:"Hold109.png",degree:35},
    { x:1,y:4,holdimg:"",degree:0},
    { x:2,y:4,holdimg:"Hold101.png",degree:0},
    { x:3,y:4,holdimg:"",degree:0},
    { x:4,y:4,holdimg:"Hold87.png",degree:0},
    { x:5,y:4,holdimg:"",degree:0},
    { x:6,y:4,holdimg:"",degree:0},
    { x:7,y:4,holdimg:"",degree:0},
    { x:8,y:4,holdimg:"Hold88.png",degree:0},
    { x:9,y:4,holdimg:"",degree:0},
    { x:10,y:4,holdimg:"Hold42.png",degree:0},
    { x:11,y:4,holdimg:"",degree:0},
    { x:1,y:3,holdimg:"Hold99.png",degree:0},
    { x:2,y:3,holdimg:"",degree:0},
    { x:3,y:3,holdimg:"",degree:0},
    { x:4,y:3,holdimg:"",degree:0},
    { x:5,y:3,holdimg:"Hold19.png",degree:0},
    { x:6,y:3,holdimg:"",degree:0},
    { x:7,y:3,holdimg:"Hold12.png",degree:10},
    { x:8,y:3,holdimg:"",degree:0},
    { x:9,y:3,holdimg:"",degree:0},
    { x:10,y:3,holdimg:"",degree:0},
    { x:11,y:3,holdimg:"Hold110.png",degree:0},
    { x:1,y:2,holdimg:"",degree:0},
    { x:2,y:2,holdimg:"",degree:0},
    { x:3,y:2,holdimg:"Hold102.png",degree:180},
    { x:4,y:2,holdimg:"",degree:0},
    { x:5,y:2,holdimg:"",degree:0},
    { x:6,y:2,holdimg:"Hold43.png",degree:-10},
    { x:7,y:2,holdimg:"",degree:0},
    { x:8,y:2,holdimg:"",degree:0},
    { x:9,y:2,holdimg:"",degree:0},
    { x:10,y:2,holdimg:"Hold103.png",degree:180},
    { x:11,y:2,holdimg:"",degree:0},
    { x:1,y:1,holdimg:"",degree:0},
    { x:2,y:1,holdimg:"Hold97.png",degree:0},
    { x:3,y:1,holdimg:"",degree:0},
    { x:4,y:1,holdimg:"Hold92.png",degree:180},
    { x:5,y:1,holdimg:"",degree:0},
    { x:6,y:1,holdimg:"",degree:0},
    { x:7,y:1,holdimg:"",degree:0},
    { x:8,y:1,holdimg:"Hold104.png",degree:0},
    { x:9,y:1,holdimg:"",degree:0},
    { x:10,y:1,holdimg:"Hold96.png",degree:0},
    { x:11,y:1,holdimg:"",degree:0}
    ]
 console.log(newState.LEDS);
  newState.LEDS.forEach(LED => {
       let hold = holdsetup.find( item =>item.x === LED.x && item.y === LED.y)
       console.log(hold)
       if (hold.holdimg != "")
       {
        LED.holdimg = '../src/images/'+hold.holdimg;
        LED.degree= hold.degree;
       }

      LED.coords = {"x":LED.x,"y":LED.y};
    

  })  
  newState.LightsLoaded = 1;
  this.setState(newState)
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
