import React, { Component,useEffect } from 'react';


class GridButton extends Component {
   constructor(props) {
    super(props);
    //this.state = props;
  }

  updateLight = ()  => { 
    if (this.props.light.color[0]> 0)
    {
      this.props.light.color = [0,25,0];
    }
    else if  (this.props.light.color[1]> 0)
    {
      this.props.light.color =[0,0,25];
    }
    else if  (this.props.light.color[2]> 0)
    {
      this.props.light.color =[0,0,0];
    }
    else {
      this.props.light.color =[25,0,0];
    }
      this.props.updateLight(this.props.light);
  }

render(){
    
    //set the rotation value used for the hold
     let degree =  this.props.degree;
     let  rotation = 'rotate('+degree+'deg)';

     //set CSS class of the indicator light
     let cssclass;
     let buttonClass;
     let cssCircle;
      if (this.props.light.color[0] > 0 ) 
        { 
          cssclass = "led-red"
          cssCircle = "circle-red"
        } 
      else if(this.props.light.color[1] > 0 ) 
      {
        cssclass = "led-green"
        cssCircle = "circle-green"
      }
      else if(this.props.light.color[2] > 0 ) 
      {
        cssclass = "led-blue"
        cssCircle = "circle-blue"
      }
      else{ 
            cssclass = "led-off"
          };

      // if there is a holdimg present  load the div with the hold and indicator led div
      if (this.props.holdimg != undefined)
      {
        return (
          
          <div className="button" style={{ cursor: "pointer"}} onClick={() => this.updateLight()}>   
                <img src={this.props.holdimg} style={{transform: rotation}}/>   
                <div  className={cssclass}></div>   
                <div className={cssCircle}></div>     
          </div>
         );
      }
      // if there i no holdimg just create an empty div
      return (
        <div className="button" ></div>
       );

   }
}
export default  GridButton