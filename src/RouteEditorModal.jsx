import React, { Component,useEffect } from 'react';
import {Modal,Button,Row,Col,Form, ModalFooter} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

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
onChangeRouteId() {
    this.state.route.RouteId = event.target.value;
}
onChangeRouteName() {
    this.state.route.RouteName = event.target.value;
}
onChangeDifficulty() {
   this.state.route.Difficulty = event.target.value;
}
componentDidMount() {
  let newState =  JSON.parse(JSON.stringify(this.state))
  newState.route = JSON.parse(JSON.stringify(this.props.route));
  this.setState(newState);
}
componentDidUpdate(){
  if (this.state.route.RouteId != this.props.route.RouteId ) {
    let newState =  JSON.parse(JSON.stringify(this.state))
    newState.route = JSON.parse(JSON.stringify(this.props.route));
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
      <Form>
      <Form.Group as={Row} className="mb-3" controlId="formHorizontalRouteId">
        <Form.Label column="lg" lg={2}>
          RouteId
        </Form.Label>
        <Col sm={10}>
          <Form.Control size="lg" type="number"  onChange={this.onChangeRouteId.bind(this)} defaultValue={RouteId}  readOnly={true}/>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formHorizontalRouteName">
        <Form.Label column="lg"  lg={2}>
          RouteName
        </Form.Label>
        <Col sm={10}>
          <Form.Control  size="lg" onChange={this.onChangeRouteName.bind(this)} defaultValue={RouteName} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formHorizontalDifficulty">
        <Form.Label column="lg"  lg={2}>
          Difficulty
        </Form.Label>
        <Col sm={10}>
          <Form.Control  size="lg" type="number" onChange={this.onChangeDifficulty.bind(this)} defaultValue={Difficulty}/>
        </Col>
      </Form.Group>

      <Button   onClick={() => this.onSaveRoute()} variant="primary" type="button">
        Save Route
      </Button>
    </Form>
      </Modal.Body>
    </Modal>
     )

    }
 }
 export default  RouteEditorModal