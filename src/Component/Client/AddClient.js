import React, { useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import moment from 'moment';
import DateComponent from '../DateComponent';
import Feedback from 'react-bootstrap/Feedback'

const AddClient = (props) => {

    const [validated, setValidated] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        else {

            fetch(variables.REACT_APP_API + 'Client', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    //'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    ClientName: e.target.ClientName.value,
                    ClientType: e.target.ClientType.value
                })
            }).then(res => res.json())
                .then((result) => {
                    if (result> 0|| result.StatusCode === 200 || result.StatusCode === "OK") {
                        closeModal();
                        props.showAlert("Successfully added", "info")
                    }
                    else {
                        props.showAlert("Error occurred!!", "danger")
                    }

                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    });
        }

        setValidated(true);
    }
    const [selectedValue, setDropdownValue] = useState(props.selectedValue);

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
                        Add client
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12}>

                            <div>
                                <Form onSubmit={handleSubmit} noValidate validated={validated}>
                                    <Row className="mb-12">
                                        <Form.Group controlId="ClientName" as={Col} >
                                            <Form.Label>Client name</Form.Label>
                                            <Form.Control type="text" name="ClientName" required
                                                placeholder="Client name" />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter client name
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        {/* <Form.Group controlId="ClientType" as={Col} >
                                            <Form.Label>Client Name</Form.Label>
                                            <Form.Control type="text" name="ClientType" required
                                                placeholder="ClientType" />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter Client type
                                            </Form.Control.Feedback>
                                        </Form.Group> */}

                                        <Form.Group controlId="ClientType" as={Col} >
                                            <Form.Label>Client type</Form.Label>
                                            <Form.Select aria-label="Default select example"
                                                onChange={(e) => setDropdownValue(e.target.value)} required>
                                                <option>--Select type--</option>
                                                {
                                                    props.clientTypes.map((item) => {
                                                        return (
                                                            <option
                                                                key={item.ProductId}
                                                                defaultValue={item.ProductId == null ? null : item.ProductId}
                                                                selected={item.ProductId === selectedValue}
                                                                value={item.ProductId}
                                                            >{item.ProductName}</option>
                                                        );
                                                    })
                                                }
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select client
                                            </Form.Control.Feedback>

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

export default AddClient
