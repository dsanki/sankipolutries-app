import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';

function CustomerList(props) {

    let history = useNavigate();

    const [customerdata, setCustomerData] = useState([]);
    const [customerlist, setCustomerList] = useState([]);
    const [producttypes, setProductType] = useState([]);
    const [validated, setValidated] = useState(false);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [photofilename, setPhotoFileName] = useState("annonymous.jpg");
    //const [isCustomerTypeValid, setCustomerTypeValid] = useState(false);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    const initialvalues = {
        modaltitle: "",
        ID: 0,
        FirstName: "",
        MiddleName: "",
        LastName: "",
        MobileNo: "",
        DOB: "",
        CustomerTypeId: 0,
        Email: "",
        IsActive: true,
        ProfileImageUrl: "annonymous.jpg"
    };

    const [custdata, setCustData] = useState(initialvalues);

    const clickAddCustomer = () => {
        setAddModalShow({ addModalShow: true });
        setCustData({
            modaltitle: "Add Customer",
            ID: 0,
            FirstName: "",
            MiddleName: "",
            LastName: "",
            MobileNo: "",
            DOB: "",
            CustomerTypeId: 0,
            Email: "",
            IsActive: true,
            ProfileImageUrl: "annonymous.jpg"
        })
    }

    const clickEditCustomer = (customerData) => {
        setAddModalShow({ addModalShow: true });
        setCustData({
            modaltitle: "Edit Customer",
            ID: customerData.ID,
            FirstName: customerData.FirstName,
            MiddleName: customerData.MiddleName,
            LastName: customerData.LastName,
            MobileNo: customerData.MobileNo,
            DOB: customerData.DOB,
            CustomerTypeId: customerData.CustomerTypeId,
            Email: customerData.Email,
            IsActive: customerData.IsActive,
            ProfileImageUrl: customerData.ProfileImageUrl
        })
    }

    const firstNameChange = (e) => {
        setCustData({ ...custdata, FirstName: e.target.value });
    }
    const middleNameChange = (e) => {
        setCustData({ ...custdata, MiddleName: e.target.value });
    }
    const lastNameChange = (e) => {
        setCustData({ ...custdata, LastName: e.target.value });
    }

    const emailChange = (e) => {
        setCustData({ ...custdata, Email: e.target.value });
    }

    const mobileNoChange = (e) => {
        setCustData({ ...custdata, MobileNo: e.target.value });
    }

    const dobChange = (e) => {
        setCustData({ ...custdata, DOB: e.target.value });
    }

    const custTypeChange = (e) => {
        if (e.target.value === "-1" || e.target.value === -1) {
            //  setCustomerTypeValid(false);

        }
        else {
            //setCustomerTypeValid(true);
            setCustData({ ...custdata, CustomerTypeId: e.target.value });
        }


    }

    const deleteCustomer = (id) => {

        if (window.confirm('Are you sure?')) {
            fetch(variables.REACT_APP_API + 'Customer/' + id, {
                method: 'DELETE',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then((result) => {
                    addCount(count);
                    props.showAlert("Successfully deleted", "info")
                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    });

        }

    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchCustomer();
            fetchCutomerTypes();
        }
        else {
            history("/login")
        }
    }, [obj]);

    const fetchCustomer = async () => {
        fetch(variables.REACT_APP_API + 'Customer/GetCustomer')
            .then(response => response.json())
            .then(data => {
                setCustomerList(data);
                setTotalPages(Math.ceil(data.length / variables.PAGE_PAGINATION_NO));
            });
    }

    const fetchCutomerTypes = async () => {
        fetch(variables.REACT_APP_API + 'ProductType/GetProductType')
            .then(response => response.json())
            .then(data => {
                setProductType(data);
            });
    }

    const profileImageUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", e.target.files[0], e.target.files[0].name);
        fetch(variables.REACT_APP_API + 'Customer/SaveProfileImage', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                //setPhotoFileName(data);

                setCustData({ ...custdata, ProfileImageUrl: data });
            })

    }
    const handleSubmitEdit = (e) => {
        e.preventDefault();
        var _form = e.target.closest('.needs-validation');
        console.log(_form.checkValidity());
        if (!_form.checkValidity()) {
            e.stopPropagation();
        }
        else {

            fetch(variables.REACT_APP_API + 'Customer/UpdateCustomer', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: custdata.ID,
                    FirstName: custdata.FirstName,
                    MiddleName: custdata.MiddleName,
                    LastName: custdata.LastName,
                    MobileNo: custdata.MobileNo,
                    DOB: custdata.DOB,
                    CustomerTypeId: custdata.CustomerTypeId,
                    Email: custdata.Email,
                    IsActive: custdata.IsActive,
                    ProfileImageUrl: custdata.ProfileImageUrl

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result > 0 || result.StatusCode === 200 || result.StatusCode === "OK") {
                        addCount(count);
                        setAddModalShow(false);

                        props.showAlert("Successfully updated", "info")
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

    const dateForPicker = (dateString) => {
        return moment(new Date(dateString)).format('YYYY-MM-DD')
    };

    let addCount = (num) => {
        setCount(num + 1);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        var _form = e.target.closest('.needs-validation');
        console.log(_form.checkValidity());
        if (!_form.checkValidity()) {
            e.stopPropagation();
        }
        else {
            fetch(variables.REACT_APP_API + 'Customer/AddCustomer', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: custdata.ID,
                    FirstName: custdata.FirstName,
                    MiddleName: custdata.MiddleName,
                    LastName: custdata.LastName,
                    MobileNo: custdata.MobileNo,
                    DOB: custdata.DOB,
                    CustomerTypeId: custdata.CustomerTypeId,
                    Email: custdata.Email,
                    IsActive: custdata.IsActive,
                    ProfileImageUrl: custdata.ProfileImageUrl

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
                    }
                    if (result === 401) {
                        history("/login")
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


    // const [form, setForm] = useState({
    //     customertype: null
    // });

    // const onHandleChange = useCallback((value, name) => {
    //     setForm(prev => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // }, []);

    // const onValidate = (value, name) => {
    //     setError(prev => ({
    //         ...prev,
    //         [name]: { ...prev[name], errorMsg: value }
    //     }));
    // }

    // const [error, setError] = useState({
    //     customertype: {
    //         isReq: true,
    //         errorMsg: '',
    //         onValidateFunc: onValidate
    //     }
    // });

    // const validateForm = () => {
    //     let isInvalid = false;
    //     Object.keys(error).forEach(x => {
    //         const errObj = error[x];
    //         if (errObj.errorMsg) {
    //             isInvalid = true;
    //         } else if (errObj.isReq && !form[x]) {
    //             isInvalid = true;
    //             onValidate(true, x);
    //         }
    //     });
    //     return !isInvalid;
    // }

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
    const nextDisabled = currentPage === totalPages

    const itemsPerPage =variables.PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = customerlist.slice(startIndex, endIndex);


    return (
        <div>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Welcome to Customer List  page</h2>
            </div>
            <div className="row">
                <div className="col" style={{textAlign:'right'}}>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddCustomer()}>Add</Button>
                </div>

            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='left'>
                        <th>First name</th>
                        <th>Middle name</th>
                        <th>Last name</th>
                        <th>Mobile no</th>
                        <th>Customer type</th>
                        <th>Email</th>
                        <th>DOB</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>


                    {

itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
                            //console.log(itemsToDiaplay.length);
                            const ctype = producttypes.filter((c) => c.ProductId === p.CustomerTypeId);
                            const cname = ctype.length > 0 ? ctype[0].ProductName : "";
                            return (
                                <tr align='center' key={p.ID}>
                                    <td align='left'>
                                        <a href={`/eggsale/${p.ID}`}>{p.FirstName}
                                            <span className="sr-only">(current)</span></a>

                                    </td>
                                    <td align='left'>{p.MiddleName}</td>
                                    <td align='left'>{p.LastName}</td>
                                    <td align='left'>{p.MobileNo}</td>
                                    <td align='left'>{cname}</td>
                                    <td align='left'>{p.Email}</td>
                                    <td align='left'>{moment(p.DOB).format('DD-MMM-YYYY')}</td>
                                    {/* <td>
                                        <ButtonToolbar>
                                            <Button className="mr-2" variant="primary"
                                                style={{ marginRight: "17.5px" }}
                                                onClick={() => clickEditCustomer(p)}>Edit</Button>
                                        </ButtonToolbar>
                                    </td> */}
                                    <td align='center'>
                                        {
                                            <ButtonToolbar>

                                                <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditCustomer(p)}></i>

                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteCustomer(p.ID)}></i>}



                                            </ButtonToolbar>
                                        }
                                    </td>
                                </tr>
                            )
                        }) : ''
                    }
                </tbody>
            </Table >

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

            <div className="ContainerOverride" id="exampleModal">
                <Modal
                    show={addModalShow}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {custdata.modaltitle}
                        </Modal.Title>

                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>

                                <div>
                                    <Form noValidate validated={validated} className="needs-validation">
                                        <Row className="mb-12">
                                            <Form.Group controlId="FirstName" as={Col} >
                                                <Form.Label>First name</Form.Label>
                                                <Form.Control type="text" name="FirstName" required value={custdata.FirstName}
                                                    placeholder="First name" onChange={firstNameChange} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter first name
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group controlId="MiddleName" as={Col} >
                                                <Form.Label>Middle name</Form.Label>
                                                <Form.Control type="text" name="MiddleName" onChange={middleNameChange}
                                                    placeholder="Middle name" value={custdata.MiddleName} />
                                            </Form.Group>
                                            <Form.Group controlId="LastName" as={Col} >
                                                <Form.Label>Last name</Form.Label>
                                                <Form.Control type="text" name="LastName" required onChange={lastNameChange}
                                                    placeholder="Last name" value={custdata.LastName} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter last name
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                        </Row>

                                        <Row className="mb-12">
                                            <Form.Group controlId="Email" as={Col} >
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="text" name="Email" required onChange={emailChange} value={custdata.Email}
                                                    placeholder="Email" />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter email
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group controlId="MobileNo" as={Col} >
                                                <Form.Label>Mobile no</Form.Label>
                                                <Form.Control type="text" name="MobileNo" required onChange={mobileNoChange} value={custdata.MobileNo}
                                                    placeholder="Mobile no" />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter mobile no
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group controlId="CustomerTypeId" as={Col} >
                                                <Form.Label>Customer type</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={custTypeChange} required>
                                                    {/* <option key="-1" value="-1">--Select--</option> */}

                                                    <option selected disabled value="">Choose...</option>
                                                    {
                                                        producttypes.map((item) => {
                                                            //const ctype = customertypes.filter((c) => c.ProductId === p.CustomerTypeId);
                                                            //const cname = ctype.length > 0 ? ctype[0].ProductName : "";

                                                            return (

                                                                <option
                                                                    key={item.ProductId}
                                                                    defaultValue={item.ProductId == null ? null : item.ProductId}
                                                                    selected={item.ProductId === custdata.CustomerTypeId}
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

                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="DOB">
                                                <Form.Label>Date</Form.Label>
                                                {/* <DateComponent date={custdata.DOB} /> */}

                                                <Form.Control
                                                    type="date"
                                                    value={custdata.DOB ? dateForPicker(custdata.DOB) : ''}
                                                    onChange={dobChange} required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select DOB
                                                </Form.Control.Feedback>

                                            </Form.Group>

                                        </Row>
                                        <Row className="mb-12">
                                            <Form.Group as={Col} controlId="ProfileImageUrl">

                                                <Form.Label>Customer photo</Form.Label>
                                                <input class="form-control" type="file" id="formFile" onChange={profileImageUpload} multiple="false" accept="image/*"  />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select image
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="ProfileImageUrl">
                                                <img width="250px" height="250px" src={variables.PHOTO_URL + custdata.ProfileImageUrl} />
                                            </Form.Group>

                                        </Row>

                                        <Form.Group as={Col}>
                                            {custdata.ID <= 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                                                    Add
                                                </Button>
                                                : null
                                            }

                                            {custdata.ID > 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitEdit(e)}>
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

        </div>
    )
}

export default CustomerList
