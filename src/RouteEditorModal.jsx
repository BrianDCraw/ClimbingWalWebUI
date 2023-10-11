import React, { Component,useEffect } from 'react';
import {Modal,Button,Row,Col,Form, ModalFooter,FloatingLabel, FormGroup} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as _ from "lodash";

class RouteEditorModal extends Component {
    constructor(props) {
     super(props);
     this.state = {
      route:{RouteId:0,RouteName:"",Difficulty:""}
     }
   }
onSaveRoute() {
     console.log(this.state.route);
      this.props.onHide(this.state.route);

    //this.props.save(this.state.route)
}
onChangeRouteName() {
    this.state.route.RouteName = event.target.value;
}
onChangeDifficulty() {
   this.state.route.Difficulty = event.target.value;
}
componentDidMount() {
  let newState =  this.state
  newState.route = this.props.route;

  this.setState(newState);
}
componentDidUpdate(){
  if (this.state.route.RouteId != this.props.route.RouteId ) {
    let newState =  this.state
    newState.route = this.props.route;
    this.setState(newState);
  }
}

 render(){
      let RouteId = this.state.route.RouteId;
      let RouteName =  this.state.route.RouteName
      let Difficulty = this.state.route.Difficulty

      if(RouteId == 0)
      {
        RouteName = ""
        Difficulty = ""
      }

     return(
        
        <Modal
          {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
         >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Route Information
        </Modal.Title>
      </Modal.Header> 
      <Modal.Body>

      <Form.Floating className="mb-3">
        <Form.Control
          id="floatingInputCustom"
          type="text"
          placeholder="ThisRoute"
          onChange={this.onChangeRouteName.bind(this)} 
          defaultValue={RouteName}
        />
        <label htmlFor="floatingInputCustom">RouteName</label>
      </Form.Floating>
      <Form.Floating className="mb-3">
        <Form.Control
          id="floatingInputCustom"
          type="number"
          placeholder="1"
          onChange={this.onChangeDifficulty.bind(this)} 
          defaultValue={Difficulty}
        />
        <label htmlFor="floatingInputCustom">Diffciulty</label>
      </Form.Floating>
      </Modal.Body>
      <ModalFooter>
      <Button  onClick={() => this.onSaveRoute()} variant="primary" type="button">
        Save Route
      </Button>
      
      </ModalFooter>


    </Modal>
     )

    }
 }
 export default  RouteEditorModal