import React, { Component, useState, useEffect, componentDidMount, componentDidUpdate, useMemo } from 'react'
import { variables } from '../../Variables';
import { Button, ButtonToolbar, Table } from 'react-bootstrap';
import Moment from 'moment';
// import EditLotComponent from './EditLotComponent'
import AddChicksMasterComponent from './AddChicksMasterComponent'
import EditChicksMasterComponent from './EditChicksMasterComponent'
//

function ChicksMasterComponent() {

    const [chicks, setChicks] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);

    const initialvalues = {
        id: 0,
        date: new Date(),
        chicks: 0,
        extrachicks: 0,
        totalchicks: 0,
        mortality: 0,
        lambchicks: 0,
        duechicks: 0,
        totalamount: 0,
        rate: 0,
        paid: 0,
        due: 0,
        paymentdate: new Date()
    };

    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [chicksdata, setChicksData] = useState(initialvalues);

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
        fetchChicks();
    }, [obj]);

    const fetchChicks = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster')
            .then(response => response.json())
            .then(data => {
                setChicks(data);
                setCount(data.length);
                setTotalPages(Math.ceil(data.length / variables.PAGE_PAGINATION_NO));
            });
    }

    const deleteChicks = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'ChicksMaster/' + id, {
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
    const itemsToDiaplay = chicks && chicks.length > 0 ? chicks.slice(startIndex, endIndex) : [];

    return (
        <div>
            <h2>Welcome to Chicks Master Page</h2>
            {
                <ButtonToolbar>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => {
                            setAddModalShow(true);
                            setChicksData(prev => ({
                                id: 0,
                                date: new Date(),
                                chicks: 0,
                                extrachicks: 0,
                                totalchicks: 0,
                                mortality: 0,
                                lambchicks: 0,
                                duechicks: 0,
                                totalamount: 0,
                                rate: 0,
                                paid: 0,
                                due: 0,
                                paymentdate: new Date(),
                                count: count
                            }
                            ));
                        }}>Add Chicks</Button>

                    <AddChicksMasterComponent show={addModalShow}
                        onHide={addModalClose}
                        id={chicksdata.id}
                        date={chicksdata.date}
                        chicks={chicksdata.chicks}
                        extrachicks={chicksdata.extrachicks}
                        totalchicks={chicksdata.totalchicks}
                        mortality={chicksdata.mortality}
                        lambchicks={chicksdata.lambchicks}
                        duechicks={chicksdata.duechicks}
                        totalamount={chicksdata.totalamount}
                        rate={chicksdata.rate}
                        paid={chicksdata.paid}
                        due={chicksdata.due}
                        paymentdate={chicksdata.paymentdate}
                        onCountAdd={addCount}
                    />
                </ButtonToolbar>
            }

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center'>
                        <th>Date</th>
                        <th>Chicks</th>
                        <th>Extra cks</th>
                        <th>Total Cks</th>
                        <th>Mortality</th>
                        <th>Lamb</th>
                        <th>Due cks</th>
                        <th>Rate</th>
                        <th>Total amt</th>
                        <th>Paid</th>
                        <th>Due</th>
                        <th>Payment date</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => (
                            <tr key={p.Id} align='center'>
                                <td align='center'>{Moment(p.Date).format('DD-MMM-YYYY')}</td>
                                <td align='center'>{p.Chicks}</td>
                                <td align='center'>{p.ExtraChicks}</td>
                                <td align='center'>{p.TotalChicks}</td>
                                <td align='center'>{p.Mortality}</td>
                                <td align='center'>{p.LambChicks}</td>
                                <td align='center'>{p.DueChicks}</td>
                                <td>{p.Rate.toFixed(2)}</td>
                                <td>{p.TotalAmount.toFixed(2)}</td>
                                <td>{p.Paid.toFixed(2)}</td>
                                <td>{p.Due.toFixed(2)}</td>
                                <td align='center'>{Moment(p.PaymentDate).format('DD-MMM-YYYY')}</td>
                                <td align='center'>
                                    {
                                        <ButtonToolbar>
                                            <Button className="mr-2" variant="primary"
                                                style={{ marginRight: "17.5px" }}
                                                onClick={() => {
                                                    setEditModalShow(true);
                                                    setChicksData(prev => ({
                                                        ...prev,
                                                        id: p.Id,
                                                        date: p.Date,
                                                        chicks: p.Chicks,
                                                        extrachicks: p.ExtraChicks,
                                                        totalchicks: p.TotalChicks,
                                                        mortality: p.Mortality,
                                                        lambchicks: p.LambChicks,
                                                        duechicks: p.DueChicks,
                                                        totalamount: p.TotalAmount,
                                                        rate: p.Rate,
                                                        paid: p.Paid,
                                                        due: p.Due,
                                                        paymentdate: p.PaymentDate,
                                                        count: count
                                                    }
                                                    ));
                                                }}>Edit</Button>

                                            <Button className="mr-2" variant="danger" size="sm"
                                                onClick={() => deleteChicks(p.Id)}>
                                                Delete
                                            </Button>

                                            <EditChicksMasterComponent show={editModalShow}
                                                onHide={editModalClose}
                                                id={chicksdata.id}
                                                date={chicksdata.date}
                                                chicks={chicksdata.chicks}
                                                extrachicks={chicksdata.extrachicks}
                                                totalchicks={chicksdata.totalchicks}
                                                mortality={chicksdata.mortality}
                                                lambchicks={chicksdata.lambchicks}
                                                duechicks={chicksdata.duechicks}
                                                totalamount={chicksdata.totalamount}
                                                rate={chicksdata.rate}
                                                paid={chicksdata.paid}
                                                due={chicksdata.due}
                                                paymentdate={chicksdata.paymentdate}
                                                onCountAdd={addCount}
                                            />
                                        </ButtonToolbar>


                                    }
                                </td>
                            </tr>
                        )) : ''
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
export default ChicksMasterComponent;
