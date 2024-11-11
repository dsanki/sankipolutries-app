import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'
import { GetCustomerByTypeId, dateyyyymmdd, 
    HandleLogout, downloadExcel } from './../../Utility'
import Loading from '../Loading/Loading'
//
function RawMaterials(props) {

    let history = useNavigate();


    const [rawmaterialList, setRawMaterialList] = useState([]);
    const [rawmaterialListFilter, setRawMaterialListFilter] = useState([]);
    const [rawMaterialsTypes, setRawMaterialsTypes] = useState([]);
    const [clientlist, setClientList] = useState([]);
    const [unitlist, setUnitList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);
    const [producttypes, setProductType] = useState([]);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        BillingDate: "",
        ClientId: "",
        MaterialTypeId: "",
        Broker: "",
        Quantity: "",
        UnitId: "",
        Rate: "",
        TotalAmount: "",
        Paid: "",
        Due: "",
        PaymentDate: "",
        Comments: "",
        InvoiceDate:"",
        InvoiceNo:"",
        ExtraCharge:""

    };

    const [materialsdata, setMaterialsData] = useState(initialvalues);

    const clickAddMaterials = () => {
        setAddModalShow({ addModalShow: true });
        setMaterialsData({
            modaltitle: "Add Raw Materials",
            Id: 0,
            BillingDate: "",
            ClientId: "",
            MaterialTypeId: "",
            Broker: "",
            Quantity: "",
            UnitId: "",
            Rate: "",
            TotalAmount: "",
            Paid: "",
            Due: "",
            PaymentDate: "",
            Comments: "",
            InvoiceDate:"",
            InvoiceNo:"",
            ExtraCharge:""
        })
    }

    const clickEditMaterials = (md) => {
        setAddModalShow({ addModalShow: true });
        setMaterialsData({
            modaltitle: "Edit Medicine",
            Id: md.Id,
            BillingDate: md.BillingDate,
            ClientId: md.ClientId,
            MaterialTypeId: md.MaterialTypeId,
            Broker: md.Broker,
            Quantity: md.Quantity,
            UnitId: md.UnitId,
            Rate: md.Rate,
            TotalAmount: md.TotalAmount,
            Paid: md.Paid,
            Due: md.Due,
            PaymentDate: md.PaymentDate,
            Comments: md.Comments,
            InvoiceDate:md.InvoiceDate,
            InvoiceNo:md.InvoiceNo,
            ExtraCharge:md.ExtraCharge
        })
    }

    const invoiceDateChange = (e) => {
        setMaterialsData({ ...materialsdata, InvoiceDate: e.target.value });
    }

    const billingDateChange = (e) => {
        setMaterialsData({ ...materialsdata, BillingDate: e.target.value });
    }

    const clientIdChange = (e) => {
        setMaterialsData({ ...materialsdata, ClientId: e.target.value });
    }

    const materialTypeChange = (e) => {
        setMaterialsData({ ...materialsdata, MaterialTypeId: e.target.value });
    }

    const brokerChange = (e) => {
        setMaterialsData({ ...materialsdata, Broker: e.target.value });
    }

    const invoiceNoChange = (e) => {
        setMaterialsData({ ...materialsdata, InvoiceNo: e.target.value });
    }

    const quantityChange = (e) => {
        setMaterialsData({
            ...materialsdata,
            Quantity: e.target.value,
            TotalAmount:Math.round((e.target.value * materialsdata.Rate) + parseFloat(materialsdata.ExtraCharge||0)).toFixed(2),
            Due: Math.round(((e.target.value * materialsdata.Rate)+ 
            parseFloat(materialsdata.ExtraCharge||0)) - materialsdata.Paid).toFixed(2)
        });
    }

    const unitIdChange = (e) => {
        setMaterialsData({ ...materialsdata, UnitId: e.target.value });
    }

    const rateChange = (e) => {
        setMaterialsData({
            ...materialsdata,
            Rate: e.target.value,
            TotalAmount: Math.round((materialsdata.Quantity * e.target.value)+ parseFloat(materialsdata.ExtraCharge||0)).toFixed(2),
            Due: Math.round(((materialsdata.Quantity * e.target.value)+ parseFloat(materialsdata.ExtraCharge||0)) 
            - materialsdata.Paid).toFixed(2)
        });
    }

    const totalAmountChange = (e) => {
        setMaterialsData({
            ...materialsdata,
            TotalAmount:Math.round(e.target.value).toFixed(2),
            Due:Math.round((e.target.value+  parseFloat(materialsdata.ExtraCharge||0)) - materialsdata.Paid).toFixed(2)
        });
    }

    const extraAmountChange = (e) => {
        setMaterialsData({
            ...materialsdata,
            ExtraCharge: e.target.value,
            TotalAmount: Math.round((materialsdata.Quantity * materialsdata.Rate)+ parseFloat(e.target.value||0)).toFixed(2),
            Due: Math.round(((materialsdata.Quantity * materialsdata.Rate)+ parseFloat(e.target.value||0)) - materialsdata.Paid).toFixed(2)
        });
    }

    const paidChange = (e) => {
        setMaterialsData({ ...materialsdata, Paid: e.target.value, 
            Due: Math.round(parseFloat(materialsdata.TotalAmount) - parseFloat(e.target.value||0)).toFixed(2) });
    }
    const paymentDateChange = (e) => {
        setMaterialsData({ ...materialsdata, PaymentDate: e.target.value });
    }
    const commentsChange = (e) => {
        setMaterialsData({ ...materialsdata, Comments: e.target.value });
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchUnit();
            fetchClient();
            fetchRawMaterials();
            fetchMaterialsTypes();
        }
        else {

            history("/login")
        }
    }, [obj]);

    

    const fetchRawMaterials = async () => {
        fetch(process.env.REACT_APP_API + 'RawMaterials/GetRawMaterials',
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
                    setRawMaterialList(data.Result);
                    setRawMaterialListFilter(data.Result);
                    setCount(data.Result.length);
                    setTotalPages(Math.ceil(data.Result.length / process.env.REACT_APP_PAGE_PAGINATION_NO));
                }
                else if (data.StatusCode === 401) {
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }
            });
    }

    const fetchMaterialsTypes = async () => {
        fetch(process.env.REACT_APP_API+ 'RawMaterials/GetRawMaterialsTypes',
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
                    setRawMaterialsTypes(data.Result);
                }
                else if (data.StatusCode === 401) {
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }
            });
    }

    const fetchUnit = async () => {
        fetch(process.env.REACT_APP_API + 'Unit',
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
                else if (data.StatusCode === 401) {
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }
            });
    }


    const fetchCutomerTypes = async () => {
        fetch(process.env.REACT_APP_API + 'ProductType/GetProductType',
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
                    setProductType(data.Result);
                }
                else if (data.StatusCode === 401) {
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }
            });
    }


    const fetchClient = async () => { GetCustomerByTypeId(process.env.REACT_APP_CUST_TYPE_ID,
        process.env.REACT_APP_API)
        .then(data => {
            if (data.StatusCode === 200) {
                setClientList(data.Result);
            }
            else if (data.StatusCode === 401) {
                HandleLogout();
                history("/login")
            }
            else if (data.StatusCode === 404) {
                props.showAlert("Data not found to fetch sheds!!", "danger")
            }
            else {
                props.showAlert("Error occurred to fetch sheds!!", "danger")
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

            fetch(process.env.REACT_APP_API + 'RawMaterials/UpdateMaterials', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({

                    Id: materialsdata.Id,
                    BillingDate: materialsdata.BillingDate,
                    ClientId: materialsdata.ClientId,
                    MaterialTypeId: materialsdata.MaterialTypeId,
                    Broker: materialsdata.Broker,
                    Quantity: materialsdata.Quantity,
                    UnitId: materialsdata.UnitId,
                    Rate: materialsdata.Rate,
                    TotalAmount: materialsdata.TotalAmount,
                    Paid: materialsdata.Paid,
                    Due: materialsdata.Due,
                    PaymentDate: materialsdata.PaymentDate,
                    Comments: materialsdata.Comments,
                    InvoiceDate:materialsdata.InvoiceDate,
                    InvoiceNo:materialsdata.InvoiceNo,
                    ExtraCharge:materialsdata.ExtraCharge

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result > 0 || result.StatusCode === 200 || result.StatusCode === "OK") {

                        addCount(count);
                        setAddModalShow(false);

                        props.showAlert("Successfully updated", "info")
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

    // const dateForPicker = (dateString) => {
    //     return moment(new Date(dateString)).format('YYYY-MM-DD')
    // };

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

            fetch(process.env.REACT_APP_API + 'RawMaterials/AddMaterials', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: materialsdata.Id,
                    BillingDate: materialsdata.BillingDate,
                    ClientId: materialsdata.ClientId,
                    MaterialTypeId: materialsdata.MaterialTypeId,
                    Broker: materialsdata.Broker,
                    Quantity: materialsdata.Quantity,
                    UnitId: materialsdata.UnitId,
                    Rate: materialsdata.Rate,
                    TotalAmount: materialsdata.TotalAmount,
                    Paid: materialsdata.Paid,
                    Due: materialsdata.Due,
                    PaymentDate: materialsdata.PaymentDate,
                    Comments: materialsdata.Comments,
                    InvoiceDate:materialsdata.InvoiceDate,
                    InvoiceNo:materialsdata.InvoiceNo,
                    ExtraCharge:materialsdata.ExtraCharge

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result > 0 || result.StatusCode === 200 || result.StatusCode === "OK") {
                        addCount(count);
                        setAddModalShow(false);
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

    const deleteMaterials = () => {

    }

    const filterSupplierChange = (e) => {

        if (e.target.value > 0) {
            const _medd = rawmaterialListFilter.filter((c) => c.ClientId === parseInt(e.target.value));
            setRawMaterialList(_medd);
        }
        else {
            setRawMaterialList(rawmaterialListFilter);
        }
    }

   

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
    const nextDisabled = currentPage === totalPages;
    const itemsPerPage = process.env.REACT_APP_PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = rawmaterialList && rawmaterialList.length > 0 ? rawmaterialList.slice(startIndex, endIndex) : [];


    return (
        <div>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <h2>Raw Materials</h2>
            </div>

            <div className="row">
                <div className="col">
                    <p><strong>Supplier</strong></p>
                    <select className="form-select" aria-label="Default select example" 
                    onChange={filterSupplierChange} style={{fontSize:13}}>
                        <option selected>--Select Supplier--</option>
                        {
                           
                            clientlist.map((item) => {

                                   let fullname=(item.MiddleName!="" && item.MiddleName!=null) ? item.FirstName+" "+item.MiddleName+" "+item.LastName: 
                                   item.FirstName+" "+item.LastName;
                                return (
                                    <option value={item.ID} key={item.ID}>{fullname}</option>)
                            }
                            )};
                    </select>
                </div>
                <div className="col" style={{ textAlign: 'right' }}>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddMaterials()}>Add</Button>
                </div>

            </div>


            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center' className="tr-custom">
                        <th>Date</th>
                        <th>Supplier</th>
                        <th>Materials name</th>
                        <th>Broker</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Total amount</th>
                        <th>Extra Charge</th>
                        <th>Paid</th>
                        <th>Due</th>
                        <th>Payment date</th>
                        <th>Comments</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>

                    {

                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
                            const _unit = unitlist.filter((c) => c.ID === p.UnitId);
                            const _uname = _unit.length > 0 ? _unit[0].UnitName : "";

                            const _supp = clientlist.filter((c) => c.ID === p.ClientId);
                           // const _suppname = _supp.length > 0 ? _supp[0].ClientName : "";
                            let _suppname= _supp.length > 0 ?(_supp[0].MiddleName!="" && _supp[0].MiddleName!=null) ? 
                            _supp[0].FirstName+" "+_supp[0].MiddleName+" "+_supp[0].LastName: 
                            _supp[0].FirstName+" "+_supp[0].LastName:"";
                            const _mat = rawMaterialsTypes.filter((c) => c.Id === p.MaterialTypeId);
                            const _matname = _mat.length > 0 ? _mat[0].Name : "";

                            return (
                                <tr align='center' key={p.Id} style={{fontSize:13}} >
                                    <td align='left'>{moment(p.BillingDate).format('DD-MMM-YYYY')}</td>
                                    <td align='left'>{_suppname}</td>
                                    <td align='left'>{_matname}</td>
                                    <td align='left'>{p.Broker}</td>
                                    <td align='left'>{p.Quantity + " " + _uname}</td>
                                    <td align='left'>{p.Rate}</td>
                                    <td align='left'>{p.TotalAmount.toFixed(2)}</td>
                                    <td align='left'>{parseFloat(p.ExtraCharge||0).toFixed(2)}</td>
                                    <td align='left'>{p.Paid.toFixed(2)}</td>
                                    <td align='left'>{p.Due.toFixed(2)}</td>
                                    <td align='left'>{p.PaymentDate!=null?moment(p.PaymentDate).format('DD-MMM-YYYY'):""}</td>
                                    <td align='left'>{p.Comments}</td>
                                    <td align='center'>
                                        {
                                            <ButtonToolbar>
                                                <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditMaterials(p)}></i>
                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteMaterials(p.Id)}></i>}
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

            {
                rawmaterialList && rawmaterialList.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
                <button
                    onClick={handlePrevClick}
                    disabled={preDisabled}
                >
                    Prev
                </button>
            }
            {

                Array.from({ length: totalPages }, (_, i) => {
                    return (
                        rawmaterialList && rawmaterialList.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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

            {rawmaterialList && rawmaterialList.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
                <button
                    onClick={handleNextClick}
                    disabled={nextDisabled}
                >
                    Next
                </button>
            }


            <div className="container" id="exampleModal">
                <Modal
                    show={addModalShow}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {materialsdata.modaltitle}
                        </Modal.Title>
                        <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <div>
                                    <Form noValidate validated={validated} className="needs-validation">
                                    <Row className="mb-12">
                                            <Form.Group as={Col} controlId="InvoiceDate">
                                                <Form.Label style={{fontSize:13}}>Invoice Date</Form.Label>
                                                <DateComponent date={null} onChange={invoiceDateChange} isRequired={true} 
                                                value={materialsdata.InvoiceDate} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please add invoice date
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <InputField controlId="InvoiceNo" label="Invoice no"
                                                type="text"
                                                value={materialsdata.InvoiceNo}
                                                name="InvoiceNo"
                                                placeholder="Invoice no"
                                                errormessage="Please enter Invoice no"
                                                onChange={invoiceNoChange}
                                                required={true}
                                                disabled={false}
                                            />
                                    </Row>
                                        <Row className="mb-12">

                                            <Form.Group as={Col} controlId="Date">
                                                <Form.Label style={{fontSize:13}}>Date</Form.Label>
                                                <DateComponent date={null} onChange={billingDateChange} isRequired={true} 
                                                value={materialsdata.BillingDate} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select date
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-12">
                                            <Form.Group controlId="MaterialTypeId" as={Col} >
                                                <Form.Label style={{fontSize:13}}>Material</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={materialTypeChange} required style={{fontSize:13}}>
                                                    <option selected disabled value="">Choose...</option>
                                                    {
                                                        rawMaterialsTypes.map((item) => {
                                                            return (
                                                                <option
                                                                    key={item.Id}
                                                                    defaultValue={item.Id == null ? null : item.Id}
                                                                    selected={item.Id === materialsdata.MaterialTypeId}
                                                                    value={item.Id}
                                                                >{item.Name}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select material
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group controlId="ClientId" as={Col} >
                                                <Form.Label style={{fontSize:13}}>Supplier</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={clientIdChange} required style={{fontSize:13}}>
                                                    <option selected disabled value="">Choose...</option>
                                                    {

                                                        clientlist.map((item) => {

                                                            let fullname=(item.MiddleName!="" && item.MiddleName!=null) ? item.FirstName+" "+item.MiddleName+" "+item.LastName: 
                                                            item.FirstName+" "+item.LastName;
                                                        return (
                                                            <option value={item.ID}
                                                             key={item.ID}
                                                             defaultValue={item.ID == null ? null : item.ID}
                                                             selected={item.ID === materialsdata.ClientId}>{fullname}</option>)
                                                        })
                                                       
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select supplier
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <InputField controlId="Broker" label="Broker"
                                                type="text"
                                                value={materialsdata.Broker}
                                                name="Broker"
                                                placeholder="Broker"
                                                errormessage="Please enter broker name"
                                                onChange={brokerChange}
                                                required={false}
                                                disabled={false}
                                            />

                                            {/* <Form.Group controlId="Broker" as={Col} >
                                                <Form.Label>Broker name</Form.Label>
                                                <Form.Control type="text" name="Broker" required value={materialsdata.Broker}
                                                    placeholder="Broker" onChange={brokerChange} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter broker name
                                                </Form.Control.Feedback>
                                            </Form.Group> */}

                                        </Row>
                                        <Row className="mb-12">
                                            <InputField controlId="Quantity" label="Quantity"
                                                type="number"
                                                value={materialsdata.Quantity}
                                                name="Quantity"
                                                placeholder="Quantity"
                                                errormessage="Please enter quantity"
                                                required={true}
                                                disabled={false}
                                                onChange={quantityChange}
                                            />
                                            {/* <Form.Group controlId="Quantity" as={Col} >
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control type="number" name="Quantity" onChange={quantityChange}
                                                    placeholder="Quantity" value={materialsdata.Quantity} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter quantity
                                                </Form.Control.Feedback>
                                            </Form.Group> */}

                                            <Form.Group controlId="UnitId" as={Col} >
                                                <Form.Label style={{fontSize:13}}>Unit</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={unitIdChange} required style={{fontSize:13}}>
                                                    <option selected disabled value="">Choose...</option>
                                                    {
                                                        unitlist.map((item) => {
                                                            return (
                                                                <option
                                                                    key={item.ID}
                                                                    defaultValue={item.ID == null ? null : item.ID}
                                                                    selected={item.ID === materialsdata.UnitId}
                                                                    value={item.ID}
                                                                >{item.UnitName}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select customer type
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <InputField controlId="Rate" label="Rate"
                                                type="number"
                                                value={materialsdata.Rate}
                                                name="Rate"
                                                placeholder="Rate"
                                                errormessage="Please enter rate"
                                                required={true}
                                                disabled={false}
                                                onChange={rateChange}
                                            />

                                        <InputField controlId="ExtraCharge" label="ExtraCharge"
                                                type="number"
                                                value={materialsdata.ExtraCharge}
                                                name="ExtraCharge"
                                                placeholder="ExtraCharge"
                                                errormessage="Extra amount"
                                                required={false}
                                                disabled={false}
                                                onChange={extraAmountChange}
                                            />                        


                                        </Row>
                                        <Row className="mb-12">
                                            <InputField controlId="TotalAmount" label="Total amount"
                                                type="number"
                                                value={materialsdata.TotalAmount}
                                                name="TotalAmount"
                                                placeholder="Total amount"
                                                errormessage="Please enter total amount"
                                                required={true}
                                                disabled={true}
                                                onChange={totalAmountChange}
                                            />
                                            {/* <Form.Group controlId="TotalAmount" as={Col} >
                                                <Form.Label>Total amount</Form.Label>
                                                <Form.Control type="number" name="TotalAmount" required onChange={totalAmountChange}
                                                    placeholder="Total amount" value={materialsdata.TotalAmount} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter total amount
                                                </Form.Control.Feedback>
                                            </Form.Group> */}

                                            <InputField controlId="Paid" label="Paid"
                                                type="number"
                                                value={materialsdata.Paid}
                                                name="Paid"
                                                placeholder="Paid"
                                                errormessage="Please enter paid amount"
                                                required={true}
                                                disabled={false}
                                                onChange={paidChange}
                                            />
                                            {/* <Form.Group controlId="Paid" as={Col} >
                                                <Form.Label>Paid</Form.Label>
                                                <Form.Control type="number" name="Email" required onChange={paidChange} value={materialsdata.Paid}
                                                    placeholder="Paid" />
                                                <Form.Control.Feedback type="invalid">
                                                    Please paid amount
                                                </Form.Control.Feedback>
                                            </Form.Group> */}

                                            <InputField controlId="Due" label="Due"
                                                type="number"
                                                value={materialsdata.Due}
                                                name="Due"
                                                placeholder="Due"
                                                errormessage="Please enter due amount"
                                                required={true}
                                                disabled={true}
                                            />

                                            {/* <Form.Group controlId="Due" as={Col} >
                                                <Form.Label>Due</Form.Label>
                                                <Form.Control type="number" name="Due" disabled value={materialsdata.Due}
                                                    placeholder="Due" />

                                            </Form.Group> */}

                                        </Row>
                                        <Row className="mb-4">



                                            <Form.Group as={Col} controlId="PaymentDate">
                                                <Form.Label style={{fontSize:13}}>Payment date</Form.Label>
                                                <DateComponent date={null} onChange={paymentDateChange} 
                                                value={materialsdata.PaymentDate} isRequired={false} />
                                                {/* <Form.Control.Feedback type="invalid">
                                                    Please select payment date
                                                </Form.Control.Feedback> */}
                                                {/* <Form.Control
                                                    type="date"
                                                    value={materialsdata.PaymentDate ? dateForPicker(materialsdata.PaymentDate) : ''}
                                                    onChange={paymentDateChange}
                                                /> */}
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-12">
                                            <Form.Group controlId="Comments" as={Col} >
                                                <Form.Label style={{fontSize:13}}>Comments</Form.Label>
                                                <Form.Control as="textarea" rows={3} name="Comments" onChange={commentsChange} value={materialsdata.Comments}
                                                    placeholder="Comments"  style={{fontSize:13}}/>
                                            </Form.Group>
                                        </Row>

                                        <Form.Group as={Col}>
                                            {materialsdata.Id <= 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                                                    Add
                                                </Button>
                                                : null
                                            }

                                            {materialsdata.Id > 0 ?

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

export default RawMaterials
