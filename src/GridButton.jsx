import React, { Component,useEffect } from 'react';


class GridButton extends Component {
 // constructor(props) {
  //  super(props);
 // }

  apicall = ()  => {
    this.props.CallAPI([0,25,0],this.props.lightNum)
  }


render(){
     let degree =  this.props.degree;
     let  rotation = 'rotate('+degree+'deg)translateX(-50%)';
       console.log(this.props)
      let cssclass = 'led_off'
      if (this.props.colors[1] > 0) 
        { cssclass = "led-green"} 
      else{cssclass = 'led-off'};
      if (this.props.holdimg != '')
      {
        return (
          <div class="button" style={{ cursor: "pointer"}} onClick={() => this.apicall()}>   
             <img src={this.props.holdimg} style={{transform: rotation}}/>   
            <div  class={cssclass}></div>
          </div>

         );
      }
      return (
        <div class="button" >   

        </div>

       );

   }
}
export default  GridButton