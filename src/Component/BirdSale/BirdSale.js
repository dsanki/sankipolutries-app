import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'
function BirdSale(props) {

    let history = useNavigate();

    const [shedlist, setShedList] = useState([]);
    const [lots, setLots] = useState([]);
    const [shedlotmaplist, SetShedLotMapList] = useState([]);
    const [birdSaleList, setBirdSaleList] = useState([]);
    const [birdSaleListFilter, setBirdSaleListFilter] = useState([]);
    const [unitlist, setUnitList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);

    //const [_lotid, setLotId] = useState();
    const [_lotname, setLotName] = useState();
    const [_totalbirds, setTotalBirds] = useState();


    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        LotId: "",
        ShedId: "",
        Date: "",
        CustomerName: "",
        BirdCount: "",
        TotalWeight: "",
        UnitId: "",
        Rate: "",
        TotalAmount: "",
        Paid: "",
        Due: "",
        PaymentDate: "",
        Comments: "",
        LotName: "",
        TotalBirdSale: ""

    };

    const [birdsaledata, setBirdSaleData] = useState(initialvalues);

    const clickAddBirdSale = () => {
        setAddModalShow({ addModalShow: true });
        setBirdSaleData({
            modaltitle: "Add Bird Sale",
            Id: 0,
            LotId: "",
            ShedId: "",
            Date: "",
            CustomerName: "",
            BirdCount: "",
            TotalWeight: "",
            UnitId: "",
            Rate: "",
            TotalAmount: "",
            Paid: "",
            Due: "",
            PaymentDate: "",
            Comments: "",
            LotName: "",
            TotalBirdSale: ""
        })
    }

    const clickEditBirdSale = (md) => {
        setAddModalShow({ addModalShow: true });
        setBirdSaleData({
            modaltitle: "Edit Bird Sale",
            Id: md.Id,
            LotId: md.LotId,
            ShedId: md.ShedId,
            Date: md.Date,
            CustomerName: md.CustomerName,
            BirdCount: md.BirdCount,
            TotalWeight: md.TotalWeight,
            UnitId: md.UnitId,
            Rate: md.Rate,
            TotalAmount: md.TotalAmount,
            Paid: md.Paid,
            Due: md.Due,
            PaymentDate: md.PaymentDate,
            Comments: md.Comments,
            LotName: md.LotName,
            TotalBirdSale: md.TotalBirdSale
        })
    }

    const lotChange = (e) => {
        setBirdSaleData({ ...birdsaledata, LotId: e.target.value });
    }

    const shedChange = (e) => {
        let lotid = "";
        let lotname = "";
        let totalbirdsale = "";

        const filterval = shedlotmaplist.filter((c) => c.shedid === parseInt(e.target.value));

        if (filterval.length > 0) {
            lotid = filterval[0].lotid;
            lotname = filterval[0].lotname;

            // setBirdSaleData({...birdsaledata, LotId: filterval[0].lotid});
            setBirdSaleData({ ...birdsaledata, ShedId: e.target.value, LotId: filterval[0].lotid });
            setLotName(filterval[0].lotname);

            fetch(variables.REACT_APP_API + 'ChicksMaster/' + filterval[0].lotid)
                .then(response => response.json())
                .then(data => {
                    totalbirdsale = data.TotalBirdSale;
                    setTotalBirds(data.TotalBirdSale);
                });

            setBirdSaleData({ ...birdsaledata, ShedId: e.target.value, LotId: lotid, LotName: lotname, TotalBirdSale: totalbirdsale });
        }
    }

    const dateChange = (e) => {
        setBirdSaleData({ ...birdsaledata, Date: e.target.value });
    }

    const customerChange = (e) => {
        setBirdSaleData({ ...birdsaledata, CustomerName: e.target.value });
    }

    const birdcountChange = (e) => {
        setBirdSaleData({ ...birdsaledata, BirdCount: e.target.value });
    }

    const totalWeightChange = (e) => {
        let totalwt=e.target.value;
        let totalamt=totalwt * birdsaledata.Rate;
        let due=totalamt - birdsaledata.Paid
        setBirdSaleData({
            ...birdsaledata,
            TotalWeight: totalwt,
            TotalAmount:totalamt,
            Due: due
        });
    }

    const unitIdChange = (e) => {
        setBirdSaleData({ ...birdsaledata, UnitId: e.target.value });
    }

    const rateChange = (e) => {
        let rate= e.target.value;
        let totalamt=birdsaledata.TotalWeight * rate;
        let due=totalamt - birdsaledata.Paid
        setBirdSaleData({
            ...birdsaledata,
            Rate: rate,
            TotalAmount: totalamt,
            Due: due
        });
    }

    const totalAmountChange = (e) => {
        setBirdSaleData({
            ...birdsaledata,
            TotalAmount: e.target.value,
            Due: e.target.value - birdsaledata.Paid
        });
    }

    const paidChange = (e) => {
        setBirdSaleData({ ...birdsaledata, Paid: e.target.value, Due: birdsaledata.TotalAmount - e.target.value });
    }
    const paymentDateChange = (e) => {
        setBirdSaleData({ ...birdsaledata, PaymentDate: e.target.value });
    }
    const commentsChange = (e) => {
        setBirdSaleData({ ...birdsaledata, Comments: e.target.value });
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchUnit();
            fetchSheds();
            fetchLots();
            fetchShedLotsMapList();
            fetchBirdSaleList();
        }
        else {

            history("/login")
        }
    }, [obj]);


    const fetchUnit = async () => {
        fetch(variables.REACT_APP_API + 'Unit',
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
                if (data.StatusCode === 200) {
                    setUnitList(data.Result);
                }
                else {
                    errorHandle(data.StatusCode);
                }
            });
    }

    const fetchSheds = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedList',
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
                if (data.StatusCode === 200) {
                    setShedList(data.Result);
                }
                else {
                    errorHandle(data.StatusCode);
                }
            });
    }

    const fetchLots = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetLots',
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
                if (data.StatusCode === 200) {
                    setLots(data.Result);
                }
                else {
                    errorHandle(data.StatusCode);
                }
            });
    }

    const fetchShedLotsMapList = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedLotMapList',
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
                if (data.StatusCode === 200) {
                    SetShedLotMapList(data.Result);
                }
                else {
                    errorHandle(data.StatusCode);
                }
            });
    }

    const errorHandle = (code) => {
        if (code === 401) {
            history("/login")
        }
        else if (code === 404) {
            props.showAlert("Data not found!!", "danger")
        }
        else {
            props.showAlert("Error occurred!!", "danger")
        }
    }

    const fetchBirdSaleList = async () => {
        fetch(variables.REACT_APP_API + 'BirdSale/GetBirdSale',
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
                if (data.StatusCode === 200) {
                    setBirdSaleList(data.Result);
                    setBirdSaleListFilter(data.Result);
                }
                else {
                    errorHandle(data.StatusCode);
                }
            });
    }

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

        fetch(variables.REACT_APP_API + 'BirdSale/UpdateBirdSale', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({

                Id: birdsaledata.Id,
                LotId: birdsaledata.LotId,
                ShedId: birdsaledata.ShedId,
                Date: birdsaledata.Date,
                CustomerName: birdsaledata.CustomerName,
                BirdCount: birdsaledata.BirdCount,
                TotalWeight: birdsaledata.TotalWeight,
                UnitId: birdsaledata.UnitId,
                Rate: birdsaledata.Rate,
                TotalAmount: birdsaledata.TotalAmount,
                Paid: birdsaledata.Paid,
                Due: birdsaledata.Due,
                PaymentDate: birdsaledata.PaymentDate,
                Comments: birdsaledata.Comments

            })
        }).then(res => res.json())
            .then((result) => {
                if (result.StatusCode === 200) {
                    addCount(count);
                    setAddModalShow(false);

                    props.showAlert("Successfully updated", "info")
                }
                else {
                    errorHandle(result.StatusCode);
                }

            },
                (error) => {
                    props.showAlert("Error occurred!!", "danger")
                });
        }

        setValidated(true);
    }

    const dateForPicker = (dateString) => {
        return moment(new Date(dateString)).format('YYYY-MM-DD')
    };

    let addCount = (num) => {
        setCount(num + 1);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

        fetch(variables.REACT_APP_API + 'BirdSale/AddBirdSale', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                Id: birdsaledata.Id,
                LotId: birdsaledata.LotId,
                ShedId: birdsaledata.ShedId,
                Date: birdsaledata.Date,
                CustomerName: birdsaledata.CustomerName,
                BirdCount: birdsaledata.BirdCount,
                TotalWeight: birdsaledata.TotalWeight,
                UnitId: birdsaledata.UnitId,
                Rate: birdsaledata.Rate,
                TotalAmount: birdsaledata.TotalAmount,
                Paid: birdsaledata.Paid,
                Due: birdsaledata.Due,
                PaymentDate: birdsaledata.PaymentDate,
                Comments: birdsaledata.Comments

            })
        }).then(res => res.json())
            .then((result) => {
                if (result.StatusCode === 200) {
                    addCount(count);
                    setAddModalShow(false);
                    props.showAlert("Successfully added", "info")
                }
                else {
                    errorHandle(result.StatusCode);
                }

            },
                (error) => {
                    props.showAlert("Error occurred!!", "danger")
                });
        //}
            }

        setValidated(true);
    }

    const deleteBirdSale = () => {

    }

    // const filterSupplierChange = (e) => {

    //     if (e.target.value > 0) {
    //         const _medd = rawmaterialListFilter.filter((c) => c.ClientId === parseInt(e.target.value));
    //         setRawMaterialList(_medd);
    //     }
    //     else {
    //         setRawMaterialList(rawmaterialListFilter);
    //     }
    // }

    return (
        <div>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <h2>Welcome to Bird Sale Page</h2>
            </div>

            <div className="row">
                {/* <div className="col">
                    <p><strong>Supplier</strong></p>
                    <select className="form-select" aria-label="Default select example" onChange={filterSupplierChange}>
                        <option selected>--Select Supplier--</option>
                        {
                            clientlist.filter((c) => c.ClientType === 2 || c.ClientType === 3).map((item) => {
                                return (
                                    <option value={item.Id} key={item.Id}>{item.ClientName}</option>)
                            }
                            )};
                    </select>
                </div> */}
                <div className="col" style={{ textAlign: 'right' }}>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddBirdSale()}>Add</Button>
                </div>

            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='left'>
                        <th>Date</th>
                        <th>Shed</th>
                        <th>Lot</th>
                        <th>Customer name</th>
                        <th>Bird count</th>
                        <th>Total weight</th>
                        <th>Rate</th>
                        <th>Total amount</th>
                        <th>Paid</th>
                        <th>Due</th>
                        <th>Payment date</th>
                        <th>Comments</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>

                    {

                        birdSaleList && birdSaleList.length > 0 ? birdSaleList.map((p) => {
                            const _unit = unitlist.filter((c) => c.ID === p.UnitId);
                            const _uname = _unit.length > 0 ? _unit[0].UnitName : "";

                            const _shed = shedlist.filter((c) => c.ShedId === p.ShedId);
                            const _shedname = _shed.length > 0 ? _shed[0].ShedName : "";

                            const _lot = lots.filter((c) => c.Id === p.LotId);
                            const _lotname = _lot.length > 0 ? _lot[0].LotName : "";
                            p.LotName=_lotname;

                            return (
                                <tr align='center' key={p.Id}>
                                    <td align='left'>{moment(p.Date).format('DD-MMM-YYYY')}</td>
                                    <td align='left'>{_shedname}</td>
                                    <td align='left'>{_lotname}</td>
                                    <td align='left'>{p.CustomerName}</td>
                                    <td align='left'>{p.BirdCount}</td>
                                    <td align='left'>{p.TotalWeight + " " + _uname}</td>
                                    <td align='left'>{p.Rate}</td>
                                    <td align='left'>{p.TotalAmount.toFixed(2)}</td>
                                    <td align='left'>{p.Paid.toFixed(2)}</td>
                                    <td align='left'>{p.Due.toFixed(2)}</td>
                                    <td align='left'>{moment(p.PaymentDate).format('DD-MMM-YYYY')}</td>
                                    <td align='left'>{p.Comments}</td>
                                    <td align='center'>
                                        {
                                            <ButtonToolbar>
                                                <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditBirdSale(p)}></i>
                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteBirdSale(p.Id)}></i>}
                                            </ButtonToolbar>
                                        }
                                    </td>
                                </tr>
                            )
                        }) : <tr>
                        <td style={{ textAlign: "center" }} colSpan={14}>
                            No Records
                        </td>
                    </tr>
                    }
                </tbody>
            </Table >



            <div className="ContainerOverride" id="exampleModal">
                <Modal
                    show={addModalShow}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {birdsaledata.modaltitle}
                        </Modal.Title>
                        <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <div>
                                    <Form noValidate validated={validated} className="needs-validation">
                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="Date">
                                                <Form.Label>Date</Form.Label>
                                                <DateComponent date={null} onChange={dateChange} isRequired={true} value={birdsaledata.Date} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select date
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-12">
                                            <Form.Group controlId="ShedId" as={Col} >
                                                <Form.Label>Shed</Form.Label>
                                                <Form.Control type="text" name="LotId" hidden disabled value={birdsaledata.LotId}
                                                />
                                                <Form.Select aria-label="Default select example"
                                                    onChange={shedChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {
                                                        shedlist.map((item) => {
                                                            return (
                                                                <option
                                                                    key={item.ShedId}
                                                                    defaultValue={item.ShedId == null ? null : item.ShedId}
                                                                    selected={item.ShedId === birdsaledata.ShedId}
                                                                    value={item.ShedId}
                                                                >{item.ShedName}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select shed
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <InputField controlId="LotName"
                                                label="LotName"
                                                type="text"
                                                value={birdsaledata.LotName}
                                                name="LotName"
                                                placeholder="Lot name"
                                                errormessage="Please provide lot name"
                                                required={true}
                                                disabled={true}
                                            />

                                            {/* <Form.Group controlId="LotName" as={Col} >
                                                <Form.Label>Lot name</Form.Label>
                                              
                                                <Form.Control type="text" name="LotName" required disabled value={_lotname}
                                                    placeholder="" />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter lot name
                                                </Form.Control.Feedback>
                                            </Form.Group> */}
                                        </Row>
                                        <Row className="mb-12">
                                            <InputField controlId="CustomerName"
                                                label="CustomerName"
                                                type="text"
                                                value={birdsaledata.CustomerName}
                                                name="CustomerName"
                                                placeholder="Customer name"
                                                errormessage="Please provide customer name"
                                                required={true}
                                                disabled={false}
                                                onChange={customerChange}
                                            />


                                            {/* <Form.Group controlId="CustomerName" as={Col} >
                                                <Form.Label>Customer name</Form.Label>
                                                <Form.Control type="text" name="CustomerName" required value={birdsaledata.CustomerName}
                                                    placeholder="" onChange={customerChange} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter customer name
                                                </Form.Control.Feedback>
                                            </Form.Group> */}

                                            <InputField controlId="BirdCount"
                                                label="BirdCount"
                                                type="number"
                                                value={birdsaledata.BirdCount}
                                                name="BirdCount"
                                                placeholder="Bird count"
                                                errormessage="Please provide bird count"
                                                required={true}
                                                disabled={false}
                                                onChange={birdcountChange}
                                            />

<InputField controlId="TotalWeight"
                                                label="TotalWeight"
                                                type="number"
                                                value={birdsaledata.TotalWeight}
                                                name="TotalWeight"
                                                placeholder="Total weight"
                                                errormessage="Please provide total weight"
                                                required={true}
                                                disabled={false}
                                                onChange={totalWeightChange}
                                            />


                                            {/* <Form.Group controlId="BirdCount" as={Col} >
                                                <Form.Label>Bird count</Form.Label>
                                                <Form.Control type="number" name="BirdCount" required value={birdsaledata.BirdCount}
                                                    placeholder="" onChange={birdcountChange} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter total bird count
                                                </Form.Control.Feedback>
                                            </Form.Group> */}

                                            {/* <Form.Group controlId="TotalWeight" as={Col} >
                                                <Form.Label>Total Weight</Form.Label>
                                                <Form.Control type="number" name="TotalWeight" required value={birdsaledata.TotalWeight}
                                                    placeholder="" onChange={totalWeightChange} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter total weight
                                                </Form.Control.Feedback>
                                            </Form.Group> */}
                                        </Row>
                                        <Row className="mb-12">

                                            <Form.Group controlId="UnitId" as={Col} >
                                                <Form.Label>Unit</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={unitIdChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {
                                                        unitlist.map((item) => {
                                                            return (
                                                                <option
                                                                    key={item.ID}
                                                                    defaultValue={item.ID == null ? null : item.ID}
                                                                    selected={item.ID === birdsaledata.UnitId}
                                                                    value={item.ID}
                                                                >{item.UnitName}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select unit
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <InputField controlId="Rate"
                                                label="Rate"
                                                type="number"
                                                value={birdsaledata.Rate}
                                                name="Rate"
                                                placeholder="Rate"
                                                errormessage="Please enter rate"
                                                required={true}
                                                disabled={false}
                                                onChange={rateChange}
                                            />

                                            {/* <Form.Group controlId="Rate" as={Col} >
                                                <Form.Label>Rate</Form.Label>
                                                <Form.Control type="number" name="Rate" required onChange={rateChange}
                                                    placeholder="Rate" value={birdsaledata.Rate} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter rate
                                                </Form.Control.Feedback>
                                            </Form.Group> */}


                                        </Row>
                                        <Row className="mb-12">
                                        <InputField controlId="TotalAmount" label="Total Amount"
                                            type="number"
                                            value={birdsaledata.TotalAmount}
                                            name="TotalAmount"
                                            placeholder="Total Amount"
                                            errormessage="Please provide total amount"
                                            required={true}
                                            disabled={true}
                                        />

                                            {/* <Form.Group controlId="TotalAmount" as={Col} >
                                                <Form.Label>Total amount</Form.Label>
                                                <Form.Control type="number" name="TotalAmount" required onChange={totalAmountChange}
                                                    placeholder="Total amount" value={birdsaledata.TotalAmount} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter total amount
                                                </Form.Control.Feedback>
                                            </Form.Group> */}

                                            <InputField controlId="Paid" label="Paid"
                                            type="number"
                                            value={birdsaledata.Paid}
                                            name="Paid"
                                            placeholder="Paid"
                                            errormessage="Please provide paid amount"
                                            required={true}
                                            disabled={false}
                                            onChange={paidChange}
                                        />

                                            {/* <Form.Group controlId="Paid" as={Col} >
                                                <Form.Label>Paid</Form.Label>
                                                <Form.Control type="number" name="Email" required onChange={paidChange} value={birdsaledata.Paid}
                                                    placeholder="Paid" />
                                                <Form.Control.Feedback type="invalid">
                                                    Please paid amount
                                                </Form.Control.Feedback>
                                            </Form.Group> */}

                                            <InputField controlId="Due" label="Due"
                                            type="number"
                                            value={birdsaledata.Due}
                                            name="Due"
                                            placeholder="Due"
                                            errormessage="Please provide due amount"
                                            required={true}
                                            disabled={true}
                                        />

                                            {/* <Form.Group controlId="Due" as={Col} >
                                                <Form.Label>Due</Form.Label>
                                                <Form.Control type="number" name="Due" disabled value={birdsaledata.Due}
                                                    placeholder="Due" />

                                            </Form.Group> */}

                                        </Row>
                                        <Row className="mb-4">
                                            <Form.Group as={Col} controlId="PaymentDate">
                                                <Form.Label>Payment date</Form.Label>
                                                <DateComponent date={null} onChange={paymentDateChange} isRequired={true} value={birdsaledata.PaymentDate} />
                                                {/* <Form.Control
                                                    type="date"
                                                    value={birdsaledata.PaymentDate ? dateForPicker(birdsaledata.PaymentDate) : ''}
                                                    onChange={paymentDateChange}
                                                /> */}
                                                <Form.Control.Feedback type="invalid">
                                                    Please select payment date
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-12">
                                            <Form.Group controlId="Comments" as={Col} >
                                                <Form.Label>Comments</Form.Label>
                                                <Form.Control as="textarea" rows={3} name="Comments" onChange={commentsChange} value={birdsaledata.Comments}
                                                    placeholder="Comments" />
                                            </Form.Group>
                                        </Row>

                                        <Form.Group as={Col}>
                                            {birdsaledata.Id <= 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                                                    Add
                                                </Button>
                                                : null
                                            }

                                            {birdsaledata.Id > 0 ?

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

export default BirdSale
