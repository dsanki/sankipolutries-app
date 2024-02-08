import React, { useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import moment from 'moment';
import Feedback from 'react-bootstrap/Feedback'
import DateComponent from './../DateComponent'

const AddEggDailyTracker = (props) => {

    const [validated, setValidated] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        }
        else {

            fetch(variables.REACT_APP_API + 'EggProductionDailyTracker', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    //'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Date: e.target.Date.value,
                    ShedId: e.target.ShedId.value,
                    LotId: e.target.LotId.value,
                    TotalBirds: e.target.TotalBirds.value,
                    TotalEggs: e.target.TotalEggs.value,
                    BrokenEggs: e.target.BrokenEggs.value,
                    OkEggs: e.target.OkEggs.value,
                    FeedIntech: e.target.FeedIntech.value,
                    ProductionPercentage: e.target.ProductionPercentage.value
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
    const [selectedValue, setDropdownValue] = useState(props.selectedValue);

    const closeModal = (e) => {
        setValidated(false);
        props.onCountAdd(props.count);
        props.onHide();
        resetState();
        e.target.reset();
    };

    const [_lotid, setLotId] = useState();
    const [_lotname, setLotName] = useState();
    const [_totalegg, setTotalEgg] = useState(0);
    const [_brokenegg, setBrokenEgg] = useState(0);
    const [_lotdetails, setLotDetails] = useState();
    const [_totalbirds, setTotalBirds] = useState();
    const [_agedays, setAgeDays] = useState(0);
    const [_ageweeks, setAgeWeeks] = useState(0);

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
                    //AgeInDays(new Date(),data.Date)


                    var a = moment(new Date(), 'DD-MM-YYYY');
                    var b = moment(new Date(data.Date), 'DD-MM-YYYY');
                    const weeks = a.diff(b, 'week');
                    const days = a.diff(b, 'days');
                    setAgeDays(days);
                    setAgeWeeks(weeks);
                    //alert("age in week :"+days+"/"+weeks)
                });
        }
        else {
            resetState();
        }
    }
    const resetState=()=>
    {
        setLotId("");
        setLotName("");
        setLotDetails("");
        setTotalBirds("");
        setAgeDays("");
        setAgeWeeks("");
        setTotalEgg("");
        setBrokenEgg("");
    }

    const changeTotalEggs = (e) => {

        if (!isNaN(parseInt(e.value))) {
            
            if(parseInt(e.value) <= 0)
            {
                setTotalEgg(0);
            }
            else{
                setTotalEgg(parseInt(e.value));
            }
        }

        else {
            setTotalEgg(0);
        }
        setTotalEgg(e.value <= 0 ? 0 : parseInt(e.value));
    }
    const changeBrokenEggs = (e) => {

        if (!isNaN(parseInt(e.value))) {
            if(parseInt(e.value) <= 0)
            {
                setBrokenEgg(0);
            }
            else{
                setBrokenEgg(parseInt(e.value));
            }
        }
        else {
            setBrokenEgg(0);
        }
    }


    return (
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
                                        <Form.Group controlId="Date" as={Col} >
                                            <Form.Label>Date</Form.Label>
                                            <DateComponent date={null} />
                                            {/* <Form.Control
                                            type="date"
                                            value={initialvalues.startdate ? dateForPicker(initialvalues.startdate) : ''}
                                            onfocus={dateForPicker(initialvalues.startdate)}
                                            placeholder={initialvalues.startdate ? dateForPicker(initialvalues.startdate) : ""}
                                           onChange={({ target }) => changeValues(target)}
                                        /> */}
                                        </Form.Group>

                                        <Form.Group controlId="ShedId" as={Col} >
                                            <Form.Label>Shed</Form.Label>
                                            <Form.Select aria-label="Default select example"
                                                onChange={onShedChange} required>
                                                <option>--Select--</option>
                                                {
                                                    props.shedlist.map((item) => {
                                                        return (
                                                            <option
                                                                key={item.ShedId}
                                                                defaultValue={item.ShedId == null ? null : item.ShedId}
                                                                selected={item.ShedId === selectedValue}
                                                                value={item.ShedId}
                                                            >{item.ShedName}</option>
                                                        );
                                                    })
                                                }
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select Shed number
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
                                        <Form.Group controlId="Age" as={Col} >
                                            <Form.Label>Age(days/Week)</Form.Label>
                                            <Form.Control type="text" name="Age" required disabled value={_agedays + " / " + _ageweeks}
                                                placeholder="" />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter age in days/weeks
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="TotalBirds" as={Col} >
                                            <Form.Label>Total Bird</Form.Label>
                                            <Form.Control type="number" name="TotalBirds" required disabled value={_totalbirds}
                                                placeholder="" />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter total bird
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-12">

                                        <Form.Group controlId="TotalEggs" as={Col} >
                                            <Form.Label>Total Eggs</Form.Label>
                                            <Form.Control type="number" name="TotalEggs" required
                                                placeholder="Total egg" onChange={({ target }) => changeTotalEggs(target)} value={_totalegg}/>
                                            <Form.Control.Feedback type="invalid">
                                                Please enter total no of eggs
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="BrokenEggs" as={Col} >
                                            <Form.Label>Broken Eggs</Form.Label>
                                            <Form.Control type="number" name="BrokenEggs" required onChange={({ target }) => changeBrokenEggs(target)} value={_brokenegg}
                                                placeholder="Broken eggs" />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter total no of broken eggs
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="OkEggs" as={Col} >
                                            <Form.Label>OK Eggs</Form.Label>
                                            <Form.Control type="number" name="OkEggs" required disabled value={(parseInt(_totalegg) - parseInt(_brokenegg))<=0?0:(parseInt(_totalegg) - parseInt(_brokenegg))}
                                                placeholder="" />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter total no of OK eggs
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="ProductionPercentage" as={Col} >
                                            <Form.Label>Production percentage</Form.Label>
                                            <Form.Control type="number" name="ProductionPercentage" required disabled value={((parseInt(_totalegg) / _totalbirds) * 100).toFixed(2)}
                                                placeholder="" />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter production percentage
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-12">
                                        <Form.Group controlId="FeedIntech" as={Col} >
                                            <Form.Label>Feed Intech</Form.Label>
                                            <Form.Control type="text" name="FeedIntech" required
                                                placeholder="Feed intech" />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter feed intech
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Form.Group>
                                        <Button variant="primary" type="submit" style={{ marginTop: "10px" }} >
                                            Add
                                        </Button>
                                        <Button variant="danger" style={{ marginTop: "10px", marginLeft: "10px" }} onClick={(e) => {
                                            closeModal();
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
        </div>
    )
}

export default AddEggDailyTracker
