import React, { Component, useState, useEffect, useMemo } from 'react'
import { Button, ButtonToolbar, Table, Form, Row, Col, Modal } from 'react-bootstrap';
import Moment from 'moment';
import { useNavigate } from 'react-router-dom'
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'
import { HandleLogout, FetchUnit, FetchCompanyDetails, FetchFeed, GetCustomerByTypeId } from '../../Utility'


function ChicksFeed(props) {

  let history = useNavigate();
  const [feedList, setFeedList] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [advancedata, setAdvanceData] = useState([]);
  const [customerlist, setCustomerList] = useState([]);
  const [unitlist, setUnitList] = useState([]);
  const [companydetails, setCompanyDetails] = useState([]);
  const [count, setCount] = useState(0);
  const [ucount, setUCount] = useState(0);
  const objupdate = useMemo(() => ({ ucount }), [ucount]);
  const obj = useMemo(() => ({ count }), [count]);

  const [issettle, setIsSettle] = useState(false);
  const [advancedataticked, setAdvanceDataTicked] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [clientlist, setClientList] = useState([]);

  let addModalClose = () => {
    setAddModalShow(false);
    setValidated(false);
  };

  let addCount = (num) => {
    setCount(num + 1);
  };

  const initialvalues = {
    modaltitle: "",
    Id: 0,
    Date: "",
    InvoiceNo: "",
    InvoiceDate: "",
    ItemName: "",
    UnitId: "",
    Quantity: "",
    Rate: "",
    TotalAmount: "",
    Discount: "",
    FinalCost: "",
    Paid: "",
    Due: "",
    PaymentDate: "",
    CustomerId: "",
    CompanyId: "",
    Comments: "",
    SettleAmount: "",
    VehicleNo: ""
  };

  const [feeddata, setFeedData] = useState(initialvalues);

  const clickAddFeed = () => {
    setAddModalShow({ addModalShow: true });
    setAdvanceData({Amount:0})

    //const [advancedata, setAdvanceData] = useState([]);
    setFeedData({
      modaltitle: "Add new Feed",
      Id: 0,
      Date: "",
      InvoiceNo: "",
      InvoiceDate: "",
      ItemName: "",
      UnitId: "",
      Quantity: "",
      Rate: "",
      TotalAmount: "",
      Discount: "",
      FinalCost: "",
      Paid: "",
      Due: "",
      PaymentDate: "",
      CustomerId: "",
      CompanyId: "",
      Comments: "",
      SettleAmount: "",
      VehicleNo: ""
    })
  }

  const clickEditFeed = (feed) => {
    setAddModalShow({ addModalShow: true });
    setFeedData({
      modaltitle: "Edit Lot",
      Id: feed.Id,
      Date: feed.Date,
      InvoiceNo: feed.InvoiceNo,
      InvoiceDate: feed.InvoiceDate,
      ItemName: feed.ItemName,
      UnitId: feed.UnitId,
      Quantity: feed.Quantity,
      Rate: feed.Rate,
      TotalAmount: feed.TotalAmount,
      Discount: feed.Discount,
      FinalCost: feed.FinalCost,
      Paid: feed.Paid,
      Due: feed.Due,
      PaymentDate: feed.PaymentDate,
      CustomerId: feed.CustomerId,
      CompanyId: feed.CompanyId,
      Comments: feed.Comments,
      SettleAmount: feed.SettleAmount,
      VehicleNo: feed.VehicleNo
    })
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

  useEffect((e) => {

    if (localStorage.getItem('token')) {
      fetchUnit();
      fetchClient();
      fetchCompanyDetails();
    }
    else {
      HandleLogout();
      history("/login")
    }
  }, []);

   useEffect((e) => {
  
          if (localStorage.getItem('token')) {
            fetchFeed();
              fetchCustomer();
              fetchAdvanceListByCustId(parseInt(feeddata.CustomerId || 0));
          }
          else {
              HandleLogout();
              history("/login")
          }
      }, [obj]);

  const customerChange = (e) => {
    setFeedData({ ...feeddata, CustomerId: e.target.value });
    addCount(count);

  }

  const quantityChange = (e) => {
    let _quantity = e.target.value;
    let _totalamt = parseFloat(_quantity || 0) * parseFloat(feeddata.Rate || 0);
    let _finalAmt = _totalamt - parseFloat(feeddata.Discount || 0);

    setFeedData({
      ...feeddata, Quantity: _quantity,
      TotalAmount: _totalamt,
      FinalCost: _finalAmt,
      Due: _finalAmt - parseFloat(feeddata.Paid || 0)
    });
  }

  const dateChange = (e) => {
    setFeedData({ ...feeddata, Date: e.target.value });
  }

  const itemNameChange = (e) => {
    setFeedData({ ...feeddata, ItemName: e.target.value });
  }

  const unitIdChange = (e) => {
    setFeedData({ ...feeddata, UnitId: e.target.value });
  }

  const vehicleNoChange = (e) => {
    setFeedData({ ...feeddata, VehicleNo: e.target.value });
  }

  



  const commentsChange = (e) => {
    setFeedData({
      ...feeddata, Comments: e.target.value
    });
  }

  const paidChange = (e) => {
    setFeedData({
      ...feeddata, Paid: e.target.value,
      Due: feeddata.FinalCost - e.target.value
    });
  }

  const discountChange = (e) => {
    let _finalcost = (parseFloat(feeddata.TotalAmount || 0) - parseFloat(e.target.value || 0));
    setFeedData({
      ...feeddata, Discount: e.target.value,
      FinalCost: _finalcost,
      Due: _finalcost - parseFloat(feeddata.Paid || 0)
    });
  }


  const rateChange = (e) => {

    let totalamount = parseFloat(feeddata.Quantity || 0) * parseFloat(e.target.value || 0);
    let _finalCost = totalamount - parseFloat(feeddata.Discount || 0)
    setFeedData({
      ...feeddata, Rate: e.target.value,
      TotalAmount: totalamount, FinalCost: _finalCost,
      Due: Math.round(_finalCost -
        parseFloat(feeddata.Paid || 0)).toFixed(2)

    });
  }

  const isSettleChange = (e) => {
    if (!issettle) {
      let advance = advancedataticked.Amount,
        finalAmt = feeddata.FinalCost;
      //Need to add one more payment mode Adjustment
      if (advance > finalAmt) {

        let _paid = parseFloat(finalAmt || 0);

        let _due = parseFloat(finalAmt || 0) - _paid;

        setFeedData({
          ...feeddata, Paid: _paid, Due: _due, SettleAmount: finalAmt
        });


        setAdvanceDataTicked({ ...advancedataticked, Amount: advance - finalAmt })
      }
      else {

        if (advance <= finalAmt) {

          let _paid = parseFloat(advance || 0);

          let _due = (parseFloat(finalAmt || 0)) - _paid;

          setFeedData({
            ...feeddata, Paid: _paid, Due: _due, SettleAmount: advance
          });

          setAdvanceDataTicked({ ...advancedataticked, Amount: 0 })
        }
      }
    }
    else {

      let _paid = parseFloat(feeddata.Paid || 0);

      let _due = feeddata.FinalCost - _paid;
      setFeedData({
        ...feeddata, Paid: _paid, Due: _due, SettleAmount: 0
      });

      let da = parseFloat(advancedata.Amount || 0);
      setAdvanceDataTicked({ ...advancedataticked, Amount: da })
    }

    setIsSettle(!issettle);
  }

  const paymentDateChange = (e) => {
    setFeedData({ ...feeddata, PaymentDate: e.target.value });
  }

  const fetchClient = async () => {
    GetCustomerByTypeId(process.env.REACT_APP_CUST_TYPE_FEED,
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

  const fetchCustomer = async () => {
    fetch(process.env.REACT_APP_API + 'Customer/GetCustomer',
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
          var filterList = data.Result;
          filterList = data.Result.filter((c) => c.CustomerTypeId
            == process.env.REACT_APP_CUST_TYPE_FEED);

          setCustomerList(filterList);
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

  const fetchAdvanceListByCustId = async (custid) => {

    fetch(process.env.REACT_APP_API + 'AdvancePayment/GetAdvancePaymentListByCustId?CustomerId=' +
      custid + '&CompanyId=' + localStorage.getItem('companyid'),
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
          setAdvanceDataTicked(data.Result);
        }
        else if (data.StatusCode === 401) {
          HandleLogout();

          history("/login")
        }
        else if (data.StatusCode === 404) {
          setAdvanceData("");
          setAdvanceDataTicked(data.Result);
        }
        else {
          props.showAlert("Error occurred!!", "danger")
          setAdvanceData("");
          setAdvanceData("");
          setAdvanceDataTicked("");
        }
      });
  }

  const fetchFeed = async () => {

    FetchFeed(process.env.REACT_APP_API)
      .then(data => {
        if (data.StatusCode === 200) {
          setFeedList(data.Result);
          setCount(data.Result.length);
          setTotalPages(Math.ceil(data.Result.length / process.env.REACT_APP_PAGE_PAGINATION_NO));
        }
        else if (data.StatusCode === 401) {
          history("/login")
        }

      });
  }

  const deleteFeed = (id) => {
    if (window.confirm('Are you sure?')) {
      fetch(process.env.REACT_APP_API + 'Feed/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => res.json())
        .then((result) => {
          if (result.StatusCode === 200) {
            addCount(count);
            props.showAlert("Successfully deleted", "info")
          }
          else if (result.StatusCode === 401) {
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
          })

      addCount(count);
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
  const itemsToDiaplay = feedList && feedList.length > 0 ? feedList.slice(startIndex, endIndex) : [];

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    var form = e.target.closest('.needs-validation');
    if (form.checkValidity() === false) {

      e.stopPropagation();
      setValidated(true);
    }
    else {

      fetch(process.env.REACT_APP_API + 'Feed/FeedAdd', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          Id: feeddata.Id,
          Date: feeddata.Date,
          InvoiceNo: feeddata.InvoiceNo,
          InvoiceDate: feeddata.InvoiceDate,
          ItemName: feeddata.ItemName,
          UnitId: feeddata.UnitId,
          Quantity: feeddata.Quantity,
          Rate: feeddata.Rate,
          TotalAmount: feeddata.TotalAmount,
          Discount: feeddata.Discount,
          FinalCost: feeddata.FinalCost,
          Paid: feeddata.Paid,
          Due: feeddata.Due,
          PaymentDate: feeddata.PaymentDate,
          CustomerId: feeddata.CustomerId,
          CompanyId: localStorage.getItem('companyid'),
          Comments: feeddata.Comments,
          SettleAmount: feeddata.SettleAmount,
          VehicleNo: feeddata.VehicleNo

        })
      })
        .then(res => res.json())
        .then((result) => {
          if (result.StatusCode === 200) {
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
          })

      setValidated(false);
    }


  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    var _form = e.target.closest('.needs-validation');
    console.log(_form.checkValidity());
    if (!_form.checkValidity()) {
      e.stopPropagation();
    }
    else {

      fetch(process.env.REACT_APP_API + 'Feed', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          Id: feeddata.Id,
          Date: feeddata.Date,
          InvoiceNo: feeddata.InvoiceNo,
          InvoiceDate: feeddata.InvoiceDate,
          ItemName: feeddata.ItemName,
          UnitId: feeddata.UnitId,
          Quantity: feeddata.Quantity,
          Rate: feeddata.Rate,
          TotalAmount: feeddata.TotalAmount,
          Discount: feeddata.Discount,
          FinalCost: feeddata.FinalCost,
          Paid: feeddata.Paid,
          Due: feeddata.Due,
          PaymentDate: feeddata.PaymentDate,
          CustomerId: feeddata.CustomerId,
          CompanyId: localStorage.getItem('companyid'),
          Comments: feeddata.Comments,
          SettleAmount: feeddata.SettleAmount,
          VehicleNo: feeddata.VehicleNo

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

  const invoiceDateChange = (e) => {
    setFeedData({ ...feeddata, InvoiceDate: e.target.value });
  }

  const invoiceNoChange = (e) => {
    setFeedData({ ...feeddata, InvoiceNo: e.target.value });
  }



  return (
    <div className="ContainerOverride">
      <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
        <h4>Feed Sale</h4>
      </div>
      <div className="row">
        <div className="col" style={{ textAlign: 'right' }}>

          <a className="mr-2 btn btn-primary"
            style={{ marginRight: '10px' }} href={`/chicksfeedpaymentout/?custtype=${process.env.REACT_APP_CUST_TYPE_FEED}`}>Payment</a>
          <Button className="mr-2" variant="primary"
            style={{ marginRight: "17.5px" }}
            onClick={() => clickAddFeed()}>Add</Button>
        </div>
      </div>

      <Table className="mt-4" striped bordered hover size="sm">
        <thead>
          <tr className="tr-custom">
            <th align='center' >Date</th>
            <th align='center' >Customer</th>
            <th align='center' >Invoice No</th>
            <th align='center' >Invoice Date</th>
            <th align='center' >Item Name</th>
            <th align='center'>Unit</th>
            <th align='center'>Quantity</th>
            <th align='center'>Rate</th>
            <th align='center'>Total amt</th>
            <th align='center'>Discount</th>
            <th align='center'>FinalCost</th>
            <th align='center'>Paid</th>
            <th align='center'>Due</th>
            <th align='center'>Payment date</th>
            <th align='center'>Comments</th>
            <th align='center'>Options</th>
          </tr>
        </thead>
        <tbody>
          {
            itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => (
              <tr key={p.Id} align='center' style={{ fontSize: '13px' }} >
                <td align='center'>{Moment(p.Date).format('DD-MMM-YYYY')}</td>
                <td align='center'>{p.CustomerName}</td>
                <td align='center'>{p.InvoiceNo}</td>
                <td align='center'>{Moment(p.InvoiceDate).format('DD-MMM-YYYY')}</td>
                <td align='center'>{p.ItemName}</td>
                <td align='center'>{p.Unit}</td>
                <td align='center'>{p.Quantity}</td>
                <td align='center'>{p.Rate}</td>
                <td align='center'>{parseFloat(p.TotalAmount || 0).toFixed(2)}</td>
                <td align='center'>{parseFloat(p.Discount || 0).toFixed(2)}</td>
                <td align='center'>{parseFloat(p.FinalCost || 0).toFixed(2)}</td>
                <td align='center'>{parseFloat(p.Paid || 0).toFixed(2)}</td>
                <td align='center'>{parseFloat(p.Due || 0).toFixed(2)}</td>
                <td align='center'>{Moment(p.PaymentDate).format('DD-MMM-YYYY')}</td>
                <td align='center'>{p.Comments}</td>
                <td align='center'>
                  {
                    <ButtonToolbar>
                      <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditFeed(p)}></i>

                      {localStorage.getItem('isadmin') === 'true' &&
                        <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteFeed(p.Id)}></i>}

                    </ButtonToolbar>
                  }
                </td>
              </tr>
            )) : <tr>
              <td style={{ textAlign: "center" }} colSpan={14}>
                No Records
              </td>
            </tr>
          }
        </tbody>
      </Table>
      {
        feedList && feedList.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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
            feedList && feedList.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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

      {feedList && feedList.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
        <button
          onClick={handleNextClick}
          disabled={nextDisabled}
        >
          Next
        </button>
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
            <Modal.Title id="contained-modal-title-vcenter" style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: '18px'
            }}>
              {feeddata.modaltitle}
            </Modal.Title>
            <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col sm={12}>
                <Form noValidate validated={validated} className="needs-validation">

                  <Row className="mb-12">
                    <Form.Group as={Col} controlId="InvoiceDate">
                      <Form.Label style={{ fontSize: 13 }}>Invoice date</Form.Label>
                      <DateComponent date={null} onChange={invoiceDateChange}
                        isRequired={true} value={feeddata.InvoiceDate} />
                      <Form.Control.Feedback type="invalid">
                        Please select invoice date
                      </Form.Control.Feedback>
                    </Form.Group>

                    <InputField controlId="InvoiceNo" label="Invoice no"
                      type="text"
                      value={feeddata.InvoiceNo}
                      name="InvoiceNo"
                      placeholder="Invoice no"
                      errormessage="Please enter Invoice No"
                      required={true}
                      disabled={false}
                      onChange={invoiceNoChange}
                    />
                  </Row>

                  <Row className="col-12">
                    <Form.Group as={Col} controlId="CustomerId">
                      <Form.Label style={{ fontSize: '13px' }}>Supplier</Form.Label>
                      <Form.Select
                        onChange={customerChange} style={{ fontSize: 13 }}>
                        <option selected value="">Choose...</option>
                        {
                          customerlist.map((item) => {
                            let fullname = (item.MiddleName != "" && item.MiddleName != null)
                              ? item.FirstName + " " + item.MiddleName + " " + item.LastName :
                              item.FirstName + " " + item.LastName;
                            return (
                              <option
                                key={item.ID}
                                defaultValue={item.ID == null ? null : item.ID}
                                selected={item.ID === parseInt(feeddata.CustomerId)}
                                value={item.ID}
                              >{fullname}</option>

                            );
                          })
                        }
                      </Form.Select>
                    </Form.Group>
                    {
                      advancedata != null && advancedata.Amount > 0 &&
                      <div className="col-6">
                        <div className="alert alert-success" role="alert">
                          <strong>  Advance of Rs: {parseFloat(advancedata.Amount || 0).toFixed(2)}</strong>

                          {
                            feeddata.FinalCost > 0 && feeddata.Due >0 && <Form.Check
                              type="checkbox"
                              id="chkIsActiveSettle"
                              label="Settle"
                              onChange={isSettleChange}
                              value={issettle}
                              checked={issettle}
                              style={{ fontSize: '13px' }}
                            />
                          }
                        </div>
                      </div>
                    }
                  </Row>
                  <Row className="mb-12">
                    <Form.Group as={Col} controlId="date">
                      <Form.Label style={{ fontSize: '13px' }}>Date</Form.Label>
                      <DateComponent date={null} onChange={dateChange} 
                      isRequired={true} value={feeddata.Date} />
                      <Form.Control.Feedback type="invalid">
                        Please select date
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row className="mb-12">
                    <InputField controlId="ItemName" label="Item name"
                      type="text"
                      value={feeddata.ItemName}
                      name="ItemName"
                      placeholder="Item name"
                      errormessage="Please enter item name"
                      onChange={itemNameChange}
                      required={true}
                      disabled={false}
                    />
                    <InputField controlId="Quantity" label="Quantity"
                      type="text"
                      value={feeddata.Quantity}
                      name="Quantity"
                      placeholder="Quantity"
                      errormessage="Please enter Quantity"
                      onChange={quantityChange}
                      required={true}
                      disabled={false}
                    />

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
                                selected={item.ID === feeddata.UnitId}
                                value={item.ID}
                              >{item.UnitName}</option>
                            );
                          })
                        }
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Select unit
                      </Form.Control.Feedback>
                    </Form.Group>

                    <InputField controlId="Rate" label="Rate"
                      type="number"
                      value={feeddata.Rate}
                      name="Rate"
                      placeholder="Rate"
                      errormessage="Enter rate"
                      required={true}
                      disabled={false}
                      onChange={rateChange}
                    />
                  </Row>

                  <Row className="mb-12">
                    <InputField controlId="TotalAmount" label="Total amount"
                      type="number"
                      value={feeddata.TotalAmount}
                      name="TotalAmount"
                      placeholder="Total amount"
                      errormessage="Please provide total amount"
                      required={true}
                      disabled={true}
                    />


                    <InputField controlId="Discount" label="Discount"
                      type="number"
                      value={feeddata.Discount}
                      name="Discount"
                      placeholder="Discount"
                      errormessage="Please provide discount"
                      required={false}
                      disabled={false}
                      onChange={discountChange}
                    />

                    <InputField controlId="FinalCost" label="Final cost"
                      type="number"
                      value={feeddata.FinalCost}
                      name="FinalCost"
                      placeholder="Final cost"
                      errormessage="Please provide final cost"
                      required={false}
                      disabled={true}
                    />
                  </Row>

                  <Row className="mb-12">

                    <InputField controlId="Paid" label="Paid"
                      type="number"
                      value={feeddata.Paid}
                      name="Paid"
                      placeholder="Paid"
                      errormessage="Please provide paid amount"
                      required={false}
                      disabled={false}
                      onChange={paidChange}
                    />

                    <InputField controlId="Due" label="Due"
                      type="number"
                      value={feeddata.Due}
                      name="Due"
                      placeholder="Due"
                      errormessage="Please provide due amount"
                      required={false}
                      disabled={true}
                    />
                  </Row>

                 
                 
                  <Row className="mb-12">
                    <Form.Group controlId="PaymentDate" as={Col}>
                      <Form.Label style={{ fontSize: '13px' }} >Payment date</Form.Label>
                     
                        <DateComponent date={null} isRequired={false}
                          onChange={paymentDateChange} value={feeddata.PaymentDate} />
                       <Form.Control.Feedback type="invalid">
                        Please select payment date
                      </Form.Control.Feedback>
                    </Form.Group>

                    <InputField controlId="VehicleNo" label="Vehicle no"
                      type="text"
                      value={feeddata.VehicleNo}
                      name="VehicleNo"
                      placeholder="Vehicle no"
                      errormessage="Please provide vehicle no"
                      required={false}
                      disabled={false}
                      onChange={vehicleNoChange}
                    />
                  </Row>

                 

                  <Row className="mb-12">
                    <Form.Group controlId="Comments" as={Col} >
                      <Form.Label style={{ fontSize: '13px' }}>Comments</Form.Label>
                      <Form.Control style={{ fontSize: '13px' }} as="textarea" rows={3} name="Comments"
                        onChange={commentsChange} value={feeddata.Comments}
                        placeholder="Comments" />

                    </Form.Group>
                  </Row>

                  <Form.Group as={Col}>
                    {feeddata.Id <= 0 ?

                      <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                        Add
                      </Button>
                      : null
                    }

                    {feeddata.Id > 0 ?

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
        </Modal>
      </div>

    </div>
  )
}

export default ChicksFeed
