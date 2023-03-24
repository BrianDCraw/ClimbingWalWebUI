import React, { Component,useEffect } from 'react';


class GridButton extends Component {
   constructor(props) {
    super(props);
  }

  apicall = ()  => {
    this.props.CallAPI([0,25,0],this.props.lightNum)
  }


render(){
    
    //set the rotation value used for the hold
     let degree =  this.props.degree;
     let  rotation = 'rotate('+degree+'deg)translateX(-50%)';

     //set CSS class of the indicator light
     let cssclass;
      if (this.props.colors[1] > 0) 
        { cssclass = "led-green"} 
      else{cssclass = 'led-off'};

      // if there is a holdimg present  load the div with the hold and indicator led div
      if (this.props.holdimg != undefined)
      {
        return (
          <div class="button" style={{ cursor: "pointer"}} onClick={() => this.apicall()}>   
             <img src={this.props.holdimg} style={{transform: rotation}}/>   
            <div  class={cssclass}></div> 
          </div>

         );
      }
      // if there i no holdimg just create an empty div
      return (
        <div class="button" ></div>
       );

   }
}
export default  GridButton