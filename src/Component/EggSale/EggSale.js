import React, { useState, useEffect, useMemo,useContext } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment';
import {ErrorMessageHandle} from '../../Utility';

function EggSale(props) {

    let history = useNavigate();
    const { id } = useParams();

    //const _context = useContext(CommonContext);

    //const [custid, setSetCustId] = useState(_id);
    const [eggsalelist, setEggSaleList] = useState([]);
    const [customerdetails, setCustomerDetails] = useState([]);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [validated, setValidated] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        CustomerId: id,
        Quantity: 0,
        PurchaseDate: "",
        EggRate: 0,
        TotalCost: 0,
        Discount:0,
        FinalCost: 0,
        Paid: 0,
        Due: 0,
        Comments: "",
        CreatedOn: "",
        CreatedBy: "",
        ModifiedOn: "",
        ModifiedBy: ""
    };

    const [eggsaledata, setEggSaletData] = useState(initialvalues);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };



    const clickAddEggSale = () => {
        setAddModalShow({ addModalShow: true });
        setEggSaletData({
            modaltitle: "Add Egg Sale",
            Id: 0,
            CustomerId: id,
            Quantity: 0,
            PurchaseDate: "",
            EggRate: 0,
            TotalCost: 0,
            Discount:0,
            FinalCost: 0,
            Paid: 0,
            Due: 0,
            Comments: "",
            CreatedOn: new Date(),
            CreatedBy: localStorage.getItem("username"),
            ModifiedOn: "",
            ModifiedBy: ""
        })
    }

    const clickEditEggSale = (eggsale) => {
        setAddModalShow({ addModalShow: true });
        setEggSaletData({
            modaltitle: "Edit Egg Sale",
            Id: eggsale.Id,
            CustomerId: eggsale.CustomerId,
            Quantity: eggsale.Quantity,
            PurchaseDate: eggsale.PurchaseDate,
            EggRate: eggsale.EggRate,
            TotalCost: eggsale.TotalCost,
            Discount:eggsale.Discount,
            FinalCost: eggsale.FinalCost,
            Paid: eggsale.Paid,
            Due: eggsale.Due,
            Comments: eggsale.Comments,
            CreatedOn: eggsale.CreatedOn,
            CreatedBy: eggsale.CreatedBy,
            ModifiedOn: new Date(),
            ModifiedBy: localStorage.getItem("username")
        })
    }

    const quantityChange = (e) => {
        setEggSaletData({ ...eggsaledata, Quantity: e.target.value , TotalCost: e.target.value*eggsaledata.EggRate,FinalCost: (e.target.value*eggsaledata.EggRate)-eggsaledata.Discount});
    }
    const purchaseDateChange = (e) => {
        setEggSaletData({ ...eggsaledata, PurchaseDate: e.target.value });
    }
    const eggRateChange = (e) => {
        setEggSaletData({ ...eggsaledata, EggRate: e.target.value, TotalCost:e.target.value*eggsaledata.Quantity,FinalCost: (e.target.value*eggsaledata.Quantity)-eggsaledata.Discount});

    }

    const totalCostChange = (e) => {
    }
    const discountChange = (e) => {
        setEggSaletData({ ...eggsaledata, Discount: e.target.value ,FinalCost: (eggsaledata.TotalCost-e.target.value)});
    }

    const finalCostChange = (e) => {
        setEggSaletData({ ...eggsaledata, FinalCost: e.target.value });
    }

    const paidChange = (e) => {
        setEggSaletData({ ...eggsaledata, Paid: e.target.value ,Due:eggsaledata.FinalCost-e.target.value});
    }

    const dueChange = (e) => {
    }

    const commentsChange = (e) => {
        setEggSaletData({ ...eggsaledata, Comments: e.target.value });
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            setEggSaletData({ ...eggsaledata, CustomerId: id});
            fetchEggSaleDetails(id);
            fetchCustomerDetails(id);
        }
        else {
            history("/login")
        }
    }, [obj]);


    const fetchEggSaleDetails = async (custid) => {
        fetch(variables.REACT_APP_API + 'EggSale/GetEggSaleDetailsByCustomerId?CustId=' + custid,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.StatusCode === 200) 
                {
                    setEggSaleList(data.Result);
                }
                else{
                    ErrorMessageHandle(data.StatusCode, props.showAlert);
                }
            });
    }

    const fetchCustomerDetails = async (custid) => {
        fetch(variables.REACT_APP_API + 'Customer/GetCustomerById?id=' + custid,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.StatusCode === 200) 
                {
                    setCustomerDetails(data.Result);
                }
                else{
                    ErrorMessageHandle(data.StatusCode, props.showAlert);
                }
            });
    }

    // const clickEditEggSale=()=>{

    // }

    const deleteEggSale=(id)=>{
        
    }


    const dateForPicker = (dateString) => {
        return moment(new Date(dateString)).format('YYYY-MM-DD')
    };

    let addCount = (num) => {
        setCount(num + 1);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        fetch(variables.REACT_APP_API + 'EggSale/EggSaleAdd', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                Id: eggsaledata.Id,
                CustomerId: eggsaledata.CustomerId,
                Quantity: eggsaledata.Quantity,
                PurchaseDate: eggsaledata.PurchaseDate,
                EggRate: eggsaledata.EggRate,
                TotalCost: eggsaledata.TotalCost,
                Discount: eggsaledata.Discount,
                FinalCost: eggsaledata.FinalCost,
                Paid: eggsaledata.Paid,
                Due: eggsaledata.Due,
                Comments:eggsaledata.Comments,
                CreatedOn:eggsaledata.CreatedOn,
                CreatedBy:eggsaledata.CreatedBy,
                ModifiedOn:eggsaledata.ModifiedOn,
                ModifiedBy:eggsaledata.ModifiedBy

            })
        }).then(res => res.json())
            .then((result) => {

                if (result.StatusCode === 200) 
                {
                    addCount(count);
                    setAddModalShow(false);
                    props.showAlert("Successfully added", "info")
                }
                else{
                    ErrorMessageHandle(result.StatusCode, props.showAlert);
                }

            },
                (error) => {
                    props.showAlert("Error occurred!!", "danger")
                });
        //}

        setValidated(true);
    }


    const handleSubmitEdit = (e) => {
        e.preventDefault();

        fetch(variables.REACT_APP_API + 'EggSale/GetEggSaleUpdate', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                Id: eggsaledata.Id,
                CustomerId: eggsaledata.CustomerId,
                Quantity: eggsaledata.Quantity,
                PurchaseDate: eggsaledata.PurchaseDate,
                EggRate: eggsaledata.EggRate,
                TotalCost: eggsaledata.TotalCost,
                Discount: eggsaledata.Discount,
                FinalCost: eggsaledata.FinalCost,
                Paid: eggsaledata.Paid,
                Due: eggsaledata.Due,
                Comments:eggsaledata.Comments,
                CreatedOn:eggsaledata.CreatedOn,
                CreatedBy:eggsaledata.CreatedBy,
                ModifiedOn:eggsaledata.ModifiedOn,
                ModifiedBy:eggsaledata.ModifiedBy

            })
        }).then(res => res.json())
            .then((result) => {
                if (result.StatusCode === 200) {
                    addCount(count);
                    setAddModalShow(false);
                    
                    props.showAlert("Successfully updated", "info")
                }
                else {
                    ErrorMessageHandle(result.StatusCode,props.showAlert)
                }

            },
                (error) => {
                    props.showAlert("Error occurred!!", "danger")
                });
        //}

        setValidated(true);
    }

    return (
        <div>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <h2>Welcome to Egg sale</h2>
            </div>
            <div className="card" style={{ marginBottom: '20px' }}>
                <div className="card-body">
                    <h5 className="card-title">Customer Name: {customerdetails.FirstName + " " + customerdetails.LastName}</h5>
                    <p className="card-title">Mobile no: {customerdetails.MobileNo}</p>
                    <p className="card-title">Email: {customerdetails.Email}</p>
                </div>
            </div>
            <Button className="mr-2" variant="primary"
                style={{ marginRight: "17.5px" }}
                onClick={() => clickAddEggSale()}>Add</Button>

           <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='left'>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Total cost</th>
                        <th>Discount</th>
                        <th>FinalCost</th>
                        <th>Paid</th>
                        <th>Due</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                <tbody>


                    {

eggsalelist && eggsalelist.length > 0 ? eggsalelist.map((p) => {
                            // const ctype = producttypes.filter((c) => c.ProductId === p.CustomerTypeId);
                            // const cname = ctype.length > 0 ? ctype[0].ProductName : "";
                            return (
                                <tr align='center' key={p.Id}>
                                   
                                   <td align='left'>{moment(p.PurchaseDate).format('DD-MMM-YYYY')}</td>
                                    <td align='left'>{p.Quantity}</td>
                                    <td align='left'>{p.EggRate}</td>
                                    <td align='left'>{p.TotalCost.toFixed(2)}</td>
                                    <td align='left'>{p.Discount.toFixed(2)}</td>
                                    <td align='left'>{p.FinalCost.toFixed(2)}</td>
                                    <td align='left'>{p.Paid.toFixed(2)}</td>
                                    <td align='left'>{p.Due.toFixed(2)}</td>
                                    <td align='left'>{p.Comments}</td>
                                    
                                    <td align='center'>
                                        {
                                            <ButtonToolbar>

                                                <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditEggSale(p)}></i>

                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteEggSale(p.Id)}></i>}



                                            </ButtonToolbar>
                                        }
                                    </td>
                                </tr>
                            )
                        }) : ''
                    }
                </tbody>
            </Table >

            <div className="container" id="exampleModal">
                <Modal
                    show={addModalShow}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {eggsaledata.modaltitle}
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>

                                <div>
                                    <Form noValidate validated={validated}>
                                        <Row className="mb-12">
                                            <Form.Group as={Col} controlId="PurchaseDate">
                                                <Form.Label>Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={eggsaledata.PurchaseDate ? dateForPicker(eggsaledata.PurchaseDate) : ''}
                                                    onChange={purchaseDateChange}
                                                />

                                            </Form.Group>

                                            <Form.Group controlId="Quantity" as={Col} >
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control type="number" name="Quantity" required value={eggsaledata.Quantity}
                                                    placeholder="Quantity" onChange={quantityChange} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter quantity
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group controlId="EggRate" as={Col} >
                                                <Form.Label>Egg rate</Form.Label>
                                                <Form.Control type="number" name="EggRate" onChange={eggRateChange}
                                                    placeholder="Egg rate" value={eggsaledata.EggRate} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter egg rate
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>

                                         <Row className="mb-12">
                                            <Form.Group controlId="TotalCost" as={Col} >
                                                <Form.Label>Total cost</Form.Label>
                                                <Form.Control type="number" name="TotalCost" required onChange={totalCostChange} value={eggsaledata.TotalCost}
                                                    placeholder="TotalCost" disabled />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter total cost
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group controlId="Discount" as={Col} >
                                                <Form.Label>Discount</Form.Label>
                                                <Form.Control type="number" name="Discount" onChange={discountChange} value={eggsaledata.Discount}
                                                    placeholder="Discount" />
                                              
                                            </Form.Group>

                                            <Form.Group controlId="FinalCost" as={Col} >
                                                <Form.Label>Final cost</Form.Label>
                                                <Form.Control type="number" name="FinalCost" required onChange={finalCostChange} value={eggsaledata.FinalCost}
                                                    placeholder="FinalCost" disabled/>
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter final cost
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            </Row>

                                            <Row className="mb-12">
                                            <Form.Group controlId="Paid" as={Col} >
                                                <Form.Label>Paid</Form.Label>
                                                <Form.Control type="number" name="Paid" required onChange={paidChange} value={eggsaledata.Paid}
                                                    placeholder="Paid" />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter total paid amount
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group controlId="Due" as={Col} >
                                                <Form.Label>Due</Form.Label>
                                                <Form.Control type="number" name="Due" value={eggsaledata.Due}
                                                    placeholder="Due" disabled />
                                            
                                            </Form.Group>
                                            </Row>

                                            <Row className="mb-12">
                                            <Form.Group controlId="Comments" as={Col} >
                                                <Form.Label>Comments</Form.Label>

                                                <Form.Control as="textarea" rows={3} name="Comments" onChange={commentsChange} value={eggsaledata.Comments}
                                                    placeholder="Comments" />
                                              
                                            </Form.Group>
                                            </Row>

                                        <Row className="mb-3">

                                        </Row>

                                        <Form.Group as={Col}>
                                            {eggsaledata.Id <= 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                                                    Add
                                                </Button>
                                                : null
                                            }

                                            {eggsaledata.Id > 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitEdit(e)}>
                                                    Update
                                                </Button>
                                                : null
                                            }

                                            <Button variant="danger" style={{ marginTop: "30px", marginLeft: "10px" }} onClick={() => {
                                                addModalClose();
                                            }
                                            }>Close</Button>

                                        </Form.Group>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
            </div >


        </div>
    )
}

export default EggSale
