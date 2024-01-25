import React, { Component, useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import DateComponent from '../DateComponent';

function AddLotComponent(props) {

    const initialvalues = {
        lotid: props.Id,
        lotname: props.LotName,
        startdate: props.StartDate,
        enddate: props.EndDate
    };

    const [lot, setLotData] = useState(initialvalues);

    const closeModal = () => {
        props.onCountAdd(props.count);
        props.onHide();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(variables.REACT_APP_API + 'LotMaster', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: e.target.Id.value,
                LotName: e.target.LotName.value,
                StartDate: e.target.StartDate.value,
                EndDate: e.target.EndDate.value

            })
        })
            .then(res => res.json())
            .then((result) => {
                alert(result);
            },
                (error) => {
                    alert('Failed');
                })
    };
    
    return (
        <div className="container">

            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Lot
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={4}>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="Id">
                                    <Form.Label hidden>Id</Form.Label>
                                    <Form.Control type="text" name="Id" required
                                        disabled
                                        defaultValue={props.lotid}
                                        placeholder="Id"
                                        hidden />
                                </Form.Group>
                                <Form.Group controlId="LotName">
                                    <Form.Label>Lot Name</Form.Label>
                                    <Form.Control type="text" name="LotName" required
                                        defaultValue={props.lotname}
                                        placeholder="LotName" />
                                </Form.Group>

                                <Form.Group controlId="StartDate">
                                    <Form.Label>Start Date</Form.Label>
                                    <DateComponent date={props.startdate} />
                                </Form.Group>
                                <Form.Group controlId="EndDate">
                                    <Form.Label>End Date</Form.Label>
                                    <DateComponent date={props.enddate} />
                                </Form.Group>

                                <Form.Group>
                                    <Button variant="primary" type="submit" style={{ marginTop: "10px" }}>
                                        Add
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={() => {
                        closeModal();
                    }
                    }>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AddLotComponent

