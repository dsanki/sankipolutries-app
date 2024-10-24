import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate,useParams, useLocation } from 'react-router-dom'
import moment from 'moment';
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'
import { FetchUnit, FetchShedsList, FetchLots, FetchLotById, FetchShedLotMapList, FetchBirdSaleList, 
    dateyyyymmdd, downloadExcel, HandleLogout, NumberInputKeyDown,FetchCompanyDetails,
    AmountInWords,ReplaceNonNumeric,Commarize } from '../../Utility'
    
import Loading from '../Loading/Loading'

import { PDFViewer } from '@react-pdf/renderer';
import InvoiceBirdSale from './InvoiceBirdSale';



function BirdSale(props) {

    let history = useNavigate();
    //const { uid } = useParams();
    const search = useLocation().search;
    //const uid = new URLSearchParams(search).get('uid');
    const [uid, setUid] = useState(new URLSearchParams(search).get('uid'));
    const [shedlist, setShedList] = useState([]);
    const [lots, setLots] = useState([]);
    const [shedlotmaplist, SetShedLotMapList] = useState([]);
    const [birdSaleList, setBirdSaleList] = useState([]);
    const [unitlist, setUnitList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);
    const [_lotname, setLotName] = useState();
    const [_totalbirds, setTotalBirds] = useState();
    const [customerdetails, setCustomerDetails] = useState([]);
    const [custname, setCustomerName] = useState([]);
    const [birdSaleListFilter, setBirdSaleListFilter] = useState([]);
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [filterShed, setFilterShed] = useState();
    const [isloaded, setIsLoaded] = useState(true);
    const [companydetails, setCompanyDetails] = useState([]);
    const [invoiceModalShow, setInvoiceModalShow] = useState(false);

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
        CustomerId: uid,
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
        TotalBirdSale: "",
        CustomerName:""
    };

    const downloadfields = [{
        Date: "",
        LotName: "",
        ShedName: "",
        CustomerId: uid,
        BirdCount: "",
        TotalBirdSale: "",
        TotalWeight: "",
        Unit: "",
        Rate: "",
        TotalAmount: "",
        Paid: "",
        Due: "",
        PaymentDate: "",
        Comments: "",
        CustomerName:""
    }];

    const [birdsaledata, setBirdSaleData] = useState(initialvalues);

    const clickAddBirdSale = () => {
        setAddModalShow({ addModalShow: true });
        setBirdSaleData({
            modaltitle: "Add Bird Sale",
            Id: 0,
            LotId: "",
            ShedId: "",
            Date: "",
            CustomerId: uid,
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
            TotalBirdSale: "",
            InvoiceNo:""
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
            CustomerId: md.CustomerId,
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
            TotalBirdSale: md.TotalBirdSale,
            InvoiceNo:md.InvoiceNo,
            CustomerName:md.CustomerName
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
            setBirdSaleData({ ...birdsaledata, ShedId: e.target.value, LotId: filterval[0].lotid });
            setLotName(filterval[0].lotname);
            FetchLotById(filterval[0].lotid)
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
        setBirdSaleData({ ...birdsaledata, CustomerId: e.target.value });
    }

    const birdcountChange = (e) => {

        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setBirdSaleData({ ...birdsaledata, BirdCount: e.target.value });
        }
    }

    const totalWeightChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        let totalwt = e.target.value;
        if (totalwt === '' || re.test(totalwt)) {
        let totalamt = totalwt * birdsaledata.Rate;
        let due = totalamt - birdsaledata.Paid
        setBirdSaleData({
            ...birdsaledata,
            TotalWeight: totalwt,
            TotalAmount: totalamt.toFixed(2),
            Due: due.toFixed(2)
        });
    }
    }

    const unitIdChange = (e) => {
        setBirdSaleData({ ...birdsaledata, UnitId: e.target.value });
    }

    const rateChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        let rate = e.target.value;
        if (rate === '' || re.test(rate)) {
        let totalamt = birdsaledata.TotalWeight * rate;
        let due = totalamt - birdsaledata.Paid
        setBirdSaleData({
            ...birdsaledata,
            Rate: rate,
            TotalAmount: totalamt.toFixed(2),
            Due: due.toFixed(2)
        });
    }
    }

    const fetchCompanyDetails = async () => {
        FetchCompanyDetails()
            .then(data => {
                if (data.StatusCode === 200) {
                    setCompanyDetails(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }
            })
    }

    // const totalAmountChange = (e) => {
    //     setBirdSaleData({
    //         ...birdsaledata,
    //         TotalAmount: e.target.value,
    //         Due: e.target.value - birdsaledata.Paid
    //     });
    // }

    const paidChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
        setBirdSaleData({ ...birdsaledata, Paid: e.target.value, Due: (birdsaledata.TotalAmount - e.target.value).toFixed(2) });
        }
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
            fetchCustomerDetails(uid);
            setBirdSaleData({ ...birdsaledata, CustomerId: uid });
            fetchCompanyDetails();
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, []);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            _birdSaleList(uid);
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);


    const fetchUnit = () => {
        FetchUnit()
            .then(data => {
                if (data.StatusCode === 200) {
                    setUnitList(data.Result);
                }
                else {
                    errorHandle(data.StatusCode);
                }
            });
    }

    const fetchSheds = () => {
        FetchShedsList()
            .then(data => {
                if (data.StatusCode === 200) {
                    setShedList(data.Result);
                }
                else {
                    errorHandle(data.StatusCode);
                }
            });
    }

    const fetchLots = () => {
        FetchLots()
            .then(data => {
                if (data.StatusCode === 200) {
                    setLots(data.Result);
                }
                else {
                    errorHandle(data.StatusCode);
                }
            });
    }

    const fetchShedLotsMapList = () => {
        FetchShedLotMapList()
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
        if (code === 300) {
            props.showAlert("Data is exists!!", "danger")
        }
        else if (code === 401) {
            HandleLogout();
            history("/login")
        }
        else if (code === 404) {
            props.showAlert("Data not found!!", "danger")
        }
        else {
            props.showAlert("Error occurred!!", "danger")
        }
    }

    const _birdSaleList = (uid) => {
        setIsLoaded(true);
        FetchBirdSaleList(uid,null)
            .then(data => {
                if (data.StatusCode === 200) {
                    setBirdSaleList(data.Result);
                    setBirdSaleListFilter(data.Result);
                    setTotalPages(Math.ceil(data.Result.length / process.env.REACT_APP_PAGE_PAGINATION_NO));
                    setIsLoaded(false);
                }
                else if (data.StatusCode === 401) {
                    setIsLoaded(false);
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 500) {
                    setIsLoaded(false);
                    HandleLogout();
                    history("/login")
                }
                else {
                    setIsLoaded(false);
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

            fetch(process.env.REACT_APP_API + 'BirdSale/UpdateBirdSale', {
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
                    CustomerId: birdsaledata.CustomerId,
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


    const clickInvoice = (birdsaledata) => {

        setBirdSaleData({
                    Id: birdsaledata.Id,
                    LotId: birdsaledata.LotId,
                    ShedId: birdsaledata.ShedId,
                    Date: birdsaledata.Date,
                    CustomerId: birdsaledata.CustomerId,
                    BirdCount: birdsaledata.BirdCount,
                    TotalWeight: birdsaledata.TotalWeight,
                    UnitId: birdsaledata.UnitId,
                    Rate: birdsaledata.Rate,
                    TotalAmount: birdsaledata.TotalAmount,
                    Paid: birdsaledata.Paid,
                    Due: birdsaledata.Due,
                    PaymentDate: birdsaledata.PaymentDate,
                    Comments: birdsaledata.Comments,
                    AmountInWords: AmountInWords(birdsaledata.TotalAmount),
                    InvoiceNo:birdsaledata.InvoiceNo
            
        });

        setInvoiceModalShow(true);
    }

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'BirdSale/AddBirdSale', {
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
                    CustomerId: birdsaledata.CustomerId,
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
        }

        setValidated(true);
    }

    const deleteBirdSale = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'BirdSale/' + id, {
              method: 'DELETE',
              headers: {
                'Authorization': localStorage.getItem('token')
              }
            })
              .then(res => res.json())
              .then((result) => {
                if (result.StatusCode === 200) {
                  addCount(count);
                  props.showAlert("Successfully deleted", "info")
                }
                else if (result.StatusCode === 401) {
                  HandleLogout();
                  history("/login")
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

    const onDateFilterFromChange = (e) => {
        setFilterFromDate(e.target.value);
        getFilterData(e.target.value, filterToDate, filterShed);
    }


    const getFilterData = (fromDate, toDate, shedid) => {
        let _filterList = [];
        if (fromDate !== "" && toDate !== "") {
            _filterList = birdSaleListFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate) && dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate === "" && toDate !== "") {
            _filterList = birdSaleListFilter.filter((c) => dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate !== "" && toDate === "") {
            _filterList = birdSaleListFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate));
        }
        else {
            _filterList = birdSaleListFilter;
        }

        if (shedid > 0) {
            _filterList = _filterList.filter((c) => c.ShedId === parseInt(shedid));
        }


        setBirdSaleList(_filterList);
    }

    const onDateFilterToChange = (e) => {
        setFilterToDate(e.target.value);
        getFilterData(filterFromDate, e.target.value, filterShed);
    }

    const onShedFilterChange = (e) => {
        setFilterShed(e.target.value);
        getFilterData(filterFromDate, filterToDate, e.target.value)
    }

    let BirdSaleListDowanloadArr = [];
    const onDownloadExcel = () => {

        downloadExcel(BirdSaleListDowanloadArr, "BirdSaleList");
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
    const nextDisabled = currentPage === totalPages

    const itemsPerPage = process.env.REACT_APP_PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    let itemsToDiaplay = birdSaleList.slice(startIndex, endIndex);

    if (itemsToDiaplay.length === 0 && birdSaleList.length > 0) {
        setCurrentPage(currentPage - 1);
    }

    let addInvoiceModalClose = () => {
        setInvoiceModalShow(false);
    };

    const fetchCustomerDetails = async (custid) => {
        fetch(process.env.REACT_APP_API + 'Customer/GetCustomerById?id=' + custid,
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
                    setCustomerDetails(data.Result);
                    if(data.Result.MiddleName!="" && data.Result.MiddleName!=null)
                    {
                        setCustomerName(data.Result.FirstName + " " + 
                            data.Result.MiddleName + " " +data.Result.LastName);
                    }
                    else{
                        setCustomerName(data.Result.FirstName + " " + data.Result.LastName);
                    }
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
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


    return (
        <div>
            {isloaded && <Loading />}
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <h2>Bird Sale Tracker</h2>
            </div>
            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row align-items-center">
                    <div className="col">
                        <p><strong>From</strong></p>
                        <DateComponent date={null} onChange={onDateFilterFromChange} isRequired={false} value={filterFromDate} />
                    </div>
                    <div className="col">
                        <p><strong>To</strong></p>
                        <DateComponent date={null} onChange={onDateFilterToChange} isRequired={false} value={filterToDate} />
                    </div>
                    <div className="col">
                        <p><strong>Shed</strong></p>
                        <Form.Select aria-label="Default select example"
                            onChange={onShedFilterChange}>
                            <option selected value="">Choose...</option>
                            {
                                shedlist.map((item) => {
                                    return (
                                        <option
                                            key={item.ShedId}
                                            defaultValue={item.ShedId == null ? null : item.ShedId}
                                            selected={item.ShedId === filterShed}
                                            value={item.ShedId}
                                        >{item.ShedName}</option>
                                    );
                                })
                            }
                        </Form.Select>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col" style={{ textAlign: 'left', marginTop: '20px' }}>
                    <i className="fa-regular fa-file-excel fa-2xl" style={{ color: '#bea2a2' }} onClick={() => onDownloadExcel()} ></i>
                </div>
                <div className="col" style={{ textAlign: 'right', marginTop: '20px' }}>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddBirdSale()}>New</Button>
                </div>

            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='left' className="tr-custom">
                        <th>Date</th>
                        <th>Shed</th>
                        {/* <th>Lot</th> */}
                        <th>Customer name</th>
                        <th>Bird count</th>
                        <th>Total weight</th>
                        <th>Rate</th>
                        <th>Total amount</th>
                        <th>Paid</th>
                        <th>Due</th>
                        <th>Payment date</th>
                        <th>Comments</th>
                        <th>Invoice</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>

                    {

                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
                            const _unit = unitlist.filter((c) => c.ID === p.UnitId);
                            const _uname = _unit.length > 0 ? _unit[0].UnitName : "";

                            const _shed = shedlist.filter((c) => c.ShedId === p.ShedId);
                            const _shedname = _shed.length > 0 ? _shed[0].ShedName : "";

                            const _lot = lots.filter((c) => c.Id === p.LotId);
                            const _lotname = _lot.length > 0 ? _lot[0].LotName : "";
                            p.LotName = _lotname;

                            BirdSaleListDowanloadArr.push({
                                Date: moment(p.Date).format('DD-MMM-YYYY'),
                                ShedName: _shedname, LotName: _lotname, CustomerId: p.CustomerId, BirdCount: p.BirdCount, TotalWeight: p.TotalWeight + " " + _uname,
                                Rate: p.Rate, TotalAmount: p.TotalAmount.toFixed(2), Paid: p.Paid.toFixed(2), Due: p.Due.toFixed(2), PaymentDate: moment(p.PaymentDate).format('DD-MMM-YYYY'),
                                Comments: p.Comments,CustomerName:p.CustomerName
                            });



                            return (
                                !isloaded && <tr align='center' key={p.Id}>
                                    <td align='left'>{moment(p.Date).format('DD-MMM-YYYY')}</td>
                                    <td align='left'>{_shedname}</td>
                                    {/* <td align='left'>{_lotname}</td> */}
                                    <td align='left'>{p.CustomerName}</td>
                                    <td align='left'>{p.BirdCount}</td>
                                    <td align='left'>{p.TotalWeight + " " + _uname}</td>
                                    <td align='left'>{p.Rate}</td>
                                    <td align='left'>{p.TotalAmount.toFixed(2)}</td>
                                    <td align='left'>{p.Paid.toFixed(2)}</td>
                                    <td align='left'>{p.Due.toFixed(2)}</td>
                                    <td align='left'>{moment(p.PaymentDate).format('DD-MMM-YYYY')}</td>
                                    <td align='left'>{p.Comments}</td>
                                    <td>
                                        <i className="fa-sharp fa-solid fa-receipt fa-beat" title='Invoice' 
                                        style={{ color: '#086dba', marginLeft: '15px' }} onClick={() => clickInvoice(p)}></i>
                                    </td>
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
            {
                birdSaleList && birdSaleList.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
                <>
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
            }

            <div className="container" id="exampleModal">
                <Modal
                    show={invoiceModalShow}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    size="xl"
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {birdsaledata.modaltitle}
                        </Modal.Title>
                        <button type="button" className="btn-close" aria-label="Close" 
                        onClick={addInvoiceModalClose}> </button>
                    </Modal.Header>

                    <Modal.Body>
                        <Fragment>
                            <PDFViewer width="900" height="900" className="app" >
                                <InvoiceBirdSale companydetails={companydetails} 
                                birdsaledata={birdsaledata} customerdetails={customerdetails}/>
                            </PDFViewer>
                        </Fragment>
                    </Modal.Body>
                </Modal>
            </div>

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
                                                <Form.Label>Date*</Form.Label>
                                                <DateComponent date={null} onChange={dateChange} isRequired={true} 
                                                value={birdsaledata.Date} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select date
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-12">
                                            <Form.Group controlId="ShedId" as={Col} >
                                                <Form.Label>Shed*</Form.Label>
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
                                                label="Lot name*"
                                                type="text"
                                                value={birdsaledata.LotName}
                                                name="LotName"
                                                placeholder="Lot name"
                                                errormessage="Please provide lot name"
                                                required={true}
                                                disabled={true}
                                            />
                                        </Row>
                                        <Row className="mb-12">
                                        <input type="hidden"  value={birdsaledata.CustomerId} name="name" />
                                          
                                           
                                            <InputField controlId="CustomerName"
                                                label="Customer name*"
                                                type="text"
                                                value={custname}
                                                name="CustomerName"
                                                placeholder="Customer name"
                                                errormessage="Please provide customer name"
                                                required={true}
                                                disabled={true}
                                                // onChange={customerChange}
                                                
                                            />

                                            <InputField controlId="BirdCount"
                                                label="Bird count*"
                                                type="text"
                                                value={birdsaledata.BirdCount}
                                                name="BirdCount"
                                                placeholder="Bird count"
                                                errormessage="Please provide bird count"
                                                required={true}
                                                disabled={false}
                                                onChange={birdcountChange}
                                                onKeyDown={NumberInputKeyDown}
                                            />

                                            <InputField controlId="TotalWeight"
                                                label="Total weight*"
                                                type="text"
                                                value={birdsaledata.TotalWeight}
                                                name="TotalWeight"
                                                placeholder="Total weight"
                                                errormessage="Please provide total weight"
                                                required={true}
                                                disabled={false}
                                                onChange={totalWeightChange}
                                            />

                                        </Row>
                                        <Row className="mb-12">

                                            <Form.Group controlId="UnitId" as={Col} >
                                                <Form.Label>Unit*</Form.Label>
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
                                                label="Rate*"
                                                type="text"
                                                value={birdsaledata.Rate}
                                                name="Rate"
                                                placeholder="Rate"
                                                errormessage="Please enter rate"
                                                required={true}
                                                disabled={false}
                                                onChange={rateChange}
                                            />
                                        </Row>
                                        <Row className="mb-12">
                                            <InputField controlId="TotalAmount" label="Total amount*"
                                                type="text"
                                                value={birdsaledata.TotalAmount}
                                                name="TotalAmount"
                                                placeholder="Total Amount"
                                                errormessage="Please provide total amount"
                                                required={true}
                                                disabled={true}
                                            />

                                            <InputField controlId="Paid" label="Paid*"
                                                type="text"
                                                value={birdsaledata.Paid}
                                                name="Paid"
                                                placeholder="Paid"
                                                errormessage="Please provide paid amount"
                                                required={true}
                                                disabled={false}
                                                onChange={paidChange}
                                            />
                                            <InputField controlId="Due" label="Due"
                                                type="text"
                                                value={birdsaledata.Due}
                                                name="Due"
                                                placeholder="Due"
                                                errormessage="Please provide due amount"
                                                required={true}
                                                disabled={true}
                                            />
                                        </Row>
                                        <Row className="mb-4">
                                            <Form.Group as={Col} controlId="PaymentDate">
                                                <Form.Label>Payment date*</Form.Label>
                                                <DateComponent date={null} onChange={paymentDateChange} isRequired={true} value={birdsaledata.PaymentDate} />
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
