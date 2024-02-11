import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import DateComponent from '../DateComponent';
import AddMortality from './AddMortality';
import EditMortality from './EditMortality';
import Moment from 'moment';
function MortalityList(props) {
    let history = useNavigate();
    const [mortalitydata, setMortalityData] = useState([]);
    const [mortalitylist, setMortalityList] = useState([]);
    const [lots, setLots] = useState([]);
    const [shedlotmaplist, SetShedLotMapList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [shedlist, setShedList] = useState([]);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);

    const [shedlotdata, SetShedLotData] = useState([]);

    let addModalClose = () => {
        setAddModalShow(false)
    };
    const [_lotdetails, setLotDetails] = useState();
    const [_totalbirds, setTotalBirds] = useState();

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

    const fetchSheds = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedList')
            .then(response => response.json())
            .then(data => {
                setShedList(data);
            });
    }

    const deleteMortality = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'Mortality/' + id, {
                method: 'DELETE',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    //'auth-token': localStorage.getItem('token')
                }
            }).then(res => res.json())
            .then((result) => {
                if (result > 0 || result.StatusCode === 200 || result.StatusCode === "OK") {
                    //closeModal();
                    props.showAlert("Successfully deleted", "info")
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
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetLots')
            .then(response => response.json())
            .then(data => {
                setLots(data);
            });
    }

    const fetchShedLotsMapList = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedLotMapList')
            .then(response => response.json())
            .then(data => {
                SetShedLotMapList(data);
            });
    }

    const fetchMortalityList = async () => {
        fetch(variables.REACT_APP_API + 'Mortality/GetMortalityShedLotMapList')
            .then(response => response.json())
            .then(data => {
                setMortalityList(data);
                setCount(data.length);
                setTotalPages(Math.ceil(data.length / variables.PAGE_PAGINATION_NO));
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

    let editModalClose = () => {
        setEditModalShow(false)
    };

    
   // const [selectedValue, setDropdownValue] = useState();



    return (
        <>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Welcome to mortality tracker page</h2>
            </div>
            
            {<ButtonToolbar>
                <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => {
                        setAddModalShow({ addModalShow: true });
                        //setEggData({ count: count });


                    }}>Add</Button>

                <AddMortality show={addModalShow}
                    onHide={addModalClose}
                    onCountAdd={addCount}
                    showAlert={props.showAlert}
                    shedlotmaplist={shedlotmaplist}
                    shedlist={shedlist}

                />
            </ButtonToolbar>}
            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center'>
                        <th>Date</th>
                        <th>Shed name</th>
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

                                            <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => {

                                                setEditModalShow({ editModalShow: true });
                                                setMortalityData(prev => ({
                                                    ...prev,
                                                    id:p.id,
                                                    lotid: p.lotid,
                                                    lotname: p.lotname,
                                                    shedid: p.shedid,
                                                    mortality: p.mortality,
                                                    date:p.date,
                                                    count: count,
                                                    
                                                }
                                                ));

                                            }}></i>

                                            {localStorage.getItem('isadmin') === 'true' &&
                                                <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteMortality(p.id)}></i>}


                                            <EditMortality show={editModalShow}
                                                onHide={editModalClose}
                                                id={mortalitydata.id}
                                                lotid={mortalitydata.lotid}
                                                lotname={mortalitydata.lotname}
                                                shedid={mortalitydata.shedid}
                                                shedname={mortalitydata.shedname}
                                                mortality={mortalitydata.mortality}
                                                date={mortalitydata.date}
                                                shedlist={shedlist}
                                                lotlist={lots}
                                                onCountAdd={addCount}
                                                showAlert={props.showAlert}
                                                shedlotmaplist={shedlotmaplist}
                                            /> 
                                        </ButtonToolbar>
                                    }
                                </td>
                            </tr>
                        )) : ''
                    }
                </tbody>
            </Table>
        </>
    )
}

export default MortalityList
