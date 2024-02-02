import React, { useState, useEffect, useMemo } from 'react'
import { variables } from './../../Variables'
import { Button, ButtonToolbar, Table } from 'react-bootstrap';
import Moment from 'moment';
import EditCarton from './EditCarton';
import AddCarton from './AddCarton';
import { useNavigate } from 'react-router-dom'

const CartonList = (props) => {
    let history = useNavigate();
    const [cartons, setCartons] = useState([]);
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [cartonId, setCartonId] = useState(0);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [count, setCount] = useState(0);

    //const [_quanTity, setquanTity] = useState(0);
    const initialvalues = {
        cartonid: "",
        quanTity: "",
        billingDate: "",
        rate: "",
        totalAmount: "",
        payment: "",
        paymentDate: "",
        unloadingCharges: "",
        clientid: ""
    };

    const [cartonsdata, setCartonsData] = useState(initialvalues);

    const [quanTity, billingDate, rate, totalAmount, payment, paymentDate, unloadingCharges, clientid] = useState();

    const APIURL = variables.REACT_APP_API + 'carton';
    const obj = useMemo(() => ({ count }), [count]);
    // useEffect(() => {
    //     fetchClient();
    //     fetchCarton();
    // }, [])

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchClient();
            fetchCarton();
        }
        else {
            history("/login")
        }
    }, [obj]);


    const fetchClient = async () => {
        await fetch(variables.REACT_APP_API + 'client')
            .then(response => response.json())
            .then(data => {
                setClients(data);
            });
    }
    const fetchCarton = async () => {
        await fetch(variables.REACT_APP_API + 'carton')
            .then(response => response.json())
            .then(data => {
                setCartons(data);
                setCount(data.length);
                setTotalPages(Math.ceil(data.length / variables.PAGE_PAGINATION_NO));
            });
    }

    let addCount = (num) => {
        setCount(num + 1);
    };
    const deleteCarton = (cartonid) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'carton/' + cartonid, {
                method: 'DELETE',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then((result) => {
                    props.showAlert("Successfully deleted", "info")
                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    });

            addCount(count);
        }
    }

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

    const itemsPerPage =variables.PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = cartons.slice(startIndex, endIndex);

    // let addModalClose = () => setAddModalShow({ addModalShow: false });
    // let editModalClose = () => setEditModalShow({ editModalShow: false });

    let addModalClose = () => {
        setAddModalShow(false)
    };

    let editModalClose = () => {
        setEditModalShow(false)
    };

    return (


        <>

            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Welcome to Carton List Page</h2>
            </div>
            {<ButtonToolbar>
                <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => {
                        setAddModalShow({ addModalShow: true });
                        setCartonsData({ count: count });
                        
                    }}>Add Carton</Button>

                <AddCarton show={addModalShow}
                    onHide={addModalClose}
                    onCountAdd={addCount}
                    showAlert={props.showAlert}
                    clientlist={clients}
                />
            </ButtonToolbar>}
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
                                            <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => {
                                                setEditModalShow({ editModalShow: true });
                                                setEditModalShow({ cartonId: carton.Id });

                                                setCartonsData(prev => ({
                                                    ...prev,
                                                    cartonid:carton.Id,
                                                    quanTity: carton.Quantity,
                                                    billingDate: carton.BillingDate,
                                                    rate: carton.Rate,
                                                    totalAmount: carton.TotalAmount,
                                                    payment: carton.Payment,
                                                    paymentDate: carton.PaymentDate,
                                                    unloadingCharges: carton.UnloadingCharge,
                                                    clientid: carton.ClientId,
                                                    //clientList: clients,
                                                    count: count
                                                }
                                                ));
                                            }}> 

                                            </i>
                                            {localStorage.getItem('isadmin') === 'true' &&
                                                <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteCarton(carton.Id)}></i>}

                                          

                                            <EditCarton show={editModalShow}
                                                onHide={editModalClose}
                                                cartonid={cartonsdata.cartonid}
                                                quantity={cartonsdata.quanTity}
                                                billingdate={cartonsdata.billingDate}
                                                rate={cartonsdata.rate}
                                                totalamount={cartonsdata.totalAmount}
                                                payment={cartonsdata.payment}
                                                paymentdate={cartonsdata.paymentDate}
                                                unloadingcharges={cartonsdata.unloadingCharges}
                                                clientid={cartonsdata.clientid}
                                                clientlist={clients}
                                                onCountAdd={addCount}
                                                showAlert={props.showAlert}
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