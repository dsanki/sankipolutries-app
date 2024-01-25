import React, { Component, useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import DateComponent from '../DateComponent';

function AddChicksMasterComponent(props) {

    const initialvalues = {
        id: props.id,
        date: props.date,
        chicks: props.chicks,
        extrachicks: props.extrachicks,
        totalchicks: props.totalchicks,
        mortality: props.mortality,
        lambChicks: props.lambchicks,
        dueChicks: props.duechicks,
        totalamount: props.totalamount,
        rate: props.rate,
        paid: props.paid,
        due: props.due,
        paymentdate: props.paymentdate
    };

    const [lot, setLotData] = useState(initialvalues);

    const closeModal = () => {
        props.onCountAdd(props.count);
        props.onHide();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(variables.REACT_APP_API + 'ChicksMaster', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: e.target.id.value,
                Date: e.target.date.value,
                Chicks: e.target.chicks.value,
                ExtraChicks: e.target.extrachicks.value,

                TotalChicks: e.target.totalchicks.value,
                Mortality: e.target.mortality.value,
                LambChicks: e.target.lambchicks.value,
                DueChicks: e.target.duechicks.value,

                TotalAmount: e.target.totalamount.value,
                Rate: e.target.rate.value,
                Paid: e.target.paid.value,
                Due: e.target.due.value,
                PaymentDate: e.target.paymentdate.value

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
                                        defaultValue={props.id}
                                        placeholder="Id"
                                        hidden />
                                </Form.Group>

                                <Form.Group controlId="Date">
                                    <Form.Label>Date</Form.Label>
                                    <DateComponent date={props.date} />
                                </Form.Group>

                                <Form.Group controlId="Chicks">
                                    <Form.Label>Chicks</Form.Label>
                                    <Form.Control type="text" name="Chicks" required
                                        defaultValue={props.Chicks}
                                        placeholder="Chicks" />
                                </Form.Group>
                                <Form.Group controlId="ExtraChicks">
                                    <Form.Label>ExtraChicks</Form.Label>
                                    <Form.Control type="text" name="ExtraChicks" required
                                        defaultValue={props.ExtraChicks}
                                        placeholder="ExtraChicks" />
                                </Form.Group>
                                <Form.Group controlId="TotalChicks">
                                    <Form.Label>TotalChicks</Form.Label>
                                    <Form.Control type="text" name="TotalChicks" required
                                        defaultValue={props.TotalChicks}
                                        placeholder="TotalChicks" />
                                </Form.Group>
                                <Form.Group controlId="Mortality">
                                    <Form.Label>Mortality</Form.Label>
                                    <Form.Control type="text" name="Mortality" required
                                        defaultValue={props.Mortality}
                                        placeholder="Mortality" />
                                </Form.Group>
                                <Form.Group controlId="LambChicks">
                                    <Form.Label>LambChicks</Form.Label>
                                    <Form.Control type="text" name="LambChicks" required
                                        defaultValue={props.LambChicks}
                                        placeholder="LambChicks" />
                                </Form.Group>
                                <Form.Group controlId="DueChicks">
                                    <Form.Label>DueChicks</Form.Label>
                                    <Form.Control type="text" name="DueChicks" required
                                        defaultValue={props.DueChicks}
                                        placeholder="DueChicks" />
                                </Form.Group>

                                <Form.Group controlId="Rate">
                                    <Form.Label>Rate</Form.Label>
                                    <Form.Control type="text" name="Rate" required
                                        defaultValue={props.Rate}
                                        placeholder="Rate" />
                                </Form.Group>

                                <Form.Group controlId="TotalAmount">
                                    <Form.Label>TotalAmount</Form.Label>
                                    <Form.Control type="text" name="TotalAmount" required
                                        defaultValue={props.TotalAmount}
                                        placeholder="TotalAmount" />
                                </Form.Group>

                                <Form.Group controlId="Paid">
                                    <Form.Label>Paid</Form.Label>
                                    <Form.Control type="text" name="Paid" required
                                        defaultValue={props.Paid}
                                        placeholder="Paid" />
                                </Form.Group>

                                <Form.Group controlId="Due">
                                    <Form.Label>Due</Form.Label>
                                    <Form.Control type="text" name="Due" required
                                        defaultValue={props.Due}
                                        placeholder="Due" />
                                </Form.Group>

                                <Form.Group controlId="PaymentDate">
                                    <Form.Label>PaymentDate</Form.Label>
                                    <DateComponent date={props.PaymentDate} />
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

export default AddChicksMasterComponent

