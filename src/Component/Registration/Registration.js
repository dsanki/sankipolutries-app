import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import Moment from 'moment';
import { useNavigate } from 'react-router-dom'
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'
import Loading from '../Loading/Loading'
import { HandleLogout, FetchCompanyDetails } from './../../Utility'
import moment from 'moment';


function Registration(props) {

    let history = useNavigate();

    const [users, setUsers] = useState([]);
    //const [userdata, setUserData] = useState([]);
    const [companylist, setCompanyList] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [cartonId, setCartonId] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);
    const [count, setCount] = useState(0);
    const [validated, setValidated] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isloaded, setIsLoaded] = useState(true);

    const [input, setInput] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        IsAdmin: '',
        CompanyId: ''
    });



    const initialvalues = {
        modaltitle: "",
        Id: 0,
        UserName: "",
        IsAdmin: "",
        PasswordHash: "",
        PasswordSalt: "",
        CompanyId: localStorage.getItem('companyid'),
        Password: "",
        ConfirmPassword: ""
    };

    const [userdata, setUserData] = useState(initialvalues);

    const deleteUser = (id) => {

    }
    const clickUserAdd = () => {
        setAddModalShow({ addModalShow: true });
        setUserData({
            modaltitle: "Add User",
            Id: 0,
            UserName: "",
            IsAdmin: "",
            PasswordHash: "",
            PasswordSalt: "",
            CompanyId: localStorage.getItem('companyid'),
            Password: "",
            ConfirmPassword: ""
        })
    }


    const onInputChange = e => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
        validateInput(e);
    }

    const [error, setError] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        IsAdmin: '',
        CompanyId: ''
    })



    const validateInput = e => {
        let { name, value } = e.target;
        setError(prev => {
            const stateObj = { ...prev, [name]: "" };

            switch (name) {
                case "username":
                    if (!value) {
                        stateObj[name] = "Please enter Username.";
                    }
                    break;

                case "password":
                    if (!value) {
                        stateObj[name] = "Please enter Password.";
                    } else if (input.confirmPassword && value !== input.confirmPassword) {
                        stateObj["confirmPassword"] = "Password and Confirm Password does not match.";
                    } else {
                        stateObj["confirmPassword"] = input.confirmPassword ? "" : error.confirmPassword;
                    }
                    break;

                case "confirmPassword":
                    if (!value) {
                        stateObj[name] = "Please enter Confirm Password.";
                    } else if (input.password && value !== input.password) {
                        stateObj[name] = "Password and Confirm Password does not match.";
                    }
                    break;

                default:
                    break;
            }

            return stateObj;
        });
    }

    const passwordChange = (e) => {
        setUserData({ ...userdata, Password: e.target.value })
    }

    const usernameChange = (e) => {
        setUserData({ ...userdata, UserName: e.target.value })
    }

    const isAdminChange = (e) => {
        setUserData({ ...userdata, IsAdmin: e.target.value })
    }

    const [conferror, setConfirmError] = useState();

    const confirmpasswordChange = (e) => {
        setUserData({ ...userdata, ConfirmPassword: e.target.value });
        if (e.target.value == '') {
            setConfirmError("Please enter Confirm Password.")
        }
        else if (userdata.Password && e.target.value !== userdata.Password) {
            setConfirmError("Password and Confirm Password does not match.")
        }
    }

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    const clickEditUser = (usr) => {
        setAddModalShow({ addModalShow: true });
        setUserData({
            modaltitle: "Edit User",
            Id: usr.Id,
            UserName: usr.UserName,
            IsAdmin: usr.IsAdmin,
            PasswordHash: usr.PasswordHash,
            PasswordSalt: usr.PasswordSalt,
            CompanyId: usr.CompanyId,
            Password: usr.Password,
            ConfirmPassword: usr.ConfirmPassword

        })
    }

    const obj = useMemo(() => ({ count }), [count]);

    useEffect((e) => {
        if (localStorage.getItem('token')) {
            fetchCompanyDetails();
        }
        else {
            history("/login")
        }
    }, []);

    useEffect((e) => {
        if (localStorage.getItem('token')) {
            fetchUsers();
        }
        else {
            history("/login")
        }
    }, [obj]);

    const fetchCompanyDetails = async () => {
        FetchCompanyDetails(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setCompanyList(data.Result);

                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }
            })
    }


    const fetchUsers = async () => {
        setIsLoaded(true);
        await fetch(process.env.REACT_APP_API + 'Registration/GetUsers?CompanyId='
            + localStorage.getItem('companyid'),
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(result => {

                if (result.StatusCode === 200) {
                    setUsers(result.Result);
                    if (result.Result.length > 0) {
                        setCount(result.Result.length);
                        setTotalPages(Math.ceil(result.Result.length / itemsPerPage));
                    }

                    setIsLoaded(false);
                }
                else if (result.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (result.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                    setIsLoaded(false);
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                    setIsLoaded(false);
                }
            });
    }

    let addCount = (num) => {
        setCount(num + 1);
    };

    const handleEditUser = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'Registration/EditUser', {
                method: 'Put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: userdata.Id,
                    UserName: userdata.UserName,
                    Password: userdata.Password,
                    ConfirmPassword: userdata.ConfirmPassword,
                    IsAdmin: userdata.IsAdmin,
                    CompanyId: userdata.CompanyId
                })
            })
                .then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully updated", "info")
                    }
                    else if (result.StatusCode === 401) {
                        HandleLogout();
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

            setValidated(false);
        }
    }

    const handleAddUser = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'Registration/AddUser', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: 0,
                    UserName: userdata.UserName,
                    Password: userdata.Password,
                    ConfirmPassword: userdata.ConfirmPassword,
                    IsAdmin: userdata.IsAdmin,
                    CompanyId: userdata.CompanyId
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
                        HandleLogout();
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

            setValidated(false);
        }
    }


    return (
        <div>
            <>
                {isloaded && <Loading />}
                <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h2>Users</h2>
                </div>

                <div class="row">

                    <div class="col-md-3">
                        <div class="row"><div class="col-md-6" style={{ textAlign: 'right' }}>
                            <Button className="mr-2" variant="primary"
                                style={{ marginRight: "17.5px" }}
                                onClick={() => clickUserAdd()}>Add</Button></div>

                        </div></div>
                </div>

                {<Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                        <tr align='center' className="tr-custom">
                            <th>User name</th>
                            <th>Is Admin</th>
                            <th>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users && users.length > 0 ? users.map((item) => {
                                return (
                                    !isloaded && <tr key={item.Id} align='center' style={{ fontSize: 13 }}>
                                        <td>{item.UserName}</td>
                                        <td>{item.IsAdmin}</td>
                                        <td>
                                            {
                                                <ButtonToolbar>
                                                    <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }}
                                                        onClick={() => clickEditUser(item)}></i>
                                                    {localStorage.getItem('isadmin') === 'true' &&
                                                        <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }}
                                                            onClick={() => deleteUser(item.Id)}></i>}
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
                </Table >

                }

                {/* {
                cartons && cartons.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
                <>
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
                </>
            } */}

                <div className="ContainerOverride">

                    <Modal
                        show={addModalShow}
                        {...props}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Add User
                            </Modal.Title>
                            <button type="button" class="btn-close" aria-label="Close"
                                onClick={addModalClose}> </button>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col sm={12}>

                                    <Form className="needs-validation" noValidate validated={validated}>

                                        <Row className="mb-12">
                                            <InputField controlId="UserName" label="User name"
                                                type="text"
                                                value={userdata.UserName}
                                                name="UserName"
                                                placeholder="User Name"
                                                errormessage={error.username}
                                                required={true}
                                                disabled={false}
                                                onChange={usernameChange}
                                                collength={'col-6'}
                                            />


                                        </Row>
                                        <Row className="mb-12">
                                            <InputField controlId="Password" label="Password"
                                                type="password"
                                                value={userdata.Password}
                                                name="Password"
                                                placeholder="Password"
                                                errormessage={error.password}
                                                required={true}
                                                disabled={false}
                                                onChange={passwordChange}
                                                collength={'col-6'}
                                            />

                                        </Row>
                                        <Row className="mb-12">
                                            <InputField controlId="ConfirmPassword" label="Confirm Password"
                                                type="password"
                                                value={userdata.ConfirmPassword}
                                                name="ConfirmPassword"
                                                placeholder="Confirm Password"
                                                errormessage={conferror}
                                                required={true}
                                                disabled={false}
                                                onChange={confirmpasswordChange}
                                                collength={'col-6'}
                                            />

                                        </Row>
                                        <Row className="col-6" style={{
                                            marginLeft: '14px',
                                            marginTop: '15px',
                                            fontSize: '14px'
                                        }}>

                                            <Form.Check style={{ fontSize: '14px' }}
                                                type="checkbox"
                                                id="chkIsAdmin"
                                                label="Is Admin"
                                                onChange={isAdminChange}
                                                value={userdata.IsAdmin}
                                                checked={userdata.IsAdmin}

                                            />

                                        </Row>



                                        <Form.Group as={Col}>
                                            {userdata.Id <= 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }}
                                                    onClick={(e) => handleAddUser(e)}>
                                                    Add
                                                </Button>
                                                : null
                                            }

                                            {userdata.Id > 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }}
                                                    onClick={(e) => handleEditUser(e)}>
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
                                </Col>
                            </Row>
                        </Modal.Body>

                        <Modal.Footer>

                        </Modal.Footer>

                    </Modal>
                </div>
            </>
        </div>
    )
}

export default Registration
