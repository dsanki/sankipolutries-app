import React, { Component, useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import DateComponent from '../DateComponent';
import Feedback from 'react-bootstrap/Feedback'

function AddChicksMasterComponent(props) {

    // const schema = yup.object().shape({
    //     chicks: yup.string().required()
    //     // lastName: yup.string().required(),
    //     // username: yup.string().required(),
    //     // city: yup.string().required(),
    //     // state: yup.string().required(),
    //     // zip: yup.string().required(),
    //     // file: yup.mixed().required(),
    //     // terms: yup.bool().required().oneOf([true], 'terms must be accepted'),
    //   });
    const [schicks, setChicks] = useState(props.chicks);
    const [sextrachicks, setExtraChicks] = useState(props.extrachicks);
    const [stotalchicks, setTotalChicks] = useState(props.totalchicks);
    const [validated, setValidated] = useState(false);


    const [smortality, setMortality] = useState(props.mortality);
    const [slambchicks, setLambChicks] = useState(props.lambchicks);
    const [sduechicks, setDueChicks] = useState(props.duechicks);

    //setChicks(props.chicks);
    //setExtraChicks(props.extrachicks );

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
        setValidated(false);
        props.onCountAdd(props.count);
        props.onHide();
    };

    // setValidated(true);


    const onMortalityChange = (e) => {

        setMortality(e.target.value);
        setDueChicks(Number(e.target.value) + Number(slambchicks));
    }

    const onLambChange = (e) => {

        setLambChicks(e.target.value);
        setDueChicks(Number(e.target.value) + Number(smortality));
    }

    const onChangeChicks = (e) => {

        setChicks(e.target.value);
        setExtraChicks(Math.round(e.target.value * 0.05));
        setTotalChicks(Number(e.target.value) + Math.round(Number(e.target.value * 0.05)));
    }

    const handleSubmit = (e) => {

        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            //return;
        }

        setValidated(true);




        fetch(variables.REACT_APP_API + 'ChicksMaster', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: e.target.id.value,
                Date: e.target.date.value,
                Chicks: e.target.Chicks.value,
                ExtraChicks: e.target.ExtraChicks.value,
                TotalChicks: e.target.TotalChicks.value,
                Mortality: e.target.Mortality.value,
                LambChicks: e.target.LambChicks.value,
                DueChicks: e.target.DueChicks.value,
                TotalAmount: e.target.TotalAmount.value,
                Rate: e.target.Rate.value,
                Paid: e.target.Paid.value,
                Due: e.target.Due.value,
                PaymentDate: e.target.PaymentDate.value
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
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        Add Chicks
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12}>
                            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                                <div class="form-group row">
                                    <Form.Label hidden>Id</Form.Label>
                                    <div class="col-sm-10">
                                        <Form.Control type="text" name="Id" required
                                            disabled
                                            defaultValue={props.id}
                                            placeholder="Id"
                                            hidden />
                                    </div>
                                </div>

                                {/* <Form.Group as={Row} className="mb-3" controlId="date">
                                    <Form.Label column sm={3}>Date</Form.Label>
                                    <Col sm={4}>
                                        <DateComponent date={props.date} />
                                    </Col>
                                </Form.Group> */}



                                <Row className="mb-12">
                                    <Form.Group as={Col} controlId="Chicks">
                                        <Form.Label>Chicks</Form.Label>
                                        <Col>
                                            <Form.Control type="number" name="Chicks" required
                                                defaultValue={schicks}
                                                placeholder="Chicks" onChange={onChangeChicks} />

                                            <Form.Control.Feedback type="invalid">
                                                Please provide a chicks number.
                                            </Form.Control.Feedback>
                                        </Col>

                                    </Form.Group>
                                    <Form.Group controlId="ExtraChicks" as={Col} >
                                        <Form.Label>Extra chicks</Form.Label>
                                        <Col >
                                            <Form.Control type="number" name="ExtraChicks" required
                                                value={sextrachicks}
                                                placeholder="Extra chicks" />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide total extra chicks number.
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group controlId="TotalChicks" as={Col}>
                                        <Form.Label>Total chicks</Form.Label>
                                        <Form.Control type="number" name="TotalChicks" required
                                            value={stotalchicks}
                                            placeholder="Total chicks" />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide total chicks number.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                </Row>

                                <Row className="mb-12">
                                    <Form.Group controlId="Mortality" as={Col}>
                                        <Form.Label>Mortality</Form.Label>
                                        <Form.Control type="number" name="Mortality" required
                                            value={smortality}
                                            placeholder="Mortality" onChange={onMortalityChange}/>
                                        <Form.Control.Feedback type="invalid">
                                            Please provide mortality.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="LambChicks" as={Col}>
                                        <Form.Label>Lamb chicks</Form.Label>
                                        <Form.Control type="number" name="LambChicks" required
                                            value={slambchicks}
                                            placeholder="Lamb chicks" onChange={onLambChange} />
                                    </Form.Group>
                                    <Form.Group controlId="DueChicks" as={Col}>
                                        <Form.Label>Due chicks</Form.Label>
                                        <Form.Control type="number" name="DueChicks" required
                                            value={sduechicks}
                                            placeholder="Due chicks" />
                                    </Form.Group>
                                </Row>

                                <Row className="mb-12">
                                <Form.Group as={Col} controlId="date">
                                        <Form.Label>Date</Form.Label>
                                        <DateComponent date={props.date} />
                                    </Form.Group>
                                    <Form.Group controlId="Rate" as={Col} >
                                        <Form.Label>Rate</Form.Label>

                                        <Form.Control type="number" name="Rate" required
                                            defaultValue={props.Rate}
                                            placeholder="Rate" />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide rate.
                                        </Form.Control.Feedback>

                                    </Form.Group>
                                   
                                </Row>

                                <Row className="mb-12">
                                    <Form.Group controlId="TotalAmount" as={Col}>
                                        <Form.Label>Total amount</Form.Label>
                                        <Form.Control type="number" name="TotalAmount" required
                                            defaultValue={props.TotalAmount}
                                            placeholder="Total amount" />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide total.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="Paid" as={Col}>
                                        <Form.Label>Paid</Form.Label>
                                        <Form.Control type="number" name="Paid" required
                                            defaultValue={props.Paid}
                                            placeholder="Paid" />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide paid amount.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="Due" as={Col}>
                                        <Form.Label>Due</Form.Label>
                                        <Form.Control type="number" name="Due" required
                                            defaultValue={props.Due}
                                            placeholder="Due" />
                                    </Form.Group>
                                </Row>
                                <Form.Group><br /></Form.Group>

                                <Form.Group controlId="PaymentDate" as={Row} className="mb-3">
                                    <Form.Label column sm={3}>PaymentDate</Form.Label>
                                    <Col sm={4}>
                                        <DateComponent date={props.PaymentDate} />
                                    </Col>
                                </Form.Group>

                                <Form.Group>
                                    <Button variant="primary" type="submit" style={{ marginTop: "10px" }}>
                                        Add
                                    </Button>

                                    <Button variant="danger" style={{ marginTop: "10px", marginLeft: "10px" }} onClick={() => {
                                        closeModal();
                                    }
                                    }>Close</Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default AddChicksMasterComponent

