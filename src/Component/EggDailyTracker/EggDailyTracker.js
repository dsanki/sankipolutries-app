import React, { useState, useEffect, useMemo } from 'react'
import { variables } from './../../Variables'
import { Button, ButtonToolbar, Table } from 'react-bootstrap';
import Moment from 'moment';
import { useNavigate } from 'react-router-dom'
import AddEggDailyTracker from './AddEggDailyTracker'
import EditEggDailyTracker from './EditEggDailyTracker'

function EggDailyTracker(props) {

    let history = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [count, setCount] = useState(0);

    const [shedlist, setShedList] = useState([]);
    const [eggtrackerlist, setEggDailyTrackerList] = useState([]);
    const [shedlotmaplist, setShedLotMapList] = useState([]);

    //const [lotname, setLotName] = useState();

    const initialvalues = {
        id: "",
        date: "",
        shedid: "",
        lotid: "",
        totalbirds:"",
        totaleggs: "",
        brokeneggs: "",
        okeggs: "",
        feedintech: "",
        productionpercentage: ""

    };

    const [eggdata, setEggData] = useState(initialvalues);

    const obj = useMemo(() => ({ count }), [count]);

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
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedList')
            .then(response => response.json())
            .then(data => {
                setShedList(data);
            });
    }

    const fetchShedLotMapList = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedLotMapList')
            .then(response => response.json())
            .then(data => {
                setShedLotMapList(data);
            });
    }

    const fetchEggDailyTrackerList = async () => {
        fetch(variables.REACT_APP_API + 'EggProductionDailyTracker/GetEggDailyTrackerList')
            .then(response => response.json())
            .then(data => {
                setEggDailyTrackerList(data);
                setCount(data.length);
                setTotalPages(Math.ceil(data.length / variables.PAGE_PAGINATION_NO));
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

    // let addModalClose = () => setAddModalShow({ addModalShow: false });
    // let editModalClose = () => setEditModalShow({ editModalShow: false });

    let addModalClose = () => {
        setAddModalShow(false)
    };

    let editModalClose = () => {
        setEditModalShow(false)
    };

    

    const deleteTracker = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'EggProductionDailyTracker/' + id, {
                method: 'DELETE',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    //'auth-token': localStorage.getItem('token')
                }
            }).then(res => res.json())
            .then((result) => {
                props.showAlert("Successfully deleted", "info")
            },
                (error) => {
                    props.showAlert("Error occurred!!", "danger")
                });

            addCount(count);
        }
    }


    return (
        <>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Welcome to Daily Production Tracker</h2>
            </div>

            {<ButtonToolbar>
                <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => {
                        setAddModalShow({ addModalShow: true });
                        setEggData({ count: count });


                    }}>Add</Button>

                <AddEggDailyTracker show={addModalShow}
                    onHide={addModalClose}
                    onCountAdd={addCount}
                    showAlert={props.showAlert}
                    shedlotmaplist={shedlotmaplist}
                    shedlist={shedlist}

                />
            </ButtonToolbar>}

            {
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr align='center'>
                            <th>Date</th>
                            <th>Shed</th>
                            <th>Lot </th>
                            <th>Birds</th>
                            {/* <th>Mortality</th> */}
                            <th>Eggs</th>
                            <th>Eggs B</th>
                            <th>Eggs OK</th>
                            <th>FIntech</th>
                            <th>%</th>
                            {/* <th>Wt(gm)</th> */}
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {
                            cartons.map(c => c.Id == cartonId)
                        } */}
                        {
                            itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((egg) => {
                                const filterByShedId = shedlotmaplist.filter((c) => c.shedid === egg.ShedId);
                                const shedname = filterByShedId.length > 0 ? filterByShedId[0].shedname : "";

                                const filterByLotId = shedlotmaplist.filter((c) => c.lotid === egg.LotId);
                                const lotname = filterByLotId.length > 0 ? filterByLotId[0].lotname : "";
                                return (
                                    <tr key={egg.Id} align='center'>
                                        <td align='center'>{Moment(egg.Date).format('DD-MMM-YYYY')}</td>
                                        <td>{shedname}</td>
                                        <td>{lotname}</td>
                                        <td>{egg.TotalBirds}</td>
                                        {/* <td>{egg.Mortality}</td> */}
                                        <td>{egg.TotalEggs}</td>
                                        <td>{egg.BrokenEggs}</td>
                                        <td>{egg.OkEggs}</td>
                                        <td>{egg.FeedIntech}</td>
                                        <td>{egg.ProductionPercentage}</td>
                                        <td align='center'>
                                            <ButtonToolbar >
                                                <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => {
                                                    setEditModalShow({ editModalShow: true });
                                                    setEditModalShow({ Id: egg.Id });



                                                    setEggData(prev => ({
                                                        ...prev,
                                                        id: egg.Id,
                                                        date: egg.Date,
                                                        shedid: egg.ShedId,
                                                        lotid: egg.LotId,
                                                        lotname:lotname,
                                                        totalbirds:egg.TotalBirds,
                                                        totaleggs: egg.TotalEggs,
                                                        brokeneggs: egg.BrokenEggs,
                                                        okeggs: egg.OkEggs,
                                                        feedintech: egg.FeedIntech,
                                                        productionpercentage: egg.ProductionPercentage,
                                                        count: count
                                                    }
                                                    ));
                                                }}>

                                                </i>
                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteTracker(egg.Id)}></i>}



                                                <EditEggDailyTracker show={editModalShow}
                                                    onHide={editModalClose}
                                                    id={eggdata.id}
                                                    date={eggdata.date}
                                                    shedid={eggdata.shedid}
                                                    lotid={eggdata.lotid}
                                                    lotname={lotname}
                                                    totalbirds={eggdata.totalbirds}
                                                    totaleggs={eggdata.totaleggs}
                                                    brokeneggs={eggdata.brokeneggs}
                                                    okeggs={eggdata.okeggs}
                                                    feedintech={eggdata.feedintech}
                                                    productionpercentage={eggdata.productionpercentage}
                                                    shedlotmaplist={shedlotmaplist}
                                                    onCountAdd={addCount}
                                                    showAlert={props.showAlert}
                                                    shedlist={shedlist}
                                                />
                                            </ButtonToolbar>
                                        </td>

                                    </tr>

                                )
                            }) : ''
                        }
                    </tbody>
                </Table >
            }

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
    )
}

export default EggDailyTracker
