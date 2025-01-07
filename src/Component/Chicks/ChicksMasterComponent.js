import React, { Component, useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Button, ButtonToolbar, Table, Form, Row, Col, Modal } from 'react-bootstrap';
import Moment from 'moment';
import { useNavigate } from 'react-router-dom'
import DateComponent from '../DateComponent';
import InputField from '../ReuseableComponent/InputField'
import { FetchChicks, HandleLogout } from '../../Utility'

function ChicksMasterComponent(props) {
    let history = useNavigate();
    const [chicks, setChicks] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [advancedata, setAdvanceData] = useState([]);
    const [customerlist, setCustomerList] = useState([]);

    const initialvalues = {
        modaltitle: "",
        Id: 0,
        Date: "",
        Chicks: "",
        ExtraChicks: "",
        TotalChicks: "",
        Mortality: "",
        LambChicks: "",
        DueChicks: "",
        TotalAmount: "",
        Rate: "",
        Paid: "",
        Due: "",
        PaymentDate: "",
        LotName: "",
        IsActive: "",
        ExtraChicksPercentage: "",
        CustomerId: "",
        Comments:"",
        Discount:"",
        FinalCost:"",
        SettleAmount:""
    };

    const [chicksdata, setChicksData] = useState(initialvalues);

    const clickAddChicks = () => {
        setAddModalShow({ addModalShow: true });
        setChicksData({
            modaltitle: "Add new Lot",
            Id: 0,
            Date: "",
            Chicks: "",
            ExtraChicks: "",
            TotalChicks: "",
            Mortality: "",
            LambChicks: "",
            DueChicks: "",
            TotalAmount: "",
            Rate: "",
            Paid: "",
            Due: "",
            PaymentDate: "",
            LotName: "",
            IsActive: true,
            ExtraChicksPercentage: "",
            CustomerId: "",
            Comments:"",
            Discount:"",
            FinalCost:"",
            SettleAmount:""
        })
    }

    const clickEditChicks = (chicks) => {
        setAddModalShow({ addModalShow: true });
        setChicksData({
            modaltitle: "Edit Lot",
            Id: chicks.Id,
            Date: chicks.Date,
            Chicks: chicks.Chicks,
            ExtraChicks: chicks.ExtraChicks,
            TotalChicks: chicks.TotalChicks,
            Mortality: chicks.Mortality,
            LambChicks: chicks.LambChicks,
            DueChicks: chicks.DueChicks,
            TotalAmount: chicks.TotalAmount,
            Rate: chicks.Rate,
            Paid: chicks.Paid,
            Due: chicks.Due,
            PaymentDate: chicks.PaymentDate,
            LotName: chicks.LotName,
            IsActive: chicks.IsActive,
            ExtraChicksPercentage: chicks.ExtraChicksPercentage,
            CustomerId: chicks.CustomerId,
            Comments:chicks.Comments,
            Discount:chicks.Discount,
            FinalCost:chicks.FinalCost,
            SettleAmount:chicks.SettleAmount
        })
    }

    const customerChange = (e) => {
        setChicksData({ ...chicksdata, CustomerId: e.target.value });
        addCount(count);

    }

    const lotnameChange = (e) => {
        setChicksData({ ...chicksdata, LotName: e.target.value });
    }

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
                    filterList = data.Result.filter((c) => c.CustomerTypeId == process.env.REACT_APP_CUST_TYPE_CHICKS);

                    setCustomerList(filterList);
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

    const chicksChange = (e) => {

        const percentage = chicksdata.ExtraChicksPercentage;
        const _inputextraTotals = parseInt(e.target.value) * (parseInt(percentage) > 0 ? percentage : 0) / 100;

        setChicksData({
            ...chicksdata, Chicks: parseInt(e.target.value),
            ExtraChicks: parseInt(_inputextraTotals),
            TotalChicks: parseInt(parseInt(e.target.value) + _inputextraTotals),
            TotalAmount: parseInt(e.target.value) * chicksdata.Rate,
            Due: (parseInt(e.target.value) * chicksdata.Rate) - chicksdata.Paid
        });
    }

    const extraChicksPercentageChange = (e) => {
        const percentage = e.target.value;
        const _inputextraTotals = chicksdata.Chicks * ((percentage > 0 ? percentage : 0) / 100);

        setChicksData({
            ...chicksdata, ExtraChicksPercentage: percentage,
            Chicks: chicksdata.Chicks,
            ExtraChicks: parseInt(_inputextraTotals),
            TotalChicks: parseInt(chicksdata.Chicks) + parseInt(_inputextraTotals),
            TotalAmount: chicksdata.Chicks * chicksdata.Rate,
            Due: (chicksdata.Chicks * chicksdata.Rate) - chicksdata.Paid

        });
    }

    const dateChange = (e) => {
        setChicksData({ ...chicksdata, Date: e.target.value });
    }

    const isActiveChange = (e) => {
        setChicksData({ ...chicksdata, IsActive: !chicksdata.IsActive });
    }

    const mortalityChange = (e) => {
        const mor = e.target.value === "" ? 0 : parseInt(e.target.value);
        setChicksData({ ...chicksdata, Mortality: e.target.value, DueChicks: mor + (chicksdata.LambChicks === "" ? 0 : parseInt(chicksdata.LambChicks)) });
    }




    const lambChange = (e) => {
        const lamb = e.target.value === "" ? 0 : parseInt(e.target.value);
        setChicksData({ ...chicksdata, LambChicks: e.target.value, 
            DueChicks: (lamb + (chicksdata.Mortality === "" ? 0 : parseInt(chicksdata.Mortality))) });
    }

    const rateChange = (e) => {
let _totalAmt=e.target.value * chicksdata.Chicks;
        let _finalcost=(parseFloat(_totalAmt||0)-parseFloat(chicksdata.Discount||0));

        setChicksData({ ...chicksdata, Rate: e.target.value, 
            TotalAmount: _totalAmt, 
            Due: _finalcost - parseFloat(chicksdata.Paid||0),
            FinalCost:_finalcost });
    }

    const paidChange = (e) => {
        setChicksData({ ...chicksdata, Paid: e.target.value, 
            Due: chicksdata.FinalCost - e.target.value });
    }

    const paymentDateChange = (e) => {
        setChicksData({ ...chicksdata, PaymentDate: e.target.value });
    }

    const commentsChange = (e) => {
        setChicksData({ ...chicksdata, Comments: e.target.value});
    }

    const discountChange = (e) => {
        let _finalcost=(parseFloat(chicksdata.TotalAmount||0)-parseFloat(e.target.value||0));
        setChicksData({ ...chicksdata, Discount: e.target.value,
            FinalCost:_finalcost,
            Due: _finalcost - parseFloat(chicksdata.Paid||0)
        });
    }

    // const finalCostChange = (e) => {
    //     setChicksData({ ...chicksdata, Rate: e.target.value, TotalAmount: e.target.value * chicksdata.Chicks, 
    //         Due: (e.target.value * chicksdata.Chicks) - chicksdata.Paid });
    // }



    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);


    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // useEffect((e) => {

    //     if (localStorage.getItem('token')) {
    //         fetchChicks();
    //     }
    //     else {
    //         history("/login")
    //     }
    // }, [obj]);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    let addCount = (num) => {
        setCount(num + 1);
    };
    const [issettle, setIsSettle] = useState(false);
      const [advancedataticked, setAdvanceDataTicked] = useState([]);


    const isSettleChange = (e) => {
        // setChicksData({ ...chicksdata, IsActive: !chicksdata.IsActive });
        if (!issettle) {
            let advance = advancedataticked.Amount,
                finalAmt = chicksdata.FinalCost;
            //Need to add one more payment mode Adjustment
            if (advance > finalAmt) {

                let _paid = parseFloat(finalAmt || 0);

                let _due = parseFloat(finalAmt || 0) - _paid;

                setChicksData({
                    ...chicksdata, Paid: _paid, Due: _due,SettleAmount:finalAmt
                });
                

                setAdvanceDataTicked({ ...advancedataticked, Amount: advance - finalAmt })
            }
            else {

                if (advance <= finalAmt) {

                    let _paid = parseFloat(advance || 0);

                    let _due = (parseFloat(finalAmt || 0)) - _paid;

                    setChicksData({
                        ...chicksdata, Paid: _paid, Due: _due, SettleAmount:advance
                    });

                    setAdvanceDataTicked({ ...advancedataticked, Amount: 0 })
                }
            }
        }
        else {

            let _paid = parseFloat(chicksdata.Paid || 0) ;

            let _due = chicksdata.FinalCost - _paid;
            setChicksData({
                ...chicksdata, Paid: _paid, Due: _due, SettleAmount:0
            });

            let da = parseFloat(advancedata.Amount || 0);
            setAdvanceDataTicked({ ...advancedataticked, Amount: da })
        }

        setIsSettle(!issettle);

    }

    const fetchAdvanceListByCustId = async (custid) => {

        fetch(process.env.REACT_APP_API + 'AdvancePayment/GetAdvancePaymentListByCustId?CustomerId=' +
            custid + '&CompanyId=' + localStorage.getItem('companyid'),
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
                    setAdvanceData(data.Result);
                    setAdvanceDataTicked(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();

                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    // props.showAlert("Data not found!!", "danger")
                    // setIsLoaded(false);
                    setAdvanceData("");
                    setAdvanceDataTicked(data.Result);
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                    // setIsLoaded(false);
                    setAdvanceData("");
                    setAdvanceData("");
                    setAdvanceDataTicked("");
                }
            });
    }


    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchChicks(localStorage.getItem('companyid'));
            fetchCustomer();
            fetchAdvanceListByCustId(parseInt(chicksdata.CustomerId || 0));
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);

    const fetchChicks = async (companyid) => {

        FetchChicks(companyid, process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setChicks(data.Result);
                    setCount(data.Result.length);
                    setTotalPages(Math.ceil(data.Result.length / process.env.REACT_APP_PAGE_PAGINATION_NO));
                }
                else if (data.StatusCode === 401) {
                    history("/login")
                }

            });
    }

    const deleteChicks = (id) => {
        if (window.confirm('Are you sure?')) {
            fetch(process.env.REACT_APP_API + 'ChicksMaster/' + id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        props.showAlert("Successfully deleted", "info")
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
    const itemsPerPage = process.env.REACT_APP_PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDiaplay = chicks && chicks.length > 0 ? chicks.slice(startIndex, endIndex) : [];


    const handleSubmitAdd = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'ChicksMaster', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: chicksdata.Id,
                    Date: chicksdata.Date,
                    Chicks: chicksdata.Chicks,
                    ExtraChicks: chicksdata.ExtraChicks,
                    TotalChicks: chicksdata.TotalChicks,
                    Mortality: chicksdata.Mortality,
                    LambChicks: chicksdata.LambChicks,
                    DueChicks: chicksdata.DueChicks,
                    TotalAmount: chicksdata.TotalAmount,
                    Rate: chicksdata.Rate,
                    Paid: chicksdata.Paid,
                    Due: chicksdata.Due,
                    PaymentDate: chicksdata.PaymentDate,
                    LotName: chicksdata.LotName,
                    IsActive: chicksdata.IsActive,
                    ExtraChicksPercentage: chicksdata.ExtraChicksPercentage,
                    CompanyId: localStorage.getItem('companyid'),
                    FinalCost:chicksdata.FinalCost,
                    Comments:chicksdata.Comments,
                    Discount:chicksdata.Discount,
                    CustomerId:chicksdata.CustomerId,
                    SettleAmount:chicksdata.SettleAmount

                })
            })
                .then(res => res.json())
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
                    })

            setValidated(false);
        }


    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        var _form = e.target.closest('.needs-validation');
        console.log(_form.checkValidity());
        if (!_form.checkValidity()) {
            e.stopPropagation();
        }
        else {

            fetch(process.env.REACT_APP_API + 'ChicksMaster', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    Id: chicksdata.Id,
                    Date: chicksdata.Date,
                    Chicks: chicksdata.Chicks,
                    ExtraChicks: chicksdata.ExtraChicks,
                    TotalChicks: chicksdata.TotalChicks,
                    Mortality: chicksdata.Mortality,
                    LambChicks: chicksdata.LambChicks,
                    DueChicks: chicksdata.DueChicks,
                    TotalAmount: chicksdata.TotalAmount,
                    Rate: chicksdata.Rate,
                    Paid: chicksdata.Paid,
                    Due: chicksdata.Due,
                    PaymentDate: chicksdata.PaymentDate,
                    LotName: chicksdata.LotName,
                    IsActive: chicksdata.IsActive,
                    ExtraChicksPercentage: chicksdata.ExtraChicksPercentage,
                    CompanyId: localStorage.getItem('companyid'),
                    FinalCost:chicksdata.FinalCost,
                    Comments:chicksdata.Comments,
                    Discount:chicksdata.Discount,
                    CustomerId:chicksdata.CustomerId,
                    SettleAmount:chicksdata.SettleAmount


                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
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

    return (
        <div className="ContainerOverride">
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h4>Chicks/ Lot List</h4>
            </div>
            <div className="row">

                <div className="col" style={{ textAlign: 'right' }}>

                    {/* <td ><a href={`/paymentout/?uid=${p.ClientId}`}>{_suppname}
                <span className="sr-only">(current)</span></a></td> */}


                    <a className="mr-2 btn btn-primary"
                        style={{ marginRight: '10px' }} href={`/paymentout/?custtype=${process.env.REACT_APP_CUST_TYPE_CHICKS}`}>Payment</a>
                    <Button className="mr-2" variant="primary"
                        style={{ marginRight: "17.5px" }}
                        onClick={() => clickAddChicks()}>Add</Button>
                </div>
            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr className="tr-custom">
                        <th align='left'>Lot name</th>
                        <th  >Date</th>
                        <th align='center' >Chicks</th>
                        <th align='center' >Extra %</th>
                        <th align='center' >Extra cks</th>
                        <th align='center' >Total Cks</th>
                        <th align='center' >Mortality</th>
                        <th align='center'>Lamb</th>
                        <th align='center'>Due cks</th>
                        <th align='center'>Rate</th>
                        <th align='center'>Total amt</th>
                        <th align='center'>Discount</th>
                        <th align='center'>FinalCost</th>
                        <th align='center'>Paid</th>
                        <th align='center'>Due</th>
                        <th align='center'>Payment date</th>
                        <th align='center'>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => (
                            <tr key={p.Id} align='center' style={{ fontSize: '13px' }} >
                                <td align='left'>{p.LotName}</td>
                                <td align='center'>{Moment(p.Date).format('DD-MMM-YYYY')}</td>
                                <td align='center'>{p.Chicks}</td>
                                <td align='center'>{p.ExtraChicksPercentage}</td>
                                <td align='center'>{p.ExtraChicks}</td>
                                <td align='center'>{p.TotalChicks}</td>
                                <td align='center'>{p.Mortality}</td>
                                <td align='center'>{p.LambChicks}</td>
                                <td align='center'>{p.DueChicks}</td>
                                <td align='center'>{p.Rate.toFixed(2)}</td>
                                <td align='center'>{p.TotalAmount.toFixed(2)}</td>
                                <td align='center'>{parseFloat(p.Discount||0).toFixed(2)}</td>
                                <td align='center'>{parseFloat(p.FinalCost||0).toFixed(2)}</td>
                                <td align='center'>{p.Paid.toFixed(2)}</td>
                                <td align='center'>{p.Due.toFixed(2)}</td>
                                <td align='center'>{Moment(p.PaymentDate).format('DD-MMM-YYYY')}</td>
                                <td align='center'>
                                    {
                                        <ButtonToolbar>
                                            <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditChicks(p)}></i>

                                            {localStorage.getItem('isadmin') === 'true' &&
                                                <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteChicks(p.Id)}></i>}

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
            {
                chicks && chicks.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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
                        chicks && chicks.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
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

            {chicks && chicks.length > process.env.REACT_APP_PAGE_PAGINATION_NO &&
                <button
                    onClick={handleNextClick}
                    disabled={nextDisabled}
                >
                    Next
                </button>
            }

            <div className="ContainerOverride">
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
                            fontSize: '18px'
                        }}>
                            {chicksdata.modaltitle}
                        </Modal.Title>
                        <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <Form noValidate validated={validated} className="needs-validation">
                                    <Row className="col-12">
                                        <Form.Group as={Col} controlId="CustomerId">
                                            <Form.Label style={{ fontSize: '13px' }}>Supplier</Form.Label>
                                            <Form.Select
                                                onChange={customerChange} style={{ fontSize: 13 }}>
                                                <option selected value="">Choose...</option>
                                                {
                                                    customerlist.map((item) => {
                                                        let fullname = (item.MiddleName != "" && item.MiddleName != null) ? item.FirstName + " " + item.MiddleName + " " + item.LastName :
                                                            item.FirstName + " " + item.LastName;
                                                        return (
                                                            <option
                                                                key={item.ID}
                                                                defaultValue={item.ID == null ? null : item.ID}
                                                                selected={item.ID === parseInt(chicksdata.CustomerId)}
                                                                value={item.ID}
                                                            >{fullname}</option>

                                                        );
                                                    })
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                        {
                                            advancedata != null && advancedata.Amount > 0 && 
                                            <div className="col-6">
                                                <div className="alert alert-success" role="alert">
                                                    <strong>  Advance of Rs: {parseFloat(advancedata.Amount || 0).toFixed(2)}</strong>
                                                   
                                                    {
                               chicksdata.TotalAmount>0 && <Form.Check
                                    type="checkbox"
                                    id="chkIsActiveSettle"
                                    label="Settle"
                                    onChange={isSettleChange}
                                    value={issettle}
                                    checked={issettle}
                                    style={{ fontSize: '13px' }}
                                />
                            }
                                                </div>
                                            </div>
                                        }
                                    </Row>
                                    <Row className="col-6">
                                        <InputField controlId="LotName" label="Lot name"
                                            type="text"
                                            value={chicksdata.LotName}
                                            name="LotName"
                                            placeholder="Lot name"
                                            errormessage="Please enter lot name"
                                            onChange={lotnameChange}
                                            required={true}
                                            disabled={false}
                                        />
                                    </Row>

                                    <Row className="mb-12">
                                        <InputField controlId="Chicks"
                                            label="Chicks"
                                            type="number"
                                            value={chicksdata.Chicks}
                                            name="Chicks"
                                            placeholder="Chicks"
                                            errormessage="Please provide a chicks number"
                                            onChange={chicksChange}
                                            required={true}
                                            disabled={false}
                                        />

                                        <InputField controlId="ExtraChicksPercentage"
                                            label="Extra %"
                                            type="number"
                                            value={chicksdata.ExtraChicksPercentage}
                                            name="ExtraChicksPercentage"
                                            placeholder="Extra %"
                                            errormessage="Please provide extra %"
                                            onChange={extraChicksPercentageChange}
                                            required={true}
                                            disabled={false}
                                        />



                                        <InputField controlId="ExtraChicks" label="Extra chicks"
                                            type="number"
                                            value={chicksdata.ExtraChicks}
                                            name="ExtraChicks"
                                            placeholder="Extra chicks"
                                            errormessage="Please provide extra chicks number"
                                            required={true}
                                            disabled={true}
                                        />
                                        <InputField controlId="TotalChicks" label="Total chicks"
                                            type="number"
                                            value={chicksdata.TotalChicks}
                                            name="TotalChicks"
                                            placeholder="Total chicks"
                                            errormessage="Please provide total chicks number"
                                            required={true}
                                            disabled={true}
                                        />
                                    </Row>
                                    <Row className="mb-12">
                                        <InputField controlId="Mortality" label="Mortality"
                                            type="number"
                                            value={chicksdata.Mortality}
                                            name="Mortality"
                                            placeholder="Total mortality"
                                            errormessage="Please provide total mortality number"
                                            required={true}
                                            disabled={false}
                                            onChange={mortalityChange}
                                        />

                                        <InputField controlId="LambChicks" label="Lamb chicks"
                                            type="number"
                                            value={chicksdata.LambChicks}
                                            name="LambChicks"
                                            placeholder="Lamb chicks"
                                            errormessage="Please provide Lamb chicks number"
                                            required={true}
                                            disabled={false}
                                            onChange={lambChange}
                                        />

                                        <InputField controlId="DueChicks" label="Due chicks"
                                            type="number"
                                            value={chicksdata.DueChicks}
                                            name="DueChicks"
                                            placeholder="Due chicks"
                                            errormessage="Please provide Due chicks number"
                                            required={true}
                                            disabled={false}
                                        />
                                    </Row>

                                    <Row className="mb-12">
                                        <Form.Group as={Col} controlId="date">
                                            <Form.Label style={{ fontSize: '13px' }}>Date</Form.Label>
                                            <DateComponent date={null} onChange={dateChange} isRequired={true} value={chicksdata.Date} />
                                            <Form.Control.Feedback type="invalid">
                                                Please select date
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <InputField controlId="Rate" label="Rate"
                                            type="number"
                                            value={chicksdata.Rate}
                                            name="Rate"
                                            placeholder="Rate"
                                            errormessage="Please provide rate"
                                            required={true}
                                            disabled={false}
                                            onChange={rateChange}
                                        />
                                    </Row>

                                    <Row className="mb-12">
                                        <InputField controlId="TotalAmount" label="Total Amount"
                                            type="number"
                                            value={chicksdata.TotalAmount}
                                            name="TotalAmount"
                                            placeholder="Total Amount"
                                            errormessage="Please provide total amount"
                                            required={true}
                                            disabled={true}
                                        />


                                        <InputField controlId="Discount" label="Discount"
                                            type="number"
                                            value={chicksdata.Discount}
                                            name="Discount"
                                            placeholder="Discount"
                                            errormessage="Please provide discount"
                                            required={false}
                                            disabled={false}
                                            onChange={discountChange}
                                        />

<InputField controlId="FinalCost" label="FinalCost"
                                            type="number"
                                            value={chicksdata.FinalCost}
                                            name="FinalCost"
                                            placeholder="Final cost"
                                            errormessage="Please provide final cost"
                                            required={false}
                                            disabled={false}
                                        />
                                          </Row>

<Row className="mb-12">


                                        <InputField controlId="Paid" label="Paid"
                                            type="number"
                                            value={chicksdata.Paid}
                                            name="Paid"
                                            placeholder="Paid"
                                            errormessage="Please provide paid amount"
                                            required={true}
                                            disabled={false}
                                            onChange={paidChange}
                                        />

                                        <InputField controlId="Due" label="Due"
                                            type="number"
                                            value={chicksdata.Due}
                                            name="Due"
                                            placeholder="Due"
                                            errormessage="Please provide due amount"
                                            required={true}
                                            disabled={true}
                                        />
                                    </Row>
                                    <Form.Group><br /></Form.Group>
                                    <Row className="mb-12">
                                        <Form.Group controlId="PaymentDate" as={Row} className="mb-3">
                                            <Form.Label style={{ fontSize: '13px' }} column sm={3}>Payment date</Form.Label>
                                            <Col sm={4}>
                                                <DateComponent date={null} isRequired={true} onChange={paymentDateChange} value={chicksdata.PaymentDate} />
                                            </Col>
                                            <Col sm={4}>
                                                <Form.Check
                                                    type="checkbox"
                                                    id="chkIsActive"
                                                    label="Is Active"
                                                    onChange={isActiveChange}
                                                    value={chicksdata.IsActive}
                                                    checked={chicksdata.IsActive}
                                                    style={{ fontSize: '13px' }}
                                                />
                                            </Col>
                                        </Form.Group>


                                    </Row>

                                    <Row className="mb-12">
                                                                              <Form.Group controlId="Comments" as={Col} >
                                                                                  <Form.Label style={{ fontSize: '13px' }}>Comments</Form.Label>
                                                                                  <Form.Control style={{ fontSize: '13px' }} as="textarea" rows={3} name="Comments"
                                                                                      onChange={commentsChange} value={chicksdata.Comments}
                                                                                      placeholder="Comments" />
                                  
                                                                              </Form.Group>
                                                                          </Row>

                                    <Form.Group as={Col}>
                                        {chicksdata.Id <= 0 ?

                                            <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                                                Add
                                            </Button>
                                            : null
                                        }

                                        {chicksdata.Id > 0 ?

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
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </div>

        </div>
    )
}
export default ChicksMasterComponent;
