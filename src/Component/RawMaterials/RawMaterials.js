import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'
import {
    GetCustomerByTypeId, dateyyyymmdd, FecthStockListById,
    HandleLogout, downloadExcel
} from './../../Utility'
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

    const [stockList, setStockList] = useState([]);

    const [rawconSolList, setRawConsolList] = useState({
        TotalCost:0,
        TotalPaid:0,
        TotalDue:0
    });

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
        InvoiceDate: "",
        InvoiceNo: "",
        ExtraCharge: "",
        GST: ""

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
            InvoiceDate: "",
            InvoiceNo: "",
            ExtraCharge: "",
            GST: ""

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
            InvoiceDate: md.InvoiceDate,
            InvoiceNo: md.InvoiceNo,
            ExtraCharge: md.ExtraCharge,
            GST: md.GST

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
            TotalAmount: Math.round((e.target.value * materialsdata.Rate) +
                parseFloat(materialsdata.ExtraCharge || 0)).toFixed(2),
            Due: Math.round(((e.target.value * materialsdata.Rate) +
                parseFloat(materialsdata.ExtraCharge || 0)) - materialsdata.Paid).toFixed(2)
        });
    }

    const unitIdChange = (e) => {
        setMaterialsData({ ...materialsdata, UnitId: e.target.value });
    }

    const rateChange = (e) => {

        let gstpercentage = parseFloat(materialsdata.GST || 0) / 100;
        let totalamount = parseFloat(materialsdata.Quantity || 0) * parseFloat(e.target.value || 0);
        let totalgst = totalamount * gstpercentage;
        let totalinclGST = Math.round(totalamount + totalgst
            + parseFloat(materialsdata.ExtraCharge || 0)).toFixed(2);

        // materialsdata.Rate= e.target.value;
        // materialsdata.TotalAmount=totalinclGST;
        // materialsdata.Due=Math.round(totalinclGST - parseFloat(materialsdata.Paid||0)).toFixed(2);

        setMaterialsData(materialsdata);
        setMaterialsData({
            ...materialsdata, Rate: e.target.value,
            TotalAmount: totalinclGST, Due: Math.round(totalinclGST -
                parseFloat(materialsdata.Paid || 0)).toFixed(2)

        });

        // setMaterialsData({
        //     ...materialsdata,
        //     Rate: e.target.value,
        //     TotalAmount: Math.round((materialsdata.Quantity * e.target.value) + parseFloat(materialsdata.ExtraCharge || 0)).toFixed(2),
        //     Due: Math.round(((materialsdata.Quantity * e.target.value) + parseFloat(materialsdata.ExtraCharge || 0))
        //         - materialsdata.Paid).toFixed(2)
        // });
    }

    const gstChange = (e) => {

        //let data = [...materialsdata];
        let gstpercentage = parseFloat(e.target.value || 0) / 100;
        let totalamount = parseFloat(materialsdata.Quantity || 0) * parseFloat(materialsdata.Rate || 0);
        let totalgst = totalamount * gstpercentage;
        let totalinclGST = Math.round(totalamount + totalgst
            + parseFloat(materialsdata.ExtraCharge || 0)).toFixed(2);

        //  materialsdata.GST= e.target.value;
        // materialsdata.TotalAmount=totalinclGST;
        // materialsdata.Due=Math.round(totalinclGST - parseFloat(materialsdata.Paid||0)).toFixed(2);

        setMaterialsData({
            ...materialsdata, GST: e.target.value,
            TotalAmount: totalinclGST, Due: Math.round(totalinclGST - parseFloat(materialsdata.Paid || 0)).toFixed(2)
        });

        // setMaterialsData({
        //     ...materialsdata,
        //     GST: e.target.value,
        //     TotalAmount: totalinclGST,
        //     Due: Math.round(totalinclGST - materialsdata.Paid).toFixed(2)

        //     // Math.round(((materialsdata.Quantity * e.target.value)+ 
        //     // parseFloat(materialsdata.ExtraCharge||0)) 
        //     // - materialsdata.Paid).toFixed(2)
        // });
    }

    const totalAmountChange = (e) => {
        setMaterialsData({
            ...materialsdata,
            TotalAmount: Math.round(e.target.value).toFixed(2),
            Due: Math.round((e.target.value + parseFloat(materialsdata.ExtraCharge || 0)) - materialsdata.Paid).toFixed(2)
        });
    }

    const extraAmountChange = (e) => {

        let gstpercentage = parseFloat(materialsdata.GST || 0) / 100;
        let totalamount = parseFloat(materialsdata.Quantity || 0) * parseFloat(materialsdata.Rate || 0);
        let totalgst = totalamount * gstpercentage;
        let totalinclGST = Math.round(totalamount + totalgst
            + parseFloat(e.target.value || 0)).toFixed(2);


        setMaterialsData({
            ...materialsdata,
            ExtraCharge: e.target.value,
            TotalAmount: totalinclGST,//Math.round((materialsdata.Quantity * materialsdata.Rate) 
            Due: Math.round(totalinclGST - parseFloat(materialsdata.Paid || 0)).toFixed(2)

            //Math.round(((materialsdata.Quantity * materialsdata.Rate) + parseFloat(e.target.value || 0)) - materialsdata.Paid).toFixed(2)
        });
    }

    const paidChange = (e) => {
        setMaterialsData({
            ...materialsdata, Paid: e.target.value,
            Due: Math.round(parseFloat(materialsdata.TotalAmount) - parseFloat(e.target.value || 0)).toFixed(2)
        });
    }
    const paymentDateChange = (e) => {
        setMaterialsData({ ...materialsdata, PaymentDate: e.target.value });
    }
    const commentsChange = (e) => {
        setMaterialsData({ ...materialsdata, Comments: e.target.value });
    }


    const calculateValues = (data) => {
        const { totalCost,totalPaid,totalDue } =
        data.reduce((accumulator, item) => {
          accumulator.totalCost += item.TotalAmount;
          accumulator.totalPaid+=item.Paid;
          accumulator.totalDue += item.Due;
          return accumulator;
        }, { totalCost: 0, totalPaid:0,totalDue:0 })
       
        setRawConsolList({ ...rawconSolList, TotalCost: totalCost,
            TotalPaid:totalPaid,TotalDue:totalDue
         });
      }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchUnit();
            fetchClient();
            fetchRawMaterials();
            //fetchMaterialsTypes();
            fetchStockByCatId();
            calculateValues(rawmaterialList);

            // const { totalCost,totalPaid,totalDue } =
            // rawmaterialList.reduce((accumulator, item) => {
            //   accumulator.totalCost += item.TotalAmount;
            //   accumulator.totalPaid+=item.Paid;
            //   accumulator.totalDue += item.Due;
             
            //   return accumulator;
            // }, { totalCost: 0, totalPaid:0,totalDue:0 })
           
            // setRawConsolList({ ...rawconSolList, TotalCost: totalCost,
            //     TotalPaid:totalPaid,TotalDue:totalDue
            //  });

        }
        else {

            history("/login")
        }
    }, [obj]);



    const fetchRawMaterials = async () => {
        fetch(process.env.REACT_APP_API + 'RawMaterials/GetRawMaterials?CompanyId=' + localStorage.getItem('companyid'),
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
                    calculateValues(data.Result);
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

    //FecthStockListById

    const fetchStockByCatId = async () => {
        FecthStockListById(process.env.REACT_APP_STOCK_CAT_RAW_MATERIALS,
            process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setStockList(data.Result);
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

    // const fetchMaterialsTypes = async () => {
    //     fetch(process.env.REACT_APP_API + 'RawMaterials/GetRawMaterialsTypes',
    //         {
    //             method: 'GET',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': localStorage.getItem('token')
    //             }
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.StatusCode === 200) {
    //                 setRawMaterialsTypes(data.Result);
    //             }
    //             else if (data.StatusCode === 401) {
    //                 history("/login")
    //             }
    //             else if (data.StatusCode === 404) {
    //                 props.showAlert("Data not found!!", "danger")
    //             }
    //             else {
    //                 props.showAlert("Error occurred!!", "danger")
    //             }
    //         });
    // }

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


    const fetchClient = async () => {
        GetCustomerByTypeId(process.env.REACT_APP_CUST_TYPE_ID,
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
                    InvoiceDate: materialsdata.InvoiceDate,
                    InvoiceNo: materialsdata.InvoiceNo,
                    ExtraCharge: materialsdata.ExtraCharge,
                    GST: materialsdata.GST,
                    CompanyId: localStorage.getItem('companyid')

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result > 0 || result.StatusCode === 200 || result.StatusCode === "OK") {

                        addCount(count);
                        // setAddModalShow(false);
                        // setValidated(false);  

                        addModalClose();

                        props.showAlert("Successfully updated", "info")
                    }
                    else {
                        props.showAlert("Error occurred!!", "danger")
                        setValidated(true);
                    }

                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                        setValidated(true);
                    });
        }
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
                    InvoiceDate: materialsdata.InvoiceDate,
                    InvoiceNo: materialsdata.InvoiceNo,
                    ExtraCharge: materialsdata.ExtraCharge,
                    GST: materialsdata.GST,
                    CompanyId: localStorage.getItem('companyid')

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result > 0 || result.StatusCode === 200 || result.StatusCode === "OK") {
                        addCount(count);
                        //setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
                        // setValidated(false);
                        addModalClose();
                    }
                    else {
                        props.showAlert("Error occurred!!", "danger")
                        setValidated(true);
                    }

                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                        setValidated(true);
                    });
        }


    }

    const deleteMaterials = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'RawMaterials/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then((result) => {

                    if (result.StatusCode === 200) {

                        props.showAlert("Successfully deleted", "info")
                        addCount(count);
                    }
                    else if (result.StatusCode === 401) {
                        HandleLogout();
                        history("/login")
                    }
                    else if (result.StatusCode === 404) {
                        props.showAlert("Data not found!!", "danger")
                    }
                    else {
                        props.showAlert("Error occurred!!", "danger")
                    }
                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    });
        }
    }

    const filterSupplierChange = (e) => {

        if (e.target.value > 0) {
            const _medd = rawmaterialListFilter.filter((c) => c.ClientId === parseInt(e.target.value));
            setRawMaterialList(_medd);
            calculateValues(_medd);
        }
        else {
            setRawMaterialList(rawmaterialListFilter);
            calculateValues(rawmaterialListFilter);
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
                <h4>Raw Materials</h4>
            </div>

            <div className="row">
                <div className="col">
                    <p><strong>Supplier</strong></p>
                    <select className="form-select" aria-label="Default select example"
                        onChange={filterSupplierChange} style={{ fontSize: 13 }}>
                        <option selected>--Select Supplier--</option>
                        {

                            clientlist.map((item) => {

                                let fullname = (item.MiddleName != "" && item.MiddleName != null) ? item.FirstName + " " + item.MiddleName + " " + item.LastName :
                                    item.FirstName + " " + item.LastName;
                                return (
                                    <option value={item.ID} key={item.ID}>{fullname}</option>)
                            }
                            )};
                    </select>
                </div>
                <div className="col" style={{ textAlign: 'right' }}>
                    <a className="mr-2 btn btn-primary"
                        style={{ marginRight: '10px' }}
                        href={`/rawmaterialspaymentout/?custtype=${process.env.REACT_APP_CUST_TYPE_RAW_MATERIALS}`}>Payment</a>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddMaterials()}>Add</Button>
                </div>

            </div>


            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center' className="tr-custom" style={{fontSize:'13px'}}>
                        <th>Date</th>
                        <th>Supplier</th>
                        <th>Materials name</th>
                        <th>Broker</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>GST</th>
                        <th>Total amount</th>
                        <th>Extra Charge</th>
                        <th>Paid</th>
                        <th>Due</th>
                        {/* <th>Payment date</th>
                        <th>Comments</th> */}
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
                            let _suppname = _supp.length > 0 ? (_supp[0].MiddleName != "" && _supp[0].MiddleName != null) ?
                                _supp[0].FirstName + " " + _supp[0].MiddleName + " " + _supp[0].LastName :
                                _supp[0].FirstName + " " + _supp[0].LastName : "";
                            const _mat = stockList.filter((c) => c.ItemId === p.MaterialTypeId);
                            const _matname = _mat.length > 0 ? _mat[0].ItemName : "";

                            return (
                                <tr align='center' key={p.Id} style={{ fontSize: '12.5px' }} >
                                    <td align='center'>{moment(p.BillingDate).format('DD-MMM-YYYY')}</td>
                                    <td align='center'  style= {{ overflowWrap:"break-word" }}>{_suppname}</td>
                                    <td align='center'>{_matname}</td>
                                    <td align='center'>{p.Broker}</td>
                                    <td align='center'>{p.Quantity + " " + _uname}</td>
                                    <td align='center'>{p.Rate}</td>
                                    <td align='center'>{p.GST}</td>
                                    <td align='center'>{p.TotalAmount.toFixed(2)}</td>
                                    <td align='center'>{parseFloat(p.ExtraCharge || 0).toFixed(2)}</td>
                                    <td align='center'>{p.Paid.toFixed(2)}</td>
                                    <td align='center'>{p.Due.toFixed(2)}</td>
                                    {/* <td align='left'>{p.PaymentDate != null ? moment(p.PaymentDate).format('DD-MMM-YYYY') : ""}</td>
                                    <td align='left'>{p.Comments}</td> */}
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
                <tfoot style={{ backgroundColor: '#cccccc', fontWeight: 'bold', fontSize: 13 }}>
                    <td align='center'>Total</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td align='center'>{parseFloat(rawconSolList.TotalCost).toFixed(2)}</td>
                    <td></td>
                    <td align='center'>{parseFloat(rawconSolList.TotalPaid).toFixed(2)}</td>
                    <td align='center'>{parseFloat(rawconSolList.TotalDue).toFixed(2)}</td>
                    {/* <td></td>
                    <td></td> */}
                    <td></td>
                </tfoot>
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
                        <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: '18px' }}>
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
                                                <Form.Label style={{ fontSize: 13 }}>Invoice Date</Form.Label>
                                                <DateComponent date={null} onChange={invoiceDateChange} isRequired={true}
                                                    value={materialsdata.InvoiceDate} />
                                                <Form.Control.Feedback type="invalid">
                                                    Select invoice date
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <InputField controlId="InvoiceNo" label="Invoice no"
                                                type="text"
                                                value={materialsdata.InvoiceNo}
                                                name="InvoiceNo"
                                                placeholder="Invoice no"
                                                errormessage="Enter Invoice no"
                                                onChange={invoiceNoChange}
                                                required={true}
                                                disabled={false}
                                            />
                                        </Row>
                                        <Row className="mb-12">

                                            <Form.Group as={Col} controlId="Date">
                                                <Form.Label style={{ fontSize: 13 }}>Date</Form.Label>
                                                <DateComponent date={null} onChange={billingDateChange} isRequired={true}
                                                    value={materialsdata.BillingDate} />
                                                <Form.Control.Feedback type="invalid">
                                                    Select date
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-12">
                                            <Form.Group controlId="MaterialTypeId" as={Col} >
                                                <Form.Label style={{ fontSize: 13 }}>Material</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={materialTypeChange} required style={{ fontSize: 13 }}>
                                                    <option selected disabled value="">Choose...</option>
                                                    {
                                                        stockList.map((item) => {
                                                            return (
                                                                <option
                                                                    key={item.ItemId}
                                                                    defaultValue={item.ItemId == null ? null : item.ItemId}
                                                                    selected={item.ItemId === materialsdata.MaterialTypeId}
                                                                    value={item.ItemId}
                                                                >{item.ItemName}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Select material
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group controlId="ClientId" as={Col} >
                                                <Form.Label style={{ fontSize: 13 }}>Supplier</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={clientIdChange} required style={{ fontSize: 13 }}>
                                                    <option selected disabled value="">Choose...</option>
                                                    {

                                                        clientlist.map((item) => {

                                                            let fullname = (item.MiddleName != "" && item.MiddleName != null) ? item.FirstName + " " + item.MiddleName + " " + item.LastName :
                                                                item.FirstName + " " + item.LastName;
                                                            return (
                                                                <option value={item.ID}
                                                                    key={item.ID}
                                                                    defaultValue={item.ID == null ? null : item.ID}
                                                                    selected={item.ID === materialsdata.ClientId}>{fullname}</option>)
                                                        })

                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Select supplier
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <InputField controlId="Broker" label="Broker"
                                                type="text"
                                                value={materialsdata.Broker}
                                                name="Broker"
                                                placeholder="Broker"
                                                errormessage="Enter broker name"
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
                                                errormessage="Enter quantity"
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
                                                <Form.Label style={{ fontSize: 13 }}>Unit</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={unitIdChange} required style={{ fontSize: 13 }}>
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
                                                    Select customer type
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <InputField controlId="Rate" label="Rate"
                                                type="number"
                                                value={materialsdata.Rate}
                                                name="Rate"
                                                placeholder="Rate"
                                                errormessage="Enter rate"
                                                required={true}
                                                disabled={false}
                                                onChange={rateChange}
                                            />

                                            <InputField controlId="GST" label="GST"
                                                type="number"
                                                value={materialsdata.GST}
                                                name="GST"
                                                placeholder="GST"
                                                errormessage="Enter GST"
                                                required={false}
                                                disabled={false}
                                                onChange={gstChange}
                                            />



                                            <InputField controlId="ExtraCharge" label="Extra charge"
                                                type="number"
                                                value={materialsdata.ExtraCharge}
                                                name="ExtraCharge"
                                                placeholder="Extra charge"
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
                                                errormessage="Enter total amount"
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
                                                errormessage="Enter paid amount"
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
                                                errormessage="Enter due amount"
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
                                                <Form.Label style={{ fontSize: 13 }}>Payment date</Form.Label>
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
                                                <Form.Label style={{ fontSize: 13 }}>Comments</Form.Label>
                                                <Form.Control as="textarea" rows={3} name="Comments" onChange={commentsChange} value={materialsdata.Comments}
                                                    placeholder="Comments" style={{ fontSize: 13 }} />
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
