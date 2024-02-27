import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';

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


  let addModalClose = () => {
    setAddModalShow(false);
    setValidated(false);
  };

  const initialvalues = {
    modaltitle: "",
    MedicineID: 0,
    MedicineName: "",
    Quantity: "",
    Date: "",
    UnitId: "",
    TotalAmount: "",
    Paid: "",
    Due: "",
    ClientId: "",
    PaymentDate: "",
    ChequeRefNo: "",
    Comments: ""

  };

  const [meddata, setMedData] = useState(initialvalues);

  const clickAddMedicine = () => {
    setAddModalShow({ addModalShow: true });
    setMedData({
      modaltitle: "Add Medicine",
      MedicineID: 0,
      MedicineName: "",
      Quantity: "",
      Date: "",
      UnitId: "",
      TotalAmount: "",
      Paid: "",
      Due: "",
      ClientId: "",
      PaymentDate: "",
      ChequeRefNo: "",
      Comments: ""
    })
  }

  const clickEditMedicine = (md) => {
    setAddModalShow({ addModalShow: true });
    setMedData({
      modaltitle: "Edit Medicine",
      MedicineID: md.MedicineID,
      MedicineName: md.MedicineName,
      Quantity: md.Quantity,
      Date: md.Date,
      UnitId: md.UnitId,
      TotalAmount: md.TotalAmount,
      Paid: md.Paid,
      Due: md.Due,
      ClientId: md.ClientId,
      PaymentDate: md.PaymentDate,
      ChequeRefNo: md.ChequeRefNo,
      Comments: md.Comments
    })
  }

  const medicineNameChange = (e) => {
    setMedData({ ...meddata, MedicineName: e.target.value });
  }
  const dateChange = (e) => {
    setMedData({ ...meddata, Date: e.target.value });
  }

  const quantityChange = (e) => {
    setMedData({ ...meddata, Quantity: e.target.value });
  }

  const unitChange = (e) => {
    setMedData({ ...meddata, UnitId: e.target.value });
  }

  const totalAmountChange = (e) => {
    setMedData({ ...meddata, TotalAmount: e.target.value, Due: e.target.value - meddata.Paid });
  }

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

  useEffect((e) => {

    if (localStorage.getItem('token')) {
      fetchUnit();
      fetchClient();
      fetchMedicineList();
    }
    else {

      history("/login")
    }
  }, [obj]);


  const fetchMedicineList = async () => {
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
        }
        else if (data.StatusCode === 401) {
          history("/login")
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
          setTotalPages(Math.ceil(data.Result.length / variables.PAGE_PAGINATION_NO));
      }
      else if (data.StatusCode === 401) {
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
          history("/login")
      }
      });
  }

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    fetch(variables.REACT_APP_API + 'Medicine/UpdateMedicine', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify({

        MedicineID: meddata.MedicineID,
        MedicineName: meddata.MedicineName,
        Date: meddata.Date,
        Quantity: meddata.Quantity,
        UnitId: meddata.UnitId,
        TotalAmount: meddata.TotalAmount,
        Paid: meddata.Paid,
        Due: meddata.Due,
        ClientId: meddata.ClientId,
        PaymentDate: meddata.PaymentDate,
        ChequeRefNo: meddata.ChequeRefNo,
        Comments: meddata.Comments

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
    //}

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

    fetch(variables.REACT_APP_API + 'Medicine/AddMedicine', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
      },
      body: JSON.stringify({
        MedicineID: meddata.MedicineID,
        MedicineName: meddata.MedicineName,
        Date: meddata.Date,
        Quantity: meddata.Quantity,
        UnitId: meddata.UnitId,
        TotalAmount: meddata.TotalAmount,
        Paid: meddata.Paid,
        Due: meddata.Due,
        ClientId: meddata.ClientId,
        PaymentDate: meddata.PaymentDate,
        ChequeRefNo: meddata.ChequeRefNo,
        Comments: meddata.Comments

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
    //}

    setValidated(true);
  }

  const deleteMedicine = () => {

  }

  const filterSupplierChange = (e) => {

    if (e.target.value > 0) {
      const _medd = medicineListForFilter.filter((c) => c.ClientId === parseInt(e.target.value));
      setMedicineList(_medd);
    }
    else {
      setMedicineList(medicineListForFilter);
    }


  }

  return (
    <div>

      <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
        <h2>Welcome to Medicine List Page</h2>
      </div>

      <div className="row">
      <div className="col">
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
        </div>
        <div className="col" style={{textAlign:'right'}}>
          <Button className="mr-2 btn-primary btn-primary-custom" variant="primary"
            style={{ marginRight: "17.5px" }}
            onClick={() => clickAddMedicine()}>Add</Button>
        </div>
       
      </div>

      <Table className="mt-4" striped bordered hover size="sm">
        <thead>
          <tr align='left' className="tr-custom">
            <th>Date</th>
            <th>Supplier</th>
            <th>Medicine name</th>
            <th>Quantity</th>
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

            medicineList && medicineList.length > 0 ? medicineList.map((p) => {
              const _unit = unitlist.filter((c) => c.ID === p.UnitId);
              const _uname = _unit.length > 0 ? _unit[0].UnitName : "";

              const _supp = clientlist.filter((c) => c.Id === p.ClientId);
              const _suppname = _supp.length > 0 ? _supp[0].ClientName : "";

              return (
                <tr align='center' key={p.MedicineID}>
                  <td align='left'>{moment(p.DOB).format('DD-MMM-YYYY')}</td>
                  <td align='left'>{_suppname}</td>
                  <td align='left'>{p.MedicineName}</td>
                  <td align='left'>{p.Quantity + " " + _uname}</td>
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
                          <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteMedicine(p.MedicineID)}></i>}
                      </ButtonToolbar>
                    }
                  </td>
                </tr>
              )
            }) : ''
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
                  <Form noValidate validated={validated}>
                    <Row className="mb-12">

                      <Form.Group as={Col} controlId="Date">
                        <Form.Label>Date</Form.Label>
                        <DateComponent date={null} onChange={dateChange} isRequired={true} value={meddata.Date} />
                        <Form.Control.Feedback type="invalid">
                          Please select date
                        </Form.Control.Feedback>
                        {/* <Form.Control
                          type="date"
                          value={meddata.Date ? dateForPicker(meddata.Date) : ''}
                          onChange={dateChange}
                        /> */}
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
                      <InputField controlId="MedicineName" label="Medicine name"
                                            type="text"
                                            value={meddata.MedicineName}
                                            name="MedicineName"
                                            placeholder="Medicine name"
                                            errormessage="Please enter medicine name"
                                            onChange={medicineNameChange}
                                            required={true}
                                            disabled={false}
                                        />
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
                    <InputField controlId="Quantity" label="Quantity"
                                            type="number"
                                            value={meddata.Quantity}
                                            name="Quantity"
                                            placeholder="Quantity"
                                            errormessage="Please enter quantity"
                                            required={true}
                                            disabled={false}
                                            onChange={quantityChange}
                                        />
                      {/* <Form.Group controlId="Quantity" as={Col} >
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="text" name="Quantity" onChange={quantityChange}
                          placeholder="Quantity" value={meddata.Quantity} />
                        <Form.Control.Feedback type="invalid">
                          Please enter quantity
                        </Form.Control.Feedback>
                      </Form.Group> */}

                      <Form.Group controlId="UnitId" as={Col} >
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
                      </Form.Group>

                      <InputField controlId="TotalAmount" label="Total amount"
                                            type="number"
                                            value={meddata.TotalAmount}
                                            name="TotalAmount"
                                            placeholder="Total amount"
                                            errormessage="Please enter total amount"
                                            required={true}
                                            disabled={false}
                                            onChange={totalAmountChange}
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
                      {meddata.MedicineID <= 0 ?

                        <Button variant="primary" className="btn-primary-custom" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                          Add
                        </Button>
                        : null
                      }

                      {meddata.MedicineID > 0 ?

                        <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitEdit(e)}>
                          Update
                        </Button>
                        : null
                      }

                      <Button variant="danger"className="btn-danger-custom" style={{ marginTop: "30px", marginLeft: "10px" }} onClick={() => {
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
