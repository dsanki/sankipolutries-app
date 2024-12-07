import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment';
import { ErrorMessageHandle } from '../../Utility';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import {
    dateyyyymmdd, HandleLogout, downloadExcel,
    FetchCompanyDetails, AmountInWords, ReplaceNonNumeric, Commarize,
    FecthEggCategory, FecthEggSaleInvoiceList, FecthEggSaleInvoiceById
} from './../../Utility'
import Loading from '../Loading/Loading'

import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import InvoiceEggSale from '../Invoice/InvoiceEggSale';



function EggSaleModule(props) {

    let history = useNavigate();
    const { uid, invid } = useParams();
    // const search = useLocation().search;
    // const [_uid, setUid] = useState(new URLSearchParams(search).get('uid'));
    // const [_invid, setInvid] = useState(new URLSearchParams(search).get('invid'));

    // console.log(_uid);
    // console.log(_invid);

    const [eggsalelist, setEggSaleList] = useState([]);
    const [customerdetails, setCustomerDetails] = useState([]);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [validated, setValidated] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [invoiceModalShow, setInvoiceModalShow] = useState(false);
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [isloaded, setIsLoaded] = useState(true);
    const [eggsalelistfilter, setEggSaleListFilter] = useState([]);
   // const [companydetails, setCompanyDetails] = useState([]);

    const [companydetails, setCompanyDetails] = useState([JSON.parse(localStorage.getItem('companydetails'))]);
    const [eggcategory, setEggCategory] = useState([]);

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [ucount, setUCount] = useState(0);
    const objupdate = useMemo(() => ({ ucount }), [ucount]);

    const [tmpidcount, setTempIdCount] = useState(0);

    const [additionalCharge, setAdditionalCharge] = useState(0);

    const _bankdetails = {
        BankName: "",
        AccountNo: "",
        IfscCode: "",
        BranchName: ""

    }

    const [bankdetails, setBankDetails] = useState(_bankdetails);
    const initialeggsalevalues = {

        Id: 0,
        Quantity: "",
        EggRate: "",
        TotalCost: "",
        DiscountPerEgg: "",
        TotalDiscount: "",
        FinalCost: "",
        Comments: "",
        EggSaleInvoiceId: 0,
        EggCategory: "",
        tempid: 0,
        EggPack: "",
        EggLose: ""

    };

    const initialeggsaleinvoicevalues = {
        modaltitle: "",
        Id: 0,
        InvoiceNo: "",
        CustomerId: uid,
        TotalQuantity: "",
        PurchaseDate: "",
        TotalCost: "",
        TotalDiscount: "",
        FinalCostInvoice: "",
        Paid: "",
        Due: "",
        EggSale: [initialeggsalevalues],
        VehicleNo: "",
        AdditionalCharge: "",
        Cash: "",
        PhonePay: "",
        NetBanking: "",
        UPI: "",
        Cheque: "",
        Advance: "",
        Complimentary: ""
    };

    const [eggsaleinvdata, setEggSaleInvoiceData] = useState(initialeggsaleinvoicevalues);
    const [eggsaledata, setEggSaletData] = useState(initialeggsalevalues);
    //const [eggsalearr, setEggSaleArr] = useState([]);
    const [eggsalearr, setEggSaleArr] = useState([]);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);

        setEggSaletData(initialeggsalevalues);
    };

    const clickAddEggSale = () => {
        setAddModalShow({ addModalShow: true });
        setEggSaleInvoiceData({
            modaltitle: "Add Egg Sale",
            Id: eggsaleinvdata.Id,
            InvoiceNo: eggsaleinvdata.InvoiceNo,
            CustomerId: uid,
            TotalQuantity: eggsaleinvdata.TotalQuantity,
            PurchaseDate: eggsaleinvdata.PurchaseDate,
            TotalCost: eggsaleinvdata.TotalCost,
            TotalDiscount: eggsaleinvdata.TotalDiscount,
            FinalCostInvoice: eggsaleinvdata.FinalCostInvoice,
            Paid: eggsaleinvdata.Paid,
            Due: eggsaleinvdata.Due,
            EggSale: [],
            VehicleNo: eggsaleinvdata.VehicleNo,
            AdditionalCharge: eggsaleinvdata.AdditionalCharge,

            Cash: eggsaleinvdata.Cash,
            PhonePay: eggsaleinvdata.PhonePay,
            NetBanking: eggsaleinvdata.NetBanking,
            UPI: eggsaleinvdata.UPI,
            Cheque: eggsaleinvdata.Cheque,
            Advance: eggsaleinvdata.Advance,
            Complimentary: eggsaleinvdata.Complimentary

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
            DiscountPerEgg: eggsale.DiscountPerEgg,
            FinalCost: eggsale.FinalCost,
            Paid: eggsale.Paid,
            Due: eggsale.Due,
            Comments: eggsale.Comments,
            EggCategory: eggsale.EggCategory,
            TotalDiscount: eggsale.TotalDiscount,
            EggSaleInvoiceId: eggsale.EggSaleInvoiceId,
            tempid: eggsale.tempid,
            EggPack: eggsale.EggPack,
            EggLose: eggsale.EggLose

        })
    }

    const quantityChange = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setEggSaletData({
                ...eggsaledata, Quantity: e.target.value, TotalCost: e.target.value * eggsaledata.EggRate,
                TotalDiscount: e.target.value * eggsaledata.DiscountPerEgg,
                FinalCost: (e.target.value * eggsaledata.EggRate) - (e.target.value * eggsaledata.DiscountPerEgg)
            });
        }
    }



    const eggCategoryChange = (e) => {
        setEggSaletData({ ...eggsaledata, EggCategory: e.target.value });
    }
    const purchaseDateChange = (e) => {
        setEggSaleInvoiceData({ ...eggsaleinvdata, PurchaseDate: e.target.value });
    }

    const vehicleNoChange = (e) => {
        setEggSaleInvoiceData({ ...eggsaleinvdata, VehicleNo: e.target.value });
    }

    const additionalChargeChange = (e) => {
        let addch = parseFloat(e.target.value || 0);

        setEggSaleInvoiceData({
            ...eggsaleinvdata, AdditionalCharge: e.target.value,

            Due: (parseFloat(eggsaleinvdata.TotalCost || 0) - 
            parseFloat(eggsaleinvdata.TotalDiscount) -parseFloat(eggsaleinvdata.Paid || 0)) + addch,
            //Due:parseFloat(eggsaleinvdata.Due||0)+addch,
            //FinalCostInvoice:(e.target.value * eggsaledata.EggRate) - (e.target.value * eggsaledata.DiscountPerEgg)
            FinalCostInvoice: (parseFloat(eggsaleinvdata.TotalCost || 0) - 
            parseFloat(eggsaleinvdata.TotalDiscount)) + addch
        });

        //setAdditionalCharge(addch);
    }


    const paidChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setEggSaleInvoiceData({
                ...eggsaleinvdata, Paid: e.target.value,
                Due: (eggsaleinvdata.FinalCostInvoice - e.target.value)
            });
        }
    }
    const eggRateChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setEggSaletData({
                ...eggsaledata, EggRate: e.target.value, 
                TotalCost: e.target.value * eggsaledata.Quantity,
                FinalCost: (e.target.value * eggsaledata.Quantity) - 
                (eggsaledata.TotalDiscount > 0 ? eggsaledata.TotalDiscount : 0)
            });
        }
    }

    const discountChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setEggSaletData({ ...eggsaledata, DiscountPerEgg: e.target.value, 
                TotalDiscount: (eggsaledata.Quantity * e.target.value), 
                FinalCost: (eggsaledata.TotalCost - (eggsaledata.Quantity * e.target.value)) });
        }
    }



    const eggpackChange = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            let totalquantity = (parseInt(e.target.value || 0) * 210) + (parseInt(eggsaledata.EggLose || 0));
            setEggSaletData({
                ...eggsaledata, EggPack: e.target.value,
                Quantity: totalquantity,
                TotalCost: totalquantity * eggsaledata.EggRate,
                TotalDiscount: totalquantity * eggsaledata.DiscountPerEgg,
                FinalCost: (totalquantity * eggsaledata.EggRate) - (totalquantity * eggsaledata.DiscountPerEgg)
            });
        }
    }

    const eggloseChange = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            let totalquantity = (parseInt(e.target.value || 0)) + (parseInt(eggsaledata.EggPack || 0) * 210);
            setEggSaletData({
                ...eggsaledata, EggLose: e.target.value,
                Quantity: totalquantity,
                TotalCost: totalquantity * eggsaledata.EggRate,
                TotalDiscount: totalquantity * eggsaledata.DiscountPerEgg,
                FinalCost: (totalquantity * eggsaledata.EggRate) - (totalquantity * eggsaledata.DiscountPerEgg)
            });
        }
    }

    // const paidChange = (e) => {
    //     const re = /^\d*\.?\d{0,2}$/
    //     if (e.target.value === '' || re.test(e.target.value)) {
    //         setEggSaletData({ ...eggsaledata, Paid: e.target.value, Due: eggsaledata.FinalCost - e.target.value });
    //     }
    // }

    const commentsChange = (e) => {
        setEggSaletData({ ...eggsaledata, Comments: e.target.value });
    }

    const cashChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let cashamt = parseFloat(e.target.value || 0);
            setEggSaleInvoiceData({
                ...eggsaleinvdata, Cash: e.target.value,
                Paid: (cashamt + parseFloat(eggsaleinvdata.PhonePay || 0) +
                    parseFloat(eggsaleinvdata.NetBanking || 0) + parseFloat(eggsaleinvdata.UPI || 0)
                    + parseFloat(eggsaleinvdata.Cheque || 0)),
                Due: (eggsaleinvdata.FinalCostInvoice -
                    (cashamt + parseFloat(eggsaleinvdata.PhonePay || 0) +
                        parseFloat(eggsaleinvdata.NetBanking || 0) + parseFloat(eggsaleinvdata.UPI || 0)
                        + parseFloat(eggsaleinvdata.Cheque || 0))
                )
            });
        }
    }

    const phonePayChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let phpayamt = parseFloat(e.target.value || 0);
            //setEggSaleInvoiceData({ ...eggsaleinvdata, VehicleNo: e.target.value });

            setEggSaleInvoiceData({
                ...eggsaleinvdata, PhonePay: e.target.value,
                Paid: (phpayamt + parseFloat(eggsaleinvdata.Cash || 0) +
                    parseFloat(eggsaleinvdata.NetBanking || 0) + parseFloat(eggsaleinvdata.UPI || 0)
                    + parseFloat(eggsaleinvdata.Cheque || 0)),
                Due: (eggsaleinvdata.FinalCostInvoice -
                    (phpayamt + parseFloat(eggsaleinvdata.Cash || 0) +
                        parseFloat(eggsaleinvdata.NetBanking || 0) + parseFloat(eggsaleinvdata.UPI || 0)
                        + parseFloat(eggsaleinvdata.Cheque || 0))
                )
            });
        }
    }

    const netBankingChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let nbamt = parseFloat(e.target.value || 0);

            setEggSaleInvoiceData({
                ...eggsaleinvdata, NetBanking: e.target.value,
                Paid: (nbamt + parseFloat(eggsaleinvdata.Cash || 0) +
                    parseFloat(eggsaleinvdata.PhonePay || 0) + parseFloat(eggsaleinvdata.UPI || 0)
                    + parseFloat(eggsaleinvdata.Cheque || 0)),
                Due: (eggsaleinvdata.FinalCostInvoice -
                    (nbamt + parseFloat(eggsaleinvdata.Cash || 0) +
                        parseFloat(eggsaleinvdata.PhonePay || 0) + parseFloat(eggsaleinvdata.UPI || 0)
                        + parseFloat(eggsaleinvdata.Cheque || 0))
                )
            });
        }
    }

    const advanceChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setEggSaleInvoiceData({ ...eggsaleinvdata, Advance: e.target.value });
        }
    }

    const upiChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let upiamt = parseFloat(e.target.value || 0);

            setEggSaleInvoiceData({
                ...eggsaleinvdata, UPI: e.target.value,
                Paid: (upiamt + parseFloat(eggsaleinvdata.Cash || 0) +
                    parseFloat(eggsaleinvdata.PhonePay || 0) + parseFloat(eggsaleinvdata.NetBanking || 0)
                    + parseFloat(eggsaleinvdata.Cheque || 0)),
                Due: (eggsaleinvdata.FinalCostInvoice -
                    (upiamt + parseFloat(eggsaleinvdata.Cash || 0) +
                        parseFloat(eggsaleinvdata.PhonePay || 0) + parseFloat(eggsaleinvdata.NetBanking || 0)
                        + parseFloat(eggsaleinvdata.Cheque || 0))
                )
            });
        }
    }

    const chequeChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let chqamt = parseFloat(e.target.value || 0);

            setEggSaleInvoiceData({
                ...eggsaleinvdata, Cheque: e.target.value,
                Paid: (chqamt + parseFloat(eggsaleinvdata.Cash || 0) +
                    parseFloat(eggsaleinvdata.PhonePay || 0) + parseFloat(eggsaleinvdata.NetBanking || 0)
                    + parseFloat(eggsaleinvdata.UPI || 0)),
                Due: (eggsaleinvdata.FinalCostInvoice -
                    (chqamt + parseFloat(eggsaleinvdata.Cash || 0) +
                        parseFloat(eggsaleinvdata.PhonePay || 0) + parseFloat(eggsaleinvdata.NetBanking || 0)
                        + parseFloat(eggsaleinvdata.UPI || 0))
                )
            });
        }
    }

    const complimentaryChange = (e) => {
        //let due=eggsaleinvdata.Due;
        const re = /^\d*\.?\d{0,2}$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            let due = Math.round(eggsaleinvdata.FinalCostInvoice -
                (parseFloat(eggsaleinvdata.Cheque || 0) + parseFloat(eggsaleinvdata.Cash || 0) +
                    parseFloat(eggsaleinvdata.PhonePay || 0) + parseFloat(eggsaleinvdata.NetBanking || 0)
                    + parseFloat(eggsaleinvdata.UPI || 0))
            )

            setEggSaleInvoiceData({
                ...eggsaleinvdata, Complimentary: e.target.value,
                Due: parseFloat(due) - parseFloat(e.target.value||0)
            });
        }
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            setEggSaletData({ ...eggsaledata, CustomerId: uid });
            fetchCustomerDetails(uid);
           // fetchCompanyDetails(localStorage.getItem('companyid'));
            fetchEggCategory();
            setBankDetails({
                ...bankdetails, BankName: process.env.REACT_APP_BANK_NAME,
                AccountNo: process.env.REACT_APP_ACCOUNT_NO,
                IfscCode: process.env.REACT_APP_IFSC_CODE,
                BranchName: process.env.REACT_APP_BRANCH_NAME
            })
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, []);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            if (invid > 0) {
                fecthEggSaleInvoiceById(invid);
            }

        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);

    useEffect((e) => {

        if (localStorage.getItem('token')) {

            const { totalCost, totalQuantity, totalDiscount, totalFinalCost } = eggsalearr.reduce((accumulator, item) => {
                accumulator.totalCost += item.TotalCost;
                accumulator.totalQuantity += parseInt(item.Quantity);
                accumulator.totalDiscount += item.TotalDiscount;
                accumulator.totalFinalCost += item.FinalCost;
                return accumulator;
            }, { totalCost: 0, totalQuantity: 0, totalDiscount: 0, totalFinalCost: 0 })

            setEggSaleInvoiceData({ ...eggsaleinvdata, TotalQuantity: totalQuantity, TotalCost: totalCost, TotalDiscount: totalDiscount, FinalCostInvoice: totalFinalCost, Due: totalFinalCost });
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [objupdate]);


    const fetchEggCategory = async () => {
        FecthEggCategory(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setEggCategory(data.Result);
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

    // const fetchCompanyDetails = async (invid) => {
    //     FetchCompanyDetails(invid, process.env.REACT_APP_API)
    //         .then(data => {
    //             if (data.StatusCode === 200) {
    //                 setCompanyDetails(data.Result);
    //             }
    //             else if (data.StatusCode === 401) {
    //                 HandleLogout();
    //                 history("/login")
    //             }
    //             else if (data.StatusCode === 404) {
    //                 props.showAlert("Data not found!!", "danger")
    //             }
    //             else {
    //                 props.showAlert("Error occurred!!", "danger")
    //             }
    //         })
    // }

    const fecthEggSaleInvoiceById = async (id) => {
        FecthEggSaleInvoiceById(id, process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setEggSaleInvoiceData(data.Result[0]);
                    setEggSaleArr(data.Result[0].EggSaleList)
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

    const deleteEggSale = (p) => {
        if (window.confirm('Are you sure?')) {

            if (p.Id > 0) {
                setEggSaleArr(eggsalearr.filter(item => item.Id !== p.Id));
                addUCount(ucount);

            }
            else {
                setEggSaleArr(eggsalearr.filter(item => item.tempid !== p.tempid));
                addUCount(ucount);
            }
        }
    }

    let addUCount = (num) => {
        setUCount(num + 1);
    };

    let addCount = (num) => {
        setCount(num + 1);
    };

    const handleAddToList = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {


            var count =tmpidcount + 1;
            const newData = {
                Id: eggsaledata.Id,
                Quantity: eggsaledata.Quantity,
                EggCategory: eggsaledata.EggCategory,
                EggRate: eggsaledata.EggRate,
                EggRate: eggsaledata.EggRate,
                TotalCost: eggsaledata.TotalCost,
                DiscountPerEgg: eggsaledata.DiscountPerEgg,
                TotalDiscount: eggsaledata.TotalDiscount,
                FinalCost: eggsaledata.FinalCost,
                EggSaleInvoiceId: eggsaledata.EggSaleInvoiceId,
                Comments: eggsaledata.Comments,
                tempid: count,
                EggPack: eggsaledata.EggPack,
                EggLose: eggsaledata.EggLose
            };


            setTempIdCount(count);
            setValidated(true);
            //console.log(eggsalearr);
            setEggSaleArr(prevState => [...prevState, newData]);
            //console.log(eggsalearr);
            addUCount(ucount);
            addModalClose();
        }
    }

    const handleEditToList = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            const newData = {
                Id: eggsaledata.Id,
                Quantity: eggsaledata.Quantity,
                EggCategory: eggsaledata.EggCategory,
                EggRate: eggsaledata.EggRate,
                EggRate: eggsaledata.EggRate,
                TotalCost: eggsaledata.TotalCost,
                DiscountPerEgg: eggsaledata.DiscountPerEgg,
                TotalDiscount: eggsaledata.TotalDiscount,
                FinalCost: eggsaledata.FinalCost,
                EggSaleInvoiceId: eggsaledata.EggSaleInvoiceId,
                Comments: eggsaledata.Comments,
                tempid: eggsaledata.tempid,
                EggPack: eggsaledata.EggPack,
                EggLose: eggsaledata.EggLose
            };

            if (eggsaledata.Id > 0) {
                const index = eggsalearr.findIndex(eg => eg.Id === eggsaledata.Id);
                let _eggsalearr = eggsalearr;
                eggsalearr[index] = newData;
                setEggSaleArr(eggsalearr);

                //setEggSaleArr(prevState => [...prevState, newData]);
            }
            else {
                const index = eggsalearr.findIndex(eg => eg.tempid === eggsaledata.tempid);
                let _eggsalearr = eggsalearr;
                eggsalearr[index] = newData;
                setEggSaleArr(eggsalearr);
            }

           // setTempIdCount(tmpidcount + 1);
            setValidated(true);
            //console.log(eggsalearr);
            addUCount(ucount);
            addModalClose();
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

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const preDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages;
    // const itemsPerPage = process.env.PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = eggsalelist && eggsalelist.length > 0 ? eggsalelist.slice(startIndex, endIndex) : [];
    if (itemsToDiaplay.length === 0 && eggsalelist.length > 0) {
        setCurrentPage(currentPage - 1);
    }

    const onDateFilterFromChange = (e) => {
        setFilterFromDate(e.target.value);
        getFilterData(e.target.value, filterToDate);
    }

    const getFilterData = (fromDate, toDate) => {
        let _filterList = [];
        if (fromDate !== "" && toDate !== "") {
            _filterList = eggsalelistfilter.filter((c) => dateyyyymmdd(c.PurchaseDate) >= dateyyyymmdd(fromDate) && dateyyyymmdd(c.PurchaseDate) <= dateyyyymmdd(toDate));
        }
        else if (fromDate === "" && toDate !== "") {
            _filterList = eggsalelistfilter.filter((c) => dateyyyymmdd(c.PurchaseDate) <= dateyyyymmdd(toDate));
        }
        else if (fromDate !== "" && toDate === "") {
            _filterList = eggsalelistfilter.filter((c) => dateyyyymmdd(c.PurchaseDate) >= dateyyyymmdd(fromDate));
        }
        else {
            _filterList = eggsalelistfilter;
        }

        setEggSaleList(_filterList);
    }

    const onDateFilterToChange = (e) => {
        setFilterToDate(e.target.value);
        getFilterData(filterFromDate, e.target.value);
    }

    const clickSaveEggInvoiceDetails = (e) => {

        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {


            fetch(process.env.REACT_APP_API + 'EggSale/EggSaleInvoiceAdd', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: 0,
                    InvoiceNo: eggsaleinvdata.InvoiceNo,
                    CustomerId: eggsaleinvdata.CustomerId,
                    TotalQuantity: eggsaleinvdata.TotalQuantity,
                    PurchaseDate: eggsaleinvdata.PurchaseDate,
                    TotalCost: eggsaleinvdata.TotalCost,
                    TotalDiscount: eggsaleinvdata.TotalDiscount,
                    FinalCostInvoice: Math.round(eggsaleinvdata.FinalCostInvoice),
                    Paid: eggsaleinvdata.Paid,
                    Due: Math.round(eggsaleinvdata.Due),
                    EggSaleList: eggsalearr,
                    VehicleNo: eggsaleinvdata.VehicleNo,
                    AdditionalCharge: eggsaleinvdata.AdditionalCharge,
                    Cash: eggsaleinvdata.Cash,
                    PhonePay: eggsaleinvdata.PhonePay,
                    NetBanking: eggsaleinvdata.NetBanking,
                    UPI: eggsaleinvdata.UPI,
                    Cheque: eggsaleinvdata.Cheque,
                    Advance: eggsaleinvdata.Advance,
                    Complimentary:eggsaleinvdata.Complimentary,
                    CompanyId:localStorage.getItem('companyid')

                })
            }).then(res => res.json())
                .then((result) => {

                    if (result.StatusCode === 200) {
                        history("/eggsale/?uid=" + uid);
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

    const clickBack = () => {
        history("/eggsale/?uid=" + uid);
    }

    const clickUpdateEggInvoiceDetails = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'EggSale/EggSaleInvoiceUpdate', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: eggsaleinvdata.Id,
                    InvoiceNo: eggsaleinvdata.InvoiceNo,
                    CustomerId: eggsaleinvdata.CustomerId,
                    TotalQuantity: eggsaleinvdata.TotalQuantity,
                    PurchaseDate: eggsaleinvdata.PurchaseDate,
                    TotalCost: eggsaleinvdata.TotalCost,
                    TotalDiscount: eggsaleinvdata.TotalDiscount,
                    FinalCostInvoice: Math.round(eggsaleinvdata.FinalCostInvoice),
                    Paid: eggsaleinvdata.Paid,
                    Due: Math.round(eggsaleinvdata.Due),
                    EggSaleList: eggsalearr,
                    VehicleNo: eggsaleinvdata.VehicleNo,
                    AdditionalCharge: eggsaleinvdata.AdditionalCharge,
                    Cash: eggsaleinvdata.Cash,
                    PhonePay: eggsaleinvdata.PhonePay,
                    NetBanking: eggsaleinvdata.NetBanking,
                    UPI: eggsaleinvdata.UPI,
                    Cheque: eggsaleinvdata.Cheque,
                    Advance: eggsaleinvdata.Advance,
                    Complimentary:eggsaleinvdata.Complimentary,
                    CompanyId:localStorage.getItem('companyid')

                })
            }).then(res => res.json())
                .then((result) => {

                    if (result.StatusCode === 200) {
                        history("/eggsale/?uid=" + uid);
                        props.showAlert("Successfully updated!!", "info")
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

        setValidated(true);
    }

    const selectPaginationChange = (e) => {
        setItemsPerPage(e.target.value);
        addCount(count);
    }

    let addInvoiceModalClose = () => {
        setInvoiceModalShow(false);
    };

    return (

        <div>
            {/* {isloaded && <Loading />} */}
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <h4>Egg sale</h4>
            </div>

            {/* <div className="container" style={{ marginTop: '30px', marginBottom: '15px' }}>
                <div className="row align-items-center">
                    <div className="col-4" style={{ textAlign: 'right' }}>
                        <p><strong>Purchase Date *</strong></p>

                    </div>
                    <div className="col-4" style={{ textAlign: 'left' }}>
                        <DateComponent date={null} onChange={purchaseDateChange} isRequired={true} value={eggsaleinvdata.PurchaseDate} />
                    </div>
                    <div className="col-4" style={{ textAlign: 'left' }}>

                        {

                        }

                    </div>
                </div>
            </div> */}


            <div class="row">
                <div class="col-md-6" style={{ textAlign: 'left' }}>
                    <h5 className="card-title">Customer Name: {customerdetails.FirstName + " " + customerdetails.LastName}</h5>
                </div>

                <div class="col-md-6" style={{ textAlign: 'right' }}> <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => clickAddEggSale()}>Add Item</Button></div>


            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr className="tr-custom" align='center'>
                        <th>Category</th>
                        <th>Rate (<span>&#8377;</span>)</th>
                        <th>Quantity </th>
                        <th>Total cost (<span>&#8377;</span>)</th>
                        <th>Discnt/Egg (<span>&#8377;</span>)</th>
                        <th>Total discnt (<span>&#8377;</span>)</th>
                        <th>Final cost (<span>&#8377;</span>)</th>
                        <th>Comments</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {

                        eggsalearr.length > 0 ? eggsalearr.map((p, i) => {

                            const filterByCategorydId = eggcategory.filter((c) => c.Id === parseInt(p.EggCategory));
                            const catname = filterByCategorydId.length > 0 ? filterByCategorydId[0].EggCategoryName : "";

                            return (
                                <tr align='center' key={i} style={{ fontSize: 14 }} >
                                    <td align='center'>{catname}</td>
                                    <td align='center'>{p.EggRate}</td>
                                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                                    }).format(parseInt(p.Quantity))}
                                    </td>


                                    <td align='center'>{new Intl.NumberFormat('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(parseFloat(parseFloat(p.TotalCost||0).toFixed(2)))}</td>



                                    {/* <td align='center'> {p.TotalCost !== "" ?  parseFloat(p.TotalCost).toFixed(2) : p.TotalCost}
                                    </td> */}

                                    <td align='center'>{parseFloat(p.DiscountPerEgg||0).toFixed(2)}</td>

                                    <td align='center'>{parseFloat(p.TotalDiscount||0).toFixed(2)}</td>
                                    <td align='center'>
                                        {p.FinalCost !== "" ? parseFloat(p.FinalCost||0).toFixed(2) : p.FinalCost}
                                    </td>

                                    <td align='left'>{p.Comments}</td>

                                    <td align='center'>
                                        {
                                            <ButtonToolbar>

                                                <i className="fa-solid fa-pen-to-square" title='Edit' style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditEggSale(p)}></i>

                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" title='Delete' style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteEggSale(p)}></i>}



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
                {
                    eggsalearr.length > 0 && <tfoot style={{ backgroundColor: '#cccccc', fontWeight: 'bold', fontSize: 14 }}>
                        <td align='center'>Total</td>
                        <td align='center'>-</td>
                        <td align='center'>{eggsaleinvdata.TotalQuantity >= 0 ? new Intl.NumberFormat('en-IN', {
                        }).format(parseInt(eggsaleinvdata.TotalQuantity)) : eggsaleinvdata.TotalQuantity}</td>

                        <td align='center'>{new Intl.NumberFormat('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(parseFloat(parseFloat(eggsaleinvdata.TotalCost).toFixed(2)))}</td>


                        {/* <td align='center'>{parseFloat(eggsaleinvdata.TotalCost).toFixed(2)}</td> */}
                        <td align='center'>-</td>

                        <td align='center'>{new Intl.NumberFormat('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(parseFloat(parseFloat(eggsaleinvdata.TotalDiscount||0).toFixed(2)))}</td>
                        {/* <td align='center'>{eggsaleinvdata.TotalDiscount}</td> */}

                        <td align='center'>{new Intl.NumberFormat('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(parseFloat(Math.round(parseFloat(eggsaleinvdata.FinalCostInvoice)).toFixed(2)))}</td>


                        {/* <td align='center'>{ parseFloat(Math.round(parseFloat(eggsaleinvdata.FinalCostInvoice))- parseFloat(additionalCharge)).toFixed(2)}</td> */}
                        <td></td>
                        <td></td>
                    </tfoot>
                }

            </Table >
            {
                eggsalearr.length > 0 &&
                <Form noValidate validated={validated} className="needs-validation">
                    <Row className="mb-12">

                        <Form.Group as={Col} controlId="PurchaseDate">
                            <Form.Label style={{ fontSize: 13 }}>Purchase Date *</Form.Label>
                            <DateComponent date={null} onChange={purchaseDateChange}
                                isRequired={true} value={eggsaleinvdata.PurchaseDate} />
                            <Form.Control.Feedback type="invalid">
                                Please select date
                            </Form.Control.Feedback>
                        </Form.Group>

                        <InputField controlId="AdditionalCharge" label="Additional charge"
                            type="number"
                            value={eggsaleinvdata.AdditionalCharge}
                            name="AdditionalCharge"
                            placeholder="Additional charge"
                            errormessage="Please enter Additional charge"
                            required={false}
                            disabled={false}
                            onChange={additionalChargeChange}
                        />



                        <InputField controlId="FinalCostInvoice" label="Final cost *"
                            type="number"

                            // new Intl.NumberFormat('en-IN', {
                            //     minimumFractionDigits: 2,
                            //     maximumFractionDigits: 2
                            // }).format(parseFloat(parseFloat(
                            //     Math.round(parseFloat(eggsaleinvdata.FinalCostInvoice))
                            //     +(additionalCharge==""?0: parseFloat(additionalCharge))).toFixed(2)))
                            value={
                                parseFloat(Math.round(parseFloat(eggsaleinvdata.FinalCostInvoice))).toFixed(2)
                            }
                            name="FinalCostInvoice"
                            placeholder="Final cost"
                            errormessage="Please enter final cost"
                            required={true}
                            disabled={true}
                        />

                        {/* <InputField controlId="FinalCostInvoice" label="Final cost *"
                            type="number"
                            value={eggsaleinvdata.FinalCostInvoice >= 0 ? 
                                Math.round(parseFloat(eggsaleinvdata.FinalCostInvoice)).toFixed(2) 
                                : eggsaleinvdata.FinalCostInvoice}
                            name="FinalCostInvoice"
                            placeholder="Final cost"
                            errormessage="Please enter final cost"
                            required={true}
                            disabled={true}
                        /> */}
                    </Row>
                    <Row>

                        {/* <InputField controlId="Paid" label="Paid *"
                            type="text"
                            value={eggsaleinvdata.Paid}
                            name="Paid"
                            placeholder="Paid"
                            errormessage="Please enter paid amount"
                            required={true}
                            disabled={false}
                            onChange={paidChange}
                        /> */}

                        <InputField controlId="Cash" label="Cash "
                            type="text"
                            value={eggsaleinvdata.Cash}
                            name="Cash"
                            placeholder="Cash"
                            errormessage="Please enter amount"
                            required={false}
                            disabled={false}
                            onChange={cashChange}
                        />
                        <InputField controlId="PhonePay" label="Phone Pay"
                            type="text"
                            value={eggsaleinvdata.PhonePay}
                            name="PhonePay"
                            placeholder="PhonePay"
                            errormessage="Please enter amount"
                            required={false}
                            disabled={false}
                            onChange={phonePayChange}
                        />

                        <InputField controlId="NetBanking" label="Net Banking Pay"
                            type="text"
                            value={eggsaleinvdata.NetBanking}
                            name="NetBanking"
                            placeholder="NetBanking"
                            errormessage="Please enter amount"
                            required={false}
                            disabled={false}
                            onChange={netBankingChange}
                        />

                        <InputField controlId="UPI" label="UPI"
                            type="text"
                            value={eggsaleinvdata.UPI}
                            name="UPI"
                            placeholder="UPI"
                            errormessage="Please enter amount"
                            required={false}
                            disabled={false}
                            onChange={upiChange}
                        />

                        <InputField controlId="Cheque" label="Cheque"
                            type="text"
                            value={eggsaleinvdata.Cheque}
                            name="Cheque"
                            placeholder="Cheque"
                            errormessage="Please enter amount"
                            required={false}
                            disabled={false}
                            onChange={chequeChange}
                        />
                    </Row>
                    <Row>

                        <InputField controlId="Due" label="Due *"
                            type="number"
                            value={parseFloat(Math.round(parseFloat(eggsaleinvdata.Due || 0)
                            ).toFixed(2))
                            }
                            name="Due"
                            placeholder="Due"
                            errormessage="Please enter due amount"
                            required={true}
                            disabled={true}

                        />

                        <InputField controlId="Complimentary" label="Complimentary"
                            type="number"
                            value={eggsaleinvdata.Complimentary}
                            name="Complimentary"
                            placeholder="Complimentary"
                            errormessage="Enter amount"
                            required={false}
                            disabled={false}
                            onChange={complimentaryChange}
                        />

                        <InputField controlId="Advance" label="Advance"
                            type="number"
                            value={eggsaleinvdata.Advance}
                            name="Advance"
                            placeholder="Advance"
                            errormessage="Please enter amount"
                            required={false}
                            disabled={false}
                            onChange={advanceChange}

                        />
                    </Row>
                    <Row className="mb-12">
                        <InputField controlId="VehicleNo" label="Vehicle no"
                            type="text"
                            value={eggsaleinvdata.VehicleNo}
                            name="VehicleNo"
                            placeholder="Vehicle no"
                            errormessage="Please enter Vehicle no"
                            required={false}
                            disabled={false}
                            onChange={vehicleNoChange}
                        />

                    </Row>

                    <Form.Group as={Col} style={{ textAlign: 'center' }}>
                        {eggsaleinvdata.Id <= 0 ?
                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }}
                                className="btn-save-eggsale" onClick={clickSaveEggInvoiceDetails}>
                                Save
                            </Button>
                            : null
                        }

                        {
                            eggsaleinvdata.Id > 0 ?
                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }}
                                    className="btn-save-eggsale" onClick={clickUpdateEggInvoiceDetails}>
                                    Update
                                </Button>
                                : null
                        }

                        <Button variant="danger" style={{ marginTop: "30px", marginLeft: "10px" }}
                            onClick={clickBack}>Back</Button>
                    </Form.Group>
                </Form>
            }


            {

                eggsalelist && eggsalelist.length > itemsPerPage &&
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
                            {eggsaledata.modaltitle}
                        </Modal.Title>
                        <button type="button" className="btn-close" aria-label="Close" onClick={addInvoiceModalClose}> </button>
                    </Modal.Header>

                    <Modal.Body>
                        <Fragment>
                            <PDFViewer width="900" height="900" className="app" >

                                <InvoiceEggSale companydetails={companydetails}
                                    eggsaledata={eggsaledata}
                                    customerdetails={customerdetails} bankdetails={bankdetails} />
                            </PDFViewer>
                        </Fragment>
                    </Modal.Body>
                </Modal>

                <Modal
                    show={addModalShow}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {eggsaledata.modaltitle}
                        </Modal.Title>
                        <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>

                                <div>
                                    <Form noValidate validated={validated} className="needs-validation">
                                        <Row className="mb-12">
                                            <Form.Group controlId="Id" as={Col} >
                                                <Form.Label style={{fontSize:'13px'}}>Category*</Form.Label>
                                                <Form.Select aria-label="Default select example" style={{fontSize:'13px'}}
                                                    onChange={eggCategoryChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {
                                                        eggcategory.map((item) => {
                                                            return (
                                                                <option
                                                                    key={item.Id}
                                                                    defaultValue={item.Id == null ? null : item.Id}
                                                                    selected={item.Id === parseInt(eggsaledata.EggCategory)}
                                                                    value={item.Id}
                                                                >{item.EggCategoryName}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select egg category
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <InputField controlId="EggPack" label="Egg pack"
                                                type="number"
                                                value={eggsaledata.EggPack}
                                                name="EggPack"
                                                placeholder="Egg pack"
                                                errormessage="Please enter no of Egg Pack"
                                                required={false}
                                                disabled={false}
                                                onChange={eggpackChange}
                                            />

                                            <InputField controlId="EggLose" label="Egg lose"
                                                type="number"
                                                value={eggsaledata.EggLose}
                                                name="EggLose"
                                                placeholder="Egg lose"
                                                errormessage="Please enter no of Egg Lose"
                                                required={false}
                                                disabled={false}
                                                onChange={eggloseChange}
                                            />

                                        </Row>

                                        <Row>
                                            <InputField controlId="Quantity" label="Quantity *"
                                                type="text"
                                                value={eggsaledata.Quantity}
                                                name="Quantity"
                                                placeholder="Quantity"
                                                errormessage="Please enter quantity"
                                                required={false}
                                                disabled={true}
                                                onChange={quantityChange}
                                            />

                                            <InputField controlId="EggRate" label="Egg rate *"
                                                type="text"
                                                value={eggsaledata.EggRate}
                                                name="EggRate"
                                                placeholder="Rate"
                                                errormessage=" Please enter egg rate"
                                                required={true}
                                                disabled={false}
                                                onChange={eggRateChange}
                                            />
                                            <InputField controlId="DiscountPerEgg" label="Discount/Egg"
                                                type="text"
                                                value={eggsaledata.DiscountPerEgg}
                                                name="DiscountPerEgg"
                                                placeholder="Discount/egg"
                                                errormessage="Please enter Discount"
                                                required={false}
                                                disabled={false}
                                                onChange={discountChange}
                                            />

                                        </Row>

                                        <Row className="mb-12">
                                            <InputField controlId="TotalCost" label="Total cost *"
                                                type="number"
                                                value={eggsaledata.TotalCost >= 0 ? parseFloat(eggsaledata.TotalCost).toFixed(2) : eggsaledata.TotalCost}
                                                name="TotalCost"
                                                placeholder="Total cost"
                                                errormessage="Please enter total cost"
                                                required={true}
                                                disabled={true}
                                            />


                                            <InputField controlId="TotalDiscount" label="Total discount"
                                                type="text"
                                                value={eggsaledata.TotalDiscount > 0 ? parseFloat(eggsaledata.TotalDiscount).toFixed(2) : eggsaledata.TotalDiscount}
                                                name="TotalDiscount"
                                                placeholder="Total discount"
                                                errormessage="Please enter Discount"
                                                required={true}
                                                disabled={true}
                                            />

                                            <InputField controlId="FinalCostInvoice" label="Final cost *"
                                                type="number"
                                                value={eggsaledata.FinalCost !== "" ? parseFloat(eggsaledata.FinalCost).toFixed(2) : eggsaledata.FinalCost}
                                                name="FinalCost"
                                                placeholder="Final cost"
                                                errormessage="Please enter final cost"
                                                required={true}
                                                disabled={true}
                                            />
                                        </Row>


                                        <Row className="mb-12">
                                            <Form.Group controlId="Comments" as={Col} >
                                                <Form.Label style={{fontSize:'13px'}}>Comments</Form.Label>
                                                <Form.Control  style={{fontSize:'13px'}} as="textarea" rows={3} name="Comments" onChange={commentsChange} value={eggsaledata.Comments}
                                                    placeholder="Comments" />

                                            </Form.Group>
                                        </Row>

                                        <Row className="mb-3">

                                        </Row>

                                        <Form.Group as={Col}>
                                            {eggsaledata.Id <= 0 && eggsaledata.tempid <= 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleAddToList(e)}>
                                                    Add
                                                </Button>
                                                : null
                                            }

                                            {eggsaledata.Id > 0 || eggsaledata.tempid > 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleEditToList(e)}>
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


        </div >
    )
}

export default EggSaleModule
