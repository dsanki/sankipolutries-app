import React, { useState, useEffect, useMemo, useContext } from 'react'
import { variables } from '../../Variables';
import { Button, ButtonToolbar, Table } from 'react-bootstrap';
import Moment from 'moment';
 import AddClient from './AddClient'
 import EditClient from './EditClient'
import loginContext from '../../Context/LoginContext';
import { useNavigate } from 'react-router-dom'

function ClientList(props) {

    let history = useNavigate();

    const username = useContext(loginContext);

    //const [lots, setLots] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [producttype, setProductType] = useState([]);
    const [clients, setClients] = useState([]);

    const initialvalues = {
        id: "",
        clientname: "",
        clienttype: ""
    };

    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [clientdata, setClientData] = useState(initialvalues);

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
        if (localStorage.getItem('token')) {
            fetchClient();
            fetchProductType();
        }
        else {
            history("/login")
        }

    }, [obj]);

    const fetchClient = async () => {
        await fetch(variables.REACT_APP_API + 'client')
            .then(response => response.json())
            .then(data => {
                setClients(data);
                setCount(data.length);
                setTotalPages(Math.ceil(data.length / variables.PAGE_PAGINATION_NO));
            });
    }

    const fetchProductType = async () => {
        await fetch(variables.REACT_APP_API + 'ProductType')
            .then(response => response.json())
            .then(data => {
                setProductType(data);
            });
    }

    const deleteClient = (clientid) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'Client/' + clientid, {
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
    const itemsToDiaplay = clients && clients.length > 0 ? clients.slice(startIndex, endIndex) : [];

    return (
        <div>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Welcome to Client List Page</h2>
            </div>
            {<ButtonToolbar>
                <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => {
                        setAddModalShow({ addModalShow: true });
                        setClientData({ count: count });
                    }}>Add Client</Button>

                <AddClient show={addModalShow}
                    onHide={addModalClose}
                    onCountAdd={addCount}
                    showAlert={props.showAlert}
                    clientTypes={producttype}
                />
            </ButtonToolbar>}

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center'>
                        <th>Client Name</th>
                        <th>Type</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => (
                            <tr key={p.Id} align='center'>
                                <td align='center'>{p.ClientName}</td>
                                <td align='center'>{p.ClientType}</td>
                                <td align='center'>
                                    {
                                        <ButtonToolbar>

                                            <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => {

                                                setEditModalShow({ editModalShow: true });
                                                setClientData(prev => ({
                                                    ...prev,
                                                    id: p.Id,
                                                    clientname: p.ClientName,
                                                    clienttype: p.ClientType,
                                                    count: count
                                                }
                                                ));

                                            }}></i>

                                            {localStorage.getItem('isadmin') === 'true' &&
                                                <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteClient(p.Id)}></i>}


                                            <EditClient show={editModalShow}
                                                onHide={editModalClose}
                                                id={clientdata.id}
                                                clientname={clientdata.clientname}
                                                clienttype={clientdata.clienttype}
                                                onCountAdd={addCount}
                                                showAlert={props.showAlert}
                                                clientTypes={producttype}
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
export default ClientList;
