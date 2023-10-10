import React, { Component,useEffect } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


  const defaultOption = 'Select an Option'


class RouteDropdown extends Component {
   constructor(props) {
    super(props);
  }


  _onSelect = (e) =>
  {
       this.props.LoadRoute(e.value)
  };

render(){
    return(
        <div>
            <Dropdown options={this.props.DropDownList} onChange={this._onSelect} value={this.props.DropDownList[this.props.selectedIndex]} placeholder={defaultOption}
              arrowClosed={<span className="arrow-closed" />}
              arrowOpen={<span className="arrow-open" />}
            />
            </div>
    )
d
   }
}
export default  RouteDropdown