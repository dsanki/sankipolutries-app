import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import moment from 'moment';
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'
import {
    FetchUnit, FetchShedsList, FetchLots, FetchLotById, FetchShedLotMapList, FetchBirdSaleList,
    dateyyyymmdd, downloadExcel, HandleLogout, NumberInputKeyDown, FetchCompanyDetails,
    AmountInWords, ReplaceNonNumeric, Commarize, ConvertNumberToWords, GetCustomerByTypeId, FecthBirdType
} from '../../Utility'

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
    const [_unitname, setUnitName] = useState();
    const [clientlist, setClientList] = useState([]);

    const [cidfilter, setCIdFilter] = useState();

    const [ucount, setUCount] = useState(0);
    const objupdate = useMemo(() => ({ ucount }), [ucount]);
    const [newcount, setAddNewCount] = useState(0);
    const objAddNew = useMemo(() => ({ newcount }), [newcount]);
    const [birdtypelist, setBirdTypeList] = useState([]);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    let addUCount = (num) => {
        setUCount(num + 1);
    };

    let addNewCount = (num) => {
        setAddNewCount(num + 1);
    };

    const initialBirdSalesDetailsValues = {
        Id: '0',
        BirdTypeId: '',
        ShedId: '',
        LotId: '',
        BirdCount: '',
        UnitId: '',
        UnitPrice: '',
        Amount: '',
        ParentId: '0',
        LotName: "",
        CompanyId: localStorage.getItem('companyid')
    }

    const [birdSalesDetailsFields, setBirdSalesDetailsFields] = useState([
        {
            Id: '0',
            BirdTypeId: '',
            ShedId: '',
            LotId: '',
            BirdCount: '',
            UnitId: '',
            UnitPrice: '',
            Amount: '',
            ParentId: '0',
            LotName: "",
            CompanyId:localStorage.getItem('companyid')
        }
    ])

    const addFields = (e) => {
        let object = {
            Id: '0',
            BirdTypeId: '',
            ShedId: '',
            LotId: '',
            BirdCount: '',
            UnitId: '',
            UnitPrice: '',
            Amount: '',
            ParentId: '0',
            LotName: "",
            CompanyId: localStorage.getItem('companyid')
        }

        setBirdSalesDetailsFields([...birdSalesDetailsFields, object]);
        addNewCount(newcount);
    }

    const removeFields = (index) => {
        let data = [...birdSalesDetailsFields];
        data.splice(index, 1);
        setBirdSalesDetailsFields(data);
        addUCount(ucount);
    }

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        // LotId: "",
        //ShedId: "",
        Date: "",
        CustomerId: uid,
        // BirdCount: "",
         TotalWeight: "",
        // UnitId: "",
        // Rate: "",
        // TotalAmount: "",
        Paid: "",
        Due: "",
        PaymentDate: "",
        Comments: "",
        // LotName: "",
        TotalBirdSale: "",
        CustomerName: "",
        VehicleNo: "",
        UnitName: _unitname,
        CompanyId: localStorage.getItem('companyid'),
        Discount: "",
        FinalCost: "",
        BirdSaleDetailsList: [initialBirdSalesDetailsValues],
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
        CustomerName: "",
        VehicleNo: "",
        //UnitName: "",
        CompanyId: localStorage.getItem('companyid'),
        Discount: "",
        FinalCost: ""
    }];

    const [birdsaledata, setBirdSaleData] = useState(initialvalues);

    const clickAddBirdSale = () => {
        setAddModalShow({ addModalShow: true });
        setBirdSalesDetailsFields([initialBirdSalesDetailsValues]);
        setBirdSaleData({
            modaltitle: "Add",
            Id: 0,
            // LotId: "",
            //ShedId: "",
            Date: "",
            CustomerId: uid,
            //BirdCount: "",
            //TotalWeight: "",
            //UnitId: "",
            //Rate: "",
            TotalAmount: "",
            Paid: "",
            Due: "",
            PaymentDate: "",
            Comments: "",
            //LotName: "",
            TotalBirdSale: "",
            InvoiceNo: "",
            VehicleNo: "",
            // UnitName: "",
            AdditionalCharge: "",
            Cash: "",
            PhonePay: "",
            NetBanking: "",
            CashDeposite: "",
            //Cheque: "",
            CompanyId: localStorage.getItem('companyid'),
            Discount: "",
            FinalCost: "",
            BirdSaleDetailsList: [initialBirdSalesDetailsValues]
        })
    }

    const _bankdetails = {
        BankName: "",
        AccountNo: "",
        IfscCode: ""
    }

    const [bankdetails, setBankDetails] = useState(_bankdetails);

    const clickEditBirdSale = (md) => {
        setAddModalShow({ addModalShow: true });
        setBirdSalesDetailsFields(md.BirdSaleDetailsList);
        setBirdSaleData({
            modaltitle: "Edit Bird Sale",
            Id: md.Id,
            //LotId: md.LotId,
            //ShedId: md.ShedId,
            Date: md.Date,
            CustomerId: md.CustomerId,
            //BirdCount: md.BirdCount,
            //TotalWeight: md.TotalWeight,
            //UnitId: md.UnitId,
            //Rate: md.Rate,
            TotalAmount: md.TotalAmount,
            Paid: md.Paid,
            Due: md.Due,
            PaymentDate: md.PaymentDate,
            Comments: md.Comments,
            // LotName: md.LotName,
            TotalBirdSale: md.TotalBirdSale,
            InvoiceNo: md.InvoiceNo,
            CustomerName: md.CustomerName,
            VehicleNo: md.VehicleNo,
            //UnitName: md.UnitName,
            AdditionalCharge: md.AdditionalCharge,
            Cash: md.Cash,
            PhonePay: md.PhonePay,
            NetBanking: md.NetBanking,
            CashDeposite: md.CashDeposite,
            // Cheque: md.Cheque,
            CompanyId: localStorage.getItem('companyid'),
            Discount: md.Discount,
            FinalCost: md.FinalCost,
            BirdSaleDetailsList: md.BirdSaleDetailsList
        })
    }

    const lotChange = (e) => {
        setBirdSaleData({ ...birdsaledata, LotId: e.target.value });
    }

    const vehicleNoChange = (e) => {
        setBirdSaleData({ ...birdsaledata, VehicleNo: e.target.value });
    }
    const birdTypeChange = (e, index) => {
        let data = [...birdSalesDetailsFields];

        data[index]["BirdTypeId"] = e.target.value;
        setBirdSalesDetailsFields(data);
        //setBirdSaleData({ ...birdsaledata, VehicleNo: e.target.value });
    }
    const shedChange = (e, index) => {
        let lotid = "";
        let lotname = "";
        let totalbirdsale = "";

        const filterval = shedlotmaplist.filter((c) => c.shedid === parseInt(e.target.value));

        if (filterval.length > 0) {
            lotid = filterval[0].lotid;
            lotname = filterval[0].lotname;


            let data = [...birdSalesDetailsFields];

            data[index]["ShedId"] = e.target.value;
            data[index]["LotId"] = lotid;

            setLotName(filterval[0].lotname);

            data[index]["LotName"] = lotname;

            FetchLotById(filterval[0].lotid)
                .then(data => {
                    totalbirdsale = data.TotalBirdSale;
                    //setTotalBirds(data.TotalBirdSale);
                });

            setBirdSalesDetailsFields(data);
            //addUCount(ucount);

            //setBirdSaleData({ ...birdsaledata, ShedId: e.target.value, LotId: filterval[0].lotid });
            // setBirdSaleData({ ...birdsaledata, ShedId: e.target.value, LotId: lotid, 
            //     LotName: lotname, TotalBirdSale: totalbirdsale });
        }
    }

    const dateChange = (e) => {
        setBirdSaleData({ ...birdsaledata, Date: e.target.value });
    }

    const customerChange = (e) => {
        setBirdSaleData({ ...birdsaledata, CustomerId: e.target.value });
    }

    const birdcountChange = (e, index) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {

            let data = [...birdSalesDetailsFields];
            data[index]["BirdCount"] = e.target.value;
            setBirdSalesDetailsFields(data);
            //addUCount(ucount);

            //setBirdSaleData({ ...birdsaledata, BirdCount: e.target.value });
        }
    }

    const totalWeightChange = (e, index) => {
        const re = /^\d*\.?\d{0,2}$/
        let totalwt = e.target.value;

        if (totalwt === '' || re.test(totalwt)) {

            let data = [...birdSalesDetailsFields];
            data[index]["TotalWeight"] = totalwt;

            let totalamt = (parseFloat(totalwt || 0) * parseFloat(data[index]["Rate"] || 0));
            data[index]["Amount"] = totalamt;

            //  let _finalcost = Math.round((parseFloat(totalamt || 0) - parseFloat(birdsaledata.Discount || 0)));

            // let due = _finalcost - (parseFloat(birdsaledata.Cash || 0)
            //     + parseFloat(birdsaledata.PhonePay || 0)
            //     + parseFloat(birdsaledata.NetBanking || 0) + parseFloat(birdsaledata.Cheque || 0)
            //     + parseFloat(birdsaledata.CashDeposite || 0));

            setBirdSalesDetailsFields(data);
            addUCount(ucount);

            // setBirdSaleData({
            //     ...birdsaledata,
            //     TotalWeight: totalwt,
            //     TotalAmount: totalamt.toFixed(2),
            //     Due: due.toFixed(2),
            //     FinalCost: _finalcost
            // });
        }
    }

    const unitIdChange = (e, index) => {
        let data = [...birdSalesDetailsFields];
        data[index]["UnitId"] = e.target.value;
        setBirdSalesDetailsFields(data);
        //addUCount(ucount);
        //etBirdSaleData({ ...birdsaledata, UnitId: e.target.value });
    }

    // const rateChange = (e) => {
    //     const re = /^\d*\.?\d{0,2}$/
    //     let rate = e.target.value;

    //     if (rate === '' || re.test(rate)) {

    //         let Adchrg = parseFloat(birdsaledata.AdditionalCharge || 0);
    //         let totalamt = (birdsaledata.TotalWeight * parseFloat(rate || 0)) + Adchrg;
    //         let _finalcost = Math.round((parseFloat(totalamt || 0) - parseFloat(birdsaledata.Discount || 0)));
    //         let due = _finalcost - parseFloat(birdsaledata.Paid || 0);

    //         setBirdSaleData({
    //             ...birdsaledata,
    //             Rate: rate,
    //             TotalAmount: totalamt.toFixed(2),
    //             Due: due.toFixed(2),
    //             FinalCost: _finalcost.toFixed(2)
    //         });
    //     }
    // }


    const rateChange = (e, index) => {
        const re = /^\d*\.?\d{0,2}$/
        let rate = e.target.value;

        if (rate === '' || re.test(rate)) {
            let data = [...birdSalesDetailsFields];

            data[index]["Rate"] = rate;
            let totalamount = (parseFloat(rate)) * parseFloat(data[index]["TotalWeight"] || 0);
            data[index]["Amount"] = totalamount;
            //let Adchrg = parseFloat(birdsaledata.AdditionalCharge || 0);
            //let totalamt = (birdsaledata.TotalWeight * parseFloat(rate || 0));
            // let _finalcost = Math.round((parseFloat(totalamt || 0) - parseFloat(birdsaledata.Discount || 0)));
            // let due = _finalcost - parseFloat(birdsaledata.Paid || 0);
            setBirdSalesDetailsFields(data);
            addUCount(ucount);
            // setBirdSaleData({
            //     ...birdsaledata,
            //     Rate: rate,
            //     TotalAmount: totalamount.toFixed(2)
            //     //Due: due.toFixed(2),
            //     //FinalCost: _finalcost.toFixed(2)
            // });
        }
    }

    const fetchCompanyDetails = async () => {
        FetchCompanyDetails(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    let _companydetils = data.Result.filter((x) => x.Id ==
                        localStorage.getItem('companyid'));
                    setCompanyDetails(_companydetils);
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
            setBirdSaleData({
                ...birdsaledata, Paid: e.target.value,
                Due: (birdsaledata.TotalAmount - e.target.value).toFixed(2)
            });
        }
    }
    const paymentDateChange = (e) => {
        setBirdSaleData({ ...birdsaledata, PaymentDate: e.target.value });
    }
    const commentsChange = (e) => {
        setBirdSaleData({ ...birdsaledata, Comments: e.target.value });
    }

    const additionalChargeChange = (e) => {
        let addch = parseFloat(e.target.value || 0);

        // let Adchrg=parseFloat(birdsaledata.AdditionalCharge||0);
        //let totalamt = (birdsaledata.TotalAmount * parseFloat(birdsaledata.Rate || 0)) + addch;
        let _finalcost = Math.round((parseFloat(birdsaledata.TotalAmount || 0) -
            parseFloat(birdsaledata.Discount || 0))) + addch;
        let due = _finalcost - parseFloat(birdsaledata.Paid || 0);


        setBirdSaleData({
            ...birdsaledata, AdditionalCharge: e.target.value,
            Due:due>=0? due.toFixed(2):0,
            //TotalAmount: totalamt.toFixed(2),
            FinalCost: _finalcost.toFixed(2)

        });
    }

    const discountChange = (e) => {
        let _finalcost = Math.round((parseFloat(birdsaledata.TotalAmount || 0) - parseFloat(e.target.value || 0)));
        let _due=_finalcost - parseFloat(birdsaledata.Paid || 0);
        
        
        setBirdSaleData({
            ...birdsaledata,
            Discount: e.target.value,
            FinalCost: _finalcost.toFixed(2),
            Due:_due>=0? _due.toFixed(2):0// (_finalcost - parseFloat(birdsaledata.Paid || 0)).toFixed(2)
        });
    }

    const cashChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let cashamt = parseFloat(e.target.value || 0);
            
            setBirdSaleData({
                ...birdsaledata, Cash: e.target.value,

                Paid: (cashamt + parseFloat(birdsaledata.PhonePay || 0) +
                    parseFloat(birdsaledata.NetBanking || 0) + parseFloat(birdsaledata.CashDeposite || 0)
                ),
                Due: (birdsaledata.FinalCost -
                    (cashamt + parseFloat(birdsaledata.PhonePay || 0) +
                        parseFloat(birdsaledata.NetBanking || 0) + parseFloat(birdsaledata.CashDeposite || 0)
                        + parseFloat(birdsaledata.Cheque || 0))
                ).toFixed(2)>0?(birdsaledata.FinalCost -
                    (cashamt + parseFloat(birdsaledata.PhonePay || 0) +
                        parseFloat(birdsaledata.NetBanking || 0) + parseFloat(birdsaledata.CashDeposite || 0)
                        + parseFloat(birdsaledata.Cheque || 0))
                ).toFixed(2):0
            });
        }
    }

    const phonePayChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let phpayamt = parseFloat(e.target.value || 0);

            setBirdSaleData({
                ...birdsaledata, PhonePay: e.target.value,
                Paid: (phpayamt + parseFloat(birdsaledata.Cash || 0) +
                    parseFloat(birdsaledata.NetBanking || 0) + parseFloat(birdsaledata.CashDeposite || 0)
                ),
                Due: (birdsaledata.FinalCost -
                    (phpayamt + parseFloat(birdsaledata.Cash || 0) +
                        parseFloat(birdsaledata.NetBanking || 0)
                        + parseFloat(birdsaledata.CashDeposite || 0)
                    )
                ).toFixed(2)
            });
        }
    }

    const netBankingChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let nbamt = parseFloat(e.target.value || 0);

            setBirdSaleData({
                ...birdsaledata, NetBanking: e.target.value,
                Paid: (nbamt + parseFloat(birdsaledata.Cash || 0) +
                    parseFloat(birdsaledata.PhonePay || 0) + parseFloat(birdsaledata.CashDeposite || 0)
                ),
                Due: (birdsaledata.FinalCost -
                    (nbamt + parseFloat(birdsaledata.Cash || 0) +
                        parseFloat(birdsaledata.PhonePay || 0) + parseFloat(birdsaledata.CashDeposite || 0)
                    )
                ).toFixed(2)
            });
        }
    }

    const cashDepositeChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let upiamt = parseFloat(e.target.value || 0);

            setBirdSaleData({
                ...birdsaledata, CashDeposite: e.target.value,
                Paid: (upiamt + parseFloat(birdsaledata.Cash || 0) +
                    parseFloat(birdsaledata.PhonePay || 0) + parseFloat(birdsaledata.NetBanking || 0)
                ),
                Due: (birdsaledata.FinalCost -
                    (upiamt + parseFloat(birdsaledata.Cash || 0) +
                        parseFloat(birdsaledata.PhonePay || 0) + parseFloat(birdsaledata.NetBanking || 0)
                    )
                ).toFixed(2)
            });
        }
    }

    const chequeChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/

        if (e.target.value === '' || re.test(e.target.value)) {
            let chqamt = parseFloat(e.target.value || 0);

            setBirdSaleData({
                ...birdsaledata, Cheque: e.target.value,
                Paid: (chqamt + parseFloat(birdsaledata.Cash || 0) +
                    parseFloat(birdsaledata.PhonePay || 0) + parseFloat(birdsaledata.NetBanking || 0)
                    + parseFloat(birdsaledata.CashDeposite || 0)),
                Due: (birdsaledata.FinalCost -
                    (chqamt + parseFloat(birdsaledata.Cash || 0) +
                        parseFloat(birdsaledata.PhonePay || 0) + parseFloat(birdsaledata.NetBanking || 0)
                        + parseFloat(birdsaledata.CashDeposite || 0))
                ).toFixed(2)
            });
        }
    }

    const clientChange = (e) => {
        setBirdSaleData({ ...birdsaledata, CustomerId: e.target.value });
    }


    const fetchClient = async () => {
        GetCustomerByTypeId(process.env.REACT_APP_CUST_TYPE_BIRD,
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

    useEffect((e) => {
        if (uid != null) {
            fetchCustomerDetails(uid);
        }

    }, [uid]);


    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchUnit();
            fetchSheds();
            fetchLots();
            fetchShedLotsMapList();
            _fetchBirdType();
            fetchCompanyDetails();
            fetchClient();
            setBirdSaleData({ ...birdsaledata, CustomerId: uid });
            setBankDetails({
                ...bankdetails, BankName: process.env.REACT_APP_BANK_NAME,
                AccountNo: process.env.REACT_APP_ACCOUNT_NO, IfscCode: process.env.REACT_APP_IFSC_CODE
            });
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

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            setBirdSaleData({
                ...birdsaledata, BirdSaleDetailsList: birdSalesDetailsFields
            });
        }
        else {
        }
    }, [objAddNew]);


    useEffect((e) => {

        setBirdSaleData({
            ...birdsaledata, BirdSaleDetailsList: birdSalesDetailsFields
        });

        const { totalCost, totalWeight } =
            birdSalesDetailsFields.reduce((accumulator, item) => {
                accumulator.totalCost += item.Amount;
                accumulator.totalWeight += item.TotalWeight;
                return accumulator;
            }, { totalCost: 0, totalWeight: 0 })

        //   let cost=totalCost;
        //   let data=birdsaledata;
        let _finalCost = Math.round((parseFloat(totalCost || 0) + parseFloat(birdsaledata.AdditionalCharge || 0)) -
            parseFloat(birdsaledata.Discount || 0)).toFixed(2);

        let _due = (parseFloat(_finalCost || 0) - parseFloat(birdsaledata.Paid || 0)).toFixed(2)

        //  // data.BirdSaleDetailsList=birdSalesDetailsFields;
        //   data.TotalAmount=parseFloat(totalCost||0).toFixed(2);
        //   data.FinalCost=_finalCost;
        //   data.Due=_due;

        //   //data["FinalCost"]=_finalCost;
        //  // data["Due"]=_due;

        //   setBirdSaleData(data);

        setBirdSaleData({
            ...birdsaledata, BirdSaleDetailsList: birdSalesDetailsFields,

            // Due:((parseFloat(totalCost||0)+ parseFloat(birdsaledata.AdditionalCharge || 0))-
            //  parseFloat(birdsaledata.Discount || 0))-parseFloat(birdsaledata.Paid || 0)

            Due: _due>=0?_due:0,// parseFloat(Math.round(totalCost - parseFloat(birdsaledata.Paid || 0))).toFixed(2),

            TotalWeight:totalWeight,
            TotalAmount: parseFloat(Math.round(totalCost)).toFixed(2),
            FinalCost: _finalCost>=0?_finalCost:0


        });

    }, [objupdate]);



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

    const fetchSheds = () => {
        FetchShedsList(process.env.REACT_APP_API)
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
        FetchLots(process.env.REACT_APP_API)
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
        FetchShedLotMapList(process.env.REACT_APP_API)
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
    //

    const _fetchBirdType = () => {
        FecthBirdType(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setBirdTypeList(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 500) {
                    HandleLogout();
                    history("/login")
                }
                else {
                    setIsLoaded(false);
                    errorHandle(data.StatusCode);
                }
            });
    }


    const _birdSaleList = (uid) => {
        setIsLoaded(true);
        FetchBirdSaleList(uid, null, process.env.REACT_APP_API)
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
                    // LotId: birdsaledata.LotId,
                    // ShedId: birdsaledata.ShedId,
                    Date: birdsaledata.Date,
                    CustomerId: birdsaledata.CustomerId,
                    // BirdCount: birdsaledata.BirdCount,
                     TotalWeight: birdsaledata.TotalWeight,
                    // UnitId: birdsaledata.UnitId,
                    // Rate: birdsaledata.Rate,
                    TotalAmount: birdsaledata.TotalAmount,
                    Paid: birdsaledata.Paid,
                    Due: birdsaledata.Due,
                    PaymentDate: birdsaledata.PaymentDate,
                    Comments: birdsaledata.Comments,
                    VehicleNo: birdsaledata.VehicleNo,
                    AdditionalCharge: birdsaledata.AdditionalCharge,
                    Cash: birdsaledata.Cash,
                    PhonePay: birdsaledata.PhonePay,
                    NetBanking: birdsaledata.NetBanking,
                    CashDeposite: birdsaledata.CashDeposite,
                    //  Cheque: birdsaledata.Cheque,
                    CompanyId: localStorage.getItem('companyid'),
                    Discount: birdsaledata.Discount,
                    FinalCost: birdsaledata.FinalCost,
                    BirdSaleDetailsList: birdsaledata.BirdSaleDetailsList

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
            //LotId: birdsaledata.LotId,
            //ShedId: birdsaledata.ShedId,
            Date: birdsaledata.Date,
            CustomerId: birdsaledata.CustomerId,
            //BirdCount: birdsaledata.BirdCount,
            //TotalWeight: birdsaledata.TotalWeight,
            //UnitId: birdsaledata.UnitId,
            //Rate: birdsaledata.Rate,
            TotalAmount: birdsaledata.TotalAmount,
            Paid: birdsaledata.Paid,
            Due: birdsaledata.Due,
            PaymentDate: birdsaledata.PaymentDate,
            Comments: birdsaledata.Comments,
            AmountInWords: ConvertNumberToWords(birdsaledata.TotalAmount),
            InvoiceNo: birdsaledata.InvoiceNo,
            VehicleNo: birdsaledata.VehicleNo,
            //UnitName: birdsaledata.UnitName,
            AdditionalCharge: birdsaledata.AdditionalCharge,
            Cash: birdsaledata.Cash,
            PhonePay: birdsaledata.PhonePay,
            NetBanking: birdsaledata.NetBanking,
            CashDeposite: birdsaledata.CashDeposite,
            //Cheque: birdsaledata.Cheque,
            CompanyId: localStorage.getItem('companyid'),
            Discount: birdsaledata.Discount,
            FinalCost: birdsaledata.FinalCost,
            BirdSaleDetailsList: birdsaledata.BirdSaleDetailsList
        });

        fetchCustomerDetails(birdsaledata.CustomerId);

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
                    //LotId: birdsaledata.LotId,
                    //ShedId: birdsaledata.ShedId,
                    Date: birdsaledata.Date,
                    CustomerId: birdsaledata.CustomerId,
                    //BirdCount: birdsaledata.BirdCount,
                     TotalWeight: birdsaledata.TotalWeight,
                    //UnitId: birdsaledata.UnitId,
                    // Rate: birdsaledata.Rate,
                    TotalAmount: birdsaledata.TotalAmount,
                    Paid: birdsaledata.Paid,
                    Due: birdsaledata.Due,
                    PaymentDate: birdsaledata.PaymentDate,
                    Comments: birdsaledata.Comments,
                    VehicleNo: birdsaledata.VehicleNo,
                    AdditionalCharge: birdsaledata.AdditionalCharge,
                    Cash: birdsaledata.Cash,
                    PhonePay: birdsaledata.PhonePay,
                    NetBanking: birdsaledata.NetBanking,
                    CashDeposite: birdsaledata.CashDeposite,
                    //Cheque: birdsaledata.Cheque,
                    CompanyId: localStorage.getItem('companyid'),
                    Discount: birdsaledata.Discount,
                    FinalCost: birdsaledata.FinalCost,
                    BirdSaleDetailsList: birdsaledata.BirdSaleDetailsList

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
        getFilterData(e.target.value, filterToDate, filterShed, cidfilter);
    }

    const clientFilterChange = (e) => {
        let _client = e.target.value;
        // history("/birdsale?uid="+_client)
        // 
        setCIdFilter(e.target.value);
        getFilterData(filterFromDate, filterToDate, filterShed, _client);
    }



    const getFilterData = (fromDate, toDate, shedid, cid) => {
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

        if (cid > 0) {
            _filterList = _filterList.filter((c) => c.CustomerId === parseInt(cid));
        }


        setBirdSaleList(_filterList);
    }

    const onDateFilterToChange = (e) => {
        setFilterToDate(e.target.value);
        getFilterData(filterFromDate, e.target.value, filterShed, cidfilter);
    }

    const onShedFilterChange = (e) => {
        setFilterShed(e.target.value);
        getFilterData(filterFromDate, filterToDate, e.target.value, cidfilter)
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


    return (
        <div>
            {isloaded && <Loading />}
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <h2>Bird Sale</h2>
            </div>
            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row align-items-center" style={{ fontSize: 13 }}>
                    <div className="col-2">
                        <p><strong>From</strong></p>
                        <DateComponent date={null} onChange={onDateFilterFromChange} isRequired={false} value={filterFromDate} />
                    </div>
                    <div className="col-2">
                        <p><strong>To</strong></p>
                        <DateComponent date={null} onChange={onDateFilterToChange} isRequired={false} value={filterToDate} />
                    </div>
                    <div className="col-2">
                        <p style={{ fontSize: 13 }}><strong >Shed</strong></p>
                        <Form.Select aria-label="Default select example"
                            onChange={onShedFilterChange} style={{ fontSize: 13 }}>
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

                    <div className="col-2">
                        <p style={{ fontSize: 13 }}><strong >Customer</strong></p>
                        <Form.Select style={{ fontSize: 13 }}
                            onChange={clientFilterChange} required>
                            <option selected value="">Choose...</option>
                            {

                                clientlist.length > 0 && clientlist.map((item) => {

                                    let fullname = (item.MiddleName != "" && item.MiddleName != null) ?
                                        item.FirstName + " " + item.MiddleName + " " + item.LastName :
                                        item.FirstName + " " + item.LastName;
                                    return (
                                        <option value={item.ID} key={item.ID}
                                            selected={item.ID === birdsaledata.CustomerId}>{fullname}</option>)
                                })


                            }
                        </Form.Select>
                    </div>

                    <div className="col-4" style={{ textAlign: 'right', marginTop: 30 }}>
                        <a className="mr-2 btn btn-primary"
                            style={{ marginRight: '20px' }} href={`/birdsalepaymentin/?custtype=${process.env.REACT_APP_CUST_TYPE_BIRD}`}>Payment</a>
                        <i className="fa-regular fa-file-excel fa-2xl"
                            style={{ color: '#bea2a2', marginRight: 30 }}
                            onClick={() => onDownloadExcel()} ></i>
                        <Button className="mr-2" variant="primary"
                            style={{ marginRight: "17.5px" }}
                            onClick={() => clickAddBirdSale()}>New</Button>
                    </div>
                </div>
            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center' className="tr-custom">
                        <th>Date</th>
                        {/* <th>Shed</th> */}
                        {/* <th>Lot</th> */}
                        <th>Customer name</th>
                        {/* <th>Bird count</th> */}
                        <th>Total weight</th>
                        {/* <th>Rate</th> */}
                        <th>Total amount</th>
                        <th>Paid</th>
                        <th>Due</th>
                        <th>Payment date</th>
                        <th>Comments</th>
                        <th>Vehicle no</th>
                        <th>Invoice</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>

                    {

                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
                            //const _unit = unitlist.filter((c) => c.ID === p.UnitId);
                            //const _uname = _unit.length > 0 ? _unit[0].UnitName : "";

                            // const _shed = shedlist.filter((c) => c.ShedId === p.ShedId);
                            // const _shedname = _shed.length > 0 ? _shed[0].ShedName : "";

                            //const _lot = lots.filter((c) => c.Id === p.LotId);
                            //const _lotname = _lot.length > 0 ? _lot[0].LotName : "";
                            // p.LotName = _lotname;

                            // BirdSaleListDowanloadArr.push({
                            //     Date: moment(p.Date).format('DD-MMM-YYYY'),
                            //     ShedName: _shedname, LotName: _lotname, CustomerId: p.CustomerId, BirdCount: p.BirdCount, TotalWeight: p.TotalWeight + " " + _uname,
                            //     Rate: p.Rate, TotalAmount: p.TotalAmount.toFixed(2), Paid: p.Paid.toFixed(2), Due: p.Due.toFixed(2), PaymentDate: moment(p.PaymentDate).format('DD-MMM-YYYY'),
                            //     Comments: p.Comments, CustomerName: p.CustomerName
                            // });



                            return (
                                !isloaded && <tr align='center' key={p.Id} style={{ fontSize: 13 }}>
                                    <td align='center'>{moment(p.Date).format('DD-MMM-YYYY')}</td>
                                    {/* <td align='center'>{_shedname}</td> */}
                                    {/* <td align='left'>{_lotname}</td> */}
                                    <td align='center'>{p.CustomerName}</td>
                                    {/* <td align='center'>{p.BirdCount}</td> */}
                                    <td align='center'>{p.TotalWeight}</td>
                                    {/* <td align='center'>{p.Rate}</td> */}

                                    <td align='center'>{p.TotalAmount.toFixed(2)}</td>
                                    <td align='center'>{p.Paid.toFixed(2)}</td>
                                    <td align='center'>{p.Due.toFixed(2)}</td>
                                    <td align='center'>{p.PaymentDate!=null?moment(p.PaymentDate).format('DD-MMM-YYYY'):""}</td>
                                    <td align='center'>{p.Comments}</td>
                                    <td align='center'>{p.VehicleNo}</td>
                                    <td>
                                        <i className="fa-sharp fa-solid fa-receipt fa-beat" title='Invoice'
                                            style={{ color: '#086dba', marginLeft: '15px' }} onClick={() => clickInvoice(p)}></i>
                                    </td>

                                    <td align='center'>
                                        {
                                            <ButtonToolbar>
                                                <i className="fa-solid fa-pen-to-square"
                                                    style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditBirdSale(p)}></i>
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
                                    birdsaledata={birdsaledata} customerdetails={customerdetails}
                                    bankdetails={bankdetails} />
                            </PDFViewer>
                        </Fragment>
                    </Modal.Body>
                </Modal>
            </div>

            <div className="ContainerOverride" id="exampleModal">
                <Modal
                    show={addModalShow}
                    {...props}
                    size="xl"
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
                                        <Row className="mb-12">
                                            <Form.Group as={Col} controlId="Date">
                                                <Form.Label style={{ fontSize: 13 }}>Date*</Form.Label>
                                                <DateComponent date={null} onChange={dateChange} isRequired={true}
                                                    value={birdsaledata.Date} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select date
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group controlId="ClientId" as={Col} >
                                                <Form.Label style={{ fontSize: 13 }}>Customer</Form.Label>
                                                <Form.Select style={{ fontSize: 13 }}
                                                    onChange={clientChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {

                                                        clientlist.length > 0 && clientlist.map((item) => {

                                                            let fullname = (item.MiddleName != "" && item.MiddleName != null) ?
                                                                item.FirstName + " " + item.MiddleName + " " + item.LastName :
                                                                item.FirstName + " " + item.LastName;
                                                            return (
                                                                <option value={item.ID} key={item.ID}
                                                                    selected={item.ID === birdsaledata.CustomerId}>{fullname}</option>)
                                                        })


                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select customer
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>


                                        <Row>
                                            <div className="row">
                                                <form>
                                                    <Row className="mb-12" style={{ fontSize: '12px', marginTop: '10px' }}>
                                                        <div class="col"><p class="form-label">Bird Type</p></div>
                                                        <div class="col"><p class="form-label">Shed</p></div>
                                                        <div class="col"><p class="form-label">Lot</p></div>
                                                        <div class="col"><p class="form-label">Bird Count</p></div>
                                                        <div class="col"><p class="form-label">Weight</p></div>
                                                        <div class="col"><p class="form-label">Unit</p></div>
                                                        <div class="col"><p class="form-label">Unit Price</p></div>
                                                        <div class="col"><p class="form-label">Amount</p></div>
                                                        <div class="col"><p class="form-label" ing>Delete</p></div>
                                                        <hr className="line" />
                                                    </Row>


                                                    {birdsaledata.BirdSaleDetailsList.map((form, index) => {
                                                        return (
                                                            <div key={index} style={{ marginTop: 10 }}>
                                                                <Row className="mb-12">

                                                                    <Form.Group controlId="Id" as={Col} >
                                                                        <Form.Control type="text" name="Id" hidden disabled value={birdsaledata.LotId}
                                                                        />
                                                                        <Form.Select aria-label="Default select example" style={{ fontSize: 13 }}
                                                                            onChange={event => birdTypeChange(event, index)} required>
                                                                            <option selected disabled value="">Choose...</option>
                                                                            {
                                                                                birdtypelist.map((item) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={item.Id}
                                                                                            defaultValue={item.Id == null ? null : item.Id}
                                                                                            selected={item.Id === form.BirdTypeId}
                                                                                            value={item.Id}
                                                                                        >{item.BirdTypeName}</option>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </Form.Select>
                                                                        <Form.Control.Feedback type="invalid">
                                                                            Please select bird type
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>

                                                                    <Form.Group controlId="ShedId" as={Col} >
                                                                        <Form.Control type="text" name="LotId" hidden disabled value={birdsaledata.LotId}
                                                                        />
                                                                        <Form.Select aria-label="Default select example" style={{ fontSize: 13 }}
                                                                            onChange={event => shedChange(event, index)} required
                                                                        //onChange={shedChange} 
                                                                        >
                                                                            <option selected disabled value="">Choose...</option>
                                                                            {
                                                                                shedlist.map((item) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={item.ShedId}
                                                                                            defaultValue={item.ShedId == null ? null : item.ShedId}
                                                                                            selected={item.ShedId === form.ShedId}
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
                                                                        label=""
                                                                        type="text"
                                                                        value={form.LotName}
                                                                        name="LotName"
                                                                        placeholder="Lot name"
                                                                        errormessage="Please provide lot name"
                                                                        required={true}
                                                                        disabled={true}
                                                                    />

                                                                    <InputField controlId="BirdCount"
                                                                        label=""
                                                                        type="text"
                                                                        value={form.BirdCount}
                                                                        name="BirdCount"
                                                                        placeholder="Bird count"
                                                                        errormessage="Please provide bird count"
                                                                        required={true}
                                                                        disabled={false}
                                                                        // onChange={birdcountChange}
                                                                        onChange={event => birdcountChange(event, index)}
                                                                    //onKeyDown={NumberInputKeyDown}
                                                                    />

                                                                    <InputField controlId="TotalWeight"
                                                                        label=""
                                                                        type="text"
                                                                        value={form.TotalWeight}
                                                                        name="TotalWeight"
                                                                        placeholder="Total weight"
                                                                        errormessage="Please provide total weight"
                                                                        required={true}
                                                                        disabled={false}
                                                                        //onChange={totalWeightChange}
                                                                        onChange={event => totalWeightChange(event, index)}
                                                                    />

                                                                    <Form.Group controlId="UnitId" as={Col} >
                                                                        <Form.Select aria-label="Default select example"
                                                                            onChange={event => unitIdChange(event, index)}
                                                                            required style={{ fontSize: 13 }}>
                                                                            <option selected disabled value="">Choose...</option>
                                                                            {
                                                                                unitlist.map((item) => {
                                                                                    return (
                                                                                        <option
                                                                                            key={item.ID}
                                                                                            defaultValue={item.ID == null ? null : item.ID}
                                                                                            selected={item.ID === form.UnitId}
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
                                                                        label=""
                                                                        type="text"
                                                                        value={form.Rate}
                                                                        name="Rate"
                                                                        placeholder="Rate"
                                                                        errormessage="Please enter rate"
                                                                        required={true}
                                                                        disabled={false}
                                                                        onChange={event => rateChange(event, index)}
                                                                    />

                                                                    <InputField controlId="Amount" label=""
                                                                        type="text"
                                                                        value={form.Amount}
                                                                        name="TotalAmount"
                                                                        placeholder="Total Amount"
                                                                        errormessage="Please provide total amount"
                                                                        required={true}
                                                                        disabled={true}
                                                                    />
                                                                    <div className="col">
                                                                        <i className="fa-solid fa-trash" style={{
                                                                            color: '#f81616',
                                                                            marginLeft: '15px'
                                                                        }}
                                                                            onClick={() => removeFields(index)}></i>
                                                                    </div>
                                                                </Row>
                                                            </div>
                                                        )
                                                    })}
                                                </form>
                                            </div>
                                            <i class="fa-solid fa-circle-plus" style={{ marginTop: '5px', width: '25px' }}
                                                onClick={(e) => addFields(e)}></i>
                                            <hr className="line" style={{ marginTop: '20px' }} />
                                        </Row>

                                        {/* <Row className="mb-12">
                                            <div className="col-8">
                                                <p class="form-label">Total weight :</p>
                                            </div>
                                            <div className="col-4" style={{ textAlign: 'left' }}>
                                                <p class="form-label">
                                                 {parseFloat(birdsaledata.TotalWeight || 0).toFixed(2)}</p>
                                            </div>
                                            <hr className="line" style={{ marginTop: '10px' }} />
                                        </Row> */}

                                        <Row className="mb-12">
                                            <div className="col-8">
                                                <p class="form-label">Total amount:</p>
                                            </div>
                                            <div className="col-4" style={{ textAlign: 'left' }}>
                                                <p class="form-label"><span>&#8377;</span> {parseFloat(birdsaledata.TotalAmount || 0).toFixed(2)}</p>
                                            </div>
                                            <hr className="line" style={{ marginTop: '10px' }} />
                                        </Row>



                                        {/* <Row>
                                            <Form.Group controlId="ShedId" as={Col} >
                                                <Form.Label style={{ fontSize: 13 }}>Shed*</Form.Label>
                                                <Form.Control type="text" name="LotId" hidden disabled value={birdsaledata.LotId}
                                                />
                                                <Form.Select aria-label="Default select example" style={{ fontSize: 13 }}
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
                                        </Row> */}

                                        <Row className="mb-12">
                                            {/* <input type="hidden" value={birdsaledata.CustomerId} name="name" /> */}



                                            {/* <InputField controlId="CustomerName"
                                                label="Customer name*"
                                                type="text"
                                                value={custname}
                                                name="CustomerName"
                                                placeholder="Customer name"
                                                errormessage="Please provide customer name"
                                                required={true}
                                                disabled={true}
                                            // onChange={customerChange}

                                            /> */}

                                            {/* <InputField controlId="BirdCount"
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
                                            /> */}

                                            {/* <InputField controlId="TotalWeight"
                                                label="Total weight*"
                                                type="text"
                                                value={birdsaledata.TotalWeight}
                                                name="TotalWeight"
                                                placeholder="Total weight"
                                                errormessage="Please provide total weight"
                                                required={true}
                                                disabled={false}
                                                onChange={totalWeightChange}
                                            /> */}

                                        </Row>
                                        {/* <Row className="mb-12">

                                            <Form.Group controlId="UnitId" as={Col} >
                                                <Form.Label style={{ fontSize: 13 }}>Unit*</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={unitIdChange} required style={{ fontSize: 13 }}>
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
                                                onChange={event => rateChange(event, index)}
                                            />

                                          
                                        </Row> */}
                                        <Row className="mb-12">

                                            {/* <InputField controlId="TotalAmount" label="Total amount*"
                                                type="text"
                                                value={birdsaledata.TotalAmount}
                                                name="TotalAmount"
                                                placeholder="Total Amount"
                                                errormessage="Please provide total amount"
                                                required={true}
                                                disabled={true}
                                            /> */}

                                            <InputField controlId="Discount" label="Discount"
                                                type="number"
                                                value={birdsaledata.Discount}
                                                name="Discount"
                                                placeholder="Discount"
                                                errormessage="Please provide discount"
                                                required={false}
                                                disabled={false}
                                                onChange={discountChange}
                                            />

                                            <InputField controlId="AdditionalCharge" label="Additional charge"
                                                type="number"
                                                value={birdsaledata.AdditionalCharge}
                                                name="AdditionalCharge"
                                                placeholder="Additional charge"
                                                errormessage="Please enter Additional charge"
                                                required={false}
                                                disabled={false}
                                                onChange={additionalChargeChange}
                                            />

                                            <InputField controlId="FinalCost" label="Final cost"
                                                type="number"
                                                value={birdsaledata.FinalCost}
                                                name="FinalCost"
                                                placeholder="Final cost"
                                                errormessage="Please provide final cost"
                                                required={false}
                                                disabled={true}
                                            />
                                        </Row>

                                        <Row>

                                        </Row>
                                        <Row>

                                            <InputField controlId="Cash" label="Cash "
                                                type="text"
                                                value={birdsaledata.Cash}
                                                name="Cash"
                                                placeholder="Cash"
                                                errormessage="Please enter amount"
                                                required={false}
                                                disabled={false}
                                                onChange={cashChange}
                                            />
                                            <InputField controlId="PhonePay" label="Phone Pay"
                                                type="text"
                                                value={birdsaledata.PhonePay}
                                                name="PhonePay"
                                                placeholder="PhonePay"
                                                errormessage="Please enter amount"
                                                required={false}
                                                disabled={false}
                                                onChange={phonePayChange}
                                            />

                                            <InputField controlId="NetBanking" label="Net banking"
                                                type="text"
                                                value={birdsaledata.NetBanking}
                                                name="NetBanking"
                                                placeholder="NetBanking"
                                                errormessage="Please enter amount"
                                                required={false}
                                                disabled={false}
                                                onChange={netBankingChange}
                                            />

                                            <InputField controlId="UPI" label="Cash deposite"
                                                type="text"
                                                value={birdsaledata.CashDeposite}
                                                name="CashDeposite"
                                                placeholder="Cash deposite"
                                                errormessage="Please enter amount"
                                                required={false}
                                                disabled={false}
                                                onChange={cashDepositeChange}
                                            />

                                            {/* <InputField controlId="Cheque" label="Cheque"
                                                type="text"
                                                value={birdsaledata.Cheque}
                                                name="Cheque"
                                                placeholder="Cheque"
                                                errormessage="Please enter amount"
                                                required={false}
                                                disabled={false}
                                                onChange={chequeChange}
                                            /> */}
                                        </Row>
                                        <Row>

                                            {/* <InputField controlId="Paid" label="Paid*"
                                                type="text"
                                                value={birdsaledata.Paid}
                                                name="Paid"
                                                placeholder="Paid"
                                                errormessage="Please provide paid amount"
                                                required={true}
                                                disabled={false}
                                                onChange={paidChange}
                                            /> */}
                                            <InputField controlId="Due" label="Due"
                                                type="text"
                                                value={birdsaledata.Due}
                                                name="Due"
                                                placeholder="Due"
                                                errormessage="Please provide due amount"
                                                required={true}
                                                disabled={true}
                                            />

                                            <Form.Group as={Col} controlId="PaymentDate">
                                                <Form.Label style={{ fontSize: 13 }}>Payment date*</Form.Label>
                                                <DateComponent date={null} onChange={paymentDateChange}
                                                    isRequired={false} value={birdsaledata.PaymentDate} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select payment date
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <InputField controlId="VehicleNo" label="Vehicle no"
                                                type="text"
                                                value={birdsaledata.VehicleNo}
                                                name="VehicleNo"
                                                placeholder="Vehicle no"
                                                errormessage="Please enter Vehicle no"
                                                required={false}
                                                disabled={false}
                                                onChange={vehicleNoChange}
                                            />
                                        </Row>
                                        <Row className="mb-12">
                                            <Form.Group controlId="Comments" as={Col} >
                                                <Form.Label style={{ fontSize: 13 }}>Comments</Form.Label>
                                                <Form.Control as="textarea" rows={3} name="Comments"
                                                    onChange={commentsChange} value={birdsaledata.Comments}
                                                    placeholder="Comments" style={{ fontSize: 13 }} />
                                            </Form.Group>
                                        </Row>

                                        <Form.Group as={Col}>
                                            {birdsaledata.Id <= 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }}
                                                    onClick={(e) => handleSubmitAdd(e)}>
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
