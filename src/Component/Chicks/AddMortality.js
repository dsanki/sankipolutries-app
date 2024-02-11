import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import EditLotShedMap from './EditLotShedMap'
import DateComponent from '../DateComponent';

function AddMortality(props) {
    let history = useNavigate();
    const [mortalitylist, setMortalityList] = useState([]);
    const [lots, setLots] = useState([]);
    const [shedlotmaplist, SetShedLotMapList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [shedlist, setShedList] = useState([]);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [shedlotdata, SetShedLotData] = useState([]);
    const [_lotid, setLotId] = useState();
    const [_lotname, setLotName] = useState();

    const [_lotdetails, setLotDetails] = useState();
    const [_totalbirds, setTotalBirds] = useState();

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchSheds();
            fetchLots();
            // fetchShedLotsMapList();
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

    // const fetchShedLotsMapList = async () => {
    //     fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedLotMapList')
    //         .then(response => response.json())
    //         .then(data => {
    //             SetShedLotMapList(data);
    //         });
    // }

    const onShedChange = (e) => {
        const shedid = e.target.value;
        setDropdownValue(shedid);
        const filterval = props.shedlotmaplist.filter((c) => c.shedid === parseInt(shedid));
        if (filterval.length > 0) {
            setLotId(filterval[0].lotid);
            setLotName(filterval[0].lotname);
            fetch(variables.REACT_APP_API + 'ChicksMaster/' + filterval[0].lotid)
                .then(response => response.json())
                .then(data => {
                    setLotDetails(data);
                    setTotalBirds(data.TotalBirdSale)
                });
        }
        else {
            //resetState();
        }
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

            fetch(variables.REACT_APP_API + 'Mortality/MortalityAdd', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    //'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id:0,
                    Date: e.target.Date.value,
                    ShedId: e.target.ShedId.value,
                    LotId: e.target.LotId.value,
                    MortalityNumber: e.target.MortalityNumber.value


                })
            }).then(res => res.json())
                .then((result) => {
                    if (result > 0 || result.StatusCode === 200 || result.StatusCode === "OK") {
                        closeModal();
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

    const closeModal = () => {
        setValidated(false);
        props.onCountAdd(props.count);
        props.onHide();
        
    };

    return (
        <>
            <div className="container" id="exampleModal">
                <Modal
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>

                                <div>
                                    <Form onSubmit={handleSubmit} noValidate validated={validated}>
                                        <Row className="mb-12">
                                            <Form.Group as={Col} controlId="Date">
                                                <Form.Label>Date</Form.Label>
                                                <DateComponent date={null} />
                                            </Form.Group>

                                            <Form.Group controlId="ShedId" as={Col} >
                                                <Form.Label>Shed</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={onShedChange} required>
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
                                            <Form.Group controlId="LotName" as={Col} >
                                                <Form.Label>Lot name</Form.Label>
                                                <Form.Control type="text" name="LotId" hidden disabled value={_lotid}
                                                />
                                                <Form.Control type="text" name="LotName" required disabled value={_lotname}
                                                    placeholder="" />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter lot name
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Row className="mb-4">

                                                <Form.Group controlId="MortalityNumber" as={Col} >
                                                    <Form.Label>Mortality Number</Form.Label>

                                                    <Form.Control type="number" name="MortalityNumber" required

                                                        placeholder="Mortality number" />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please provide Mortality Number.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
                                            <Form.Group as={Col}>
                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }}>
                                                    Add
                                                </Button>

                                            </Form.Group>

                                        </Row>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
            </div >

        </>
    )
}

export default AddMortality
