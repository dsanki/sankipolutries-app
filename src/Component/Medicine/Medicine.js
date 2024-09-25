import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import { FecthStockListById, HandleLogout, dateyyyymmdd, downloadExcel } from './../../Utility'
import Loading from '../Loading/Loading'

function Medicine(props) {

  let history = useNavigate();


  const [medicineList, setMedicineList] = useState([]);
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

  let addModalClose = () => {
    setAddModalShow(false);
    setValidated(false);
  };

  const initialvalues = {
    modaltitle: "",
    Id: 0,
    MedicineID: "",
    MedicineName: "",
    Quantity: "",
    UnitPrice: "",
    Date: "",
    UnitId: "",
    TotalAmount: "",
    Paid: "",
    Due: "",
    ClientId: "",
    PaymentDate: "",
    ChequeRefNo: "",
    Comments: "",
    GST: "",
    InvoiceNo:"",
    InvoiceDate:""

  };

  const [meddata, setMedData] = useState(initialvalues);

  const clickAddMedicine = () => {
    setAddModalShow({ addModalShow: true });
    setMedData({
      modaltitle: "Add Medicine",
      Id: 0,
      MedicineID: "",
      MedicineName: "",
      Quantity: "",
      UnitPrice: "",
      Date: "",
      UnitId: "",
      TotalAmount: "",
      Paid: "",
      Due: "",
      ClientId: "",
      PaymentDate: "",
      ChequeRefNo: "",
      Comments: "",
      GST: "",
      InvoiceNo:"",
      InvoiceDate:""
    })
  }

  const clickEditMedicine = (md) => {
    setAddModalShow({ addModalShow: true });
    setMedData({
      modaltitle: "Edit Medicine",
      Id: md.Id,
      MedicineID: md.MedicineID,
      MedicineName: md.MedicineName,
      Quantity: md.Quantity,
      UnitPrice: md.UnitPrice,
      Date: md.Date,
      UnitId: md.UnitId,
      TotalAmount: md.TotalAmount,
      Paid: md.Paid,
      Due: md.Due,
      ClientId: md.ClientId,
      PaymentDate: md.PaymentDate,
      ChequeRefNo: md.ChequeRefNo,
      Comments: md.Comments,
      GST: md.GST,
      InvoiceNo:md.InvoiceNo,
      InvoiceDate:md.InvoiceDate
    })
  }

  const medicineNameChange = (e) => {
    let stk = stocklist.filter(x => x.ItemId === parseInt(e.target.value));
    let qty =meddata.Quantity !== "" ? parseInt(meddata.Quantity) : 0;
    let gstpercentage = stk[0].GST / 100;
    let totalamount=(parseFloat(stk[0].PurchasePrice) * qty);
    let totalgst=totalamount*gstpercentage;
   // let total = stk[0].GST > 0 ? ((parseFloat(stk[0].PurchasePrice) * qty) * gstpercentage) : ((parseFloat(stk[0].PurchasePrice) * qty));
   let totalinclGST = totalamount+totalgst;
    setMedData({
      ...meddata, MedicineName: stk[0].ItemName,
      MedicineID: stk[0].ItemId,
      UnitPrice: stk[0].PurchasePrice,
      GST: stk[0].GST,
      TotalAmount: totalinclGST,
      Due:totalinclGST-meddata.Paid
    });
  }
  const dateChange = (e) => {
    setMedData({ ...meddata, Date: e.target.value });
  }

  const quantityChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      let stk = stocklist.filter(x => x.ItemId === parseInt(meddata.MedicineID));
      let qty = e.target.value !== "" ? parseInt(e.target.value) : 0;
      let gstpercentage = stk[0].GST / 100;

      let totalamount=(parseFloat(stk[0].PurchasePrice) * qty);
      let totalgst=totalamount*gstpercentage;

      let totalinclGST = totalamount+totalgst;

      setMedData({
        ...meddata,
        Quantity: e.target.value,
        TotalAmount: totalinclGST, GST: stk[0].GST,
        Due:totalinclGST-meddata.Paid
      });
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
    setMedData({ ...meddata, ClientId: e.target.value });
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

    if (localStorage.getItem('token')) {
      fetchUnit();
      fetchClient();
      fetchStockListById(variables.STOCK_CAT_MEDICINE)
    }
    else {

      history("/login")
    }
  }, []);




  const fetchStockListById = async (catid) => {
    
    FecthStockListById(catid)
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
    fetch(variables.REACT_APP_API + 'Medicine/GetMedicine',
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
          setIsLoaded(false);
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
          setCount(data.Result.length);
          setTotalPages(Math.ceil(data.Result.length / itemsPerPage));
        }
        else if (data.StatusCode === 401) {
          HandleLogout();
          history("/login")
        }
      });
  }

  const fetchClient = async () => {
    fetch(variables.REACT_APP_API + 'client',
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
          setClientList(data.Result);
        }
        else if (data.StatusCode === 401) {
          HandleLogout();
          history("/login")
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

      fetch(variables.REACT_APP_API + 'Medicine/UpdateMedicine', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          Id: meddata.Id,
          MedicineID: meddata.MedicineID,
          MedicineName: meddata.MedicineName,
          Date: meddata.Date,
          Quantity: meddata.Quantity,
          UnitPrice: meddata.UnitPrice,
          UnitId: meddata.UnitId,
          TotalAmount: meddata.TotalAmount,
          Paid: meddata.Paid,
          Due: meddata.Due,
          ClientId: meddata.ClientId,
          PaymentDate: meddata.PaymentDate,
          ChequeRefNo: meddata.ChequeRefNo,
          Comments: meddata.Comments,
          InvoiceDate:meddata.InvoiceDate,
          InvoiceNo:meddata.InvoiceNo

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

      fetch(variables.REACT_APP_API + 'Medicine/AddMedicine', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          Id: meddata.Id,
          MedicineID: meddata.MedicineID,
          MedicineName: meddata.MedicineName,
          Date: meddata.Date,
          Quantity: meddata.Quantity,
          UnitPrice: meddata.UnitPrice,
          UnitId: meddata.UnitId,
          TotalAmount: meddata.TotalAmount,
          Paid: meddata.Paid,
          Due: meddata.Due,
          ClientId: meddata.ClientId,
          PaymentDate: meddata.PaymentDate,
          ChequeRefNo: meddata.ChequeRefNo,
          Comments: meddata.Comments,
          InvoiceDate:meddata.InvoiceDate,
          InvoiceNo:meddata.InvoiceNo

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

  const deleteMedicine = () => {

  }

  // const filterSupplierChange = (e) => {

  //   if (e.target.value > 0) {
  //     const _medd = medicineListForFilter.filter((c) => c.ClientId === parseInt(e.target.value));
  //     setMedicineList(_medd);
  //   }
  //   else {
  //     setMedicineList(medicineListForFilter);
  //   }


  // }

  const onDateFilterFromChange = (e) => {
    setFilterFromDate(e.target.value);
    getFilterData(e.target.value, filterToDate);
  }


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
          MedicineName:p.MedicineName,
          Quantity: p.Quantity, 
          Rate: p.UnitPrice.toFixed(2), 
          TotalAmount: p.TotalAmount.toFixed(2), 
          Paid: p.Paid.toFixed(2), 
          Due: p.Due.toFixed(2), 
          PaymentDate: moment(p.PaymentDate).format('DD-MMM-YYYY'),
          Comments: p.Comments,
          InvoiceDate:p.InvoiceDate,
          InvoiceNo:p.InvoiceNo
      });
  });

  downloadExcel(_list, "MedicineList");
}


  return (
    <div>
  {isloaded && <Loading />}
      <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
        <h2> Medicine Tracker</h2>
      </div>

      <div className="container" style={{ marginTop: '30px', marginBottom: '20px' }}>
        <div className="row align-items-center">
          <div className="col">
            <p><strong>From</strong></p>
            <DateComponent date={null} onChange={onDateFilterFromChange} isRequired={false} value={filterFromDate} />
          </div>
          <div className="col">
            <p><strong>To</strong></p>
            <DateComponent date={null} onChange={onDateFilterToChange} isRequired={false} value={filterToDate} />
          </div>
          {/* <div className="col">
                    <p><strong>Supplier</strong></p>
                        
                        <Form.Select aria-label="Default select example"
                            onChange={filterSupplierChange}>
                            <option selected value="">Choose...</option>
                            {
                               clientlist.filter((c) => c.ClientType === 2 || c.ClientType === 3).map((item) => {
                                    return (
                                        <option
                                            key={item.Id}
                                            defaultValue={item.Id == null ? null : item.Id}
                                            value={item.Id}
                                        >{item.ClientName}</option>
                                    );
                                })
                            }
                        </Form.Select>
                    </div> */}
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


      <div class="row">
                <div class="col-md-9">  <i className="fa-regular fa-file-excel fa-2xl" style={{ color: '#bea2a2' }} title='Download Egg Sale List' onClick={() => onDownloadExcel()} ></i></div>
                <div class="col-md-3"> <div class="row"><div class="col-md-6" style={{ textAlign: 'right' }}> <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => clickAddMedicine()}>Add</Button></div>

                    <div class="col-md-6">
                        <select className="form-select" aria-label="Default select example" style={{ width: "80px" }} onChange={selectPaginationChange}>
                            <option selected value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                        </select></div></div></div>
            </div>

      <Table className="mt-4" striped bordered hover size="sm">
        <thead>
          <tr align='left' className="tr-custom">
            <th>Date</th>
            <th>Supplier</th>
            <th>Medicine name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total amount</th>
            <th>Paid</th>
            <th>Due</th>
            <th>Payment date</th>
            <th>Cheque ref</th>
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
              p.GST=stk.length>0?stk[0].GST:0;
              const _supp = clientlist.filter((c) => c.Id === p.ClientId);
              const _suppname = _supp.length > 0 ? _supp[0].ClientName : "";

              return (
                !isloaded && <tr align='center' key={p.Id}>
                  <td align='left'>{moment(p.Date).format('DD-MMM-YYYY')}</td>
                  <td align='left'>{_suppname}</td>
                  <td align='left'>{p.MedicineName}</td>
                  <td align='left'>{p.Quantity}</td>
                  <td align='left'>{p.UnitPrice}</td>
                  <td align='left'>{p.TotalAmount.toFixed(2)}</td>
                  <td align='left'>{p.Paid.toFixed(2)}</td>
                  <td align='left'>{p.Due.toFixed(2)}</td>
                  <td align='left'>{moment(p.PaymentDate).format('DD-MMM-YYYY')}</td>
                  <td align='left'>{p.ChequeRefNo}</td>
                  <td align='left'>{p.Comments}</td>
                  <td align='center'>
                    {
                      <ButtonToolbar>
                        <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditMedicine(p)}></i>
                        {localStorage.getItem('isadmin') === 'true' &&
                          <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteMedicine(p.Id)}></i>}
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
                          <Form.Label>Invoice Date</Form.Label>
                          <DateComponent date={null} onChange={invoiceDateChange} isRequired={true} value={meddata.InvoiceDate} />
                          <Form.Control.Feedback type="invalid">
                            Please select invoice date
                          </Form.Control.Feedback>
                        </Form.Group>

                        <InputField controlId="UnitPrice" label="Invoice No"
                          type="text"
                          value={meddata.InvoiceNo}
                          name="InvoiceNo"
                          placeholder="Invoice No"
                          errormessage="Please enter Invoice No"
                          required={true}
                          disabled={false}
                      />
                    </Row>
                    <Row className="mb-12">

                      <Form.Group as={Col} controlId="Date">
                        <Form.Label>Date</Form.Label>
                        <DateComponent date={null} onChange={dateChange} isRequired={true} value={meddata.Date} />
                        <Form.Control.Feedback type="invalid">
                          Please select date
                        </Form.Control.Feedback>
                      
                      </Form.Group>
                      <Form.Group controlId="ClientId" as={Col} >
                        <Form.Label>Supplier</Form.Label>
                        <Form.Select aria-label="Default select example"
                          onChange={clientChange} required>
                          <option selected disabled value="">Choose...</option>
                          {
                            clientlist.filter((c) => c.ClientType === 2 || c.ClientType === 3).map((item) => {
                              return (
                                <option
                                  key={item.Id}
                                  defaultValue={item.Id == null ? null : item.Id}
                                  selected={item.Id === meddata.ClientId}
                                  value={item.Id}
                                >{item.ClientName}</option>
                              );
                            })
                          }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Please select supplier
                        </Form.Control.Feedback>
                      </Form.Group>
                      {/* <InputField controlId="MedicineName" label="Medicine name"
                        type="text"
                        value={meddata.MedicineName}
                        name="MedicineName"
                        placeholder="Medicine name"
                        errormessage="Please enter medicine name"
                        onChange={medicineNameChange}
                        required={true}
                        disabled={false}
                      /> */}

                      <Form.Group controlId="MedicineName" as={Col} >
                        <Form.Label>Medicine name</Form.Label>
                        <Form.Select aria-label="Default select example"
                          onChange={medicineNameChange} required>
                          <option selected disabled value="">Choose...</option>
                          {
                            stocklist.map((item) => {
                              return (
                                <option
                                  key={item.ItemId}
                                  defaultValue={item.ItemId == null ? null : item.ItemId}
                                  selected={item.ItemId === meddata.MedicineID}
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


                      {/* <Form.Group controlId="MedicineName" as={Col} >
                        <Form.Label>Medicine name</Form.Label>
                        <Form.Control type="text" name="MedicineName" required value={meddata.MedicineName}
                          placeholder="Medicine name" onChange={medicineNameChange} />
                        <Form.Control.Feedback type="invalid">
                          Please enter medicine name
                        </Form.Control.Feedback>
                      </Form.Group> */}

                    </Row>


                    <Row className="mb-12">
                      <InputField controlId="UnitPrice" label="Unit Price"
                        type="text"
                        value={meddata.UnitPrice}
                        name="UnitPrice"
                        placeholder="UnitPrice"
                        errormessage="Please enter UnitPrice"
                        required={true}
                        disabled={true}
                      />
                      <InputField controlId="Quantity" label="Quantity"
                        type="text"
                        value={meddata.Quantity}
                        name="Quantity"
                        placeholder="Quantity"
                        errormessage="Please enter quantity"
                        required={true}
                        disabled={false}
                        onChange={quantityChange}
                      />

                      <InputField controlId="GST" label="GST %"
                        type="text"
                        value={meddata.GST}
                        name="GST"
                        placeholder="GST"
                        errormessage="Please enter GST"
                        required={true}
                        disabled={true}
                      />

                      {/* <Form.Group controlId="Quantity" as={Col} >
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="text" name="Quantity" onChange={quantityChange}
                          placeholder="Quantity" value={meddata.Quantity} />
                        <Form.Control.Feedback type="invalid">
                          Please enter quantity
                        </Form.Control.Feedback>
                      </Form.Group> */}




                      {/* <Form.Group controlId="UnitId" as={Col} >
                        <Form.Label>Unit</Form.Label>
                        <Form.Select aria-label="Default select example"
                          onChange={unitChange} required>
                          <option selected disabled value="">Choose...</option>
                          {
                            unitlist.map((item) => {
                              return (
                                <option
                                  key={item.ID}
                                  defaultValue={item.ID == null ? null : item.ID}
                                  selected={item.ID === meddata.UnitId}
                                  value={item.ID}
                                >{item.UnitName}</option>
                              );
                            })
                          }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Please select customer type
                        </Form.Control.Feedback>
                      </Form.Group> */}

                      <InputField controlId="TotalAmount" label="Total amount"
                        type="number"
                        value={meddata.TotalAmount}
                        name="TotalAmount"
                        placeholder="Total amount"
                        errormessage="Please enter total amount"
                        required={true}
                        disabled={true}
                      />


                      {/* <Form.Group controlId="TotalAmount" as={Col} >
                        <Form.Label>Total amount</Form.Label>
                        <Form.Control type="text" name="TotalAmount" required onChange={totalAmountChange}
                          placeholder="Total amount" value={meddata.TotalAmount} />
                        <Form.Control.Feedback type="invalid">
                          Please enter total amount
                        </Form.Control.Feedback>
                      </Form.Group> */}
                    </Row>
                    <Row className="mb-12">

                      <InputField controlId="Paid" label="Paid"
                        type="number"
                        value={meddata.Paid}
                        name="Paid"
                        placeholder="Paid"
                        errormessage="Please enter paid amount"
                        required={true}
                        disabled={false}
                        onChange={paidChange}
                      />
                      {/* <Form.Group controlId="Paid" as={Col} >
                        <Form.Label>Paid</Form.Label>
                        <Form.Control type="text" name="Email" required onChange={paidChange} value={meddata.Paid}
                          placeholder="Paid" />
                        <Form.Control.Feedback type="invalid">
                          Please paid amount
                        </Form.Control.Feedback>
                      </Form.Group> */}
                      <InputField controlId="Due" label="Due"
                        type="number"
                        value={meddata.Due}
                        name="Due"
                        placeholder="Due"
                        errormessage="Please enter due amount"
                        required={true}
                        disabled={true}
                      />
                      {/* <Form.Group controlId="Due" as={Col} >
                        <Form.Label>Due</Form.Label>
                        <Form.Control type="text" name="Due" disabled value={meddata.Due}
                          placeholder="Due" />

                      </Form.Group> */}
                      <Form.Group as={Col} controlId="PaymentDate">
                        <Form.Label>Payment date</Form.Label>
                        <DateComponent date={null} onChange={paymentDateChange} isRequired={true} value={meddata.PaymentDate} />
                        <Form.Control.Feedback type="invalid">
                          Please select payment date
                        </Form.Control.Feedback>
                        {/* <Form.Control
                          type="date"
                          value={meddata.PaymentDate ? dateForPicker(meddata.PaymentDate) : ''}
                          onChange={paymentDateChange}
                        /> */}
                      </Form.Group>
                    </Row>

                    <Row className="mb-12">
                      <Form.Group controlId="ChequeRefNo" as={Col} >
                        <Form.Label>Cheque Ref No</Form.Label>
                        <Form.Control as="textarea" rows={3} name="ChequeRefNo" onChange={chequeRefNoChange} value={meddata.ChequeRefNo}
                          placeholder="Cheque Ref No" />
                      </Form.Group>
                    </Row>
                    <Row className="mb-12">
                      <Form.Group controlId="Comments" as={Col} >
                        <Form.Label>Comments</Form.Label>
                        <Form.Control as="textarea" rows={3} name="Comments" onChange={commentsChange} value={meddata.Comments}
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
