import React, { useState, useEffect, useMemo } from 'react'
import { variables } from './../../Variables';
import { Button, ButtonToolbar, Table, Row, Col, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

function ShedLotMap(props) {
    let history = useNavigate();
    const [shedlist, setShedList] = useState([]);
    const [lots, setLots] = useState([]);
    const [shedlotmaplist, SetShedLotMapList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);

    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);




    const initialvalues = {
        modaltitle: "",
        Id:0,
        ShedId: "",
        LotId: ""
    };

    const [shedlotdata, setShedLotData] = useState(initialvalues);

    const clickAddShedLot = () => {
        setAddModalShow({ addModalShow: true });
        setShedLotData({
            modaltitle: "Add",
            Id:0,
            ShedId: "",
            LotId: ""
        })
    }

    const clickEditShedLot = (p) => {
        setAddModalShow({ addModalShow: true });
        setShedLotData({
            modaltitle: "Edit",
            Id:p.id,
            ShedId: p.shedid,
            LotId: p.lotid
        })
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchSheds();
            fetchLots();
            fetchShedLotsMapList();
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
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(data => {
                setShedList(data.Result);
            });
    }

    const deleteShedLotMap = () => {

    }

    const fetchLots = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetLots',
            {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(data => {
                setLots(data.Result);
            });
    }

    const fetchShedLotsMapList = async () => {
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedLotMapList',
            {
                method: 'GET',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(data => {
                SetShedLotMapList(data.Result);
            });
    }

    let addCount = (num) => {
        setCount(num + 1);
    };

    const onShedChange = (e) => {
        setShedLotData({ ...shedlotdata, ShedId: e.target.value });
    }
    const onLotChange = (e) => {
        setShedLotData({ ...shedlotdata, LotId: e.target.value });
    }

    const handleAdd = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(variables.REACT_APP_API + 'ChicksMaster/LotShedMap', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    ShedId: shedlotdata.ShedId,
                    LotId: shedlotdata.LotId
                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
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

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };


    const handleEdit = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(variables.REACT_APP_API + 'ChicksMaster/LotShedMapUpdate', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    ShedId: shedlotdata.ShedId,
                    LotId: shedlotdata.LotId
                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
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
    const [selectedValue, setDropdownValue] = useState();



    return (
        <div className="ContainerOverride">
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Welcome to Shed - Lot Mapping Page</h2>
            </div>
            <div className="row">
                <div className="col" style={{ textAlign: 'right' }}>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddShedLot()}>Add</Button>
                </div>
            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center'>
                        <th>Shed name</th>
                        <th>Lot Name</th>
                        <th>Is Production</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        shedlotmaplist && shedlotmaplist.length > 0 ? shedlotmaplist.map((p) => (
                            <tr key={p.shedid} align='center'>

                                <td align='center'>{p.shedname}</td>
                                <td align='center'>{p.lotname}</td>
                                <td align='center'>{p.isproduction}</td>
                                <td align='center'>
                                    {
                                        <ButtonToolbar>
                                            <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditShedLot(p)}></i>

                                            {localStorage.getItem('isadmin') === 'true' &&
                                                <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteShedLotMap(p.ShedId)}></i>}

                                        </ButtonToolbar>
                                    }
                                </td>
                            </tr>
                        )) : <tr>
                        <td style={{ textAlign: "center" }} colSpan={14}>
                            No Records
                        </td>
                    </tr>
                    }
                </tbody>
            </Table>

            <div className="" id="exampleModal">
                <Modal
                    show={addModalShow}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter" style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            {shedlotdata.modaltitle}
                        </Modal.Title>
                        <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>

                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>

                                <div>
                                    <Form noValidate validated={validated} className="needs-validation">
                                        <Row className="mb-12">
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
                                                                    selected={item.ShedId === shedlotdata.ShedId}
                                                                    value={item.ShedId}
                                                                >{item.ShedName}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select Shed
                                                </Form.Control.Feedback>

                                            </Form.Group>
                                            <Form.Group controlId="lotid" as={Col} >
                                                <Form.Label>Lot</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={onLotChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {
                                                        lots.map((item) => {
                                                            return (
                                                                <option
                                                                    key={item.Id}
                                                                    defaultValue={item.Id == null ? null : item.Id}
                                                                    selected={item.Id === shedlotdata.LotId}
                                                                    value={item.Id}
                                                                >{item.LotName}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select lot
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        {/* <Form.Group as={Col}>
                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }}>
                                                Update
                                            </Button>

                                        </Form.Group> */}

                                        <Form.Group as={Col}>
                                            {shedlotdata.Id <= 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleAdd(e)}>
                                                    Add
                                                </Button>
                                                : null
                                            }

                                            {shedlotdata.Id > 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleEdit(e)}>
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
        </div >
        </div >
    )
}

export default ShedLotMap
