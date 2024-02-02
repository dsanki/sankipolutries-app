import React, {useState} from 'react'
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import moment from 'moment';
import DateComponent from './../DateComponent'

function LotFormComponent(props) {

    const dateFromDateString = (dateString) => {
        return moment(new Date(dateString)).format('YYYY-MM-DDT00:00:00.000');
    };

    const dateForPicker = (dateString) => {
        return dateString!==""? moment(new Date(dateString)).format('YYYY-MM-DD'):moment(new Date()).format('YYYY-MM-DD');
    };

    const changeValues = ({ name, value }) => {
       // setInitialvalues({ ..._initialvalues, [name]: value });
       // setPreGame(initialvalues);
      }

   const handleSubmit = (e) => {
        e.preventDefault();

        const id= e.target.Id.value;
        const title= e.target.LotName.value;
        const startdate= e.target.StartDate.value;
        const enddate= e.target.EndDate.value;
        props.handleSubmit(id,title,startdate,enddate);
        //props.childToParent (id,title,startdate,enddate);
    }

    const onChangeValues = (e) => {
       // setLotDetails({ ...lotdetails, [e.target.name]: e.target.value });
    }
  return (
    <div>
       <Form onSubmit={handleSubmit}>
                                <Row className="mb-12">
                                    <Form.Group controlId="Id" as={Col} hidden>
                                        <Form.Label hidden>Id</Form.Label>
                                        <Form.Control type="text" name="Id" required
                                            disabled
                                            defaultValue={props.post.lotid}
                                            placeholder="Id"
                                            hidden />
                                    </Form.Group>
                                    <Form.Group controlId="LotName" as={Col} >
                                        <Form.Label>Lot Name</Form.Label>
                                        <Form.Control type="text" name="LotName" required 
                                        defaultValue={props.post.lotname}  
                                        onChange={onChangeValues}
                                            placeholder="LotName" />
                                    </Form.Group>

                                  
                                    <Form.Group controlId="StartDate" as={Col} >
                                        <Form.Label>Start Date</Form.Label>
                                        <DateComponent date={props.post.startdate} />
                                    </Form.Group>

                                    <Form.Group controlId="EndDate" as={Col} >
                                        <Form.Label>End Date</Form.Label>
                                        <DateComponent date={props.post.enddate} />
                                    </Form.Group>

                                    <Form.Group>
                                        <Button variant="primary" type="submit" style={{ marginTop: "10px" }} >
                                        {props.buttonLabel}
                                        </Button>
                                        {/* <Button variant="danger" style={{ marginTop: "10px", marginLeft: "10px" }} onClick={() => {
                                            closeModal();
                                        }
                                        }>Close</Button> */}
                                    </Form.Group>
                                </Row>
                            </Form>
    </div>
  )
}

export default LotFormComponent
