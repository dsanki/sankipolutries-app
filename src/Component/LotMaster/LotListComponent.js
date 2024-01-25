import React, { Component, useState, useEffect, componentDidMount, componentDidUpdate, useMemo } from 'react'
import { variables } from './../../Variables';
import { Button, ButtonToolbar, Table } from 'react-bootstrap';
import Moment from 'moment';
import EditLotComponent from './EditLotComponent'
import AddLotComponent from './AddLotComponent'


function LotListComponent() {

    const [lots, setLots] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);

    const initialvalues = {
        lotid: "",
        lotname: "",
        startdate: "",
        enddate: ""
    };

    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [lotdata, setLotData] = useState(initialvalues);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    let addModalClose = () => {
        setAddModalShow(false)
    };

    let addCount = (num) => {
        setCount(num + 1);
    };

    let editModalClose = () => {
        setEditModalShow(false)
    };

    useEffect((e) => {
        fetchLots();
    }, [obj]);

    const fetchLots = async () => {
        fetch(variables.REACT_APP_API + 'LotMaster')
            .then(response => response.json())
            .then(data => {
                setLots(data);
                setCount(data.length);
                setTotalPages(Math.ceil(data.length / variables.PAGE_PAGINATION_NO));
            });
    }

    const deleteLot = (lotid) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'LotMaster/' + lotid, {
                method: 'DELETE',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            addCount(count);
        }
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
    const nextDisabled = currentPage === totalPages;
    const itemsPerPage = variables.PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = lots && lots.length > 0 ? lots.slice(startIndex, endIndex) : [];

    return (
        <div>
            <h2>Welcome to Lot List Page</h2>
            {<ButtonToolbar>
                <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => {
                        setAddModalShow(true);
                        setLotData(prev => ({
                            lotid: 0,
                            lotname: "",
                            startdate: new Date(),
                            enddate: new Date(),
                            count: count
                        }
                        ));
                    }}>Add Lot</Button>

                <AddLotComponent show={addModalShow}
                    onHide={addModalClose}
                    lotid={lotdata.lotid}
                    lotname={lotdata.lotname}
                    startdate={lotdata.startdate}
                    enddate={lotdata.enddate}
                    onCountAdd={addCount}
                />
            </ButtonToolbar>}

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center'>
                        <th>Lot Name</th>
                        <th>Start Date</th>
                        <th>End Name</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => (
                            <tr key={p.Id} align='center'>
                                <td align='center'>{p.LotName}</td>
                                <td align='center'>{Moment(p.StartDate).format('DD-MMM-YYYY')}</td>
                                <td align='center'>{p.EndDate ? Moment(p.EndDate).format('DD-MMM-YYYY') : ''}</td>
                                <td align='center'>
                                    {
                                        <ButtonToolbar>
                                            <Button className="mr-2" variant="primary" style={{ marginRight: "17.5px" }} onClick={() => {
                                                setEditModalShow(true);
                                                setLotData(prev => ({
                                                    ...prev,
                                                    lotid: p.Id,
                                                    lotname: p.LotName,
                                                    startdate: p.StartDate,
                                                    enddate: p.EndDate,
                                                    count: count
                                                }
                                                ));

                                            }}>Edit</Button>

                                            <Button className="mr-2" variant="danger" size="sm"
                                                onClick={() => deleteLot(p.Id)}>
                                                Delete
                                            </Button>

                                            <EditLotComponent show={editModalShow}
                                                onHide={editModalClose}
                                                lotid={lotdata.lotid}
                                                lotname={lotdata.lotname}
                                                startdate={lotdata.startdate}
                                                enddate={lotdata.enddate}
                                                onCountAdd={addCount}
                                            />
                                        </ButtonToolbar>
                                    }
                                </td>
                            </tr>
                        )): ''
                    }
                </tbody>
            </Table>

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

        </div>
    )
}
export default LotListComponent;
