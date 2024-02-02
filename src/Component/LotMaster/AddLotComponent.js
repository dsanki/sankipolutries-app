import React, { Component, useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import DateComponent from '../DateComponent';
import moment from 'moment';

function AddLotComponent(props) {

    const initialvalues = {
        lotid: props.lotid,
        lotname: props.lotname,
        startdate: props.startdate,
        enddate: props.enddate
    };

    const [_initialvalues, setInitialvalues] = useState(initialvalues)

    useEffect(() => {
      }, [initialvalues]);

      const changeValues = ({ name, value }) => {
        setInitialvalues({ ..._initialvalues, [name]: value });
       // setPreGame(initialvalues);
      }

    // const [lotdetails, setLotdetails] = useState([])
    // const [lotid, setLotid] = useState(props.lotid)
    // const [lotname, setLotname] = useState(props.lotname)
    // const [startdate, setStartdate] = useState(props.startdate)
    // const [enddate, setEnddate] = useState(props.enddate)

    const [lot, setLotData] = useState(initialvalues);

    const closeModal = () => {
        props.onCountAdd(props.count);
        props.onHide();
    };

    const dateFromDateString = (dateString) => {
        return moment(new Date(dateString)).format('YYYY-MM-DDT00:00:00.000');
    };

    const dateForPicker = (dateString) => {
        return moment(new Date(dateString)).format('YYYY-MM-DD')
    };

    const handleSubmit = (e) => {
        
        e.preventDefault();

        const _lotid = _initialvalues.lotid===null || _initialvalues.lotid==="" && _initialvalues.lotid !== undefined? 0:_initialvalues.lotid
        const _lotname = _initialvalues.lotname.trim()
        const _startdate = _initialvalues.startdate
        const _enddate = _initialvalues.enddate
        const methodName = (_lotid !== 0  ? 'PUT' : 'POST');
        fetch(variables.REACT_APP_API + 'LotMaster', {
            method: methodName,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            // body: JSON.stringify({
            //     Id: e.target.Id.value,
            //     LotName: e.target.LotName.value,
            //     StartDate: e.target.StartDate.value,
            //     EndDate: e.target.EndDate.value

            // })

            body: JSON.stringify({
                Id: _lotid,
                LotName: _lotname,
                StartDate: _startdate,
                EndDate: _enddate

            })
        })
            .then(res => res.json())
            .then((result) => {

                // setLotdetails([...lotdetails, result])
                //setLotid("")
                //setLotname("")
                //setStartdate("")
                //setEnddate("")
                closeModal();
                alert(result);
            },
                (error) => {
                    alert('Failed');
                })
    };

    return (
        <div className="container">

            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Lot
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12}>

                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-12">
                                    <Form.Group controlId="Id" as={Col} hidden>
                                        <Form.Label hidden>Id</Form.Label>
                                        <Form.Control type="text" name="Id" required
                                            disabled
                                            defaultValue={initialvalues.lotid}
                                            placeholder="Id"
                                            hidden />
                                    </Form.Group>
                                    <Form.Group controlId="LotName" as={Col} >
                                        <Form.Label>Lot Name</Form.Label>
                                        <Form.Control type="text" name="LotName" required 
                                        //onChange={e => setLotname(e.target.value)}
                                        onChange={({ target }) => changeValues(target)}
                                            defaultValue={initialvalues.lotname}
                                            placeholder="LotName" />
                                    </Form.Group>

                                    <Form.Group controlId="StartDate" as={Col} >
                                        <Form.Label>Start Date</Form.Label>
                                        {/* <DateComponent date={props.startdate} /> */}
                                        <Form.Control
                                            type="date"
                                            value={initialvalues.startdate ? dateForPicker(initialvalues.startdate) : ''}
                                            onfocus={dateForPicker(initialvalues.startdate)}
                                            placeholder={initialvalues.startdate ? dateForPicker(initialvalues.startdate) : ""}
                                           onChange={({ target }) => changeValues(target)}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="EndDate" as={Col} >
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={initialvalues.enddate ? dateForPicker(initialvalues.enddate) : ''}
                                            onfocus={dateForPicker(initialvalues.enddate)}
                                            placeholder={initialvalues.enddate ? dateForPicker(initialvalues.enddate) : ""}
                                            //onChange={(e) => setEnddate(dateFromDateString(e.target.value))}
                                            onChange={({ target }) => changeValues(target)}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Button variant="primary" type="submit" style={{ marginTop: "10px" }} >
                                            Add
                                        </Button>
                                        <Button variant="danger" style={{ marginTop: "10px", marginLeft: "10px" }} onClick={() => {
                                            closeModal();
                                        }
                                        }>Close</Button>
                                    </Form.Group>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AddLotComponent

