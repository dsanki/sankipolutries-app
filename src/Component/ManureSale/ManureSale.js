import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Moment from 'moment';
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'
import {
    FetchUnit,
    dateyyyymmdd, downloadExcel, HandleLogout, NumberInputKeyDown, FetchCompanyDetails, GetCustomerByTypeId,
    AmountInWords, ReplaceNonNumeric, Commarize, ConvertNumberToWords
,downloadExcelFilter} from '../../Utility'

import Loading from '../Loading/Loading'

import { PDFViewer } from '@react-pdf/renderer';

function ManureSale(props) {
    let history = useNavigate();
    //const { uid } = useParams();
    const search = useLocation().search;
    //const uid = new URLSearchParams(search).get('uid');
    //const [uid, setUid] = useState(new URLSearchParams(search).get('uid'));

    const [manureSaleList, setManureSaleList] = useState([]);
    const [manureSaleListFilter, setManureSaleListFilter] = useState([]);
    const [unitlist, setUnitList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);
    const [customerdetails, setCustomerDetails] = useState([]);
    const [custname, setCustomerName] = useState([]);
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [clientlist, setClientList] = useState([]);
    const [isloaded, setIsLoaded] = useState(true);
    const [companydetails, setCompanyDetails] = useState([]);
    const [invoiceModalShow, setInvoiceModalShow] = useState(false);
    const [_unitname, setUnitName] = useState();
    const [itemsPerPage, setItemsPerPage] = useState(10);
     const [companydetailsfromlocal, setCompanyDetailsFromLocal] = 
     useState(JSON.parse(localStorage.getItem('companydetails')));

     const [ucount, setUCount] = useState(0);
        const objupdate = useMemo(() => ({ ucount }), [ucount]);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

       const [manureconSolList, setManureConsolList] = useState({
            TotalAmount: 0,
            TotalFinalAmount: 0,
            TotalDiscount: 0,
            TotalPaid: 0,
            TotalDue: 0
        });


        const calculateValues = (data) => {
            const { totalAmount, totalFinalAmount,totalDiscount, totalPaid, totalDue } =
                data.reduce((accumulator, item) => {
                    accumulator.totalAmount += item.TotalAmount;
                    accumulator.totalFinalAmount += item.FinalCost;
                    accumulator.totalDiscount += item.Discount;
                    accumulator.totalPaid += item.Paid;
                    accumulator.totalDue += item.Due;
    
                    return accumulator;
                }, { totalAmount: 0, totalFinalAmount:0,totalDiscount:0,totalPaid: 0, totalDue: 0 })
    
                setManureConsolList({
                ...manureconSolList, TotalAmount: totalAmount,TotalFinalAmount:totalFinalAmount,
                TotalDiscount:totalDiscount,
                TotalPaid: totalPaid, TotalDue: totalDue
            });
        }
    

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        UnitId: "",
        CustomerId: "",
        CompanyId: "",
        Paid: "",
        Due: "",
        Date: "",
        Cash: "",
        PhonePay: "",
        NetBanking: "",
        CashDeposite: "",
        UnitPrice: "",
        TotalAmount: "",
        AdditionalCharge: "",
        PaymentDate: "",
        Discount: "",
        FinalCost: "",
        InvoiceNo: "",
        CustomerName: "",
        Quantity: "",
        Comments: ""
    };

    const [manureSaleData, setManureSaleData] = useState(initialvalues);

    const clickAddManureSale = () => {
        setAddModalShow({ addModalShow: true });
        setManureSaleData({
            modaltitle: "Add Manure Sale",
            Id: 0,
            UnitId: "",
            CustomerId: "",
            CompanyId: "",
            Paid: "",
            Due: "",
            Date: "",
            Cash: "",
            PhonePay: "",
            NetBanking: "",
            CashDeposite: "",
            UnitPrice: "",
            TotalAmount: "",
            AdditionalCharge: "",
            PaymentDate: "",
            Discount: "",
            FinalCost: "",
            InvoiceNo: "",
            CustomerName: "",
            Quantity: "",
            Comments: ""
        })
    }

    const clickEditManureSale = (md) => {
        setAddModalShow({ addModalShow: true });
        setManureSaleData({
            modaltitle: "Edit Manure Sale",
            Id: md.Id,
            UnitId: md.UnitId,
            CustomerId: md.CustomerId,
            CompanyId: md.CompanyId,
            Paid: md.Paid,
            Due: md.Due,
            Date: md.Date,
            Cash: md.Cash,
            PhonePay: md.PhonePay,
            NetBanking: md.NetBanking,
            CashDeposite: md.CashDeposite,
            UnitPrice: md.UnitPrice,
            TotalAmount: md.TotalAmount,
            AdditionalCharge: md.AdditionalCharge,
            PaymentDate: md.PaymentDate,
            Discount: md.Discount,
            FinalCost: md.FinalCost,
            InvoiceNo: md.InvoiceNo,
            CustomerName: md.CustomerName,
            Comments: md.Comments,
            Quantity: md.Quantity
        })
    }

    const commentsChange = (e) => {
        setManureSaleData({
            ...manureSaleData, Comments: e.target.value
        });
    }

    const dateChange = (e) => {
        setManureSaleData({ ...manureSaleData, Date: e.target.value });
    }

    const customerChange = (e) => {
        setManureSaleData({ ...manureSaleData, CustomerId: e.target.value });
    }

    const unitIdChange = (e) => {
        setManureSaleData({ ...manureSaleData, UnitId: e.target.value });
    }

    const quantityChange = (e) => {
        let _totalAmt = manureSaleData.UnitPrice * e.target.value;
        let _finalcost = (parseFloat(_totalAmt || 0) - parseFloat(manureSaleData.Discount || 0));
        setManureSaleData({
            ...manureSaleData, Quantity: e.target.value,
            TotalAmount: _totalAmt,
            Due: _finalcost - parseFloat(manureSaleData.Paid || 0),
            FinalCost: _finalcost
        });
    }

    const unitPriceChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        let rate = e.target.value;
        if (rate === '' || re.test(rate)) {

            let _totalAmt = rate * manureSaleData.Quantity;
            let _finalcost = (parseFloat(_totalAmt || 0) - parseFloat(manureSaleData.Discount || 0));

            // let totalamt = manureSaleData.Quantity * rate;
            let due = _finalcost - parseFloat(manureSaleData.Paid || 0)

            setManureSaleData({
                ...manureSaleData,
                UnitPrice: rate,
                TotalAmount: _totalAmt.toFixed(2),
                Due: due.toFixed(2),
                FinalCost: _finalcost
            });



        }
    }

    const fetchCompanyDetails = async () => {
        FetchCompanyDetails(process.env.REACT_APP_API)
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

    const paidChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setManureSaleData({
                ...manureSaleData, Paid: e.target.value,
                Due: (manureSaleData.TotalAmount - e.target.value).toFixed(2)
            });
        }
    }

   
    const paymentDateChange = (e) => {
        setManureSaleData({ ...manureSaleData, PaymentDate: e.target.value });
    }

    const additionalChargeChange = (e) => {
        let addch = parseFloat(e.target.value || 0);
        let _totalAmt=(parseFloat(manureSaleData.Quantity || 0) * parseFloat(manureSaleData.UnitPrice || 0)) 
        let _finalcost =((parseFloat(_totalAmt || 0) +addch)- parseFloat(manureSaleData.Discount || 0));


        setManureSaleData({
            ...manureSaleData, AdditionalCharge: e.target.value,
            Due: _finalcost-parseFloat(manureSaleData.Paid||0),
            TotalAmount: (_totalAmt +addch).toFixed(2),
            FinalCost:_finalcost.toFixed(2)
        });
    }

    const cashChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let cashamt = parseFloat(e.target.value || 0);
            setManureSaleData({
                ...manureSaleData, Cash: e.target.value,
                Paid: (cashamt + parseFloat(manureSaleData.PhonePay || 0) +
                    parseFloat(manureSaleData.NetBanking || 0) 
                    + parseFloat(manureSaleData.CashDeposite || 0)),
                Due: (manureSaleData.FinalCost -
                    (cashamt + parseFloat(manureSaleData.PhonePay || 0) +
                        parseFloat(manureSaleData.NetBanking || 0) 
                        + parseFloat(manureSaleData.CashDeposite || 0))
                )
            });
        }
    }

    const phonePayChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let phpayamt = parseFloat(e.target.value || 0);
            //setBirdSaleData({ ...birdsaledata, VehicleNo: e.target.value });

            setManureSaleData({
                ...manureSaleData, PhonePay: e.target.value,
                Paid: (phpayamt + parseFloat(manureSaleData.Cash || 0) +
                    parseFloat(manureSaleData.NetBanking || 0) + parseFloat(manureSaleData.CashDeposite || 0)),
                Due: (manureSaleData.FinalCost -
                    (phpayamt + parseFloat(manureSaleData.Cash || 0) +
                        parseFloat(manureSaleData.NetBanking || 0) + parseFloat(manureSaleData.CashDeposite || 0))
                )
            });
        }
    }

    const netBankingChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let nbamt = parseFloat(e.target.value || 0);

            setManureSaleData({
                ...manureSaleData, NetBanking: e.target.value,
                Paid: (nbamt + parseFloat(manureSaleData.Cash || 0) +
                    parseFloat(manureSaleData.PhonePay || 0) + parseFloat(manureSaleData.CashDeposite || 0)
                ),
                Due: (manureSaleData.FinalCost -
                    (nbamt + parseFloat(manureSaleData.Cash || 0) +
                        parseFloat(manureSaleData.PhonePay || 0) + parseFloat(manureSaleData.CashDeposite || 0))
                )
            });
        }
    }

    const cashDepositeChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let upiamt = parseFloat(e.target.value || 0);

            setManureSaleData({
                ...manureSaleData, CashDeposite: e.target.value,
                Paid: (upiamt + parseFloat(manureSaleData.Cash || 0) +
                    parseFloat(manureSaleData.PhonePay || 0) + parseFloat(manureSaleData.NetBanking || 0)
                ),
                Due: (manureSaleData.FinalCost -
                    (upiamt + parseFloat(manureSaleData.Cash || 0) +
                        parseFloat(manureSaleData.PhonePay || 0) + parseFloat(manureSaleData.NetBanking || 0))
                )
            });
        }
    }

    const clientChange = (e) => {
        setManureSaleData({ ...manureSaleData, CustomerId: e.target.value });
    }

    const discountChange = (e) => {
        let _finalcost = (parseFloat(manureSaleData.TotalAmount || 0) - parseFloat(e.target.value || 0));
        setManureSaleData({
            ...manureSaleData, Discount: e.target.value,
            FinalCost: _finalcost,
            Due: _finalcost - parseFloat(manureSaleData.Paid || 0)
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

    const fetchUnit = () => {
        FetchUnit(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setUnitList(data.Result);
                }
                else {
                    errorHandle(data.StatusCode);
                }
            });
    }

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
                    if (data.Result.MiddleName != "" && data.Result.MiddleName != null) {
                        setCustomerName(data.Result.FirstName + " " +
                            data.Result.MiddleName + " " + data.Result.LastName);
                    }
                    else {
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

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchUnit();
            fetchClient();
            // fetchCustomerDetails(manureSaleData.CustomerId);
            //setManureSaleData({ ...manureSaleData, CustomerId: uid });
            fetchCompanyDetails();
           // _manureSaleList(null);

            // setBankDetails({ ...bankdetails, BankName: process.env.REACT_APP_BANK_NAME,
            //     AccountNo:process.env.REACT_APP_ACCOUNT_NO,IfscCode: process.env.REACT_APP_IFSC_CODE
            //  });
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, []);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            _manureSaleList();
            calculateValues(manureSaleList);
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);

    const fetchClient = async () => {
        GetCustomerByTypeId(process.env.REACT_APP_CUST_TYPE_MANURE,
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


    const _manureSaleList = () => {
        setIsLoaded(true);
        fetch(process.env.REACT_APP_API + 'Manure/GetManureList?CompanyId=' + localStorage.getItem('companyid'),
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
                    setManureSaleList(data.Result);
                    setManureSaleListFilter(data.Result);
                    if (data.Result.length > 0) {
                    setTotalPages(Math.ceil(data.Result.length / process.env.REACT_APP_PAGE_PAGINATION_NO));
                    setCount(data.Result.length);
                    }
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
                    //errorHandle(data.StatusCode);
                }
            });
    }

    let addCount = (num) => {
        setCount(num + 1);
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'Manure/UpdateManure', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({

                    Id: manureSaleData.Id,
                    UnitId: manureSaleData.UnitId,
                    CustomerId: manureSaleData.CustomerId,
                    Paid: manureSaleData.Paid,
                    Due: manureSaleData.Due,
                    Date: manureSaleData.Date,
                    Cash: manureSaleData.Cash,
                    PhonePay: manureSaleData.PhonePay,
                    NetBanking: manureSaleData.NetBanking,
                    CashDeposite: manureSaleData.CashDeposite,
                    UnitPrice: manureSaleData.UnitPrice,
                    TotalAmount: manureSaleData.TotalAmount,
                    AdditionalCharge: manureSaleData.AdditionalCharge,
                    PaymentDate: manureSaleData.PaymentDate,
                    Discount: manureSaleData.Discount,
                    FinalCost: manureSaleData.FinalCost,
                    InvoiceNo: manureSaleData.InvoiceNo,
                    CustomerName: manureSaleData.CustomerName,
                    CompanyId: localStorage.getItem('companyid'),
                    Quantity: manureSaleData.Quantity,
                    Comments: manureSaleData.Comments

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

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'Manure/AddManure', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: manureSaleData.Id,
                    UnitId: manureSaleData.UnitId,
                    CustomerId: manureSaleData.CustomerId,
                    Paid: manureSaleData.Paid,
                    Due: manureSaleData.Due,
                    Date: manureSaleData.Date,
                    Cash: manureSaleData.Cash,
                    PhonePay: manureSaleData.PhonePay,
                    NetBanking: manureSaleData.NetBanking,
                    CashDeposite: manureSaleData.CashDeposite,
                    UnitPrice: manureSaleData.UnitPrice,
                    TotalAmount: manureSaleData.TotalAmount,
                    AdditionalCharge: manureSaleData.AdditionalCharge,
                    PaymentDate: manureSaleData.PaymentDate,
                    Discount: manureSaleData.Discount,
                    FinalCost: manureSaleData.FinalCost,
                    InvoiceNo: manureSaleData.InvoiceNo,
                    CustomerName: manureSaleData.CustomerName,
                    CompanyId: localStorage.getItem('companyid'),
                    Quantity: manureSaleData.Quantity,
                    Comments: manureSaleData.Comments

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

    const deleteManure = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'Manure/' + id, {
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
        getFilterData(e.target.value, filterToDate);
    }


    const getFilterData = (fromDate, toDate) => {
        let _filterList = [];
        if (fromDate !== "" && toDate !== "") {
            _filterList = manureSaleListFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate) && dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate === "" && toDate !== "") {
            _filterList = manureSaleListFilter.filter((c) => dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate !== "" && toDate === "") {
            _filterList = manureSaleListFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate));
        }
        else {
            _filterList = manureSaleListFilter;
        }

        setManureSaleList(_filterList);
    }

    const onDateFilterToChange = (e) => {
        setFilterToDate(e.target.value);
        getFilterData(filterFromDate, e.target.value);
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

    //const itemsPerPage = process.env.REACT_APP_PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    let itemsToDiaplay = manureSaleList.slice(startIndex, endIndex);

    if (itemsToDiaplay.length === 0 && manureSaleList.length > 0) {
        setCurrentPage(currentPage - 1);
    }

    let addInvoiceModalClose = () => {
        setInvoiceModalShow(false);
    };

    const filterSupplierChange = (e) => {

        if (e.target.value > 0) {
            const _medd = manureSaleListFilter.filter((c) => c.CustomerId === parseInt(e.target.value));
            setManureSaleList(_medd);
            calculateValues(_medd);
            // setManureSaleData({ ...manureSaleData, CustomerId: e.target.value });
        }
        else {
            setManureSaleList(manureSaleListFilter);
            calculateValues(manureSaleListFilter);
        }

        addUCount(ucount);
    }

    let addUCount = (num) => {
        setUCount(num + 1);
    };

    const selectPaginationChange = (e) => {
        setItemsPerPage(e.target.value);
        addCount(count);
    }

    const onDownloadExcel = () => {
            const _list = manureSaleList.map((p) => {
              return ({
                              Date: Moment(p.Date).format('DD-MMM-YYYY'),
                              CustomerName: p.CustomerName,
                              TotalCost: parseFloat(p.TotalAmount||0).toFixed(2)
                          });
            });

            

          downloadExcelFilter(_list, "ManureSale", companydetailsfromlocal.CompanyName,filterFromDate,filterToDate);
        }
    

    return (
        <div>
            {isloaded && <Loading />}
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <h2>Manure Sale</h2>
            </div>

            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row align-items-center" style={{ fontSize: 13 }}>
                    <div className="col-2">
                        <p><strong>From</strong></p>
                        <DateComponent date={null} onChange={onDateFilterFromChange}
                            isRequired={false} value={filterFromDate} />
                    </div>
                    <div className="col-2">
                        <p><strong>To</strong></p>
                        <DateComponent date={null} onChange={onDateFilterToChange}
                            isRequired={false} value={filterToDate} />
                    </div>
                    <div className="col-2">
                        <p><strong>Supplier</strong></p>

                        <Form.Select style={{ fontSize: '13px' }}
                            onChange={filterSupplierChange}>
                            <option selected value="">Choose...</option>
                            {
                                clientlist.map((item) => {
                                    return (
                                        <option
                                            key={item.ID}
                                            defaultValue={item.Id == null ? null : item.ID}
                                            value={item.ID}
                                        >{item.FirstName + " " + item.LastName}</option>
                                    );
                                })
                            }
                        </Form.Select>
                    </div>

                    <div className="col-4" style={{ textAlign: 'right'}}>
                        <i className="fa-regular fa-file-excel fa-2xl"
                            style={{ color: '#bea2a2', marginRight: 30 }}
                            onClick={() => onDownloadExcel()} ></i>
                        <Button className="mr-2" variant="primary"
                            style={{ marginRight: "17.5px" }}
                            onClick={() => clickAddManureSale()}>New</Button>
                    </div>

                    <div className="col-2">
                        <select className="form-select" aria-label="Default select example"
                        style={{ width: "80px" }} onChange={selectPaginationChange}>
                            <option selected value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                        </select>
                    </div>
                </div>
            </div>

              {<Table className="mt-4" striped bordered hover size="sm">
                            <thead>
                                <tr align='center' className="tr-custom">
                                    <th>Date</th>
                                    <th>Customer Name</th>
                                    <th>Quantity</th>
                                    <th>Unit</th>
                                    <th>Rate (<span>&#8377;</span>)</th>
                                    <th>Total Amount (<span>&#8377;</span>)</th>
                                    <th>Discount (<span>&#8377;</span>)</th>
                                    <th>Addn Charge (<span>&#8377;</span>)</th>
                                    <th>Final Amount (<span>&#8377;</span>)</th>
                                    <th>Paid (<span>&#8377;</span>)</th>
                                    <th>Due (<span>&#8377;</span>)</th>
                                    <th>Payment Date</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((manure) => {
                                        // const _supp = clientlist.filter((c) => c.ID === manure.CustomerId);
                                        // const filterByClientName = _supp.length > 0 ? (_supp[0].MiddleName != "" && _supp[0].MiddleName != null) ?
                                        //     _supp[0].FirstName + " " + _supp[0].MiddleName + " " + _supp[0].LastName :
                                        //     _supp[0].FirstName + " " + _supp[0].LastName : "";
                                        //     manure.CustomerName = filterByClientName;
            
            
            
                                        return (
                                            !isloaded && <tr key={manure.Id} align='center' style={{ fontSize: '13px' }}>
                                                <td>{Moment(manure.Date).format('DD-MMM-YYYY')}</td>
                                                <td>{manure.CustomerName}</td>
                                                <td>{manure.Quantity}</td>
                                                <td>{manure.UnitName}</td>
            
                                                <td>{new Intl.NumberFormat('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(parseFloat(parseFloat(manure.UnitPrice).toFixed(2)))}
                                                </td>
                                                <td>{new Intl.NumberFormat('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(parseFloat(parseFloat(manure.TotalAmount || 0).toFixed(2)))}
                                                </td>
                                                <td>{new Intl.NumberFormat('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(parseFloat(parseFloat(manure.Discount || 0).toFixed(2)))}
                                                </td>
                                                <td>{new Intl.NumberFormat('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(parseFloat(parseFloat(manure.AdditionalCharge || 0).toFixed(2)))}
                                                </td>
                                                <td>{new Intl.NumberFormat('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(parseFloat(parseFloat(manure.FinalCost || 0).toFixed(2)))}
                                                </td>
            
                                                <td>{new Intl.NumberFormat('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(parseFloat(parseFloat(manure.Paid || 0).toFixed(2)))}
                                                </td>
                                              
                                                <td>{new Intl.NumberFormat('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(parseFloat(parseFloat(manure.Due || 0).toFixed(2)))}
                                                </td>
                                                <td>{Moment(manure.PaymentDate).format('DD-MMM-YYYY')}</td>
                                                <td>
                                                    {
                                                        <ButtonToolbar>
                                                            <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }}
                                                                onClick={() => clickEditManureSale(manure)}></i>
                                                            {localStorage.getItem('isadmin') === 'true' &&
                                                                <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }}
                                                                    onClick={() => deleteManure(manure.Id)}></i>}
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
            
                                <td align='center'>{new Intl.NumberFormat('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(parseFloat(manureconSolList.TotalAmount || 0).toFixed(2))}
                                </td>
                                <td align='center'>{new Intl.NumberFormat('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(parseFloat(manureconSolList.TotalDiscount || 0).toFixed(2))}
                                </td>
                                <td></td>
                                <td align='center'>{new Intl.NumberFormat('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(parseFloat(manureconSolList.TotalFinalAmount || 0).toFixed(2))}
                                </td>
            
                                <td align='center'>{new Intl.NumberFormat('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(parseFloat(manureconSolList.TotalPaid || 0).toFixed(2))}
                                </td>
                                
                                <td align='center'>{new Intl.NumberFormat('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(parseFloat(parseFloat(manureconSolList.TotalDue || 0).toFixed(2)))}
                                </td>
            
                                <td></td>
                                {/* <td></td>
                                <td></td> */}
                                <td></td>
                            </tfoot>
                        </Table >
            
                        }


            <div className="ContainerOverride">

                <Modal
                    show={addModalShow}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: '18px' }}>
                            Add Manure
                        </Modal.Title>
                        <button type="button" class="btn-close"
                            aria-label="Close" onClick={addModalClose}> </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>

                                <Form className="needs-validation" noValidate validated={validated}>

                                    <Row className="mb-12">

                                        <Form.Group controlId="Date" as={Col} >
                                            <Form.Label style={{ fontSize: '13px' }}>Date</Form.Label>
                                            <Col >
                                                <DateComponent date={null} isRequired={true}
                                                    onChange={dateChange} value={manureSaleData.Date} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select date
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>

                                        <Form.Group controlId="ClientId" as={Col}>
                                            <Form.Label style={{ fontSize: '13px' }}>Client</Form.Label>
                                            <Col>

                                                <Form.Select aria-label="Default select example" style={{ fontSize: '13px' }}
                                                    onChange={clientChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {

                                                        clientlist.map((item) => {

                                                            let fullname = (item.MiddleName != "" && item.MiddleName != null) ?
                                                                item.FirstName + " " + item.MiddleName + " " + item.LastName :
                                                                item.FirstName + " " + item.LastName;
                                                            return (
                                                                <option value={item.ID} key={item.ID}
                                                                    selected={item.ID === manureSaleData.CustomerId}>{fullname}</option>)
                                                        })
                                                    }

                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select customer
                                                </Form.Control.Feedback>

                                            </Col>
                                        </Form.Group>


                                    </Row>
                                    <Row className="mb-12">
                                        <InputField controlId="Quantity" label="Quantity"
                                            type="number"
                                            value={manureSaleData.Quantity}
                                            name="Quantity"
                                            placeholder="Quantity"
                                            errormessage="Please enter quantity"
                                            required={true}
                                            disabled={false}
                                            onChange={quantityChange}
                                        />

                                        <Form.Group controlId="ClientId" as={Col}>
                                            <Form.Label style={{ fontSize: '13px' }}>Unit</Form.Label>
                                            <Col>

                                                <Form.Select aria-label="Default select example" style={{ fontSize: '13px' }}
                                                    onChange={unitIdChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {

                                                        unitlist.map((item) => {


                                                            return (
                                                                <option value={item.ID} key={item.ID}
                                                                    selected={item.ID === manureSaleData.UnitId}>{item.UnitName}</option>)
                                                        })
                                                    }

                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select Unit
                                                </Form.Control.Feedback>

                                            </Col>
                                        </Form.Group>



                                        <InputField controlId="UnitPrice" label="Unit price"
                                            type="number"
                                            value={manureSaleData.UnitPrice}
                                            name="UnitPrice"
                                            placeholder="Unit price"
                                            errormessage="Please enter unit price"
                                            required={true}
                                            disabled={false}
                                            onChange={unitPriceChange}
                                        />
                                    </Row>
                                    <Row className="mb-12">
                                        {/* <InputField controlId="GST" label="GST"
                                            type="number"
                                            value={cartonsdata.GST}
                                            name="GST"
                                            placeholder="GST"
                                            errormessage="Please enter GST"
                                            required={false}
                                            disabled={false}
                                            onChange={gstChange}
                                        /> */}

                                        <InputField controlId="TotalAmount" label="Total amount"
                                            type="number"
                                            value={manureSaleData.TotalAmount}
                                            name="TotalAmount"
                                            placeholder="Total amount"
                                            errormessage="Please provide total amount"
                                            required={true}
                                            disabled={true}
                                        />

                                        <InputField controlId="Discount" label="Discount"
                                            type="number"
                                            value={manureSaleData.Discount}
                                            name="Discount"
                                            placeholder="Discount"
                                            errormessage="Please provide discount"
                                            required={false}
                                            disabled={false}
                                            onChange={discountChange}
                                        />

                                        <InputField controlId="AdditionalCharge" label="Additional charge"
                                            type="number"
                                            value={manureSaleData.AdditionalCharge}
                                            name="AdditionalCharge"
                                            placeholder="Additional charge"
                                            errormessage="Please enter Additional charge"
                                            required={false}
                                            disabled={false}
                                            onChange={additionalChargeChange}
                                        />

                                        <InputField controlId="FinalCost" label="FinalCost"
                                            type="number"
                                            value={manureSaleData.FinalCost}
                                            name="FinalCost"
                                            placeholder="Final cost"
                                            errormessage="Please provide final cost"
                                            required={false}
                                            disabled={true}
                                        />

                                    </Row>

                                    <Row>

                                        <InputField controlId="Cash" label="Cash "
                                            type="text"
                                            value={manureSaleData.Cash}
                                            name="Cash"
                                            placeholder="Cash"
                                            errormessage="Please enter amount"
                                            required={false}
                                            disabled={false}
                                            onChange={cashChange}
                                        />
                                        <InputField controlId="PhonePay" label="Phone Pay / UPI"
                                            type="text"
                                            value={manureSaleData.PhonePay}
                                            name="PhonePay"
                                            placeholder="PhonePay / UPI"
                                            errormessage="Please enter amount"
                                            required={false}
                                            disabled={false}
                                            onChange={phonePayChange}
                                        />

                                        <InputField controlId="NetBanking" label="Net Banking Pay"
                                            type="text"
                                            value={manureSaleData.NetBanking}
                                            name="NetBanking"
                                            placeholder="NetBanking"
                                            errormessage="Please enter amount"
                                            required={false}
                                            disabled={false}
                                            onChange={netBankingChange}
                                        />

                                        <InputField controlId="CashDeposite" label="Cash Deposite"
                                            type="text"
                                            value={manureSaleData.CashDeposite}
                                            name="CashDeposite"
                                            placeholder="Cash Deposite"
                                            errormessage="Please cash deposite amount"
                                            required={false}
                                            disabled={false}
                                            onChange={cashDepositeChange}
                                        />


                                    </Row>
                                    <Row className="mb-8">

                                        {/* <InputField controlId="Paid" label="Paid"
                                            type="number"
                                            value={manureSaleData.Paid}
                                            name="Paid"
                                            placeholder="Paid"
                                            errormessage="Please enter paid amount"
                                            required={false}
                                            disabled={false}
                                            onChange={paidChange}
                                        /> */}

                                        {/* <InputField controlId="UnloadingCharge" label="Unloading charge"
                                            type="number"
                                            value={cartonsdata.UnloadingCharge}
                                            name="UnloadingCharge"
                                            placeholder="Unloading charge"
                                            errormessage="Please unloading charge"
                                            required={true}
                                            disabled={false}
                                            onChange={unloadingChargeChange}
                                        /> */}

                                        <InputField controlId="Due" label="Due"
                                            type="number"
                                            value={manureSaleData.Due}
                                            name="Due"
                                            placeholder="Due"
                                            errormessage="Due"
                                            required={false}
                                            disabled={false}
                                        // onChange={unloadingChargeChange}
                                        />

                                        <Form.Group controlId="PaymentDate" as={Col} >
                                            <Form.Label style={{ fontSize: '13px' }}>Payment Date</Form.Label>
                                            <Col >
                                                <DateComponent date={null} isRequired={true}
                                                    onChange={paymentDateChange} value={manureSaleData.PaymentDate} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select payment date
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-12">
                                        <Form.Group controlId="Comments" as={Col} >
                                            <Form.Label style={{ fontSize: '13px' }}>Comments</Form.Label>
                                            <Form.Control style={{ fontSize: '13px' }} as="textarea" rows={3} name="Comments"
                                                onChange={commentsChange} value={manureSaleData.Comments}
                                                placeholder="Comments" />

                                        </Form.Group>
                                    </Row>



                                    <Form.Group as={Col}>
                                        {manureSaleData.Id <= 0 ?

                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                                                Add
                                            </Button>
                                            : null
                                        }

                                        {manureSaleData.Id > 0 ?

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
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>

                </Modal>
            </div>




        </div>
    )
}

export default ManureSale
