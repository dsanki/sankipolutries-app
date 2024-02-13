import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import DateComponent from '../DateComponent';

function AddCustomer(props) {
    let history = useNavigate();
    const [customertypes, setCustomerTypes] = useState([props.customertypes]);
    const [customerdata, SetCustomerData] = useState([]);
    const [validated, setValidated] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);



    // const initialvalues = {
    //     id: props.id,
    //     date: props.date,
    //     shedid: props.shedid,
    //     lotid: props.lotid,
    //     lotname:props.lotname,
    //     totalbirds:props.totalbirds,
    //     totaleggs: props.totaleggs,
    //     brokeneggs: props.brokeneggs,
    //     okeggs: props.okeggs,
    //     feedintech: props.feedintech,
    //     productionpercentage: props.productionpercentage
    // };


    const[photofilename, setPhotoFileName]=useState("annonymous.png");


    useEffect((e) => {

        if (localStorage.getItem('token')) {

        }
        else {
            history("/login")
        }
    }, [obj]);

    // const fetchSheds = async () => {
    //     fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedList')
    //         .then(response => response.json())
    //         .then(data => {
    //             setShedList(data);
    //         });
    // }

    const deleteShedLotMap = () => {

    }

    // const fetchLots = async () => {
    //     fetch(variables.REACT_APP_API + 'ChicksMaster/GetLots')
    //         .then(response => response.json())
    //         .then(data => {
    //             setLots(data);
    //         });
    // }

    // const fetchShedLotsMapList = async () => {
    //     fetch(variables.REACT_APP_API + 'ChicksMaster/GetShedLotMapList')
    //         .then(response => response.json())
    //         .then(data => {
    //             SetShedLotMapList(data);
    //         });
    // }

    // const onShedChange = (e) => {
    //     const shedid = e.target.value;
    //     setDropdownValue(shedid);
    //     const filterval = props.shedlotmaplist.filter((c) => c.shedid === parseInt(shedid));
    //     if (filterval.length > 0) {
    //         setLotId(filterval[0].lotid);
    //         setLotName(filterval[0].lotname);
    //         fetch(variables.REACT_APP_API + 'ChicksMaster/' + filterval[0].lotid)
    //             .then(response => response.json())
    //             .then(data => {
    //                 setLotDetails(data);
    //                 setTotalBirds(data.TotalBirdSale)
    //             });
    //     }
    //     else {
    //         //resetState();
    //     }
    // }

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

            fetch(variables.REACT_APP_API + 'Customer/AddCustomer', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    //'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: 0,
                    FirstName: e.target.FirstName.value,
                    MiddleName: e.target.MiddleName.value,
                    LastName: e.target.LastName.value,
                    MobileNo: e.target.MobileNo.value,
                    DOB: e.target.DOB.value,
                    CustomerTypeId: e.target.CustomerTypeId.value,
                    Email: e.target.Email.value,
                    PhotoURL: e.target.MortalityNumber.value,
                    IsActive: True,
                    ProfileImageUrl: ""

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

    const profileImageUpload=(e)=>
    {
        e.preventDefault();
        const formData=new FormData();
        formData.append("file",e.target.files[0],e.target.files[0].name);
        fetch(variables.REACT_APP_API + 'Customer/SaveProfileImage', {
            method: 'POST',
            body:formData
        })
        .then(res=>res.json())
        .then(data=>{
            setPhotoFileName(data);
        })

    }

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
                                            <Form.Group controlId="FirstName" as={Col} >
                                                <Form.Label>First name</Form.Label>
                                                <Form.Control type="text" name="FirstName" required
                                                    placeholder="First name" />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter first name
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group controlId="MiddleName" as={Col} >
                                                <Form.Label>Middle name</Form.Label>
                                                <Form.Control type="text" name="MiddleName"
                                                    placeholder="Middle name" />
                                            </Form.Group>
                                            <Form.Group controlId="LastName" as={Col} >
                                                <Form.Label>Last name</Form.Label>
                                                <Form.Control type="text" name="LastName" required
                                                    placeholder="Last name" />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter last name
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                        </Row>

                                        <Row className="mb-12">
                                            <Form.Group controlId="Email" as={Col} >
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="text" name="Email" required
                                                    placeholder="Email" />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter email
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group controlId="MobileNo" as={Col} >
                                                <Form.Label>Mobile no</Form.Label>
                                                <Form.Control type="text" name="MobileNo" required
                                                    placeholder="Mobile no" />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter mobile no
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group controlId="ProductId" as={Col} >
                                                <Form.Label>Customer type</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={onShedChange} required>
                                                    <option>--Select--</option>
                                                    {
                                                        props.customertypes.map((item) => {
                                                            //const ctype = customertypes.filter((c) => c.ProductId === p.CustomerTypeId);
                                                            //const cname = ctype.length > 0 ? ctype[0].ProductName : "";

                                                            return (

                                                                <option
                                                                    key={item.ProductId}
                                                                    defaultValue={item.ProductId == null ? null : item.ProductId}
                                                                    // selected={item.CustomerTypeId === selectedValue}
                                                                    value={item.ProductId}
                                                                >{item.ProductName}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select customer type
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>

                                        <Row className="mb-4">
                                            <Form.Group as={Col} controlId="DOB">
                                                <Form.Label>Date</Form.Label>
                                                <DateComponent date={null} />
                                            </Form.Group>
                                        </Row>
                                        <Row className="mb-8">
                                            <Form.Group as={Col} controlId="DOB">
                                                <Form.Label>Customer photo</Form.Label>
                                                <input class="form-control" type="file" id="formFile" onChange={profileImageUpload} />
                                            </Form.Group>
                                            <Form.Group as={Col}>
                                              <img width="250px" height="250px" src={variables.PHOTO_URL+photofilename}/>
                                            </Form.Group>
                                        </Row>
                                      
                                        <Form.Group as={Col}>
                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }}>
                                                Add
                                            </Button>
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

        </>
    )
}

export default AddMortality
