import React, { Component, useEffect } from 'react';
import { variables } from './Variables';


import { Button, ButtonToolbar, Table } from 'react-bootstrap'; 
import { EditCartonModal } from './EditCartonModal';
import { AddCartonModal } from './AddCartonModal';
import Moment from 'moment';
import Pages from './Component/Pages';
import CartonList from './Component/Carton/CartonList';
import {useNavigate } from 'react-router-dom'


export class Carton extends Component {

    constructor(props) {
        super(props);
        this.state = { cartons: [], addModalShow: false, editModalShow: false, clients: [] }
    }

    //process.env.REACT_APP_API 
    refreshList() {
        fetch(variables.REACT_APP_API + 'carton')
            .then(response => response.json())
            .then(data => {
                this.setState({ cartons: data });
                //this.setState({totalPages:Math.ceil(data.length / 20)});
                console.log(3);
            });

       

    }

    getClientList()
    {
        fetch(variables.REACT_APP_API + 'client')
        .then(responseClient => responseClient.json())
        .then(dataClient => {
            this.setState({ clients: dataClient });
            //console.log(dataClient);
        });

    }
    // refreshList(){
    //     fetch(process.env.REACT_APP_API+'carton')
    //     .then(response=>response.json())
    //     .then(data=>{
    //         this.setState({cartons:data});
    //     });
    // }

    componentDidMount() {
      
        this.refreshList();
       this.getClientList();
    }

    componentDidUpdate() {
        if(this.addModalShow==false || this.state.editModalShow==false)
        {
            this.refreshList();
            this.getClientList();
        }
        
        
    }

    // componentDidUpdate(prevProps, prevState) {
    //     // only update chart if the data has changed
    //     if (prevProps.data !== this.props.data) {
    //         this.refreshList();
    //         console.log(2);
    //     }
    //   }

    

    deleteCarton(cartonid) {
        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'carton/' + cartonid, {
                method: 'DELETE',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        }
    }


    render() {
        const { cartons, cartonId, quanTity, billingDate, rate, totalamount, payment, paymentDate, unloadingCharges, clients, clientid } = this.state;

        let addModalClose = () => this.setState({ addModalShow: false });
        let editModalClose = () => this.setState({ editModalShow: false });
        return (
            <div>
                <h2>welcome to Carton Page</h2>
                <ButtonToolbar>
                    <Button className="mr-2" variant="info"
                        onClick={() => this.setState({
                            addModalShow: true,
                            cartonId: 0,
                            quanTity: 0,
                            billingDate: new Date(),
                            rate: 0,
                            totalamount: 0,
                            payment: 0,
                            paymentDate: new Date(),
                            unloadingCharges: 0,
                            clientid: 0,
                            clientlist: clients

                        })}>
                        Add Carton
                    </Button>
                    <AddCartonModal show={this.state.addModalShow}
                        onHide={addModalClose}
                        cartonid={cartonId}
                        quantity={quanTity}
                        billingdate={billingDate}
                        rate={rate}
                        totalamount={totalamount}
                        payment={payment}
                        paymentdate={paymentDate}
                        unloadingcharges={unloadingCharges}
                        clientid={clientid}
                        clientlist={clients}
                    />
                </ButtonToolbar>
                {
                    <>
                    <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr align='center'>
                            <th>Quantity</th>
                            <th>Billing Date</th>
                            <th>Client Name</th>
                            <th>Rate</th>
                            <th>Total Amount</th>
                            <th>Payment</th>
                            <th>Payment Date</th>
                            <th>Unloading Charge</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cartons.map(c => c.Id == cartonId)
                        }
                        {
                            
                            cartons && cartons.length > 0 ? cartons.map((carton) => {

                                const filterByClientId = clients.filter((c) => c.Id === carton.ClientId);
                                const filterByClientName = filterByClientId.length > 0 ? filterByClientId[0].ClientName : "";
                                return (
                                    <tr key={carton.Id} align='center'>
                                        <td align='center'>{carton.Quantity}</td>
                                        <td align='center'>{Moment(carton.BillingDate).format('DD-MMM-YYYY')}</td>
                                        <td>{filterByClientName}</td>
                                        {/* <td>{new Date(carton.BillingDate).toDateString("mmmm dS, yyyy")}</td> */}
                                        <td>{carton.Rate.toFixed(2)}</td>
                                        <td>{carton.TotalAmount.toFixed(2)}</td>
                                        <td>{carton.Payment.toFixed(2)}</td>
                                        <td>{Moment(carton.PaymentDate).format('DD-MMM-YYYY')}</td>
                                        {/* <td>{new Date(carton.PaymentDate).toLocaleString("es-US")}</td> */}
                                        <td>{carton.UnloadingCharge.toFixed(2)}</td>
                                        <td align='center'>
                                            <ButtonToolbar >
                                                <Button className="mr-2" variant="info" style={{ marginRight: "17.5px" }} 
                                                    onClick={() => this.setState({
                                                        editModalShow: true,
                                                        cartonId: carton.Id,
                                                        quanTity: carton.Quantity,
                                                        billingDate: carton.BillingDate,
                                                        rate: carton.Rate,
                                                        totalamount: carton.TotalAmount,
                                                        payment: carton.Payment,
                                                        paymentDate: carton.PaymentDate,
                                                        unloadingCharges: carton.UnloadingCharge,
                                                        clientid: carton.ClientId,
                                                        clientlist: clients

                                                    })}>
                                                    Edit
                                                </Button>

                                                <Button className="mr-2" variant="danger" size="sm" 
                                                    onClick={() => this.deleteCarton(carton.Id)}>
                                                    Delete
                                                </Button>

                                                <EditCartonModal show={this.state.editModalShow}
                                                    onHide={editModalClose}
                                                    cartonid={cartonId}
                                                    quantity={quanTity}
                                                    billingdate={billingDate}
                                                    rate={rate}
                                                    totalamount={totalamount}
                                                    payment={payment}
                                                    paymentdate={paymentDate}
                                                    unloadingcharges={unloadingCharges}
                                                    clientid={clientid}
                                                    clientlist={clients}
                                                />
                                            </ButtonToolbar>
                                        </td>

                                    </tr>
                                )
                            }
                            ): ''
                        }
                    </tbody>

                </Table>
               
                </>
                }

            </div>
        )
    }
}