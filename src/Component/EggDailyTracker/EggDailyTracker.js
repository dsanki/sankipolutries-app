import React, { useState, useEffect, useMemo } from 'react'
import { variables } from './../../Variables'
import { Button, ButtonToolbar, Table, Modal, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import { CalculateAgeInDays, CalculateAgeInWeeks, dateyyyymmdd } from './../../Utility'

function EggDailyTracker(props) {

    let history = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);
    const [count, setCount] = useState(0);
    const [shedlist, setShedList] = useState([]);
    const [eggtrackerlist, setEggDailyTrackerList] = useState([]);
    const [eggtrackerlistForFilter, setEggtrackerlistForFilter] = useState([]);
    const [shedlotmaplist, setShedLotMapList] = useState([]);
    const [validated, setValidated] = useState(false);
    const obj = useMemo(() => ({ count }), [count]);
    const [_agedays, setAgeDays] = useState(0);
    const [_ageweeks, setAgeWeeks] = useState(0);
    const [filterDate, setFilterDate] = useState();

    const initialvalues = {
        id: 0,
        Date: "",
        ShedId: "",
        LotId: "",
        TotalBirds: "",
        TotalEggs: "",
        BrokenEggs: "",
        OkEggs: "",
        FeedIntech: "",
        ProductionPercentage: "",
        AgeDays: "",
        AgeWeeks: ""
    };

    const [eggdata, setEggData] = useState(initialvalues);

    const clickAddEggProduction = () => {
        setAddModalShow({ addModalShow: true });
        setEggData({
            modaltitle: "Add Egg Production Tracker",
            id: 0,
            Date: "",
            ShedId: "",
            LotId: "",
            TotalBirds: "",
            TotalEggs: "",
            BrokenEggs: "",
            OkEggs: "",
            FeedIntech: "",
            ProductionPercentage: "",
            AgeDays: "",
            AgeWeeks: "",
            LotName: ""
        })
    }

    const clickEditEggProduction = (egg) => {
        setAddModalShow({ addModalShow: true });
        setEggData({
            modaltitle: "Edit Egg Production Tracker",
            id: egg.id,
            Date: egg.Date,
            ShedId: egg.ShedId,
            LotId: egg.LotId,
            TotalBirds: egg.TotalBirds,
            TotalEggs: egg.TotalEggs,
            BrokenEggs: egg.BrokenEggs,
            OkEggs: egg.OkEggs,
            FeedIntech: egg.FeedIntech,
            ProductionPercentage: egg.ProductionPercentage,
            AgeDays: egg.AgeDays,
            AgeWeeks: egg.AgeWeeks,
            LotName: egg.LotName
        })
    }

    const onDateChange = (e) => {
        setEggData({ ...eggdata, Date: e.target.value });
    }

    const onDateFilterChange = (e) => {
        setFilterDate(e.target.value);
        if (e.target.value !== "") {
            const _filterList = eggtrackerlistForFilter.filter((c) => dateyyyymmdd(c.Date) === dateyyyymmdd(e.target.value));
            setEggDailyTrackerList(_filterList);
        }
        else {
            setEggDailyTrackerList(eggtrackerlistForFilter);
        }
    }

    const onTotalEggsChange = (e) => {
        let _totalegg = e.target.value === "" ? 0 : parseInt(e.target.value);
        setEggData({ ...eggdata, TotalEggs: e.target.value, OkEggs: _totalegg - eggdata.BrokenEggs, ProductionPercentage: ((_totalegg / eggdata.TotalBirds) * 100).toFixed(2) });
    }

    const onBrokenEggsChange = (e) => {
        let _brokenegg = e.target.value === "" ? 0 : parseInt(e.target.value);
        setEggData({ ...eggdata, BrokenEggs: _brokenegg, OkEggs: eggdata.TotalEggs - _brokenegg, ProductionPercentage: ((eggdata.TotalEggs / eggdata.TotalBirds) * 100).toFixed(2) });
    }

    const onFeedIntechChange = (e) => {
        setEggData({ ...eggdata, FeedIntech: e.target.value });
    }

    const [_lotdetails, setLotDetails] = useState();
    const onShedChange = (e) => {
        const shedid = e.target.value;
        let lotid = "";
        let lotname = "";
        let totalbirds = "";
        let days = "";
        let weeks = "";

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
                    setLotDetails(data.Result);
                    totalbirds = data.Result.TotalChicks;
                    weeks = CalculateAgeInWeeks(data.Result.Date);
                    days = CalculateAgeInDays(data.Result.Date);
                    setEggData({ ...eggdata, ShedId: shedid, LotId: lotid, LotName: lotname, TotalBirds: totalbirds, AgeDays: days, AgeWeeks: weeks });
                });
        }
        else {
            setEggData({ ...eggdata, ShedId: shedid, LotId: lotid, LotName: lotname, TotalBirds: totalbirds, AgeDays: days, AgeWeeks: weeks });
        }
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchShedLotMapList();
            fetchEggDailyTrackerList();
            fetchSheds();
        }
        else {
            history("/login")
        }
    }, [obj]);

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
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found to fetch sheds!!", "danger")
                }
                else {
                    props.showAlert("Error occurred to fetch sheds!!", "danger")
                }
            });
    }

    const fetchShedLotMapList = async () => {
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
                    setShedLotMapList(data.Result);
                }
                else if (data.StatusCode === 401) {
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found to shed lot map list!!", "danger")
                }
                else {
                    props.showAlert("Error occurred shed lot map list!!", "danger")
                }
            });
    }

    const fetchEggDailyTrackerList = async () => {
        fetch(variables.REACT_APP_API + 'EggProductionDailyTracker/GetEggDailyTrackerList',
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
                    setEggDailyTrackerList(data.Result);
                    setEggtrackerlistForFilter(data.Result);
                    setCount(data.Result.length);
                    setTotalPages(Math.ceil(data.Result.length / variables.PAGE_PAGINATION_NO));
                }
                else if (data.StatusCode === 401) {
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found GetEggDailyTrackerList!!", "danger")
                }
                else {
                    props.showAlert("Error occurred GetEggDailyTrackerList!!", "danger")
                }
            });
    }

    let addCount = (num) => {
        setCount(num + 1);
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
    const itemsToDiaplay = eggtrackerlist.slice(startIndex, endIndex);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    const deleteTracker = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'EggProductionDailyTracker/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then((data) => {
                    if (data.StatusCode === 200) {
                        setCount(1);
                        props.showAlert("Successfully deleted", "info")
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
                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    });

            addCount(count);
        }
    }
    
    const handleAddEggTracker = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(variables.REACT_APP_API + 'EggProductionDailyTracker', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    id: eggdata.id,
                    Date: eggdata.Date,
                    ShedId: eggdata.ShedId,
                    LotId: eggdata.LotId,
                    TotalBirds: eggdata.TotalBirds,
                    TotalEggs: eggdata.TotalEggs,
                    BrokenEggs: eggdata.BrokenEggs,
                    OkEggs: eggdata.OkEggs,
                    FeedIntech: eggdata.FeedIntech,
                    ProductionPercentage: eggdata.ProductionPercentage

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

    const handleEditEggTracker = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(variables.REACT_APP_API + 'EggProductionDailyTracker', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    id: eggdata.id,
                    Date: eggdata.Date,
                    ShedId: eggdata.ShedId,
                    LotId: eggdata.LotId,
                    TotalBirds: eggdata.TotalBirds,
                    TotalEggs: eggdata.TotalEggs,
                    BrokenEggs: eggdata.BrokenEggs,
                    OkEggs: eggdata.OkEggs,
                    FeedIntech: eggdata.FeedIntech,
                    ProductionPercentage: eggdata.ProductionPercentage
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
                <h2>Welcome to Daily Production Tracker</h2>
            </div>
            <div className="row">
                <div className="col" sm={12}>
                    <p><strong>Filter date</strong></p>
                    <DateComponent date={null} onChange={onDateFilterChange} isRequired={false} value={filterDate} />
                </div>
                <div className="col" style={{ textAlign: 'right' }}>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddEggProduction()}>Add</Button>
                </div>
            </div>

            {
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr align='center'>
                            <th>Date</th>
                            <th>Shed</th>
                            <th>Lot </th>
                            <th>Birds</th>
                            <th>Eggs</th>
                            <th>Eggs B</th>
                            <th>Eggs OK</th>
                            <th>FIntech</th>
                            <th>%</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((egg) => {
                                const filterByShedId = shedlotmaplist.filter((c) => c.shedid === egg.ShedId);
                                const shedname = filterByShedId.length > 0 ? filterByShedId[0].shedname : "";

                                egg.AgeDays = CalculateAgeInDays(egg.LotDate);
                                egg.AgeWeeks = CalculateAgeInWeeks(egg.LotDate);
                                return (
                                    <tr key={egg.id} align='center'>
                                        <td align='center'>{moment(egg.Date).format('DD-MMM-YYYY')}</td>
                                        <td>{shedname}</td>
                                        <td>{egg.LotName}</td>
                                        <td>{egg.TotalBirds}</td>
                                        <td>{egg.TotalEggs}</td>
                                        <td>{egg.BrokenEggs}</td>
                                        <td>{egg.OkEggs}</td>
                                        <td>{egg.FeedIntech}</td>
                                        <td>{egg.ProductionPercentage}</td>
                                        <td align='center'>
                                            {
                                                <ButtonToolbar>
                                                    <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditEggProduction(egg)}></i>

                                                    {localStorage.getItem('isadmin') === 'true' &&
                                                        <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteTracker(egg.id)}></i>}

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
            }
            {
                eggtrackerlist && eggtrackerlist.length > variables.PAGE_PAGINATION_NO &&
                <button
                    onClick={handlePrevClick}
                    disabled={preDisabled}
                >

                    Prev
                </button>
            }
            {
                eggtrackerlist && eggtrackerlist.length > variables.PAGE_PAGINATION_NO &&

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

            {
                eggtrackerlist && eggtrackerlist.length > variables.PAGE_PAGINATION_NO &&
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
                                        <Form.Group controlId="Date" as={Col} >
                                            <Form.Label>Date</Form.Label>
                                            <Form.Control type="text" name="LotId" hidden disabled value={eggdata.LotId} />
                                            <DateComponent date={null} onChange={onDateChange} isRequired={true} value={eggdata.Date} />
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
                                                                selected={item.ShedId === eggdata.ShedId}
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
                                    </Row>
                                    <Row className="mb-12">
                                        <InputField controlId="LotName"
                                            label="LotName"
                                            type="text"
                                            value={eggdata.LotName}
                                            name="LotName"
                                            placeholder="Lot name"
                                            errormessage="Please provide lot name"
                                            required={true}
                                            disabled={true}
                                        />

                                        <InputField controlId="Age"
                                            label="Age (days/week)"
                                            type="text"
                                            value={eggdata.AgeDays + " / " + eggdata.AgeWeeks}
                                            name="Age"
                                            placeholder="Age"
                                            errormessage="Please enter age in days/weeks"
                                            required={true}
                                            disabled={true}
                                        />

                                        <InputField controlId="TotalBirds"
                                            label="Total birds"
                                            type="number"
                                            value={eggdata.TotalBirds}
                                            name="TotalBirds"
                                            placeholder="TotalBirds"
                                            errormessage="Please enter total birds"
                                            required={true}
                                            disabled={true}
                                        />
                                    </Row>
                                    <Row className="mb-12">
                                        <InputField controlId="TotalEggs"
                                            label="Total eggs"
                                            type="number"
                                            value={eggdata.TotalEggs}
                                            name="TotalEggs"
                                            placeholder="Total eggs"
                                            errormessage="Please provide total eggs"
                                            onChange={onTotalEggsChange}
                                            required={true}
                                            disabled={false}
                                        />

                                        <InputField controlId="BrokenEggs"
                                            label="Broken eggs"
                                            type="number"
                                            value={eggdata.BrokenEggs}
                                            name="BrokenEggs"
                                            placeholder="Broken eggs"
                                            errormessage="Please provide broken eggs"
                                            onChange={onBrokenEggsChange}
                                            required={true}
                                            disabled={false}
                                        />

                                        <InputField controlId="OkEggs"
                                            label="OK eggs"
                                            type="number"
                                            value={eggdata.OkEggs}
                                            name="OkEggs"
                                            placeholder="OK eggs"
                                            errormessage="Please provide OK eggs"
                                            required={true}
                                            disabled={true}
                                        />

                                        <InputField controlId="ProductionPercentage"
                                            label="Production %"
                                            type="number"
                                            value={eggdata.ProductionPercentage}
                                            name="ProductionPercentage"
                                            placeholder="Production %"
                                            errormessage="Please provide production %"
                                            required={true}
                                            disabled={true}
                                        />
                                    </Row>

                                    <Row className="mb-12">
                                        <InputField controlId="FeedIntech"
                                            label="Feed intech"
                                            type="number"
                                            value={eggdata.FeedIntech}
                                            name="FeedIntech"
                                            placeholder="Feed intech"
                                            errormessage="Please enter feed intech"
                                            required={true}
                                            disabled={false}
                                            onChange={onFeedIntechChange}
                                        />
                                    </Row>

                                    <Form.Group as={Col}>
                                        {eggdata.id <= 0 ?

                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleAddEggTracker(e)}>
                                                Add
                                            </Button>
                                            : null
                                        }

                                        {eggdata.id > 0 ?

                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleEditEggTracker(e)}>
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

        </>
    )
}

export default EggDailyTracker
