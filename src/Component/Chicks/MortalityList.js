import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Button, ButtonToolbar, Table, Row, Col, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'
import Moment from 'moment';
import Loading from '../Loading/Loading'
import * as XLSX from 'xlsx';

import { FetchMortalityList, FetchShedLotMapList, FetchShedsList, NumberInputKeyDown, HandleLogout, dateyyyymmdd, downloadExcel } from '../../Utility'


function MortalityList(props) {
  let history = useNavigate();

  const [mortalitylist, setMortalityList] = useState([]);
  const [shedlotmaplist, SetShedLotMapList] = useState([]);
  const [validated, setValidated] = useState(false);
  const [shedlist, setShedList] = useState([]);
  const [count, setCount] = useState(0);
  const obj = useMemo(() => ({ count }), [count]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [addModalShow, setAddModalShow] = useState(false);
  const [isloaded, setIsLoaded] = useState(true);

  const [mortalitylistForFilter, setMortalityListForFilter] = useState([]);

  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterShed, setFilterShed] = useState();

  let addModalClose = () => {
    setAddModalShow(false);
    setValidated(false);
  };

  const initialvalues = {
    modaltitle: "",
    Id: 0,
    Date: "",
    ShedId: "",
    LotId: "",
    MortalityNumber: "",
    LotName: "",
    TotalBirds: ""
  };

  const [mortalitydata, setMortalityData] = useState(initialvalues);

  const clickAddMortality = () => {
    setAddModalShow({ addModalShow: true });
    setMortalityData({
      modaltitle: "Add new mortality",
      Id: 0,
      Date: "",
      ShedId: "",
      LotId: "",
      MortalityNumber: "",
      LotName: "",
      TotalBirds: ""
    })
  }

  const clickEditMortality = (mo) => {
    setAddModalShow({ addModalShow: true });
    setMortalityData({
      modaltitle: "Edit mortality",
      Id: mo.id,
      Date: mo.date,
      ShedId: mo.shedid,
      LotId: mo.lotid,
      MortalityNumber: mo.mortality,
      LotName: mo.lotname,
      TotalBirds: mo.totalbirds
    })
  }

  useEffect((e) => {

    if (localStorage.getItem('token')) {
      fetchSheds();
      fetchShedLotsMapList();
    }
    else {
      HandleLogout();
      history("/login")
    }
  }, []);


  const dateChange = (e) => {
    setMortalityData({ ...mortalitydata, Date: e.target.value });
  }

  const onShedChange = (e) => {
    const shedid = e.target.value;
    let lotid = "";
    let lotname = "";
    let totalbirds = "";

    const filterval = shedlotmaplist.filter((c) => c.shedid === parseInt(shedid));
    if (filterval.length > 0) {
      lotid = filterval[0].lotid;
      lotname = filterval[0].lotname;
      fetch(variables.REACT_APP_API + 'ChicksMaster/' + filterval[0].lotid,
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
          totalbirds = data.Result.TotalChicks - (data.Result.Mortality + data.Result.TotalMortality + data.Result.TotalBirdSale);
          setMortalityData({ ...mortalitydata, ShedId: shedid, LotId: lotid, LotName: lotname, TotalBirds: totalbirds });
        });
    }
    else {
      setMortalityData({ ...mortalitydata, ShedId: shedid, LotId: lotid, LotName: lotname, TotalBirds: totalbirds });
    }
  }

  const mortalityChange = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setMortalityData({ ...mortalitydata, MortalityNumber: e.target.value });
    }
  }

  const fetchSheds = async () => {
    const _data = FetchShedsList()
      .then(data => {
        if (data.StatusCode === 200) {
          setShedList(data.Result);
        }
        else if (data.StatusCode === 401) {
          HandleLogout();
          history("/login")
        }
        else {
          props.showAlert("Error occurred!!", "danger")
        }
      });
  }

  const deleteMortality = (id) => {
    if (window.confirm('Are you sure?')) {
      fetch(variables.REACT_APP_API + 'Mortality/' + id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
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

  const fetchShedLotsMapList = async () => {
    FetchShedLotMapList()
      .then(data => {
        if (data.StatusCode === 200) {
          SetShedLotMapList(data.Result);
        }
        else if (data.StatusCode === 401) {
          HandleLogout();
          history("/login");
        }
        else if (data.StatusCode === 500) {
          history("/login");
          HandleLogout();
        }
      });
  }

  useEffect((e) => {

    if (localStorage.getItem('token')) {
      fetchMortalityList();
    }
    else {
      HandleLogout();
      history("/login")
    }
  }, [obj]);


  const fetchMortalityList = () => {
    setIsLoaded(true);
    FetchMortalityList()
      .then(data => {
        if (data.StatusCode === 200) {
          setMortalityList(data.Result);
          setMortalityListForFilter(data.Result);
          setTotalPages(Math.ceil(data.Result.length / variables.PAGE_PAGINATION_NO));
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

      })
      .catch(err => console.log(err));
  };

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

  const itemsPerPage = variables.PAGE_PAGINATION_NO;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let itemsToDiaplay = mortalitylist.slice(startIndex, endIndex);
  if (itemsToDiaplay.length === 0 && mortalitylist.length > 0) {
    setCurrentPage(currentPage - 1);
  }

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

      fetch(variables.REACT_APP_API + 'Mortality/MortalityAdd', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          Id: mortalitydata.Id,
          Date: mortalitydata.Date,
          ShedId: mortalitydata.ShedId,
          LotId: mortalitydata.LotId,
          MortalityNumber: mortalitydata.MortalityNumber

        })
      }).then(res => res.json())
        .then((result) => {
          if (result.StatusCode === 200) {
            addCount(count);
            addModalClose();
            props.showAlert("Successfully added", "info")
          }
          else if (result.StatusCode === 300) {
            props.showAlert("Data is exists for this shed for the day!!", "danger")
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

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    var form = e.target.closest('.needs-validation');
    if (form.checkValidity() === false) {

      e.stopPropagation();
      setValidated(true);
    }
    else {

      fetch(variables.REACT_APP_API + 'Mortality/MortalityUpdate', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          Id: mortalitydata.Id,
          Date: mortalitydata.Date,
          ShedId: mortalitydata.ShedId,
          LotId: mortalitydata.LotId,
          MortalityNumber: mortalitydata.MortalityNumber

        })
      }).then(res => res.json())
        .then((result) => {
          if (result.StatusCode === 200) {
            addCount(count);
            addModalClose();
            props.showAlert("Successfully updated!!", "info")
          }
          else if (result.StatusCode === 401) {
            HandleLogout();
            history("/login")
          }
          else if (result.StatusCode === 404) {
            props.showAlert("Data not found!!", "danger")
          }
          else if (result.StatusCode === 400) {
            props.showAlert("Bad Request!!", "danger")
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


  const onDateFilterFromChange = (e) => {
    setFilterFromDate(e.target.value);
    getFilterData(e.target.value, filterToDate, filterShed);
  }


  const getFilterData = (fromDate, toDate, shedid) => {
    let _filterList = [];
    if (fromDate !== "" && toDate !== "") {
      _filterList = mortalitylistForFilter.filter((c) => dateyyyymmdd(c.date) >= dateyyyymmdd(fromDate) && dateyyyymmdd(c.date) <= dateyyyymmdd(toDate));
    }
    else if (fromDate === "" && toDate !== "") {
      _filterList = mortalitylistForFilter.filter((c) => dateyyyymmdd(c.date) <= dateyyyymmdd(toDate));
    }
    else if (fromDate !== "" && toDate === "") {
      _filterList = mortalitylistForFilter.filter((c) => dateyyyymmdd(c.date) >= dateyyyymmdd(fromDate));
    }
    else {
      _filterList = mortalitylistForFilter;
    }

    if (shedid !== "") {
      _filterList = _filterList.filter((c) => c.shedid === parseInt(shedid));
    }


    setMortalityList(_filterList);
  }

  const onDateFilterToChange = (e) => {
    setFilterToDate(e.target.value);
    getFilterData(filterFromDate, e.target.value, filterShed);
  }

  const onShedFilterChange = (e) => {
    setFilterShed(e.target.value);
    getFilterData(filterFromDate, filterToDate, e.target.value)
  }
  
  const onDownloadExcel=()=>
  {

    const updatedList = mortalitylist.map(obj => {
          return {
            Date:obj.date,
              Shed: obj.shedname,
              LotName: obj.lotname,
              Mortality:obj.mortality,
              TotalBirds: obj.totalbirds
          }
  });

  downloadExcel(updatedList,"MortalityList");
  }



  return (
    <div>
      {isloaded && <Loading />}
      <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '10px' }}>
        <h2>Mortality tracker</h2>
      </div>

      <div className="container" style={{marginTop: '30px' }}>
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
              <option selected  value="">Choose...</option>
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
        <i className="fa-regular fa-file-excel fa-2xl" style={{color: '#bea2a2'}} onClick={() =>onDownloadExcel() } ></i>
        </div>
        <div className="col" style={{ textAlign: 'right', marginTop: '20px' }}>
          <Button className="mr-2" variant="primary"
            style={{ marginRight: "17.5px" }}
            onClick={() => clickAddMortality()}>New</Button>
        </div>
      </div>
      <Table className="mt-4" striped bordered hover size="sm">
        <thead>
          <tr align='center' className="tr-custom">
            <th>Date</th>
            <th>Shed</th>
            <th>Lot Name</th>
            <th>Mortality</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>

          {

            itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => (

              !isloaded && <tr key={p.id} align='center'>
                <td align='center'>{Moment(p.date).format('DD-MMM-YYYY')}</td>
                <td align='center'>{p.shedname}</td>
                <td align='center'>{p.lotname}</td>
                <td align='center'>{p.mortality}</td>

                <td align='center'>
                  {
                    <ButtonToolbar>
                      <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditMortality(p)}></i>

                      {localStorage.getItem('isadmin') === 'true' &&
                        <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteMortality(p.id)}></i>}

                    </ButtonToolbar>
                  }
                </td>
              </tr>
            )) : <tr>
              <td style={{ textAlign: "center" }} colSpan={5}>
                No Records
              </td>
            </tr>
          }
        </tbody>
      </Table>

      {
        mortalitylist && mortalitylist.length > variables.PAGE_PAGINATION_NO &&
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

      <Modal
        show={addModalShow}
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Add
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

                      <Form.Label>Date</Form.Label>
                      <Form.Control type="text" name="LotId" hidden disabled value={mortalitydata.LotId} />
                      <DateComponent date={null} onChange={dateChange} isRequired={true} value={mortalitydata.Date} />
                      <Form.Control.Feedback type="invalid">
                        Please select date
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="ShedId" as={Col} >
                      <Form.Label>Shed</Form.Label>
                      <Form.Select aria-label="Default select example"
                        onChange={onShedChange} required>
                        <option selected disabled value="">Choose...</option>
                        {
                          shedlist.map((item) => {
                            return (
                              <option
                                key={item.ShedId}
                                defaultValue={item.ShedId == null ? null : item.ShedId}
                                selected={item.ShedId === mortalitydata.ShedId}
                                value={item.ShedId}
                              >{item.ShedName}</option>
                            );
                          })
                        }
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select Shed
                      </Form.Control.Feedback>

                    </Form.Group>

                    <InputField controlId="LotName"
                      label="Lot name"
                      type="text"
                      value={mortalitydata.LotName}
                      name="LotName"
                      placeholder="Lot name"
                      errormessage="Please provide lot name"
                      required={true}
                      disabled={true}
                    />
                    <InputField controlId="TotalBirds"
                      label="Total birds"
                      type="number"
                      value={mortalitydata.TotalBirds}
                      name="TotalBirds"
                      placeholder="Total birds"
                      errormessage="Please enter total birds"
                      required={true}
                      disabled={true}
                    />



                    <Row className="mb-4">
                      <InputField controlId="MortalityNumber"
                        label="Mortality number"
                        type="text"
                        value={mortalitydata.MortalityNumber}
                        name="MortalityNumber"
                        placeholder="Mortality number"
                        errormessage="Please provide a mortality number"
                        onChange={mortalityChange}
                        required={true}
                        disabled={false}
                        onKeyDown={NumberInputKeyDown}
                      />
                    </Row>

                    <Form.Group as={Col}>
                      {mortalitydata.Id <= 0 ?

                        <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                          Add
                        </Button>
                        : null
                      }

                      {mortalitydata.Id > 0 ?

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

                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>

        </Modal.Footer>
      </Modal>


    </div>
  )
}

export default MortalityList
