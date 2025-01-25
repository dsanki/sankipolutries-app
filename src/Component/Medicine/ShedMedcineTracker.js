import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import {
    FetchSheds, FecthStockListById, CalculateAgeInWeeks, CalculateAgeInDays,
    FetchShedLotMapList, dateyyyymmdd, downloadExcel, HandleLogout,
    NumberInputKeyDown, FetchShedsList, FetchLotById,CalculateAgeInWeeksUpdated, CalculateNoOfDaysUpdated
} from '../../Utility';
//import { FetchUnit, FetchShedsList, FetchLots, FetchLotById  } from '../../Utility'
import Loading from '../Loading/Loading'

function ShedMedcineTracker(props) {

    let history = useNavigate();

    const [medicinetrackerlist, setMedicineTrackerList] = useState([]);
    const [medicinelist, setMedicineList] = useState([]);
    const [shedlotmaplist, setShedLotMapList] = useState([]);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [shedlist, setShedList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isloaded, setIsLoaded] = useState(true);
    const [stocklist, setStockList] = useState([]);
    const [medicineFilter, setMedicineListFilter] = useState([]);
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [filterShed, setFilterShed] = useState();
    const [medicineDownload, setMedicineDownload] = useState([]);


    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchSheds();
            fetchShedLotsMapList();
            fetchMedicineList();
            fetchStockListById(process.env.REACT_APP_STOCK_CAT_MEDICINE);
            //fetchShedLotMapList();
        }
        else {
            HandleLogout();
            history("/login");
        }
    }, []);



    useEffect((e) => {

        if (localStorage.getItem('token')) {

            fetchMedicineTracker();
        }
        else {
            HandleLogout();
            history("/login");
        }
    }, [obj]);

    const fetchMedicineTracker = async () => {
        setIsLoaded(true);
        fetch(process.env.REACT_APP_API + 'Medicine/GetMedicineTracker?CompanyId=' +
            localStorage.getItem('companyid'),
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
                    setMedicineTrackerList(data.Result);
                    setMedicineListFilter(data.Result);
                    setTotalPages(Math.ceil(data.Result.length / process.env.REACT_APP_PAGE_PAGINATION_NO));
                    setMedicineDownload(data.Result);
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

    const fetchMedicineList = async () => {
        fetch(process.env.REACT_APP_API + 'Medicine/GetMedicineListByCompanyId?CompanyId='
            + localStorage.getItem('companyid'),
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


    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        ShedId: "",
        LotNo: "",
        MedicineID: "",
        Dose: "",
        Date: "",
        Comments: "",
        LotName: "",
        TotalBirds: "",
        AgeDays: "",
        AgeWeeks: "",
        LotDate: ""
    };

    const [medicinetrackerdata, setMedicineTrackerData] = useState(initialvalues);

    const clickAddMedicineTracker = () => {
        setAddModalShow({ addModalShow: true });
        setMedicineTrackerData({
            modaltitle: "Add Vaccination for Lot",
            Id: 0,
            ShedId: "",
            LotNo: "",
            MedicineID: "",
            Dose: "",
            Date: "",
            Comments: "",
            LotName: "",
            TotalBirds: "",
            AgeDays: "",
            AgeWeeks: "",
            LotDate: ""

        })
    }

    const clickEditMedicineTracker = (md) => {
        setAddModalShow({ addModalShow: true });
        setMedicineTrackerData({
            modaltitle: "Edit Vaccination for Lot",
            Id: md.Id,
            ShedId: md.ShedId,
            LotNo: md.LotId,
            MedicineID: md.MedicineID,
            Dose: md.Dose,
            Date: md.Date,
            Comments: md.Comments,
            LotName: md.LotName,
            TotalBirds: md.TotalBirds,
            AgeDays: md.AgeDays,
            AgeWeeks: md.AgeWeeks,
            LotDate: md.LotDate
        })
    }

    const onMedicineChange = (e) => {

        let stk = stocklist.filter(x => x.ItemId === parseInt(e.target.value));
        setMedicineTrackerData({
            ...medicinetrackerdata, MedicineID: e.target.value,
            MedicineName: stk[0].ItemName
        });
    }

  const [_lotdetails, setLotDetails] = useState();
    const onDateChange = (e) => {
        let days = "";
        let weeks = "";

        if (_lotdetails != null && (_lotdetails.Date != null || _lotdetails.Date != "")) {
                    if(e.target.value != "")
                    {
                        weeks = CalculateAgeInWeeksUpdated(_lotdetails.Date, e.target.value);
                        days = CalculateNoOfDaysUpdated(_lotdetails.Date, e.target.value);
                    }
                    else{
                        weeks = CalculateAgeInWeeksUpdated(_lotdetails.Date, new Date());
                        days = CalculateNoOfDaysUpdated(_lotdetails.Date, new Date());
                    }
                }

                setMedicineTrackerData({ ...medicinetrackerdata, Date: e.target.value, 
                    AgeDays: days, AgeWeeks: weeks });
    }

    const onCommentsChange = (e) => {
        setMedicineTrackerData({ ...medicinetrackerdata, Comments: e.target.value });
    }

    const onDoseChange = (e) => {
        setMedicineTrackerData({ ...medicinetrackerdata, Dose: e.target.value });
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

                    setLotDetails(data.Result);
                    totalbirds = data.Result.TotalChicks -
                        (data.Result.Mortality + data.Result.TotalMortality
                            + data.Result.TotalBirdSale);

                    if (medicinetrackerdata.Date != null && medicinetrackerdata.Date != "") {
                        weeks = CalculateAgeInWeeksUpdated(data.Result.Date, medicinetrackerdata.Date,);
                        days = CalculateNoOfDaysUpdated(data.Result.Date, medicinetrackerdata.Date);
                    }
                    else {
                        weeks = CalculateAgeInWeeksUpdated(data.Result.Date, new Date());
                        days = CalculateNoOfDaysUpdated(data.Result.Date, new Date());
                    }

                    //weeks = CalculateAgeInWeeks(data.Result.Date);
                    //days = CalculateAgeInDays(data.Result.Date);
                    setMedicineTrackerData({
                        ...medicinetrackerdata, ShedId: shedid, LotNo: lotid,
                        LotName: lotname, TotalBirds: totalbirds,
                        AgeDays: days, AgeWeeks: weeks
                    });
                });
        }
        else {
            setMedicineTrackerData({
                ...medicinetrackerdata, ShedId: shedid,
                LotNo: lotid, LotName: lotname, TotalBirds: totalbirds,
                AgeDays: days, AgeWeeks: weeks
            });
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
    const itemsToDiaplay = medicinetrackerlist.slice(startIndex, endIndex);
    if (itemsToDiaplay.length === 0 && medicinetrackerlist.length > 0) {
        setCurrentPage(currentPage - 1);
    }


    const handleAddMedicineTracker = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'Medicine/AddMedicineTracker', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: medicinetrackerdata.Id,
                    ShedId: medicinetrackerdata.ShedId,
                    MedicineID: medicinetrackerdata.MedicineID,
                    Dose: medicinetrackerdata.Dose,
                    Date: medicinetrackerdata.Date,
                    Comments: medicinetrackerdata.Comments,
                    TotalBirds: medicinetrackerdata.TotalBirds,
                    CompanyId: localStorage.getItem('companyid')

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

    const handleEditMedicineTracker = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'Medicine/UpdateMedicineTracker', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: medicinetrackerdata.Id,
                    ShedId: medicinetrackerdata.ShedId,
                    MedicineID: medicinetrackerdata.MedicineID,
                    Dose: medicinetrackerdata.Dose,
                    Date: medicinetrackerdata.Date,
                    Comments: medicinetrackerdata.Comments,
                    TotalBirds: medicinetrackerdata.TotalBirds,
                    CompanyId: localStorage.getItem('companyid')

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
            _filterList = medicineFilter.filter((c) => dateyyyymmdd(c.Date) >=
                dateyyyymmdd(fromDate) && dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate === "" && toDate !== "") {
            _filterList = medicineFilter.filter((c) => dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate !== "" && toDate === "") {
            _filterList = medicineFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate));
        }
        else {
            _filterList = medicineFilter;
        }

        if (shedid > 0) {
            _filterList = _filterList.filter((c) => c.ShedId === parseInt(shedid));
        }

        setMedicineDownload(_filterList);
        setMedicineTrackerList(_filterList);
    }

    const onDateFilterToChange = (e) => {
        setFilterToDate(e.target.value);
        getFilterData(filterFromDate, e.target.value, filterShed);
    }

    const onShedFilterChange = (e) => {
        setFilterShed(e.target.value);
        getFilterData(filterFromDate, filterToDate, e.target.value)
    }

    let medicineListDowanloadArr = [];
    const onDownloadExcel = () => {
        const vvv = medicinetrackerlist.map((p) => {
            const filterByShedId = shedlotmaplist.filter((c) => c.shedid === p.ShedId);
            const shedname = filterByShedId.length > 0 ? filterByShedId[0].shedname : "";

            const filterByMedicineId = medicinelist.filter((c) => c.id === p.MedicineID);
            const medicinename = ""; //filterByMedicineId.length > 0 ? filterByMedicineId[0].MedicineName : "";

            p.AgeDays = CalculateAgeInDays(p.LotDate);
            p.AgeWeeks = CalculateAgeInWeeks(p.LotDate);

            return ({
                Date: moment(p.Date).format('DD-MMM-YYYY'),
                ShedName: shedname, LotName: p.LotName,
                Medicine: medicinename, Comments: p.Comments
            });
        });

        downloadExcel(vvv, "MedicineTrackerList");
    }

    const deleteMedicineTracker = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'Medicine/DeleteMedicineTracker/?id=' + id, {
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

    const fetchShedLotMapList = async () => {
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



    return (
        <div>
            {isloaded && <Loading />}
            <div className="row justify-content-center"
                style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <h2>Medicine Tracker</h2>
            </div>
            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row align-items-center">
                    <div className="col-2">
                        <p style={{ fontSize: '13px' }}><strong>From</strong></p>
                        <DateComponent date={null} onChange={onDateFilterFromChange}
                            isRequired={false} value={filterFromDate} />
                    </div>
                    <div className="col-2">
                        <p style={{ fontSize: '13px' }}><strong>To</strong></p>
                        <DateComponent date={null} onChange={onDateFilterToChange}
                            isRequired={false} value={filterToDate} />
                    </div>
                    <div className="col-2">
                        <p style={{ fontSize: '13px' }}><strong>Shed</strong></p>
                        <Form.Select aria-label="Default select example" style={{ fontSize: '13px' }}
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
                    <div className="col-6" style={{ textAlign: 'right', marginTop: '38px' }}>
                        <i className="fa-regular fa-file-excel fa-2xl" style={{ color: '#bea2a2', marginRight: 30 }}
                            onClick={() => onDownloadExcel()} ></i>
                        <Button className="mr-2 btn-primary btn-primary-custom" variant="primary"
                            style={{ marginRight: "17.5px" }}
                            onClick={() => clickAddMedicineTracker()}>Add</Button>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col" style={{ textAlign: 'left', marginTop: '20px' }}>

                </div>
                <div className="col" style={{ textAlign: 'right', marginTop: '20px' }}>

                </div>

            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center' className="tr-custom">
                        <th>Date</th>
                        <th>Shed</th>
                        {/* <th>Lot name</th> */}
                        <th>Medicine</th>
                        <th>Dose</th>
                        <th>Comments</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>

                    {

                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {

                            const filterByShedId = shedlotmaplist.filter((c) => c.shedid === p.ShedId);
                            const shedname = filterByShedId.length > 0 ? filterByShedId[0].shedname : "";
                            const filterByMedicineId = stocklist.filter(x => x.ItemId === parseInt(p.MedicineID));
                            //const filterByMedicineId = medicinelist.filter((c) => c.id === p.MedicineID);
                            const medicinename = filterByMedicineId.length > 0 ? filterByMedicineId[0].ItemName : "";



                            if (p.Date != null && p.Date != "") {
                                p.AgeWeeks = CalculateAgeInWeeksUpdated(p.ChicksDate, p.Date);
                                p.AgeDays = CalculateNoOfDaysUpdated(p.ChicksDate, p.Date);
                            }

                           // p.AgeDays = CalculateAgeInDays(p.ChicksDate);
                            //p.AgeWeeks = CalculateAgeInWeeks(p.ChicksDate);



                            medicineListDowanloadArr.push({
                                Date: moment(p.Date).format('DD-MMM-YYYY'),
                                ShedName: shedname,
                                LotName: p.LotName,
                                Medicine: medicinename,
                                Dose: p.Dose,
                                Comments: p.Comments
                            });

                            return (
                                !isloaded && <tr align='center' style={{ fontSize: 13 }} key={p.Id}>
                                    <td >{moment(p.Date).format('DD-MMM-YYYY')}</td>
                                    <td >{shedname}</td>
                                    {/* <td >{p.LotName}</td> */}
                                    <td >{medicinename}</td>
                                    <td >{p.Dose}</td>
                                    <td >{p.Comments}</td>
                                    <td align='center'>
                                        {
                                            <ButtonToolbar>
                                                <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditMedicineTracker(p)}></i>
                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteMedicineTracker(p.Id)}></i>}
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
                medicinetrackerlist && medicinetrackerlist.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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
                                            <Form.Label style={{ fontSize: '13px' }}>Date*</Form.Label>
                                            <Form.Control type="text" name="Id"
                                                hidden disabled value={medicinetrackerdata.Id} />
                                            <DateComponent date={null} onChange={onDateChange}
                                                isRequired={true} value={medicinetrackerdata.Date} />
                                            <Form.Control.Feedback type="invalid">
                                                Please select date
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="ShedId" as={Col} >
                                            <Form.Label style={{ fontSize: '13px' }}>Shed*</Form.Label>
                                            <Form.Select aria-label="Default select example"
                                                onChange={onShedChange} style={{ fontSize: '13px' }} required>
                                                <option selected disabled value="">Choose...</option>
                                                {
                                                    shedlist.map((item) => {
                                                        return (
                                                            <option
                                                                key={item.ShedId}
                                                                defaultValue={item.ShedId == null ? null : item.ShedId}
                                                                selected={item.ShedId === medicinetrackerdata.ShedId}
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
                                        <Form.Control type="text" name="LotNo" hidden
                                            disabled value={medicinetrackerdata.LotNo} />
                                        <InputField controlId="LotName"
                                            label="Lot name*"
                                            type="text"
                                            value={medicinetrackerdata.LotName}
                                            name="LotName"
                                            placeholder="Lot name"
                                            errormessage="Please provide lot name"
                                            required={true}
                                            disabled={true}
                                        />

                                        <InputField controlId="Age"
                                            label="Age (days/week)"
                                            type="text"
                                            value={medicinetrackerdata.AgeDays + " / " + medicinetrackerdata.AgeWeeks}
                                            name="Age"
                                            placeholder="Age"
                                            errormessage="Please enter age in days/weeks"
                                            required={true}
                                            disabled={true}
                                        />

                                        <InputField controlId="TotalBirds"
                                            label="Total birds"
                                            type="number"
                                            value={medicinetrackerdata.TotalBirds}
                                            name="TotalBirds"
                                            placeholder="TotalBirds"
                                            errormessage="Please enter total birds"
                                            required={true}
                                            disabled={true}
                                        />
                                    </Row>
                                    <Row className="mb-12">
                                        <Form.Group controlId="MedicineID" as={Col} >
                                            <Form.Label style={{ fontSize: '13px' }}>Medicine*</Form.Label>
                                            <Form.Select style={{ fontSize: '13px' }}
                                                onChange={onMedicineChange} required>
                                                <option selected disabled value="">Choose...</option>
                                                {

                                                    stocklist.map((item) => {
                                                        return (
                                                            <option
                                                                key={item.ItemId}
                                                                defaultValue={item.ItemId == null ? null : item.ItemId}
                                                                selected={item.ItemId === medicinetrackerdata.MedicineID}
                                                                value={item.ItemId}
                                                            >{item.ItemName}</option>
                                                        );
                                                    })
                                                    // medicinelist.map((item) => {
                                                    //     return (
                                                    //         <option
                                                    //             key={item.id}
                                                    //             defaultValue={item.id == null ? null : item.id}
                                                    //             selected={item.id === medicinetrackerdata.MedicineID}
                                                    //             value={item.id}
                                                    //         >{item.MedicineName}</option>
                                                    //     );
                                                    // })
                                                }
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select Medicine name
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <InputField controlId="Dose"
                                            label="Dose"
                                            type="text"
                                            value={medicinetrackerdata.Dose}
                                            name="Dose"
                                            placeholder="Dose"
                                            errormessage="Please enter dose"
                                            required={true}
                                            disabled={false}
                                            onChange={onDoseChange}
                                        />

                                    </Row>

                                    <Row className="mb-12">
                                        <Form.Group controlId="Comments" as={Col} >
                                            <Form.Label style={{ fontSize: '13px' }}>Comments</Form.Label>
                                            <Form.Control as="textarea" rows={3} 
                                            name="Comments" onChange={onCommentsChange} 
                                            value={medicinetrackerdata.Comments} style={{ fontSize: '13px' }}
                                                placeholder="Comments" />
                                        </Form.Group>
                                    </Row>

                                    <Form.Group as={Col}>
                                        {medicinetrackerdata.Id <= 0 ?

                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleAddMedicineTracker(e)}>
                                                Add
                                            </Button>
                                            : null
                                        }

                                        {medicinetrackerdata.Id > 0 ?

                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleEditMedicineTracker(e)}>
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

export default ShedMedcineTracker
