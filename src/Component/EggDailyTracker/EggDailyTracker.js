import React, { useState, useEffect, useMemo } from 'react'
//import { variables } from './../../Variables'
import { Button, ButtonToolbar, Table, Modal, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import EggCategoryWiseCount from '../ReuseableComponent/EggCategoryWiseCount'


import DateComponent from '../DateComponent';
import {
    CalculateAgeInDays, CalculateAgeInWeeks, dateyyyymmdd, FetchLotById,
    HandleLogout, FetchShedsList, FetchShedLotMapList, downloadExcel
} from './../../Utility'
import Loading from '../Loading/Loading'

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
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [filterShed, setFilterShed] = useState();
    const [isloaded, setIsLoaded] = useState(true);
    const [companydetails, setCompanyDetails] = useState(JSON.parse(localStorage.getItem('companydetails')));

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
        AgeWeeks: "",
        EggBig: "",
        EggCp: "",
        EggMcp: "",
        EggScp: "",
        BirdWeight: "",
        EggPack: "",
        EggLose: "",
        FeedConsume: ""
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
            LotName: "",
            EggBig: "",
            EggCp: "",
            EggMcp: "",
            EggScp: "",
            BirdWeight: "",
            EggPack: "",
            EggLose: "",
            FeedConsume: ""
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
            LotName: egg.LotName,
            EggBig: egg.EggBig,
            EggCp: egg.EggCp,
            EggMcp: egg.EggMcp,
            EggScp: egg.EggScp,
            BirdWeight: egg.BirdWeight,
            EggPack: egg.EggPack,
            EggLose: egg.EggLose,
            FeedConsume: egg.FeedConsume
        })
    }

    const onDateChange = (e) => {
        setEggData({ ...eggdata, Date: e.target.value });
    }

    const onEggBigChange = (e) => {
        const re = /^[0-9\b]+$/;
        let _total = e.target.value;
        if (_total === '' || re.test(_total)) {
            setEggData({ ...eggdata, EggBig: e.target.value });
        }
    }

    const onEggPackChange = (e) => {
        const re = /^[0-9\b]+$/;
        let _total = e.target.value;
        let totaleggs = "";

        if (_total === "" && eggdata.EggLose === "") {
            totaleggs = "";
        }

        else {
            totaleggs = parseInt(_total || 0) * 210 + (parseInt(eggdata.EggLose || 0));
        }
        if (_total === '' || re.test(_total)) {

            let percentage = ((totaleggs / eggdata.TotalBirds) * 100);
            setEggData({
                ...eggdata, EggPack: e.target.value,
                TotalEggs: totaleggs,
                // TotalEggs:(parseInt(totaleggs||0)*210 +
                // parseInt(eggdata.EggLose||0))==0?"":(parseInt(totaleggs||0)*210 
                // +parseInt(eggdata.EggLose||0)),
                OkEggs: (totaleggs - parseInt(eggdata.BrokenEggs || 0)) < 0 ? "" : (totaleggs - parseInt(eggdata.BrokenEggs || 0)),
                ProductionPercentage: percentage == 0 ? 0 : percentage.toFixed(2)

            });
        }
    }

    const onEggLoseChange = (e) => {
        const re = /^[0-9\b]+$/;
        let _total = e.target.value;
        let totaleggs = "";
        if (_total === "" && eggdata.EggPack === "") {
            totaleggs = "";
        }
        else {
            totaleggs = parseInt(eggdata.EggPack || 0) * 210 + (parseInt(_total || 0));
        }

        if (_total === '' || re.test(_total)) {
            let percentage = ((totaleggs / eggdata.TotalBirds) * 100);
            setEggData({
                ...eggdata, EggLose: e.target.value,
                TotalEggs: totaleggs,
                OkEggs: (totaleggs - eggdata.BrokenEggs) < 0 ? "" : (totaleggs - eggdata.BrokenEggs),
                ProductionPercentage: percentage == 0 ? 0 : percentage.toFixed(2)
            });
        }
    }

    const onTotalEggsChange = (e) => {
        const re = /^[0-9\b]+$/;
        let _total = e.target.value;

        if (_total === '' || re.test(_total)) {
            setEggData({
                ...eggdata, TotalEggs: e.target.value,
                OkEggs: _total - eggdata.BrokenEggs,
                ProductionPercentage: ((_total / eggdata.TotalBirds) * 100).toFixed(2)
            });
        }
    }

    const onEggCpChange = (e) => {
        const re = /^[0-9\b]+$/;
        let _total = e.target.value;
        if (_total === '' || re.test(_total)) {
            setEggData({ ...eggdata, EggCp: e.target.value });
        }
    }

    const onEggLcpChange = (e) => {
        const re = /^[0-9\b]+$/;
        let _total = e.target.value;
        if (_total === '' || re.test(_total)) {
            setEggData({ ...eggdata, EggScp: e.target.value });
        }
    }

    const onEggMcpChange = (e) => {
        const re = /^[0-9\b]+$/;
        let _total = e.target.value;
        if (_total === '' || re.test(_total)) {
            setEggData({ ...eggdata, EggMcp: e.target.value });
        }
    }

    const onBrokenEggsChange = (e) => {
        const re = /^[0-9\b]+$/;
        let _brokenegg = e.target.value;

        // let totaleggs="";
        // if(_brokenegg==="")
        // {
        //     totaleggs="";
        // }
        // else{
        //     totaleggs=parseInt(eggdata.EggPack||0)*210 +(parseInt(_total||0));
        // }
        if (_brokenegg === '' || re.test(_brokenegg)) {
            setEggData({
                ...eggdata, BrokenEggs: _brokenegg,
                OkEggs: (eggdata.TotalEggs - _brokenegg) < 0 ? "" : (eggdata.TotalEggs - _brokenegg),
                ProductionPercentage: ((eggdata.TotalEggs / eggdata.TotalBirds) * 100).toFixed(2)
            });
        }
    }

    const onFeedIntechChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setEggData({ ...eggdata, FeedIntech: e.target.value });
        }
    }

    const onFeedConsumeChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        let totalfeedbags = e.target.value;
        if (totalfeedbags === '' || re.test(totalfeedbags)) {
            setEggData({
                ...eggdata, FeedConsume: totalfeedbags,
                FeedIntech: Math.round((((totalfeedbags / 2) * 100000) / eggdata.TotalBirds))
            });
        }
    }

    const onBirdWeightChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setEggData({ ...eggdata, BirdWeight: e.target.value });
        }
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
            FetchLotById(lotid, process.env.REACT_APP_API)
                .then(data => {
                    setLotDetails(data.Result);
                    totalbirds = data.Result.TotalChicks - (data.Result.Mortality + data.Result.TotalMortality + data.Result.TotalBirdSale);
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
            fetchSheds();
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, []);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchEggDailyTrackerList();
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);

    


    const fetchSheds = async () => {
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

    const fetchEggDailyTrackerList = async () => {
        setIsLoaded(true);
        fetch(process.env.REACT_APP_API + 'EggProductionDailyTracker/GetEggDailyTrackerList?CompanyId=' + parseInt(localStorage.getItem('companyid')),
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
                    setTotalPages(Math.ceil(data.Result.length / process.env.REACT_APP_PAGE_PAGINATION_NO));
                    setIsLoaded(false);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found GetEggDailyTrackerList!!", "danger")
                }
                else {
                    props.showAlert("Error occurred GetEggDailyTrackerList!!", "danger")
                }
            });

        setIsLoaded(false);
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
    const itemsToDiaplay = eggtrackerlist.slice(startIndex, endIndex);
    if (itemsToDiaplay.length === 0 && eggtrackerlist.length > 0) {
        setCurrentPage(currentPage - 1);
    }

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    const deleteTracker = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'EggProductionDailyTracker/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then((data) => {
                    if (data.StatusCode === 200) {
                        addCount(count);
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

            fetch(process.env.REACT_APP_API + 'EggProductionDailyTracker/EggProductionDailyTrackerAdd', {
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
                    ProductionPercentage: eggdata.ProductionPercentage,
                    EggBig: eggdata.EggBig,
                    EggCp: eggdata.EggCp,
                    EggMcp: eggdata.EggMcp,
                    EggScp: eggdata.EggScp,
                    BirdWeight: eggdata.BirdWeight,
                    EggPack: eggdata.EggPack,
                    EggLose: eggdata.EggLose,
                    FeedConsume: eggdata.FeedConsume,
                    CompanyId: localStorage.getItem('companyid')

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
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

    const handleEditEggTracker = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'EggProductionDailyTracker/EggProductionDailyTrackerUpdate', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                    'Access-Control-Allow-Origin': '*',
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
                    ProductionPercentage: eggdata.ProductionPercentage,
                    EggBig: eggdata.EggBig,
                    EggCp: eggdata.EggCp,
                    EggMcp: eggdata.EggMcp,
                    EggScp: eggdata.EggScp,
                    BirdWeight: eggdata.BirdWeight,
                    EggPack: eggdata.EggPack,
                    EggLose: eggdata.EggLose,
                    FeedConsume: eggdata.FeedConsume,
                    CompanyId: localStorage.getItem('companyid')

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
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

    const onDateFilterFromChange = (e) => {
        setFilterFromDate(e.target.value);
        getFilterData(e.target.value, filterToDate, filterShed);
    }

    const getFilterData = (fromDate, toDate, shedid) => {
        let _filterList = [];
        if (fromDate !== "" && toDate !== "") {
            _filterList = eggtrackerlistForFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate) && dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate === "" && toDate !== "") {
            _filterList = eggtrackerlistForFilter.filter((c) => dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
        }
        else if (fromDate !== "" && toDate === "") {
            _filterList = eggtrackerlistForFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate));
        }
        else {
            _filterList = eggtrackerlistForFilter;
        }

        if (shedid > 0) {
            _filterList = _filterList.filter((c) => c.ShedId === parseInt(shedid));
        }
        setEggDailyTrackerList(_filterList);
    }

    const onDateFilterToChange = (e) => {
        setFilterToDate(e.target.value);
        getFilterData(filterFromDate, e.target.value, filterShed);
    }

    const onShedFilterChange = (e) => {
        setFilterShed(e.target.value);
        getFilterData(filterFromDate, filterToDate, e.target.value)
    }

    const onDownloadExcel = () => {
        const _list = eggtrackerlist.map((p) => {
            const filterByShedId = shedlotmaplist.filter((c) => c.shedid === p.ShedId);
            const shedname = filterByShedId.length > 0 ? filterByShedId[0].shedname : "";

            const AgeDays = CalculateAgeInDays(p.LotDate);
            const AgeWeeks = CalculateAgeInWeeks(p.LotDate);

            return ({
                Date: moment(p.Date).format('DD-MMM-YYYY'),
                ShedName: shedname, LotName: p.LotName, Birds: p.TotalBirds, Eggs: p.TotalEggs, BrokenEggs: p.BrokenEggs,
                OKEggs: p.OkEggs,
                EggBig: p.EggBig,
                EggMcp: p.EggMcp, EggCp: p.EggCp, EggScp: p.EggScp,
                FeedIntech: p.FeedIntech, Age: AgeDays / AgeWeeks, ProductionPercentage: p.ProductionPercentage,

            });
        });

        downloadExcel(_list, "EggDailyTrackerList");
    }

    const [data, setData] = useState([{ category: "", pack: "", lose: "", count: "" }])

    const handleChange = (e, i) => {
        const { name, value } = e.target
        const onchangeVal = [...data]
        onchangeVal[i][name] = value
        setData(onchangeVal)
    }

    const handleDelete = (i) => {
        const deleteVal = [...data]
        deleteVal.splice(i, 1)
        setData(deleteVal)
    }

    const handleClick = (e) => {
        e.preventDefault();
        setData([...data, { category: "", pack: "", lose: "", count: "" }]);
    }

    return (
        <>
            {isloaded && <Loading />}
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h3>Daily Production Tracker</h3>
            </div>
            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row align-items-center">
                    <div className="col-2">
                        <p style={{ fontSize: '13px' }}><strong>From</strong></p>
                        <DateComponent date={null} onChange={onDateFilterFromChange} isRequired={false} value={filterFromDate} />
                    </div>
                    <div className="col-2">
                        <p style={{ fontSize: '13px' }}><strong>To</strong></p>
                        <DateComponent date={null} onChange={onDateFilterToChange} isRequired={false} value={filterToDate} />
                    </div>
                    <div className="col-2">
                        <p style={{ fontSize: '13px' }}><strong>Shed</strong></p>
                        <Form.Select aria-label="Default select example"
                            onChange={onShedFilterChange} style={{ fontSize: '13px' }}>
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
                    {/* <div className="col-2" style={{marginTop:'38px'}}>
                   
                    </div> */}
                    <div className="col-6" style={{ textAlign: 'right', marginTop: '38px' }}>
                        <i className="fa-regular fa-file-excel fa-2xl"
                            style={{ color: '#bea2a2', marginRight: 30 }}
                            onClick={() => onDownloadExcel()} ></i>
                        <Button className="mr-2" variant="primary"
                            style={{ marginRight: "17.5px" }}
                            onClick={() => clickAddEggProduction()}>Add</Button>
                    </div>
                </div>
            </div>

            {/* <div className="row">
                <div className="col" style={{ textAlign: 'left', marginTop: '20px' }}>
                   
                </div>
               
                <div className="col" style={{ textAlign: 'right', marginTop: '20px' }}>
                   
                </div>
            </div> */}

            {
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr align='center' className="tr-custom">
                            <th>Date</th>
                            <th>Shed</th>
                            <th>Birds</th>
                            <th>Eggs</th>
                            <th>Broken</th>
                            <th>OK</th>
                            <th>Big/Cp/Mcp/Scp </th>
                            <th>FConsume (bags)</th>
                            <th>FIntech</th>
                            <th>%</th>
                            <th>Wt(gm)</th>
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
                                    !isloaded && <tr key={egg.id} align='center' style={{ fontSize: 13 }} >
                                        <td align='center'>{moment(egg.Date).format('DD-MMM-YYYY')}</td>
                                        <td>{shedname}</td>




                                        <td>
                                            {new Intl.NumberFormat('en-IN', {
                                            }).format(parseInt(egg.TotalBirds))}

                                        </td>
                                        <td> {new Intl.NumberFormat('en-IN', {
                                        }).format(parseInt(egg.TotalEggs))}</td>
                                        <td>
                                            {new Intl.NumberFormat('en-IN', {
                                            }).format(parseInt(egg.BrokenEggs))}</td>
                                        <td> {new Intl.NumberFormat('en-IN', {
                                        }).format(parseInt(egg.OkEggs))}</td>

                                        <td>{egg.EggBig != null ? new Intl.NumberFormat('en-IN', {
                                        }).format(parseInt(egg.EggBig)) : 0}/{egg.EggCp != null ? new Intl.NumberFormat('en-IN', {
                                        }).format(parseInt(egg.EggCp)) : 0}/{egg.EggMcp != null ? new Intl.NumberFormat('en-IN', {
                                        }).format(parseInt(egg.EggMcp)) : 0}/{egg.EggScp != null ? new Intl.NumberFormat('en-IN', {
                                        }).format(parseInt(egg.EggScp)) : 0}</td>
                                        <td>{egg.FeedConsume}</td>
                                        <td>{egg.FeedIntech}</td>
                                        <td>{egg.ProductionPercentage}</td>
                                        <td>{egg.BirdWeight}</td>
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
                                <td style={{ textAlign: "center", fontSize:'13px' }} colSpan={14}>
                                    No Records
                                </td>
                            </tr>
                        }
                    </tbody>
                </Table >
            }
            {
                eggtrackerlist && eggtrackerlist.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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
                                            <Form.Label style={{ fontSize: '13px' }}>Date *</Form.Label>
                                            <Form.Control type="text" name="LotId" hidden disabled value={eggdata.LotId} />
                                            <DateComponent date={null} onChange={onDateChange} isRequired={true} value={eggdata.Date} />
                                            <Form.Control.Feedback type="invalid">
                                                Please select date
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="ShedId" as={Col} >
                                            <Form.Label style={{ fontSize: '13px' }}>Shed *</Form.Label>
                                            <Form.Select style={{ fontSize: '13px' }}
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
                                            label="Lot name *"
                                            type="text"
                                            value={eggdata.LotName}
                                            name="LotName"
                                            placeholder="Lot name"
                                            errormessage="Please provide lot name"
                                            required={true}
                                            disabled={true}
                                        />

                                        <InputField controlId="Age"
                                            label="Age (days/week) *"
                                            type="text"
                                            value={eggdata.AgeDays + " / " + eggdata.AgeWeeks}
                                            name="Age"
                                            placeholder="Age"
                                            errormessage="Please enter age in days/weeks"
                                            required={true}
                                            disabled={true}
                                        />

                                        <InputField controlId="TotalBirds"
                                            label="Total birds *"
                                            type="number"
                                            value={eggdata.TotalBirds}
                                            name="TotalBirds"
                                            placeholder="Total birds"
                                            errormessage="Please enter total birds"
                                            required={true}
                                            disabled={true}
                                        />
                                    </Row>
                                    <Row className="mb-12">
                                        <InputField controlId="EggPack"
                                            label="Egg Pack"
                                            type="number"
                                            value={eggdata.EggPack}
                                            name="EggPack"
                                            placeholder="Egg pack"
                                            errormessage="Please enter egg pack"
                                            required={true}
                                            disabled={false}
                                            onChange={onEggPackChange}
                                        />

                                        <InputField controlId="EggLose"
                                            label="Egg Lose"
                                            type="number"
                                            value={eggdata.EggLose}
                                            name="EggLose"
                                            placeholder="Lose egg"
                                            errormessage="Please enter no of lose egg"
                                            required={false}
                                            disabled={false}
                                            onChange={onEggLoseChange}
                                        />
                                    </Row>

                                    <Row className="mb-12">
                                        <InputField controlId="TotalEggs"
                                            label="Total eggs *"
                                            type="number"
                                            value={eggdata.TotalEggs}
                                            name="TotalEggs"
                                            placeholder="Total eggs"
                                            errormessage="Please provide total eggs"
                                            onChange={onTotalEggsChange}
                                            required={false}
                                            disabled={true}
                                        />

                                        <InputField controlId="BrokenEggs"
                                            label="Broken eggs *"
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
                                            label="OK eggs *"
                                            type="text"
                                            value={eggdata.OkEggs}
                                            name="OkEggs"
                                            placeholder="OK eggs"
                                            errormessage="Please provide OK eggs"
                                            required={true}
                                            disabled={true}
                                        />

                                        <InputField controlId="ProductionPercentage"
                                            label="Production % *"
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
                                        <InputField controlId="EggBig"
                                            label="Big eggs"
                                            type="text"
                                            value={eggdata.EggBig}
                                            name="EggBig"
                                            placeholder="Big eggs"
                                            errormessage="Please provide big eggs"
                                            onChange={onEggBigChange}
                                            required={false}
                                            disabled={false}
                                        />

                                        <InputField controlId="EggCp"
                                            label="Cp eggs"
                                            type="text"
                                            value={eggdata.EggCp}
                                            name="EggCp"
                                            placeholder="Cp eggs"
                                            errormessage="Please provide Cp eggs"
                                            onChange={onEggCpChange}
                                            required={false}
                                            disabled={false}
                                        />

                                        <InputField controlId="EggMcp"
                                            label="Mcp eggs"
                                            type="text"
                                            value={eggdata.EggMcp}
                                            name="EggMcp"
                                            placeholder="Mcp eggs"
                                            errormessage="Please provide Mcp eggs"
                                            required={false}
                                            disabled={false}
                                            onChange={onEggMcpChange}
                                        />

                                        <InputField controlId="EggScp"
                                            label="Scp eggs"
                                            type="text"
                                            value={eggdata.EggScp}
                                            name="EggScp"
                                            placeholder="Scp eggs"
                                            errormessage="Please provide Scp eggs"
                                            required={false}
                                            disabled={false}
                                            onChange={onEggLcpChange}
                                        />
                                    </Row>

                                    <Row className="mb-12">
                                        <InputField controlId="FeedConsume"
                                            label="Feed Consume (bags)*"
                                            type="text"
                                            value={eggdata.FeedConsume}
                                            name="FeedConsume"
                                            placeholder="Feed consume"
                                            errormessage="Please enter feed consume quantity"
                                            required={true}
                                            disabled={false}
                                            onChange={onFeedConsumeChange}
                                        />
                                        <InputField controlId="FeedIntech"
                                            label="Feed intech"
                                            type="text"
                                            value={eggdata.FeedIntech}
                                            name="FeedIntech"
                                            placeholder="Feed intech"
                                            errormessage="Please enter feed intech"
                                            required={true}
                                            disabled={true}
                                            onChange={onFeedIntechChange}
                                        />

                                        <InputField controlId="BirdWeight"
                                            label="Bird weight (gm)"
                                            type="text"
                                            value={eggdata.BirdWeight}
                                            name="BirdWeight"
                                            placeholder="Bird weight"
                                            errormessage="Please enter bird weight"
                                            required={false}
                                            disabled={false}
                                            onChange={onBirdWeightChange}
                                        />

                                    </Row>
                                    {/* <Row>
<EggCategoryWiseCount data={data} onChange={handleChange} handleClick={handleClick}
handleDelete={handleDelete}/>
</Row> */}
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
