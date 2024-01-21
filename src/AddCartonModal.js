import React, { Component, useState } from 'react';
import { Modal, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import DateComponent from './Component/DateComponent';
import ClientDDLComponent from './Component/DropDownComponent';
import { variables } from './Variables';
import AlertComponent from './Component/AlertComponent';
// import TableComponent from './Component/TableComponent';


export class AddCartonModal extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            rate: 0,
            totalamount: 0,
            quantity: 0
        };

        // this.initialState = { rate: 0,
        //     totalamount:0,
        //     quantity:0
        // };

        this.onChangeRate = this.onChangeRate.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    onChangeRate = (event) => {
        this.setState({ rate: event.target.value });
        this.setState({ totalamount: event.target.value * this.state.quantity });
    }

    onChangeQuantity(event) {
        this.setState({ quantity: event.target.value });
        this.setState({ totalamount: event.target.value * this.state.rate });
    }

    componentDidUpdate(props, state) {  // runs everytime after component updates, the arguments props and state are previous props and state before update.
        // this check is important, you are doing set state inside componentDidUpdate it must be inside some condition
        // otherwise you will be stuck in infinite loop as component updates everytime state changes
        // if(state.initialValue!==this.state.initialValue){  // if initial value was changed(by function alpha) change final value too.
        //     console.log('input changed');  // just to see it working correctly, remove it later
        //     this.setState({ totalamount: this.state.initialValue * 10 });  // set final value to initial value * 10
        // }
    }

    closeModal = () => {
        //this.setState({ rate: 0 ,  quantity: 0 ,  totalamount: 0 }, () => { this.props.onHide()} );
        this.setState({ rate: 0, quantity: 0, totalamount: 0 }); this.props.onHide();

        //  this.setState({...this.state}, () => { this.props.onHide() });
    };

    handleSubmit(event) {
        event.preventDefault();
        fetch(variables.REACT_APP_API + 'carton', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: event.target.CartonId.value,
                BillingDate: event.target.BillingDate.value,
                Quantity: event.target.Quantity.value,
                TotalAmount: event.target.TotalAmount.value,
                Payment: event.target.Payment.value,
                Rate: event.target.Rate.value,
                UnloadingCharge: event.target.UnloadingCharge.value,
                ClientId: event.target.ClientId.value,
                PaymentDate: new Date()

            })
        })
            .then(res => res.json())
            .then((result) => {
                //<AlertComponent isSuccess={true} />
                alert(result);
            },
                (error) => {
                    //<AlertComponent isSuccess={false}/>
                    alert('Failed');
                })
    }

    render() {
        const { rate, totalamount, quantity } = this.state;
        return (
            <div className="container">

                <Modal
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Edit Carton
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>

                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="CartonId">
                                        <Form.Label className="font-weight-bold" >CartonId</Form.Label>
                                        <Form.Control type="text" name="CartonId" required
                                            disabled
                                            defaultValue={this.props.cartonid}
                                            placeholder="CartonId" />
                                    </Form.Group>
                                    <Form.Group controlId="ClientId">
                                        <Form.Label>Client</Form.Label>
                                        {/* <Form.Control type="select" >
                                            {this.props.clientList.map(client =>
                                                <option
                                                    key={client.Id}>{client.ClientName}</option>
                                            )}
                                        </Form.Control> */}

                                        <ClientDDLComponent
                                            selectedValue={this.props.clientid}
                                            firstValue="Select Client"
                                            listItems={this.props.clientlist} />
                                    </Form.Group>

                                    <Form.Group controlId="BillingDate">
                                        <Form.Label>Billing Date</Form.Label>
                                        <DateComponent date={this.props.billingdate} />
                                    </Form.Group>

                                    <Form.Group controlId="Quantity">
                                        <Form.Label>Quantity</Form.Label>
                                        <Form.Control type="number" name="Quantity" required
                                            defaultValue={this.props.quantity}
                                            placeholder="Quantity" onChange={this.onChangeQuantity} />
                                    </Form.Group>

                                    <Form.Group controlId="Rate">
                                        <Form.Label>Rate</Form.Label>
                                        <Form.Control type="decimal" name="Rate" required
                                            defaultValue={this.props.rate}
                                            placeholder="Rate" onChange={this.onChangeRate} />
                                    </Form.Group>
                                    <Form.Group controlId="TotalAmount">
                                        <Form.Label>Total Amount</Form.Label>
                                        <Form.Control type="decimal" name="Total Amount" required disabled
                                            Value={this.state.totalamount}
                                            placeholder="Total Amount" />
                                    </Form.Group>
                                    <Form.Group controlId="Payment">
                                        <Form.Label>Payment</Form.Label>
                                        <Form.Control type="" name="Payment" required
                                            defaultValue={this.props.payment}
                                            placeholder="Payment" />
                                    </Form.Group>

                                    <Form.Group controlId="UnloadingCharge">
                                        <Form.Label>Unloading Charge</Form.Label>
                                        <Form.Control type="" name="UnloadingCharge" required
                                            defaultValue={this.props.unloadingcharges}
                                            placeholder="Unloading Charge" />
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
                        {/* <Button variant="danger" onClick={this.props.onHide}>Close</Button> */}
                        <Button onClick={() => {
                            this.closeModal();
                        }
                        }>Close</Button>
                    </Modal.Footer>

                </Modal>
                {/* <TableComponent/> */}
            </div>


        )
    }
}