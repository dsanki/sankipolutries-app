import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import { FetchSheds, CalculateAgeInWeeks, CalculateAgeInDays, FetchShedLotMapList, dateyyyymmdd, downloadExcel, HandleLogout, NumberInputKeyDown, FetchShedsList, FetchLotById } from '../../Utility';
//import { FetchUnit, FetchShedsList, FetchLots, FetchLotById  } from '../../Utility'
import Loading from '../Loading/Loading'




function ChicksVaccinationTracker(props) {
    let history = useNavigate();

    const [vaccinationtrackerlist, setVaccinationTrackerList] = useState([]);
    const [vaccinationtypelist, setVaccinationTypeList] = useState([]);
    const [vaccinationroutelist, setVaccinationRouteList] = useState([]);
    const [vaccinationlist, setVaccinationList] = useState([]);
    const [vaccinationagelist, setVaccinationAgeList] = useState([]);
    const [shedlotmaplist, setShedLotMapList] = useState([]);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [shedlist, setShedList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isloaded, setIsLoaded] = useState(true);

    const [vccFilter, setVccListFilter] = useState([]);
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [filterShed, setFilterShed] = useState();
    const [vccDownload, setVccDownload] = useState([]);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchVaccinationRoute();
            fetchVaccinationAgeList();
            fetchVaccinationType();
            fetchSheds();
            fetchShedLotsMapList();
            fetchVaccinationList();
        }
        else {
            HandleLogout();
            history("/login");
        }
    }, []);



    useEffect((e) => {

        if (localStorage.getItem('token')) {

            fetchVaccinationTracker();
        }
        else {
            HandleLogout();
            history("/login");
        }
    }, [obj]);

    const fetchVaccinationTracker = async () => {
        setIsLoaded(true);
        fetch(process.env.REACT_APP_API + 'VaccinationTracker/GetVaccinationTracker',
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
                    setVaccinationTrackerList(data.Result);
                    setVccListFilter(data.Result);
                    setTotalPages(Math.ceil(data.Result.length / process.env.REACT_APP_PAGE_PAGINATION_NO));
                    setVccDownload(data.Result);
                    setIsLoaded(false);
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


    const fetchVaccinationType = async () => {
        fetch(process.env.REACT_APP_API + 'VaccinationTracker/GetVaccinationType',
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
                    setVaccinationTypeList(data.Result);
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


    const fetchVaccinationRoute = async () => {
        fetch(process.env.REACT_APP_API + 'VaccinationTracker/GetVaccinationRoute',
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
                    setVaccinationRouteList(data.Result);
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

    const fetchVaccinationList = async () => {
        fetch(process.env.REACT_APP_API + 'VaccinationTracker/GetVaccinationList',
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
                    setVaccinationList(data.Result);
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

    const fetchVaccinationAgeList = async () => {
        fetch(process.env.REACT_APP_API + 'VaccinationTracker/GetVaccinationAge',
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
                    setVaccinationAgeList(data.Result);
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

    const fetchSheds = () => {
        FetchShedsList(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setShedList(data.Result);
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


    const fetchShedLotsMapList = () => {
        FetchShedLotMapList(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setShedLotMapList(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
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


    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        ShedId: "",
        LotNo: "",
        VaccinationID: "",
        AgeID: "",
        TypeID: "",
        RouteID: "",
        Date: "",
        Comments: "",
        LotName: "",
        TotalBirds: "",
        AgeDays: "",
        AgeWeeks: "",
        LotDate: ""

    };

    const [vacctrackerdata, setVaccTrackerData] = useState(initialvalues);

    const clickAddVaccTracker = () => {
        setAddModalShow({ addModalShow: true });
        setVaccTrackerData({
            modaltitle: "Add Vaccination for Lot",
            Id: 0,
            ShedId: "",
            LotNo: "",
            VaccinationID: "",
            AgeID: "",
            TypeID: "",
            RouteID: "",
            Date: "",
            Comments: "",
            LotName: "",
            TotalBirds: "",
            AgeDays: "",
            AgeWeeks: "",
            LotDate: ""

        })
    }

    const clickEditVaccTracker = (md) => {
        setAddModalShow({ addModalShow: true });
        setVaccTrackerData({
            modaltitle: "Edit Vaccination for Lot",
            Id: md.Id,
            ShedId: md.ShedId,
            LotNo: md.LotId,
            VaccinationID: md.VaccinationID,
            AgeID: md.AgeID,
            TypeID: md.TypeID,
            RouteID: md.RouteID,
            Date: md.Date,
            Comments: md.Comments,
            LotName: md.LotName,
            TotalBirds: md.TotalBirds,
            AgeDays: md.AgeDays,
            AgeWeeks: md.AgeWeeks,
            LotDate: md.LotDate
        })
    }


    const onVaccinationChange = (e) => {
        setVaccTrackerData({ ...vacctrackerdata, VaccinationID: e.target.value });
    }

    const onAgeChange = (e) => {
        setVaccTrackerData({ ...vacctrackerdata, AgeID: e.target.value });
    }

    const onTypeChange = (e) => {
        setVaccTrackerData({ ...vacctrackerdata, TypeID: e.target.value });
    }

    const onRouteChange = (e) => {
        setVaccTrackerData({ ...vacctrackerdata, RouteID: e.target.value });
    }

    const onDateChange = (e) => {
        setVaccTrackerData({ ...vacctrackerdata, Date: e.target.value });
    }

    const onCommentsChange = (e) => {
        setVaccTrackerData({ ...vacctrackerdata, Comments: e.target.value });
    }

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
            FetchLotById(lotid, process.env.REACT_APP_API)
                .then(data => {
                    totalbirds = data.Result.TotalChicks - (data.Result.Mortality + data.Result.TotalMortality + data.Result.TotalBirdSale);
                    weeks = CalculateAgeInWeeks(data.Result.Date);
                    days = CalculateAgeInDays(data.Result.Date);
                    setVaccTrackerData({
                        ...vacctrackerdata, ShedId: shedid, LotNo: lotid,
                        LotName: lotname, TotalBirds: totalbirds,
                        AgeDays: days, AgeWeeks: weeks
                    });
                });
        }
        else {
            setVaccTrackerData({
                ...vacctrackerdata, ShedId: shedid,
                LotNo: lotid, LotName: lotname, TotalBirds: totalbirds,
                AgeDays: days, AgeWeeks: weeks
            });
        }
    }

    const deleteVaccTracker = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'VaccinationTracker/' + id, {
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
    const itemsPerPage = process.env.REACT_APP_PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = vaccinationtrackerlist.slice(startIndex, endIndex);
    if (itemsToDiaplay.length === 0 && vaccinationtrackerlist.length > 0) {
        setCurrentPage(currentPage - 1);
    }

    const handleAddVccTracker = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'VaccinationTracker/AddVaccinationTracker', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: vacctrackerdata.Id,
                    ShedId: vacctrackerdata.ShedId,
                    LotNo: vacctrackerdata.LotNo,
                    VaccinationID: vacctrackerdata.VaccinationID,
                    AgeID: vacctrackerdata.AgeID,
                    TypeID: vacctrackerdata.TypeID,
                    RouteID: vacctrackerdata.RouteID,
                    Date: vacctrackerdata.Date,
                    Comments: vacctrackerdata.Comments

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        setValidated(false);
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
    }

    const handleEditVccTracker = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'VaccinationTracker/UpdateVaccinationTracker', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: vacctrackerdata.Id,
                    ShedId: vacctrackerdata.ShedId,
                    LotNo: vacctrackerdata.LotNo,
                    VaccinationID: vacctrackerdata.VaccinationID,
                    AgeID: vacctrackerdata.AgeID,
                    TypeID: vacctrackerdata.TypeID,
                    RouteID: vacctrackerdata.RouteID,
                    Date: vacctrackerdata.Date,
                    Comments: vacctrackerdata.Comments

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info");
                        setValidated(false);
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
    }

    const onDateFilterFromChange = (e) => {
        setFilterFromDate(e.target.value);
        getFilterData(e.target.value, filterToDate, filterShed);
    }


    const getFilterData = (fromDate, toDate, shedid) => {
        let _filterList = [];
        if (fromDate !== "" && toDate !== "") {
            _filterList = vccFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate) && dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate === "" && toDate !== "") {
            _filterList = vccFilter.filter((c) => dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate !== "" && toDate === "") {
            _filterList = vccFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate));
        }
        else {
            _filterList = vccFilter;
        }

        if (shedid > 0) {
            _filterList = _filterList.filter((c) => c.ShedId === parseInt(shedid));
        }

        setVccDownload(_filterList);
        setVaccinationTrackerList(_filterList);
    }

    const onDateFilterToChange = (e) => {
        setFilterToDate(e.target.value);
        getFilterData(filterFromDate, e.target.value, filterShed);
    }

    const onShedFilterChange = (e) => {
        setFilterShed(e.target.value);
        getFilterData(filterFromDate, filterToDate, e.target.value)
    }

    let VccListDowanloadArr = [];
    const onDownloadExcel = () => {
        const vvv = vaccinationtrackerlist.map((p) => {
            const filterByShedId = shedlotmaplist.filter((c) => c.shedid === p.ShedId);
            const shedname = filterByShedId.length > 0 ? filterByShedId[0].shedname : "";

            const filterByVccId = vaccinationlist.filter((c) => c.id === p.VaccinationID);
            const vccname = filterByVccId.length > 0 ? filterByVccId[0].VaccinationName : "";

            const filterByVccTypeId = vaccinationtypelist.filter((c) => c.id === p.TypeID);
            const vcctypename = filterByVccTypeId.length > 0 ? filterByVccTypeId[0].TypeName : "";

            const filterByVccAgeId = vaccinationagelist.filter((c) => c.id === p.AgeID);
            const vccage = filterByVccAgeId.length > 0 ? filterByVccAgeId[0].Age : "";

            const filterByVccRoute = vaccinationroutelist.filter((c) => c.id === p.RouteID);
            const vccroute = filterByVccRoute.length > 0 ? filterByVccRoute[0].Route : "";

            p.AgeDays = CalculateAgeInDays(p.LotDate);
            p.AgeWeeks = CalculateAgeInWeeks(p.LotDate);

            return ({
                Date: moment(p.Date).format('DD-MMM-YYYY'),
                ShedName: shedname, LotName: p.LotName, Vaccination: vccname, Age: vccage, Type: vcctypename,
                Route: vccroute, Comments: p.Comments
            });
        });

        downloadExcel(vvv, "VaccinationTrackerList");
    }

    return (
        <div>
            {isloaded && <Loading />}
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <h2>Vaccination Tracker</h2>
            </div>
            <div className="container" style={{ marginTop: '30px' }}>
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
                </div>
            </div>

            <div className="row">
                <div className="col" style={{ textAlign: 'left', marginTop: '20px' }}>
                    <i className="fa-regular fa-file-excel fa-2xl" style={{ color: '#bea2a2' }} onClick={() => onDownloadExcel()} ></i>
                </div>
                <div className="col" style={{ textAlign: 'right', marginTop: '20px' }}>
                    <Button className="mr-2 btn-primary btn-primary-custom" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddVaccTracker()}>Add</Button>
                </div>

            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center' className="tr-custom">
                        <th>Date</th>
                        <th>Shed</th>
                        <th>Lot name</th>
                        <th>Vaccination</th>
                        <th>Age</th>
                        <th>Type</th>
                        <th>Route</th>
                        <th>Comments</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>

                    {

                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
                            const filterByShedId = shedlotmaplist.filter((c) => c.shedid === p.ShedId);
                            const shedname = filterByShedId.length > 0 ? filterByShedId[0].shedname : "";

                            const filterByVccId = vaccinationlist.filter((c) => c.id === p.VaccinationID);
                            const vccname = filterByVccId.length > 0 ? filterByVccId[0].VaccinationName : "";

                            const filterByVccTypeId = vaccinationtypelist.filter((c) => c.id === p.TypeID);
                            const vcctypename = filterByVccTypeId.length > 0 ? filterByVccTypeId[0].TypeName : "";

                            const filterByVccAgeId = vaccinationagelist.filter((c) => c.id === p.AgeID);
                            const vccage = filterByVccAgeId.length > 0 ? filterByVccAgeId[0].Age : "";

                            const filterByVccRoute = vaccinationroutelist.filter((c) => c.id === p.RouteID);
                            const vccroute = filterByVccRoute.length > 0 ? filterByVccRoute[0].Route : "";
                            p.AgeDays = CalculateAgeInDays(p.LotDate);
                            p.AgeWeeks = CalculateAgeInWeeks(p.LotDate);

                            VccListDowanloadArr.push({
                                Date: moment(p.Date).format('DD-MMM-YYYY'),
                                ShedName: shedname, LotName: p.LotName, Vaccination: vccname, Age: vccage, Type: vcctypename,
                                Route: vccroute, Comments: p.Comments
                            });

                            return (
                                !isloaded && <tr align='center' style={{fontSize:13}} key={p.Id}>
                                    <td >{moment(p.Date).format('DD-MMM-YYYY')}</td>
                                    <td >{shedname}</td>
                                    <td >{p.LotName}</td>
                                    <td >{vccname}</td>
                                    <td >{vccage}</td>
                                    <td >{vcctypename}</td>
                                    <td >{vccroute}</td>
                                    <td >{p.Comments}</td>
                                    <td align='center'>
                                        {
                                            <ButtonToolbar>
                                                <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditVaccTracker(p)}></i>
                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteVaccTracker(p.Id)}></i>}
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
                vaccinationtrackerlist && vaccinationtrackerlist.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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
                                        <Form.Group controlId="Date" as={Col} >
                                            <Form.Label>Date*</Form.Label>
                                            <Form.Control type="text" name="Id" hidden disabled value={vacctrackerdata.Id} />
                                            <DateComponent date={null} onChange={onDateChange} isRequired={true} value={vacctrackerdata.Date} />
                                            <Form.Control.Feedback type="invalid">
                                                Please select date
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="ShedId" as={Col} >
                                            <Form.Label>Shed*</Form.Label>
                                            <Form.Select aria-label="Default select example"
                                                onChange={onShedChange} required>
                                                <option selected disabled value="">Choose...</option>
                                                {
                                                    shedlist.map((item) => {
                                                        return (
                                                            <option
                                                                key={item.ShedId}
                                                                defaultValue={item.ShedId == null ? null : item.ShedId}
                                                                selected={item.ShedId === vacctrackerdata.ShedId}
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
                                        <Form.Control type="text" name="LotNo" hidden disabled value={vacctrackerdata.LotNo} />
                                        <InputField controlId="LotName"
                                            label="Lot name*"
                                            type="text"
                                            value={vacctrackerdata.LotName}
                                            name="LotName"
                                            placeholder="Lot name"
                                            errormessage="Please provide lot name"
                                            required={true}
                                            disabled={true}
                                        />

                                        <InputField controlId="Age"
                                            label="Age (days/week)"
                                            type="text"
                                            value={vacctrackerdata.AgeDays + " / " + vacctrackerdata.AgeWeeks}
                                            name="Age"
                                            placeholder="Age"
                                            errormessage="Please enter age in days/weeks"
                                            required={true}
                                            disabled={true}
                                        />

                                        <InputField controlId="TotalBirds"
                                            label="Total birds"
                                            type="number"
                                            value={vacctrackerdata.TotalBirds}
                                            name="TotalBirds"
                                            placeholder="TotalBirds"
                                            errormessage="Please enter total birds"
                                            required={true}
                                            disabled={true}
                                        />
                                    </Row>
                                    <Row className="mb-12">
                                        <Form.Group controlId="VaccinationID" as={Col} >
                                            <Form.Label>Vaccination*</Form.Label>
                                            <Form.Select aria-label="Default select example"
                                                onChange={onVaccinationChange} required>
                                                <option selected disabled value="">Choose...</option>
                                                {
                                                    vaccinationlist.map((item) => {
                                                        return (
                                                            <option
                                                                key={item.id}
                                                                defaultValue={item.id == null ? null : item.id}
                                                                selected={item.id === vacctrackerdata.VaccinationID}
                                                                value={item.id}
                                                            >{item.VaccinationName}</option>
                                                        );
                                                    })
                                                }
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select vaccination name
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="AgeID" as={Col} >
                                            <Form.Label>Age*</Form.Label>
                                            <Form.Select aria-label="Default select example"
                                                onChange={onAgeChange} required>
                                                <option selected disabled value="">Choose...</option>
                                                {
                                                    vaccinationagelist.map((item) => {
                                                        return (
                                                            <option
                                                                key={item.id}
                                                                defaultValue={item.id == null ? null : item.id}
                                                                selected={item.id === vacctrackerdata.AgeID}
                                                                value={item.id}
                                                            >{item.Age}</option>
                                                        );
                                                    })
                                                }
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select age category
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="TypeID" as={Col} >
                                            <Form.Label>Type*</Form.Label>
                                            <Form.Select aria-label="Default select example"
                                                onChange={onTypeChange} required>
                                                <option selected disabled value="">Choose...</option>
                                                {
                                                    vaccinationtypelist.map((item) => {
                                                        return (
                                                            <option
                                                                key={item.id}
                                                                defaultValue={item.id == null ? null : item.id}
                                                                selected={item.id === vacctrackerdata.TypeID}
                                                                value={item.id}
                                                            >{item.TypeName}</option>
                                                        );
                                                    })
                                                }
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select type
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                    </Row>

                                    <Row className="mb-12">
                                        <Form.Group controlId="RouteID" as={Col} >
                                            <Form.Label>Route*</Form.Label>
                                            <Form.Select aria-label="Default select example"
                                                onChange={onRouteChange} required>
                                                <option selected disabled value="">Choose...</option>
                                                {
                                                    vaccinationroutelist.map((item) => {
                                                        return (
                                                            <option
                                                                key={item.id}
                                                                defaultValue={item.id == null ? null : item.id}
                                                                selected={item.id === vacctrackerdata.RouteID}
                                                                value={item.id}
                                                            >{item.Route}</option>
                                                        );
                                                    })
                                                }
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select route
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-12">
                                        <Form.Group controlId="Comments" as={Col} >
                                            <Form.Label>Comments</Form.Label>
                                            <Form.Control as="textarea" rows={3} name="Comments" onChange={onCommentsChange} value={vacctrackerdata.Comments}
                                                placeholder="Comments" />
                                        </Form.Group>
                                    </Row>

                                    <Form.Group as={Col}>
                                        {vacctrackerdata.Id <= 0 ?

                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleAddVccTracker(e)}>
                                                Add
                                            </Button>
                                            : null
                                        }

                                        {vacctrackerdata.Id > 0 ?

                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleEditVccTracker(e)}>
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


        </div>
    )
}

export default ChicksVaccinationTracker
