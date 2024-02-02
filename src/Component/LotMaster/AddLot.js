import React, { useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import moment from 'moment';
import DateComponent from './../DateComponent';
import Feedback from 'react-bootstrap/Feedback'

const AddLot = (props) => {

    const [validated, setValidated] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        else {

            fetch(variables.REACT_APP_API + 'LotMaster', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    LotName: e.target.LotName.value,
                    StartDate: e.target.StartDate.value,
                    EndDate: e.target.EndDate.value,
                    CreatedDate:new Date()
                })
            }).then(res => res.json())
                .then((result) => {
                    if(result.StatusCode===200 ||result.StatusCode==="OK"){
                        closeModal();
                        props.showAlert("Successfully added", "info")
                    }
                    else
                    {
                        props.showAlert("Error occurred!!", "danger")
                    }
                   
                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    });
        }

        setValidated(true);
    }

    const dateFromDateString = (dateString) => {
        return moment(new Date(dateString)).format('YYYY-MM-DDT00:00:00.000');
    };

    const dateForPicker = (dateString) => {
        return dateString !== "" ? moment(new Date(dateString)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');
    };

    const closeModal = () => {
        setValidated(false);
        props.onCountAdd(props.count);
        props.onHide();
    };

    return (
        <div className="container" id="exampleModal">
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add Lot
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12}>

                            <div>
                                <Form onSubmit={handleSubmit} noValidate validated={validated}>
                                    <Row className="mb-12">
                                        <Form.Group controlId="LotName" as={Col} >
                                            <Form.Label>Lot Name</Form.Label>
                                            <Form.Control type="text" name="LotName" required
                                                placeholder="LotName" />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter Lot name
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="StartDate" as={Col} >
                                            <Form.Label>Start Date</Form.Label>
                                            <DateComponent date={props.startdate} />
                                        </Form.Group>

                                        <Form.Group controlId="EndDate" as={Col} >
                                            <Form.Label>End Date</Form.Label>
                                            <DateComponent date={props.enddate} />
                                        </Form.Group>

                                        <Form.Group>
                                            <Button variant="primary" type="submit" style={{ marginTop: "10px" }} >
                                                Add
                                            </Button>
                                            <Button variant="danger" style={{ marginTop: "10px", marginLeft: "10px" }} onClick={() => {
                                                closeModal();
                                            }
                                            }>Close</Button>
                                        </Form.Group>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AddLot
