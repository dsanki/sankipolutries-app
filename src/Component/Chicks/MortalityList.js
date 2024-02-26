import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Button, ButtonToolbar, Table, Row, Col, Form,Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
    import DateComponent from '../DateComponent';
// import AddMortality from './AddMortality';
// import EditMortality from './EditMortality';
import InputField from '../ReuseableComponent/InputField'
import Moment from 'moment';
function MortalityList(props) {
    let history = useNavigate();

    const [mortalitylist, setMortalityList] = useState([]);
    const [lots, setLots] = useState([]);
    const [shedlotmaplist, SetShedLotMapList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [shedlist, setShedList] = useState([]);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);

    const [shedlotdata, SetShedLotData] = useState([]);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };
    const [_lotdetails, setLotDetails] = useState();
    const [_totalbirds, setTotalBirds] = useState();



    const initialvalues = {
        modaltitle: "",
        Id: 0,
        Date: "",
        ShedId: "",
        LotId: "",
        MortalityNumber: "",
        LotName: "",
        TotalBirdSale: ""
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
            TotalBirdSale: ""
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
            TotalBirdSale: mo.TotalBirdSale
        })
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchSheds();
            fetchLots();
            fetchShedLotsMapList();
            fetchMortalityList();
        }
        else {
            history("/login")
        }
    }, [obj]);

    const dateChange = (e) => {
        setMortalityData({ ...mortalitydata, Date: e.target.value });
    }

    // const lotidChange = (e) => {
    //     setMortalityData({ ...mortalitydata, LotId: e.target.value });
    // }

    const onShedChange = (e) => {
        const shedid = e.target.value;
        let lotid = "";
        let lotname = "";
        let totalbirdsale = "";

        const filterval = shedlotmaplist.filter((c) => c.shedid === parseInt(shedid));
        if (filterval.length > 0) {
            lotid = filterval[0].lotid;
            lotname = filterval[0].lotname;
            fetch(variables.REACT_APP_API + 'ChicksMaster/' + filterval[0].lotid)
                .then(response => response.json())
                .then(data => {
                    setLotDetails(data);
                    totalbirdsale = data.TotalBirdSale;
                    setTotalBirds(data.TotalBirdSale)
                });
        }

        setMortalityData({ ...mortalitydata, ShedId: shedid, LotId: lotid, LotName: lotname, TotalBirdSale: totalbirdsale });
    }

    const mortalityChange = (e) => {
        setMortalityData({ ...mortalitydata, MortalityNumber: e.target.value });
    }



    const fetchSheds = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedList',
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
                    setShedList(data.Result);
                }
                else if (data.StatusCode === 401) {
                    history("/login")
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
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        //closeModal();
                        props.showAlert("Successfully deleted", "info")
                    }
                    else if (result.StatusCode === 401) {
                        history("/login")
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

    const fetchLots = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetLots',
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
                    setLots(data.Result);
                }
                else if (data.StatusCode === 401) {
                    history("/login")
                }
                else if (data.StatusCode === 500) {
                    history("/login")
                }

            });
    }

    const fetchShedLotsMapList = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedLotMapList',
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
                    SetShedLotMapList(data.Result);
                }
                else if (data.StatusCode === 401) {
                    history("/login")
                }
                else if (data.StatusCode === 500) {
                    history("/login")
                }
            });
    }

    const fetchMortalityList = async () => {
        fetch(variables.REACT_APP_API + 'Mortality/GetMortalityShedLotMapList',
            {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.StatusCode === 200) {
                    setMortalityList(data.Result);
                    setCount(data.Result.length);
                    setTotalPages(Math.ceil(data.Result.length / variables.PAGE_PAGINATION_NO));
                }
                else if (data.StatusCode === 401) {
                    history("/login")
                }
                else if (data.StatusCode === 500) {
                    history("/login")
                }

            });
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

    const itemsPerPage = variables.PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = mortalitylist.slice(startIndex, endIndex);



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
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
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
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
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
                    });
        }

        setValidated(true);
    }


    return (
        <>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Mortality tracker</h2>
            </div>
            <div className="row">
                <div className="col" style={{ textAlign: 'right' }}>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddMortality()}>Add</Button>
                </div>
            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center'>
                        <th>Date</th>
                        <th>Lot Name</th>
                        <th>Mortality</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => (
                            <tr key={p.id} align='center'>
                                <td align='center'>{Moment(p.date).format('DD-MMM-YYYY')}</td>
                                <td align='center'>{p.shedname}</td>
                                <td align='center'>{p.lotname}</td>
                                <td align='center'>{p.mortality}</td>

                                <td align='center'>
                                    {
                                        <ButtonToolbar>
                                            <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditMortality(p)}></i>

                                            {localStorage.getItem('isadmin') === 'true' &&
                                                <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteMortality(p.Id)}></i>}

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
                        mortalitylist && mortalitylist.length > variables.PAGE_PAGINATION_NO &&
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

            {mortalitylist && mortalitylist.length > variables.PAGE_PAGINATION_NO &&
                <button
                    onClick={handleNextClick}
                    disabled={nextDisabled}
                >
                    Next
                </button>
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
                                        {/* <Form.Group controlId="LotName" as={Col} >
                                            <Form.Label>Lot name</Form.Label>
                                            <Form.Control type="text" name="LotId" hidden disabled value={_lotid}
                                            />
                                            <Form.Control type="text" name="LotName" required disabled value={_lotname}
                                                placeholder="" />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter lot name
                                            </Form.Control.Feedback>
                                        </Form.Group> */}

                                        <InputField controlId="LotName"
                                                label="LotName"
                                                type="text"
                                                value={mortalitydata.LotName}
                                                name="LotName"
                                                placeholder="Lot name"
                                                errormessage="Please provide lot name"
                                                required={true}
                                                disabled={true}
                                            />



                                        <Row className="mb-4">
                                            <InputField controlId="MortalityNumber"
                                                label="MortalityNumber"
                                                type="number"
                                                value={mortalitydata.MortalityNumber}
                                                name="MortalityNumber"
                                                placeholder="Mortality number"
                                                errormessage="Please provide a mortality number"
                                                onChange={mortalityChange}
                                                required={true}
                                                disabled={false}
                                            />
                                            {/* <Form.Group controlId="MortalityNumber" as={Col} >
                                                    <Form.Label>Mortality Number</Form.Label>




                                                    <Form.Control type="number" name="MortalityNumber" required onChange={mortalityChange}

                                                        placeholder="Mortality number" />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide Mortality Number.
                                                    </Form.Control.Feedback>
                                                </Form.Group> */}
                                        </Row>
                                        {/* <Form.Group as={Col}>
                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }}>
                                                Add
                                            </Button>

                                        </Form.Group> */}

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

        </>
    )
}

export default MortalityList
