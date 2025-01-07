import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import { FecthStockListById, HandleLogout, dateyyyymmdd, downloadExcel, GetCustomerByTypeId } from './../../Utility'
import Loading from '../Loading/Loading'
import { green } from '@material-ui/core/colors';
import { BlobProvider } from '@react-pdf/renderer';

function Medicine(props) {

  let history = useNavigate();


  const [medicineList, setMedicineList] = useState([]);
  const [subMedicineList, setSubMedicineList] = useState([]);
  const [medicineListForFilter, setMedicineListForFilter] = useState([]);
  //const [medicinedata, setMedicineData] = useState([]);
  const [clientlist, setClientList] = useState([]);
  const [unitlist, setUnitList] = useState([]);
  const [validated, setValidated] = useState(false);
  const [count, setCount] = useState(0);
  const obj = useMemo(() => ({ count }), [count]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [addModalShow, setAddModalShow] = useState(false);
  const [stocklist, setStockList] = useState([]);

  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [isloaded, setIsLoaded] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [ucount, setUCount] = useState(0);
  const objupdate = useMemo(() => ({ ucount }), [ucount]);
  const [newcount, setAddNewCount] = useState(0);
  const objAddNew = useMemo(() => ({ newcount }), [newcount]);
  const [advancedata, setAdvanceData] = useState([]);

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

  const initialMedicineSubvalues = {
    Id: '0',
    MedicineId: '',
    MedicineName: '',
    Quantity: '',
    UnitPrice: '',
    GST: '',
    Amount: '',
    ParentId: '0'
  }

  //const [formMedicineFields, setMedicineFields] = useState(initialMedicineSubvalues);

  const [formMedicineFields, setMedicineFields] = useState([
    {
      Id: '0',
      MedicineId: '',
      MedicineName: '',
      Quantity: '',
      UnitPrice: '',
      GST: '',
      Amount: '',
      ParentId: '0'
    }
  ])

  const handleMedicineFieldsChange = (event, index) => {
    let data = [...formMedicineFields];
    data[index][event.target.name] = event.target.value;
    setMedicineFields(data);
  }

  const addFields = (e) => {
    let object = {
      Id: '0',
      MedicineId: '',
      MedicineName: '',
      Quantity: '',
      UnitPrice: '',
      GST: '',
      Amount: '',
      ParentId: '0'
    }
    //props.addFields();
    setMedicineFields([...formMedicineFields, object]);
    addNewCount(newcount);
  }

  const removeFields = (index) => {
    let data = [...formMedicineFields];
    data.splice(index, 1);
    setMedicineFields(data);
    addUCount(ucount);
  }

  const initialvalues = {
    modaltitle: "",
    Id: 0,
    Date: "",
    TotalAmount: "",
    Paid: "",
    Due: "",
    ClientId: "",
    PaymentDate: "",
    ChequeRefNo: "",
    Comments: "",
    InvoiceNo: "",
    InvoiceDate: "",
    MedicineSubList: [initialMedicineSubvalues],
    AdvanceAmount: "",
    IsSettle: ""
  };

  const [meddata, setMedData] = useState(initialvalues);

  const clickAddMedicine = () => {
    setAddModalShow({ addModalShow: true });
    setMedicineFields([initialMedicineSubvalues]);
    setMedData({
      modaltitle: "Add Medicine/Vaccine",
      Id: 0,
      Date: "",
      TotalAmount: "",
      Paid: "",
      Due: "",
      ClientId: "",
      PaymentDate: "",
      ChequeRefNo: "",
      Comments: "",
      InvoiceNo: "",
      InvoiceDate: "",
      MedicineSubList: [initialMedicineSubvalues],
      AdvanceAmount: "",
      IsSettle: false
    })
  }

  const clickEditMedicine = (md) => {
    setAddModalShow({ addModalShow: true });
    setMedicineFields(md.MedicineSubList);
    setMedData({
      modaltitle: "Edit Medicine/Vaccine",
      Id: md.Id,
      Date: md.Date,
      TotalAmount: md.TotalAmount,
      Paid: md.Paid,
      Due: md.Due,
      ClientId: md.ClientId,
      PaymentDate: md.PaymentDate,
      ChequeRefNo: md.ChequeRefNo,
      Comments: md.Comments,
      InvoiceNo: md.InvoiceNo,
      InvoiceDate: md.InvoiceDate,
      MedicineSubList: md.MedicineSubList,
      AdvanceAmount: md.AdvanceAmount,
      IsSettle: md.IsSettles
    })
  }


  const [_totalAmount, _setTotalAmount] = useState(0);
  const [_totalPaid, _setTotalPaid] = useState(0);
  const [_totalDue, _setTotalDue] = useState(0);

  const calculateValues = (data) => {
    const { totalAmount, totalPaid, totalDue }
      = data.reduce((accumulator, item) => {
        accumulator.totalAmount += parseFloat(item.TotalAmount || 0);
        accumulator.totalPaid += parseFloat(item.Paid || 0);
        accumulator.totalDue += parseFloat(item.Due || 0);
        return accumulator;
      }, { totalAmount: 0, totalPaid: 0, totalDue: 0 })

    _setTotalAmount(totalAmount);
    _setTotalPaid(totalPaid);
    _setTotalDue(totalDue);
  }

  const medicineNameChange = (e, index) => {
    let stk = stocklist.filter(x => x.ItemId === parseInt(e.target.value));
    //let qty = meddata.Quantity !== "" ? parseInt(meddata.Quantity) : 0;

    // let total = stk[0].GST > 0 ? ((parseFloat(stk[0].PurchasePrice) * qty) * gstpercentage) : ((parseFloat(stk[0].PurchasePrice) * qty));

    // setMedData({
    //   ...meddata,
    //   Amount: totalinclGST,
    //   Due: totalinclGST - meddata.Paid
    // });

    let data = [...formMedicineFields];
    data[index]["MedicineName"] = stk[0].ItemName;
    data[index]["MedicineId"] = stk[0].ItemId;
    //data[index]["UnitPrice"] = stk[0].PurchasePrice;

    let gstpercentage = parseFloat(data[index]["GST"] || 0) / 100;
    let totalamount = (parseFloat(data[index]["UnitPrice"] || 0) * parseFloat(data[index]["Quantity"] || 0));
    let totalgst = totalamount * gstpercentage;
    let totalinclGST = totalamount + totalgst;


    //data[index]["GST"] = stk[0].GST;
    data[index]["Amount"] = totalinclGST;

    setMedicineFields(data);
  }
  const dateChange = (e) => {
    setMedData({ ...meddata, Date: e.target.value });
    // let data = [...formMedicineFields];
    // data[index]["Date"] = e.target.value;
  }

  const unitPriceChange = (e, index) => {
    const re = /^\d*\.?\d{0,2}$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      let data = [...formMedicineFields];

      data[index]["UnitPrice"] = e.target.value;


      let gstpercentage = parseFloat(data[index]["GST"] || 0) / 100;

      let totalamount = (parseFloat(e.target.value)) * parseFloat(data[index]["Quantity"] || 0);
      let totalgst = totalamount * gstpercentage;
      let totalinclGST = totalamount + totalgst;

      data[index]["Amount"] = totalinclGST;

      setMedicineFields(data);

      addUCount(ucount);
    }
  }


  const gstChange = (e, index) => {
    const re = /^\d*\.?\d{0,2}$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      let data = [...formMedicineFields];

      data[index]["GST"] = e.target.value;


      let gstpercentage = parseFloat(e.target.value || 0) / 100;

      let totalamount = (parseFloat(data[index]["UnitPrice"] || 0))
        * parseInt(data[index]["Quantity"] || 0);

      let totalgst = totalamount * gstpercentage;
      let totalinclGST = totalamount + totalgst;

      data[index]["Amount"] = totalinclGST;

      setMedicineFields(data);

      addUCount(ucount);
    }
  }

  const quantityChange = (e, index) => {
    const re = /^[0-9\b]+$/;
    let data = [...formMedicineFields];

    if (e.target.value === '' || re.test(e.target.value)) {
      // let stk = stocklist.filter(x => x.ItemId === parseInt(formMedicineFields[index].MedicineId));
      //let qty = e.target.value !== "" ? parseInt(e.target.value) : 0;
      let _unitprice = data[index]["UnitPrice"];
      let totalamount = (parseFloat(_unitprice || 0)) * parseInt(e.target.value);

      let gstpercentage = data[index]["GST"] / 100;

      //let totalamount = (parseFloat(stk[0].PurchasePrice) * qty);
      let totalgst = totalamount * gstpercentage;

      let totalinclGST = totalamount + totalgst;

      // setMedData({
      //   ...meddata,
      //   TotalAmount: totalinclGST, GST: stk[0].GST,
      //   Due: totalinclGST - meddata.Paid
      // });

      //let data = [...formMedicineFields];
      data[index]["Quantity"] = e.target.value;
      data[index]["Amount"] = totalinclGST;

      setMedicineFields(data);

      addUCount(ucount);
    }
  }

  const unitChange = (e) => {
    setMedData({ ...meddata, UnitId: e.target.value });
  }

  // const totalAmountChange = (e) => {
  //   setMedData({ ...meddata, TotalAmount: e.target.value, Due: e.target.value - meddata.Paid });
  // }

  const paidChange = (e) => {
    setMedData({ ...meddata, Paid: e.target.value, Due: meddata.TotalAmount - e.target.value });
  }

  const clientChange = (e) => {
    fetchAdvanceListByCustId(e.target.value);
    setMedData({...meddata, ClientId: e.target.value });
  }

  const paymentDateChange = (e) => {
    setMedData({ ...meddata, PaymentDate: e.target.value });
  }
  const chequeRefNoChange = (e) => {
    setMedData({ ...meddata, ChequeRefNo: e.target.value });
  }

  const commentsChange = (e) => {
    setMedData({ ...meddata, Comments: e.target.value });
  }

  const invoiceDateChange = (e) => {
    setMedData({ ...meddata, InvoiceDate: e.target.value });
  }

  const invoiceNoChange = (e) => {
    setMedData({ ...meddata, InvoiceNo: e.target.value });
  }

  const settleAdvancePayment = (e) => {
    if (parseFloat(meddata.TotalAmount || 0) > parseFloat(meddata.AdvanceAmount || 0)) {
      let tobepaid = parseFloat(meddata.TotalAmount || 0) - parseFloat(meddata.AdvanceAmount || 0);
      let dueafterdeduction = tobepaid - parseFloat(meddata.Paid || 0);
      setMedData({
        ...meddata, Due: Math.round(dueafterdeduction).toFixed(2), IsSettle: !meddata.IsSettle
      });
    }
    else if (parseFloat(meddata.TotalAmount || 0) <= parseFloat(meddata.AdvanceAmount || 0)) {

      let tobepaid = parseFloat(meddata.AdvanceAmount || 0) - parseFloat(meddata.TotalAmount || 0);
      let dueafterdeduction = tobepaid - parseFloat(meddata.Paid || 0);

      setMedData({
        ...meddata, Paid: meddata.TotalAmount, Due: 0, IsSettle: !meddata.IsSettle
      });
    }

  }


  useEffect((e) => {

    if (localStorage.getItem('token')) {
      setMedData({
        ...meddata, MedicineSubList: formMedicineFields
      });
    }
    else {
    }
  }, [objAddNew]);

  useEffect((e) => {

    if (localStorage.getItem('token')) {
      fetchMedicineList();
      //getFilterData(filterFromDate, filterToDate);


    }
    else {

      history("/login")
    }
  }, [obj]);

  useEffect((e) => {
    const { totalCost } =
      formMedicineFields.reduce((accumulator, item) => {
        accumulator.totalCost += item.Amount;
        return accumulator;
      }, { totalCost: 0 })


    setMedData({
      ...meddata, Due: parseFloat(Math.round(totalCost - parseFloat(meddata.Paid || 0))).toFixed(2),
      TotalAmount: parseFloat(Math.round(totalCost)).toFixed(2), MedicineSubList: formMedicineFields
    });

  }, [objupdate]);
  // addUCount(ucount);

  useEffect((e) => {

    if (localStorage.getItem('token')) {
      fetchUnit();
      fetchClient();
      fetchStockListById(process.env.REACT_APP_STOCK_CAT_MEDICINE_AND_VACCINE)
    }
    else {

      history("/login")
    }
  }, []);

  const fetchAdvanceListByCustId = async (custid) => {

    fetch(process.env.REACT_APP_API + 'AdvancePayment/GetAdvancePaymentList?CustomerId='+
      custid+'&CompanyId='+localStorage.getItem('companyid') ,
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
          setAdvanceData(data.Result);
          setMedData({
            ...meddata, AdvanceAmount: data.Result[0].Amount, ClientId:custid
          })
        }
        else if (data.StatusCode === 401) {
          HandleLogout();

          history("/login")
        }
        else if (data.StatusCode === 404) {
          props.showAlert("Data not found!!", "danger")
          setIsLoaded(false);
        }
        else {
          props.showAlert("Error occurred!!", "danger")
          setIsLoaded(false);
        }
      });
  }


  // const fetchAdvanceListByCustId = async (custid) => {

  //   fetch(process.env.REACT_APP_API + 'AdvancePayment/GetAdvancePaymentList',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //         'Authorization': localStorage.getItem('token')
  //       },
  //       body: JSON.stringify({
  //         CustomerId: custid,
  //         CompanyId: localStorage.getItem('companyid'),
  //         Date:new Date(),
  //         Id:0,
  //         Amount:0,
  //         PaymentMode:"",
  //         Settlement:false

  //       })
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       if (data.StatusCode === 200) {
  //         setAdvanceData(data.Result);
  //         setMedData({
  //           ...meddata, AdvanceAmount: data.Result[0].Amount, ClientId:custid
  //         })
  //       }
  //       else if (data.StatusCode === 401) {
  //         HandleLogout();

  //         history("/login")
  //       }
  //       else if (data.StatusCode === 404) {
  //         props.showAlert("Data not found!!", "danger")
  //         setIsLoaded(false);
  //       }
  //       else {
  //         props.showAlert("Error occurred!!", "danger")
  //         setIsLoaded(false);
  //       }
  //     });
  // }


  const fetchStockListById = async (catid) => {

    FecthStockListById(catid, process.env.REACT_APP_API)
      .then(data => {
        if (data.StatusCode === 200) {
          setStockList(data.Result);

        }
        else if (data.StatusCode === 401) {
          HandleLogout();
          history("/login")
        }
        else if (data.StatusCode === 404) {
          props.showAlert("Data not found!!", "danger");

        }
        else {
          props.showAlert("Error occurred!!", "danger");

        }
      })
  }

  const fetchMedicineList = async () => {
    setIsLoaded(true);
    fetch(process.env.REACT_APP_API + 'Medicine/GetMedicineListByCompanyId?CompanyId=' + localStorage.getItem('companyid'),
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

          setMedicineList(data.Result);
          setMedicineListForFilter(data.Result);
          setCount(data.Result.length);
          setTotalPages(Math.ceil(data.Result.length / itemsPerPage));
          setIsLoaded(false);

          calculateValues(data.Result);
          //setMedicineFields(data.Result.MedicineSubList)
        }
        else if (data.StatusCode === 401) {
          HandleLogout();

          history("/login")
        }
        else if (data.StatusCode === 404) {
          props.showAlert("Data not found!!", "danger")
          setIsLoaded(false);
        }
        else {
          props.showAlert("Error occurred!!", "danger")
          setIsLoaded(false);
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
          HandleLogout();
          history("/login")
        }
      });
  }

  const fetchClient = async () => {
    GetCustomerByTypeId(process.env.REACT_APP_CUST_TYPE_MEDICINE,
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

      fetch(process.env.REACT_APP_API + 'Medicine/UpdateMedicine', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          Id: meddata.Id,
          Date: meddata.Date,
          TotalAmount: meddata.TotalAmount,
          Paid: meddata.Paid,
          Due: meddata.Due,
          ClientId: meddata.ClientId,
          PaymentDate: meddata.PaymentDate,
          ChequeRefNo: meddata.ChequeRefNo,
          Comments: meddata.Comments,
          InvoiceDate: meddata.InvoiceDate,
          InvoiceNo: meddata.InvoiceNo,
          MedicineSubList: meddata.MedicineSubList,
          CompanyId: localStorage.getItem('companyid'),
          IsSettle:meddata.IsSettle

        })
      }).then(res => res.json())
        .then((result) => {
          if (result.StatusCode === 200) {
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

      fetch(process.env.REACT_APP_API + 'Medicine/AddMedicine', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          Id: meddata.Id,
          TotalAmount: meddata.TotalAmount,
          Paid: meddata.Paid,
          Due: meddata.Due,
          ClientId: meddata.ClientId,
          PaymentDate: meddata.PaymentDate,
          ChequeRefNo: meddata.ChequeRefNo,
          Comments: meddata.Comments,
          InvoiceDate: meddata.InvoiceDate,
          InvoiceNo: meddata.InvoiceNo,
          MedicineSubList: meddata.MedicineSubList,
          Date: meddata.Date,
          CompanyId: localStorage.getItem('companyid'),
          IsSettle:meddata.IsSettle

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



  const deleteMedicine = (id) => {
    if (window.confirm('Are you sure?')) {
      fetch(process.env.REACT_APP_API + 'Medicine/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => res.json())
        .then((data) => {
          if (data.StatusCode === 200) {
            setCount(count);
            props.showAlert("Successfully deleted", "info")
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
        },
          (error) => {
            props.showAlert("Error occurred!!", "danger")
          });

      addCount(count);
    }
  }

  const filterSupplierChange = (e) => {

    if (e.target.value > 0) {
      const _medd = medicineListForFilter.filter((c) => c.ClientId === parseInt(e.target.value));
      setMedicineList(_medd);
      calculateValues(_medd);
    }
    else {
      setMedicineList(medicineListForFilter);
      calculateValues(medicineListForFilter);
    }

    addUCount(ucount);
  }

  const onDateFilterFromChange = (e) => {
    setFilterFromDate(e.target.value);
    getFilterData(e.target.value, filterToDate);
  }

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage)
// }
// const handleNextClick = () => {
//     if (currentPage < totalPages) {
//         setCurrentPage(currentPage + 1)
//     }
// }
// const handlePrevClick = () => {
//     if (currentPage > 1) {
//         setCurrentPage(currentPage - 1)
//     }
// }


  const getFilterData = (fromDate, toDate) => {
    let _filterList = [];
    if (fromDate !== "" && toDate !== "") {
      _filterList = medicineListForFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate) && dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
    }
    else if (fromDate === "" && toDate !== "") {
      _filterList = medicineListForFilter.filter((c) => dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
    }
    else if (fromDate !== "" && toDate === "") {
      _filterList = medicineListForFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate));
    }
    else {
      _filterList = medicineListForFilter;
    }

    // if (shedid > 0) {
    //     _filterList = medicineListForFilter.filter((c) => c.ClientId === parseInt(e.target.value));
    // }
    setMedicineList(_filterList);
    calculateValues(_filterList);
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
  //const itemsPerPage = variables.PAGE_PAGINATION_NO;
  const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
  const endIndex = startIndex + parseInt(itemsPerPage);
  const itemsToDiaplay = medicineList.slice(startIndex, endIndex);
  if (itemsToDiaplay.length === 0 && medicineList.length > 0) {
    setCurrentPage(currentPage - 1);
  }

  const selectPaginationChange = (e) => {
    setItemsPerPage(e.target.value);
    addCount(count);
  }

  const onDownloadExcel = () => {
    const _list = medicineList.map((p) => {
      return ({
        Date: moment(p.Date).format('DD-MMM-YYYY'),
        MedicineName: p.MedicineName,
        Quantity: p.Quantity,
        Rate: p.UnitPrice.toFixed(2),
        TotalAmount: p.TotalAmount.toFixed(2),
        Paid: p.Paid.toFixed(2),
        Due: p.Due.toFixed(2),
        PaymentDate: moment(p.PaymentDate).format('DD-MMM-YYYY'),
        Comments: p.Comments,
        InvoiceDate: p.InvoiceDate,
        InvoiceNo: p.InvoiceNo
      });
    });

    downloadExcel(_list, "MedicineList");
  }


  return (
    <div>
      {isloaded && <Loading />}
      <div className="row justify-content-center" 
      style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
        <h4> Medicine / Vaccine Purchase Tracker</h4>
      </div>

      <div className="container" style={{ marginTop: '30px', marginBottom: '20px' }}>
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

          <div className="col-4" style={{ textAlign: 'right', marginTop: 30 }}>
            <i className="fa-regular fa-file-excel fa-2xl" style={{ color: '#bea2a2', marginRight: 30 }}
              title='Download Egg Sale List' onClick={() => onDownloadExcel()} ></i>

            <Button className="mr-2" variant="primary"
              style={{ marginRight: "17.5px" }}
              onClick={() => clickAddMedicine()}>Add</Button>
          </div><div className="col-2" >
            <select className="form-select" aria-label="Default select example"
              style={{ width: "80px", marginTop: 30 }} onChange={selectPaginationChange}>
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

      {/* <div className="row">
        <div className="col">
          <p><strong>Supplier</strong></p>

        </div>
        <div className="col" style={{ textAlign: 'right' }}>
          <Button className="mr-2 btn-primary btn-primary-custom" variant="primary"
            style={{ marginRight: "17.5px" }}
            onClick={() => clickAddMedicine()}>Add</Button>
        </div>

      </div> */}




      <Table className="mt-4" striped bordered hover size="sm">
        <thead>
          <tr align='center' className="tr-custom">
            <th>Date</th>
            <th>Invoice no</th>
            <th>Invoice date</th>
            <th>Supplier</th>
            <th>Total amount (<span>&#8377;</span>)</th>
            <th>Paid (<span>&#8377;</span>)</th>
            <th>Due (<span>&#8377;</span>)</th>
            <th>Payment date</th>
            <th>Comments</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>

          {
            itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
              //     medicineList && medicineList.length > 0 ? medicineList.map((p) => {
              // const _unit = unitlist.filter((c) => c.ID === p.UnitId);
              // const _uname = _unit.length > 0 ? _unit[0].UnitName : "";
              let stk = stocklist.filter(x => x.ItemId === parseInt(p.MedicineID));
              p.GST = stk.length > 0 ? stk[0].GST : 0;


              const _supp = clientlist.filter((c) => c.ID === p.ClientId);
              const _suppname = _supp.length > 0 ? (_supp[0].MiddleName != "" && _supp[0].MiddleName != null) ?
                _supp[0].FirstName + " " + _supp[0].MiddleName + " " + _supp[0].LastName :
                _supp[0].FirstName + " " + _supp[0].LastName : "";
              p.ClientName = _suppname;

              fetchAdvanceListByCustId(p.ClientId);

              //setMedicineFields(p.MedicineSubList);

              return (
                !isloaded && <tr align='center' style={{ fontSize: '12.5px' }} key={p.Id}>
                  <td >{moment(p.Date).format('DD-MMM-YYYY')}</td>
                  <td>{p.InvoiceNo}</td>
                  <td>{moment(p.InvoiceDate).format('DD-MMM-YYYY')}</td>

                  <td style= {{ overflowWrap:"break-word" }}><a href={`/paymentout/?uid=${p.ClientId}&custtype=${process.env.REACT_APP_CUST_TYPE_MEDICINE}`}>{_suppname}
                    <span className="sr-only">(current)</span></a></td>
                  <td >{p.TotalAmount.toFixed(2)}</td>
                  <td >{parseFloat(p.Paid || 0).toFixed(2)}</td>
                  <td >{parseFloat(p.Due || 0).toFixed(2)}</td>
                  <td >{(p.PaymentDate == '' || p.PaymentDate == null) ? '' : moment(p.PaymentDate).format('DD-MMM-YYYY')}</td>
                  <td >{p.Comments}</td>
                  <td align='center'>
                    {
                      <ButtonToolbar>
                        <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditMedicine(p)}></i>
                        {localStorage.getItem('isadmin') === 'true' &&
                          <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }}
                            onClick={() => deleteMedicine(p.Id)}></i>}


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
          <td align='center'>{parseFloat(_totalAmount).toFixed(2)}</td>
          <td align='center'>{parseFloat(_totalPaid).toFixed(2)}</td>
          <td align='center'>{parseFloat(_totalDue).toFixed(2)}</td>
          <td></td>
          <td></td>
          <td></td>
        </tfoot>
      </Table >


      {
                medicineList && medicineList.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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
          show={addModalShow}
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: '18px' }}>
              {meddata.modaltitle}
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
                        <DateComponent date={null} onChange={invoiceDateChange} isRequired={true} value={meddata.InvoiceDate} />
                        <Form.Control.Feedback type="invalid">
                          Please select invoice date
                        </Form.Control.Feedback>
                      </Form.Group>

                      <InputField controlId="InvoiceNo" label="Invoice No"
                        type="text"
                        value={meddata.InvoiceNo}
                        name="InvoiceNo"
                        placeholder="Invoice no"
                        errormessage="Please enter Invoice No"
                        required={true}
                        disabled={false}
                        onChange={invoiceNoChange}
                      />
                    </Row>
                    <Row className="mb-12">

                      <Form.Group as={Col} controlId="Date">
                        <Form.Label style={{ fontSize: 13 }}>Date</Form.Label>
                        <DateComponent date={null} onChange={dateChange} isRequired={true} value={meddata.Date} />
                        <Form.Control.Feedback type="invalid">
                          Please select date
                        </Form.Control.Feedback>

                      </Form.Group>
                      <Form.Group controlId="ClientId" as={Col} >
                        <Form.Label style={{ fontSize: 13 }}>Supplier</Form.Label>
                        <Form.Select style={{ fontSize: 13 }}
                          onChange={clientChange} required>
                          <option selected disabled value="">Choose...</option>
                          {

                            clientlist.map((item) => {

                              let fullname = (item.MiddleName != "" && item.MiddleName != null) ?
                                item.FirstName + " " + item.MiddleName + " " + item.LastName :
                                item.FirstName + " " + item.LastName;
                              return (
                                <option value={item.ID} key={item.ID}
                                  selected={item.ID === meddata.ClientId}>{fullname}</option>)
                            })


                          }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Please select supplier
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Row>
                      <div className="row">
                        <form>
                          <Row className="mb-12" style={{ fontSize: '12px', marginTop: '10px' }}>
                            <div class="col-3"><p class="form-label">Medicine Name</p></div>
                            <div class="col"><p class="form-label">Quantity</p></div>
                            <div class="col"><p class="form-label">Unit Price</p></div>
                            <div class="col"><p class="form-label">GST</p></div>
                            <div class="col-2"><p class="form-label">Amount</p></div>
                            <div class="col"><p class="form-label" ing>Delete</p></div>
                            <hr className="line" />
                          </Row>

                          {/* <button onClick={addFields} style={{ width: 37, marginLeft: 10, marginTop: 10 }}>+</button> */}
                          {meddata.MedicineSubList.map((form, index) => {
                            return (
                              <div key={index} style={{ marginTop: 10 }}>
                                <Row className="mb-12">
                                  <Form.Group controlId="MedicineName" as={Col} className="col-3">
                                    {/* <Form.Label style={{ fontSize: 13 }}>Medicine name</Form.Label> */}
                                    <Form.Select style={{ fontSize: 13 }}
                                      onChange={event => medicineNameChange(event, index)} required>
                                      <option selected disabled value="">Choose Medicine</option>
                                      {
                                        stocklist.map((item) => {
                                          return (
                                            <option
                                              key={item.ItemId}
                                              defaultValue={item.ItemId == null ? null : item.ItemId}
                                              selected={item.ItemId === form.MedicineId}
                                              value={item.ItemId}
                                            >{item.ItemName}</option>
                                          );
                                        })
                                      }
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                      Please select medicine name
                                    </Form.Control.Feedback>
                                  </Form.Group>

                                  <InputField controlId="Quantity" label=""
                                    type="text"
                                    value={form.Quantity}
                                    name="Quantity"
                                    placeholder="Quantity"
                                    errormessage="Please enter quantity"
                                    required={true}
                                    disabled={false}
                                    onChange={event => quantityChange(event, index)}
                                  />

                                  <InputField controlId="UnitPrice" label=""
                                    type="text"
                                    value={form.UnitPrice}
                                    name="UnitPrice"
                                    placeholder="Unit price"
                                    errormessage="Please enter UnitPrice"
                                    required={true}
                                    disabled={false}
                                    onChange={event => unitPriceChange(event, index)}
                                  />

                                  <InputField controlId="GST" label=""
                                    type="text"
                                    value={form.GST}
                                    name="GST"
                                    placeholder="GST"
                                    errormessage="Please enter GST"
                                    required={false}
                                    disabled={false}
                                    onChange={event => gstChange(event, index)}
                                  //
                                  />

                                  <InputField controlId="Amount" label=""
                                    type="number"
                                    value={parseFloat(Math.round(form.Amount)).toFixed(2)}
                                    name="Amount"
                                    placeholder="Amount"
                                    errormessage="Enter amount"
                                    required={true}
                                    disabled={true}
                                    collength="col-2"
                                  />

                                  <div className="col">
                                    <i className="fa-solid fa-trash" style={{
                                      color: '#f81616',
                                      marginLeft: '15px'
                                    }}
                                      onClick={() => removeFields(index)}></i>
                                    {/* <button style={{ width: 37, marginLeft: 10 }} 
                onClick={() => removeFields(index)}>-</button> */}
                                  </div>
                                </Row>
                              </div>
                            )
                          })}
                        </form>
                      </div>
                      <i class="fa-solid fa-circle-plus" style={{ marginTop: '5px', width: '25px' }}
                        onClick={(e) => addFields(e)}></i>
                      {/* <i class="fa-solid fa-circle-plus" ></i> */}
                      <hr className="line" style={{ marginTop: '20px' }} />
                    </Row>

                    <Row className="mb-12">
                      <div className="col-8">
                        <p class="form-label">Total :</p>
                      </div>
                      <div className="col-4" style={{ textAlign: 'left' }}>
                        <p class="form-label"><span>&#8377;</span> {parseFloat(meddata.TotalAmount || 0).toFixed(2)}</p>
                      </div>
                      <hr className="line" style={{ marginTop: '10px' }} />
                    </Row>

                    {

                      parseFloat(meddata.AdvanceAmount || 0) > 0 ?
                        <Row className="mb-12">
                          <div className="col-6">
                            <p class="form-label" style={{color:'green'}}>Advance payment done Rs: {parseFloat(meddata.AdvanceAmount|| 0).toFixed(2)}</p>
                          </div>
                          <div className="col-6">
                            <Form.Check
                              type="checkbox"
                              id="chkIsActive"
                              label="Settle advance amount"
                              onChange={settleAdvancePayment}
                              value={meddata.IsSettle}
                              checked={meddata.IsSettle}
                              style={{ fontSize: '13px', fontWeight:'bold'}}
                            />
                          </div>
                          <hr className="line" style={{ marginTop: '10px' }} />
                        </Row> : ""
                    }
                    <Row className="mb-12">

                      <InputField controlId="Paid" label="Paid"
                        type="number"
                        value={meddata.Paid}
                        name="Paid"
                        placeholder="Paid"
                        errormessage="Please enter paid amount"
                        required={false}
                        disabled={false}
                        onChange={paidChange}
                      />

                      <InputField controlId="Due" label="Due"
                        type="number"
                        value={parseFloat(meddata.Due || 0).toFixed(2)}
                        name="Due"
                        placeholder="Due"
                        errormessage="Please enter due amount"
                        required={false}
                        disabled={true}
                      />

                      <Form.Group as={Col} controlId="PaymentDate">
                        <Form.Label style={{ fontSize: 13 }}>Payment date</Form.Label>
                        <DateComponent date={null} onChange={paymentDateChange}
                          isRequired={false} value={meddata.PaymentDate} />
                        <Form.Control.Feedback type="invalid">
                          Please select payment date
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>

                    <Row className="mb-12">

                      <InputField controlId="ChequeRefNo" label="Cheque Ref No"
                        type="text"
                        value={meddata.ChequeRefNo}
                        name="ChequeRefNo"
                        placeholder="Cheque Ref No"
                        errormessage="Enter Cheque Ref No"
                        required={false}
                        disabled={false}
                        onChange={chequeRefNoChange}
                      />
                      {/* <Form.Group controlId="ChequeRefNo" as={Col} >
                        <Form.Label style={{ fontSize: 13 }}>Cheque Ref No</Form.Label>
                        <Form.Control as="textarea" rows={3} style={{ fontSize: 13 }} 
                        name="ChequeRefNo" onChange={chequeRefNoChange} value={meddata.ChequeRefNo}
                          placeholder="Cheque Ref No" />
                      </Form.Group> */}
                    </Row>
                    <Row className="mb-12">
                      <Form.Group controlId="Comments" as={Col} >
                        <Form.Label style={{ fontSize: 13 }}>Comments</Form.Label>
                        <Form.Control as="textarea" rows={3} style={{ fontSize: 13 }} name="Comments" onChange={commentsChange} value={meddata.Comments}
                          placeholder="Comments" />
                      </Form.Group>
                    </Row>

                    <Form.Group as={Col}>
                      {meddata.Id <= 0 ?

                        <Button variant="primary" className="btn-primary-custom" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                          Add
                        </Button>
                        : null
                      }

                      {meddata.Id > 0 ?

                        <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitEdit(e)}>
                          Update
                        </Button>
                        : null
                      }

                      <Button variant="danger" className="btn-danger-custom" style={{ marginTop: "30px", marginLeft: "10px" }} onClick={() => {
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

export default Medicine
