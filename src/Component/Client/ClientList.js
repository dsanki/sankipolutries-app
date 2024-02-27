import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Button, ButtonToolbar, Table, Form, Row, Col, Modal } from 'react-bootstrap';
//import Moment from 'moment';
// import AddClient from './AddClient'
// import EditClient from './EditClient'
import loginContext from '../../Context/LoginContext';
import { useNavigate } from 'react-router-dom'

import InputField from '../ReuseableComponent/InputField'

function ClientList(props) {

    let history = useNavigate();

    //const username = useContext(loginContext);

    //const [lots, setLots] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    //const [editModalShow, setEditModalShow] = useState(false);
    const [producttype, setProductType] = useState([]);
    const [clients, setClients] = useState([]);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [validated, setValidated] = useState(false);

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        ClientName: "",
        ClientType: ""
    };

    const [clientdata, setClientData] = useState(initialvalues);

    const clickAddClient = () => {
        setAddModalShow({ addModalShow: true });
        setClientData({
            modaltitle: "Add new client",
            Id: 0,
            ClientName: "",
            ClientType: ""
        })
    }

    const clickEditClient = (client) => {
        setAddModalShow({ addModalShow: true });
        setClientData({
            modaltitle: "Edit client",
            Id: client.Id,
            ClientName: client.ClientName,
            ClientType: client.ClientType
        })
    }

    const clientNameChange = (e) => {
        setClientData({ ...clientdata, ClientName: e.target.value });
    }

    const clientTypeChange = (e) => {
        setClientData({ ...clientdata, ClientType: e.target.value });
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    let addCount = (num) => {
        setCount(num + 1);
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
        await fetch(variables.REACT_APP_API + 'client',
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
                    setClients(data.Result);
                    setCount(data.Result.length);
                    setTotalPages(Math.ceil(data.Result.length / variables.PAGE_PAGINATION_NO));
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

            });
    }

    const fetchProductType = async () => {
        await fetch(variables.REACT_APP_API + 'ProductType/GetProductType',
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
                    setProductType(data.Result);
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

            });
    }

    const deleteClient = (clientid) => {
        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'Client/' + clientid, {
                method: 'DELETE',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then((data) => {
                    if (data.StatusCode === 200) {
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


    const handleAddClient = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(variables.REACT_APP_API + 'Client', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: clientdata.Id,
                    ClientName: clientdata.ClientName,
                    ClientType: clientdata.ClientType

                })
            })
                .then(res => res.json())
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
                    })
        }

        setValidated(true);
    }

    const handleEditClient = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(variables.REACT_APP_API + 'Client', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: clientdata.Id,
                    ClientName: clientdata.ClientName,
                    ClientType: clientdata.ClientType

                })
            })
                .then(res => res.json())
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
                    })
        }

        setValidated(true);
    }

    return (
        <div>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Welcome to Client List Page</h2>
            </div>
            <div className="col" style={{ textAlign: 'right' }}>
                <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => clickAddClient()}>Add</Button>
            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='left' className="tr-custom">
                        <th>Client Name</th>
                        <th>Type</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
                            // const _unit = producttype.filter((c) => c.ID === p.UnitId);
                            // const _uname = _unit.length > 0 ? _unit[0].UnitName : "";
                            let custtype = producttype.filter((x) => x.ProductId === p.ClientType);
                            const _name = producttype.length > 0 ? producttype[0].ProductName : "";

                            return (
                                <tr key={p.Id} align='left' >
                                    <td align='left'>{p.ClientName}</td>
                                    <td align='left'>{_name}</td>
                                    <td align='center'>
                                        {
                                            <ButtonToolbar>

                                                <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditClient(p)}></i>

                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteClient(p.Id)}></i>}

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
            </Table>


            {
                clients && clients.length > variables.PAGE_PAGINATION_NO &&
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
                        clients && clients.length > variables.PAGE_PAGINATION_NO &&
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

            {clients && clients.length > variables.PAGE_PAGINATION_NO &&
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
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add Client
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12}>
                            {/* <LotFormComponent
                buttonLabel='Update'
                post={props}
                handleSubmit={handleEditSubmit}
                closeModal={closeModal}
              /> */}


                            <div>
                                <Form noValidate validated={validated} className="needs-validation">
                                    <Row className="mb-12">
                                        {/* <Form.Group controlId="Id" as={Col} hidden>
                      <Form.Label hidden>Id</Form.Label>
                      <Form.Control type="text" name="Id" required
                        disabled
                        defaultValue={props.id}
                        placeholder="Id"
                        hidden />

                    </Form.Group> */}

                                        <InputField controlId="ClientName" label="Client name"
                                            type="text"
                                            value={clientdata.ClientName}
                                            name="ClientName"
                                            placeholder="Client name"
                                            errormessage="Please enter client name"
                                            onChange={clientNameChange}
                                            required={true}
                                            disabled={false}
                                        />

                                        {/* <Form.Group controlId="ClientName" as={Col} >
                      <Form.Label>Client Name</Form.Label>
                      <Form.Control type="text" name="ClientName" required
                        defaultValue={props.clientname}
                        //onChange={onChangeValues}
                        placeholder="ClientName" />
                      <Form.Control.Feedback type="invalid">
                        Please enter Client name
                      </Form.Control.Feedback>
                    </Form.Group> */}

                                        <Form.Group controlId="ClientType" as={Col} >
                                            <Form.Label>Client type</Form.Label>
                                            <Form.Select aria-label="Default select example"
                                                onChange={clientTypeChange} required>
                                                <option selected disabled value="">Choose...</option>
                                                {
                                                    producttype.map((item) => {
                                                        return (
                                                            <option
                                                                key={item.ProductId}
                                                                defaultValue={item.ProductId == null ? null : item.ProductId}
                                                                selected={item.ProductId === clientdata.ClientType}
                                                                value={item.ProductId}
                                                            >{item.ProductName}</option>
                                                        );
                                                    })
                                                }
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select client
                                            </Form.Control.Feedback>

                                        </Form.Group>

                                        <Form.Group as={Col}>
                                            {clientdata.Id <= 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleAddClient(e)}>
                                                    Add
                                                </Button>
                                                : null
                                            }

                                            {clientdata.Id > 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleEditClient(e)}>
                                                    Update
                                                </Button>
                                                : null
                                            }

                                            <Button variant="danger" style={{ marginTop: "30px", marginLeft: "10px" }} onClick={() => {
                                                addModalClose();
                                            }
                                            }>Close</Button>

                                        </Form.Group>

                                        {/* <Form.Group>
                      <Button variant="primary" type="submit" style={{ marginTop: "10px" }} >
                        Update
                      </Button>
                      <Button variant="danger" style={{ marginTop: "10px", marginLeft: "10px" }} onClick={() => {
                        closeModal();
                      }
                      }>Close</Button>
                    </Form.Group> */}
                                    </Row>
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
export default ClientList;
