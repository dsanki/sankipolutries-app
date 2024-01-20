import React, { useState, useEffect } from 'react'
import { variables } from './../../Variables'
import { Button, ButtonToolbar, Table } from 'react-bootstrap'; 
import Moment from 'moment';
import { EditCartonModal } from './../../EditCartonModal';
import { AddCartonModal } from './../../AddCartonModal';

const CartonList = () => {
    const [cartons, setUserData] = useState([]);
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [cartonId, setCartonId] = useState(0);
    const [editModalShow ,setEditModalShow] = useState(false);
    const [addModalShow ,setAddModalShow] = useState(false);

    // const [addModalClose ,setaddModalClose] = useState(false);
    // const [editModalClose ,seteditModalClose] = useState(false);
    //editModalShow

    // const initialValues = {  quanTity: '', billingDate: '', rate: '',totalAmount: '', payment: '', paymentDate: '', unloadingCharges: '', clientid: '', cartons: [], clients: [] };
    // const [values, setValues] = useState(initialValues); 
    const [ quanTity, billingDate, rate, totalAmount, payment, paymentDate, unloadingCharges, clientid ] = useState();
    
   // this.state = { cartons: [], addModalShow: false, editModalShow: false, clients: [] ,quanTity, billingDate, rate, totalAmount, payment, paymentDate, unloadingCharges, clientid}

    //

    const APIURL = variables.REACT_APP_API + 'carton';

    useEffect(() => {
        fetch(APIURL)
            .then((res) => res.json())
            .then((data) => {
                setUserData(data);
                //this.setState({ cartons: data });
                setTotalPages(Math.ceil(data.length / 5));
            });

            fetch(variables.REACT_APP_API + 'client')
            .then((res) => res.json())
            .then((data) => {
                setClients(data);
                //this.setState({ clients: data });
            })

    }, [])

    // current pages function
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }
    const handleNextClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }
    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }
    const preDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = cartons.slice(startIndex, endIndex);

    let addModalClose = () => this.setState({ addModalShow: false });
    let editModalClose = () => this.setState({ editModalShow: false });

    return (
      
       
        <>
        
            <p>Learn Coding with Bhai React Pagination </p>
            {<Table className="mt-4" striped bordered hover size="sm">
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
                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((carton) => {
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
                                        <Button className="mr-2" variant="info" style={{ marginRight: "17.5px" }} onClick={() => {
    //this.setEditModalShow({ editModalShow: true }); 
   setEditModalShow({editModalShow:true});
   setEditModalShow({cartonId:carton.Id});
   this.setState({
        //editModalShow: true,
        //cartonId: carton.Id,
        quanTity: carton.Quantity,
        billingDate: carton.BillingDate,
        rate: carton.Rate,
        totalAmount: carton.TotalAmount,
        payment: carton.Payment,
        paymentDate: carton.PaymentDate,
        unloadingCharges: carton.UnloadingCharge,
        clientid: carton.ClientId,
        clientList: clients

    })
  }}>
                                                Edit
                                            </Button>

                                            {/* <Button className="mr-2" variant="info" style={{ marginRight: "17.5px" }}
                                                onClick={() => 
                                                    this.setState({
                                                    //editModalShow: true,
                                                    cartonId: carton.Id,
                                                    quanTity: carton.Quantity,
                                                    billingDate: carton.BillingDate,
                                                    rate: carton.Rate,
                                                    totalAmount: carton.TotalAmount,
                                                    payment: carton.Payment,
                                                    paymentDate: carton.PaymentDate,
                                                    unloadingCharges: carton.UnloadingCharge,
                                                    clientid: carton.ClientId,
                                                    clientList: clients

                                                }
                                                )}>
                                                Edit
                                            </Button> */}

                                            <Button className="mr-2" variant="danger" size="sm"
                                                onClick={() => this.deleteCarton(carton.Id)}>
                                                Delete
                                            </Button>

                                            <EditCartonModal show={editModalShow}
                                                onHide={editModalClose}
                                                cartonid={cartonId}
                                                quantity={quanTity}
                                                billingdate={billingDate}
                                                rate={rate}
                                                totalamount={totalAmount}
                                                payment={payment}
                                                paymentdate={paymentDate}
                                                unloadingcharges={unloadingCharges}
                                                clientid={clientid}
                                                clientList={clients}
                                            />
                                        </ButtonToolbar>
                                    </td>

                                </tr>

                            )
                        }) : ''
                    }
                </tbody>
            </Table >

            }
            <button
                onClick={handlePrevClick}
                disabled={preDisabled}
            >
                Prev
            </button>
            {
                Array.from({ length: totalPages }, (_, i) => {
                    return (
                        <button
                            onClick={() => handlePageChange(i + 1)}
                            key={i}
                            disabled={i + 1 === currentPage}
                        >
                            {i + 1}
                        </button>
                    )
                })
            }


            <button
                onClick={handleNextClick}
                disabled={nextDisabled}
            >
                Next
            </button>

        </>
    )
}


export default CartonList;