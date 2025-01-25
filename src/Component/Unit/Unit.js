import React, { Component, useState, useEffect, useMemo } from 'react'
import { Button, ButtonToolbar, Table, Form, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import InputField from '../ReuseableComponent/InputField'
import { HandleLogout, FetchUnit } from '../../Utility'


function Unit(props) {

  let history = useNavigate();
  const [unitlist, setUnitList] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [count, setCount] = useState(0);
  const obj = useMemo(() => ({ count }), [count]);
  const [validated, setValidated] = useState(false);

  let addModalClose = () => {
    setAddModalShow(false);
    setValidated(false);
  };

  let addCount = (num) => {
    setCount(num + 1);
  };

  const initialvalues = {
    modaltitle: "",
    ID: 0,
    UnitName: ""
  };
  const [unitdata, setUnitData] = useState(initialvalues);

  const clickAddUnit = () => {
    setAddModalShow({ addModalShow: true });

    //const [advancedata, setAdvanceData] = useState([]);
    setUnitData({
      modaltitle: "Add new Unit",
      ID: 0,
      UnitName: ""
    })
  }

  const clickEditUnit = (unit) => {
    setAddModalShow({ addModalShow: true });
    setUnitData({
      modaltitle: "Edit Unit",
      ID: unit.ID,
      UnitName: unit.UnitName
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
    }
    else {
      HandleLogout();
      history("/login")
    }
  }, [obj]);


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

  const unitNameChange = (e) => {
    setUnitData({
      ...unitdata, UnitName: e.target.value
    });
  }


  const deleteUnit = (id) => {
    if (window.confirm('Are you sure?')) {
      fetch(process.env.REACT_APP_API + 'Unit/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      }).then(res => res.json())
        .then((result) => {
          if (result.StatusCode ===200) {
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
    }
  }


  const handleSubmitAdd = (e) => {
    e.preventDefault();
    var form = e.target.closest('.needs-validation');
    if (form.checkValidity() === false) {

      e.stopPropagation();
      setValidated(true);
    }
    else {

      fetch(process.env.REACT_APP_API + 'Unit/UnitAdd', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          ID: unitdata.ID,
          UnitName: unitdata.UnitName

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

      fetch(process.env.REACT_APP_API + 'Unit/UnitEdit', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          ID: unitdata.ID,
          UnitName: unitdata.UnitName

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


  return (
    <div className="ContainerOverride">
      <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
        <h4>Unit</h4>
      </div>

      <div className="row">
        <div className="col" style={{ textAlign: 'right' }}>
          <Button className="mr-2" variant="primary"
            style={{ marginRight: "17.5px" }}
            onClick={() => clickAddUnit()}>Add</Button>
        </div>
      </div>

      <Table className="mt-4" striped bordered hover size="sm">
        <thead>
          <tr className="tr-custom" align='center'>
            <th align='center' >Sl.no</th>
            <th align='center' >Unit name</th>
            <th align='center'>Options</th>
          </tr>
        </thead>
        <tbody>
          {
            unitlist && unitlist.length > 0 ? unitlist.map((p, index) => (
              <tr key={p.ID} align='center' style={{ fontSize: '13px' }} >
                <td align='center'>{index + 1}</td>
                <td align='center'>{p.UnitName}</td>
                <td align='center'>
                  {
                    <ButtonToolbar>
                      <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }}
                        onClick={() => clickEditUnit(p)}></i>

                      {localStorage.getItem('isadmin') === 'true' &&
                        <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }}
                          onClick={() => deleteUnit(p.ID)}></i>}

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
              {unitdata.modaltitle}
            </Modal.Title>
            <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col sm={12}>
                <Form noValidate validated={validated} className="needs-validation">

                  <Row className="mb-12">


                    <InputField controlId="UnitName" label="Unit name"
                      type="text"
                      value={unitdata.UnitName}
                      name="UnitName"
                      placeholder="Unit name"
                      errormessage="Please enter Unit name"
                      required={true}
                      disabled={false}
                      onChange={unitNameChange}
                    />
                  </Row>

                  <Form.Group as={Col}>
                    {unitdata.ID <= 0 ?

                      <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                        Add
                      </Button>
                      : null
                    }

                    {unitdata.ID > 0 ?

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

export default Unit
