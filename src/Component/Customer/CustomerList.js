import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { variables } from '../../Variables';
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';

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
    const [addModalShow, setAddModalShow] = useState(false);
    const [photofilename, setPhotoFileName] = useState("annonymous.jpg");
    const [filterCutomerType, setFilterCutomerType] = useState("");
    const [filterCutomerName, setFilterCutomerName] = useState("");
    const [customerListForFilter, setCustomerListForFilter] = useState([]);

    const search = useLocation().search;
    const [_type, setType] = useState(new URLSearchParams(search).get('customertype'));



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
        //DOB: "",
        CustomerTypeId: 0,
        Email: "",
        IsActive: true,
        ProfileImageUrl: "annonymous.jpg",
        Address: ""
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
            //DOB: "",
            CustomerTypeId: "",
            Email: "",
            IsActive: true,
            ProfileImageUrl: "annonymous.jpg",
            Address: "",
            CustomerId:""
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
            //DOB: customerData.DOB,
            CustomerTypeId: customerData.CustomerTypeId,
            Email: customerData.Email,
            IsActive: customerData.IsActive,
            ProfileImageUrl: customerData.ProfileImageUrl,
            Address: customerData.Address,
            CustomerId:customerData.CustomerId
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

    const customerChange = (e) => {
        setCustData({ ...custdata, CustomerId: e.target.value });
    }

    const mobileNoChange = (e) => {
        setCustData({ ...custdata, MobileNo: e.target.value });
    }

    // const dobChange = (e) => {
    //     setCustData({ ...custdata, DOB: e.target.value });
    // }

    const custTypeChange = (e) => {
        setCustData({ ...custdata, CustomerTypeId: e.target.value });
    }

    const addresschange = (e) => {
        setCustData({ ...custdata, Address: e.target.value });
    }



    const deleteCustomer = (id) => {

        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'Customer/' + id, {
                method: 'DELETE',
                header: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        props.showAlert("Successfully deleted", "info");
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
        fetch(process.env.REACT_APP_API + 'Customer/GetCustomer',
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
                    var filterList = data.Result;
                    //var custype=producttypes.filter(x=>x.ProductName==_type);
                    if (typeof (_type) !== 'undefined' && _type != null) {
                        setFilterCutomerType(_type);
                        filterList = data.Result.filter((c) => c.CustomerTypeId == _type);
                    }

                    setCustomerList(filterList);
                    setCustomerListForFilter(data.Result);
                    setTotalPages(Math.ceil(filterList.length / process.env.REACT_APP_PAGE_PAGINATION_NO));
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

    const fetchCutomerTypes = async () => {
        fetch(process.env.REACT_APP_API + 'ProductType/GetProductType',
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

    const profileImageUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", e.target.files[0], e.target.files[0].name);
        fetch(process.env.REACT_APP_API + 'Customer/SaveProfileImage', {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.StatusCode === 200) {
                    setCustData({ ...custdata, ProfileImageUrl: data.Result });
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

            fetch(process.env.REACT_APP_API + 'Customer/UpdateCustomer', {
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
                    //DOB: custdata.DOB,
                    CustomerTypeId: custdata.CustomerTypeId,
                    Email: custdata.Email,
                    IsActive: custdata.IsActive,
                    ProfileImageUrl: custdata.ProfileImageUrl,
                    Address: custdata.Address

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);

                        props.showAlert("Successfully updated", "info")
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
            fetch(process.env.REACT_APP_API + 'Customer/AddCustomer', {
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
                    // DOB: custdata.DOB,
                    CustomerTypeId: custdata.CustomerTypeId,
                    Email: custdata.Email,
                    IsActive: custdata.IsActive,
                    ProfileImageUrl: custdata.ProfileImageUrl,
                    Address: custdata.Address

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
                    }
                    else if (result.StatusCode === 401) {
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

    const itemsPerPage = process.env.REACT_APP_PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = customerlist.slice(startIndex, endIndex);


    const onCustomerTypeChange = (e) => {
        setFilterCutomerType(e.target.value);
        getFilterCustomerListData(filterCutomerName, e.target.value);

        const url = new URL(window.location.href);
        url.searchParams.set('customertype', e.target.value);
        window.history.pushState(null, '', url.toString());
    }

    const customerNameSearch = (e) => {
        setFilterCutomerName(e.target.value);
        getFilterCustomerListData(e.target.value, filterCutomerType);
    }

    const getFilterCustomerListData = (custname, custType) => {
        let _filterList = [];
        if (custname !== "") {
            _filterList = customerListForFilter.filter(((c) => c.FirstName
                .toLowerCase().includes(custname.toLowerCase()) ||
                c.LastName.toLowerCase().includes(custname.toLowerCase()))
            );
        }
        else {
            _filterList = customerListForFilter;
        }

        if (custType > 0) {
            _filterList = _filterList.filter((c) => c.CustomerTypeId == custType);
        }
        setCustomerList(_filterList);
    }




    return (
        <div>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Customer List</h2>
            </div>
            <div className="container" style={{ marginTop: '10px', width: '50%' }}>
                <div className="row align-items-center">
                    <div className="col">
                        <InputField label="Customer name"
                            type="text"
                            value={filterCutomerName}
                            name="CustomerName"
                            placeholder="Search customer"
                            onChange={customerNameSearch}
                            required={false}
                            disabled={false}

                        />
                    </div>

                    <div className="col">

                        <label class="form-label" style={{ fontSize: 13 }}>Customer Type</label>

                        <Form.Select aria-label="Default select example"
                            onChange={onCustomerTypeChange} style={{ fontSize: 13 }}>
                            <option selected value="">Choose...</option>
                            {
                                producttypes.map((item) => {
                                    return (
                                        <option
                                            key={item.ProductId}
                                            defaultValue={item.ProductId == null ? null : item.ProductId}
                                            selected={item.ProductId === parseInt(filterCutomerType)}
                                            value={item.ProductId}
                                        >{item.ProductName}</option>

                                    );
                                })
                            }
                        </Form.Select>
                    </div>
                    <div className="col" style={{ textAlign: 'right', marginTop: '30px' }}>
                        <Button className="mr-2" variant="primary"
                            style={{ marginRight: "17.5px" }}
                            onClick={() => clickAddCustomer()}>Add</Button>
                    </div>
                </div>
            </div>
            {/* <div className="row">
              

            </div> */}

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='left' className="tr-custom">
                        <th>Name</th>
                        <th>Mobile no</th>
                        <th>Customer type</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>


                    {

                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
                            //console.log(itemsToDiaplay.length);
                            const ctype = producttypes.filter((c) => c.ProductId === p.CustomerTypeId);
                            const cname = ctype.length > 0 ? ctype[0].ProductName : "";
                            let fullname = (p.MiddleName != "" && p.MiddleName != null) ? p.FirstName + " " + p.MiddleName + " " + p.LastName :
                                p.FirstName + " " + p.LastName;
                            return (
                                <tr align='center' key={p.ID} style={{ fontSize: 13 }} >
                                    <td align='left'>
                                        {


                                            p.CustomerTypeId === 4 ?
                                                <a href={`/birdsale/?uid=${p.ID}`}>{fullname}
                                                    <span className="sr-only">(current)</span></a>
                                                : <a href={`/eggsale/?uid=${p.ID}`}>{fullname}
                                                    <span className="sr-only">(current)</span></a>
                                        }
                                        {/* <a href={`/eggsale/${p.ID}`}>{p.FirstName}
                                            <span className="sr-only">(current)</span></a> */}

                                    </td>
                                    {/* <td align='left'>{p.MiddleName}</td>
                                    <td align='left'>{p.LastName}</td> */}
                                    <td align='left'>{p.MobileNo}</td>
                                    <td align='left'>{cname}</td>
                                    <td align='left'>{p.Email}</td>
                                    <td align='left'>{p.Address}</td>
                                    {/* <td align='left'>{moment(p.DOB).format('DD-MMM-YYYY')}</td> */}
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
                        }) : <tr>
                            <td style={{ textAlign: "center" }} colSpan={14}>
                                No Records
                            </td>
                        </tr>
                    }
                </tbody>
            </Table >
            {
                customerlist && customerlist.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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
            }


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
                        <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>

                                <div>
                                    <Form noValidate validated={validated} className="needs-validation">
                                        
                                        <Row className="mb-12">

                                            <InputField controlId="FirstName" label="First name"
                                                type="text"
                                                value={custdata.FirstName}
                                                name="FirstName"
                                                placeholder="First name"
                                                errormessage="Please enter first name"
                                                onChange={firstNameChange}
                                                required={true}
                                                disabled={false}
                                            />

                                            <InputField controlId="MiddleName" label="Middle name"
                                                type="text"
                                                value={custdata.MiddleName}
                                                name="MiddleName"
                                                placeholder="Middle name"
                                                errormessage="Please enter middle name"
                                                onChange={middleNameChange}
                                                required={false}
                                                disabled={false}
                                            />

                                            <InputField controlId="LastName" label="Last name"
                                                type="text"
                                                value={custdata.LastName}
                                                name="LastName"
                                                placeholder="Last name"
                                                errormessage="Please enter last name"
                                                onChange={lastNameChange}
                                                required={true}
                                                disabled={false}
                                            />
                                        </Row>

                                        <Row className="mb-12">

                                            <InputField controlId="Email" label="Email"
                                                type="email"
                                                value={custdata.Email}
                                                name="Email"
                                                placeholder="Email"
                                                errormessage="Please enter email"
                                                onChange={emailChange}
                                                required={false}
                                                disabled={false}
                                            />

                                            <InputField controlId="MobileNo" label="Mobile no"
                                                type="number"
                                                value={custdata.MobileNo}
                                                name="MobileNo"
                                                placeholder="Mobile no"
                                                errormessage="Please enter mobile no"
                                                onChange={mobileNoChange}
                                                required={true}
                                                disabled={false}
                                            />

                                            <Form.Group controlId="CustomerTypeId" as={Col} >
                                                <Form.Label style={{ fontSize: 13 }}>Customer type</Form.Label>
                                                <Form.Select aria-label="Default select example"
                                                    onChange={custTypeChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {
                                                        producttypes.map((item) => {

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
                                        <Row className="mb-12">
                                            <InputField controlId="Address" label="Address"
                                                type="text"
                                                value={custdata.Address}
                                                name="Address"
                                                placeholder="Address"
                                                errormessage="Please enter Address"
                                                onChange={addresschange}
                                                required={true}
                                                disabled={false}
                                            />
                                        </Row>

                                        {/* <Row className="mb-3">
                                            <Form.Group as={Col} controlId="DOB">
                                                <Form.Label>DOB</Form.Label>
                                                <DateComponent date={null} onChange={dobChange} isRequired={false} value={custdata.DOB} />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select DOB
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                        </Row> */}
                                        <Row className="mb-12">
                                            <Form.Group as={Col} controlId="ProfileImageUrl">
                                                <Form.Label style={{ fontSize: 13 }}>Customer photo</Form.Label>
                                                <input class="form-control" type="file" id="formFile"
                                                    onChange={profileImageUpload} multiple="false" accept="image/*" style={{ fontSize: 13 }} />
                                                <Form.Control.Feedback type="invalid" style={{ fontSize: 13 }}>
                                                    Please select image
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="ProfileImageUrl">
                                                <img width="250px" height="250px" src={process.env.REACT_APP_PHOTO_URL + custdata.ProfileImageUrl} />
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
