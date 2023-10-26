import React, { Component,useEffect   } from 'react';
import 'react-dropdown/style.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

class RouteDropdown extends Component {
   constructor(props) {
    super(props);
  }

  _onSelect = (e) =>
  {
       this.props.LoadRoute(e)
  };

render(){
    let label = "Select Route"
     if (this.props.DropDownList[this.props.selectedIndex] != undefined  && this.props.selectedIndex != 0)
     {
      label= this.props.DropDownList[this.props.selectedIndex].label ;
     }
    return(
           <div className="routeDropdown">
             <DropdownButton align={{ lg: 'end' }} size="lg"  onSelect={this._onSelect}        id="dropdown-menu-align-end" title={label}>
              { this.props.DropDownList.map(({ value,label }) => (
                  <Dropdown.Item as="button"  size="lg" key={"route " +value} eventKey={value}>{label}</Dropdown.Item>
              ))}
            </DropdownButton>
  
            </div>


    )
d
   }
}
export default  RouteDropdown