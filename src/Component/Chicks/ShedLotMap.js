import React, { useState, useEffect, useMemo } from 'react'
import { variables } from './../../Variables';
import { Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import EditLotShedMap from './EditLotShedMap'

function ShedLotMap(props) {
    let history = useNavigate();
    const [shedlist, setShedList] = useState([]);
    const [lots, setLots] = useState([]);
    const [shedlotmaplist, SetShedLotMapList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);

    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);

    const [shedlotdata, SetShedLotData] = useState([]);

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
        fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedList')
            .then(response => response.json())
            .then(data => {
                setShedList(data);
            });
    }

    const deleteShedLotMap = () => {

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

    let addCount = (num) => {
        setCount(num + 1);
    };

    let editModalClose = () => {
        setEditModalShow(false)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        else {

            fetch(variables.REACT_APP_API + 'ChicksMaster/LotShedMap', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    //'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    ShedId: e.target.ShedId.value,
                    LotId: e.target.Id.value

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result > 0 || result.StatusCode === 200 || result.StatusCode === "OK") {
                        //closeModal();
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
        <>
             <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Welcome to Shed - Lot Mapping Page</h2>
            </div>
            <div>
            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Row className="mb-12">

                    <Form.Group controlId="ShedId" as={Col} >
                        <Form.Label>Shed</Form.Label>
                        <Form.Select aria-label="Default select example"
                            onChange={(e) => setDropdownValue(e.target.value)} required>
                            <option>--Select shed--</option>
                            {
                                shedlist.map((item) => {
                                    return (
                                        <option
                                            key={item.ShedId}
                                            defaultValue={item.ShedId == null ? null : item.ShedId}
                                            //selected={item.ShedId === selectedValue}
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
                    <Form.Group controlId="Id" as={Col} >
                        <Form.Label>Lot</Form.Label>
                        <Form.Select aria-label="Default select example"
                            onChange={(e) => setDropdownValue(e.target.value)} required>
                            <option>--Select Lot--</option>
                            {
                                lots.map((item) => {
                                    return (
                                        <option
                                            key={item.Id}
                                            defaultValue={item.Id == null ? null : item.Id}
                                            //selected={item.ShedId === selectedValue}
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

                    <Form.Group as={Col}>
                        <Button variant="primary" type="submit" style={{ marginTop: "30px" }}>
                            Add
                        </Button>

                    </Form.Group>

                </Row>
            </Form>
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

                                            <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => {

                                                setEditModalShow({ editModalShow: true });
                                                SetShedLotData(prev => ({
                                                    ...prev,
                                                    lotid: p.lotid,
                                                    //lotname: p.lotname,
                                                    shedid: p.shedid,
                                                    //shedname: p.shedname,
                                                    //isproduction:p.isproduction,
                                                    count: count
                                                }
                                                ));

                                            }}></i>

                                            {localStorage.getItem('isadmin') === 'true' &&
                                                <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteShedLotMap(p.shedid)}></i>}


                                            <EditLotShedMap show={editModalShow}
                                                onHide={editModalClose}
                                                lotid={shedlotdata.lotid}
                                                //lotname={shedlotdata.lotname}
                                                shedid={shedlotdata.shedid}
                                                //shedname={shedlotdata.shedname}
                                                //isproduction={shedlotdata.isproduction}
                                                shedlist={shedlist}
                                                lotlist={lots}
                                                onCountAdd={addCount}
                                                showAlert={props.showAlert}
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

export default ShedLotMap
