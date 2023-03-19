import React, { Component } from 'react';


class GridButton extends Component {
  constructor(props) {
    super(props);
  }

  apicall = ()  => {
    this.props.CallAPI([0,25,0],this.props.lightNum)
  }


render(){
      let cssclass = 'led_off'
      if (this.props.colors[1] > 0) 
        { cssclass = "led-green"} 
      else{cssclass = 'led-off'};
        return (
          <div class="button">
            <div onClick={() => this.apicall()} class={cssclass}></div>
            {this.props.coords[0]} ,{this.props.coords[1]}

          </div>

         );
   }
}
export default  GridButton