import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import DateComponent from '../DateComponent';
import {
    CalculateAgeInWeeks, CalculateAgeInDays,
    dateyyyymmdd, downloadExcel, HandleLogout, GetCustomerByTypeId,
    NumberInputKeyDown
} from '../../Utility';
import Loading from '../Loading/Loading'

function PaymentHistory(props) {
    let history = useNavigate();
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [isloaded, setIsLoaded] = useState(true);
    const [paymenthistorylist, setPaymentHistoryList] = useState([]);
    const [paymenthistorylistFilter, setPaymentHistoryListFilter] = useState([]);
    const [customers, setCustomerList] = useState([]);
    const [clientlist, setClientList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [ucount, setUCount] = useState(0);
    const objU = useMemo(() => ({ ucount }), [ucount]);



 const _paymentDetails = {
    CustomerId: "",
    Amount: "",
    PaymentDate: "",
    PaymentMode: "",
    Id: "",
    PaymentDate: "",

}

const [paymentDetails, setPaymentDetails] = useState(_paymentDetails);
    useEffect(() => {
        fetchClient(null);
    }, []);

    useEffect((e) => {
        if (localStorage.getItem('token')) {
            fetchFeedPaymentOutHistory(null);
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);


    // useEffect(() => {
    //     let data = customers.filter((item) =>
    //         item.FirstName.toLowerCase().includes(searchcustomer.toLowerCase()) ||
    //         item.LastName.toLowerCase().includes(searchcustomer.toLowerCase())
    //     )

    //     setfiltered(data);

    // }, [searchcustomer]);


    const fetchClient = async (customertype) => {
        GetCustomerByTypeId(customertype,
            process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setClientList(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found to fetch sheds!!", "danger")
                }
                else {
                    props.showAlert("Error occurred to fetch sheds!!", "danger")
                }

            });
    }


    const fetchFeedPaymentOutHistory = async (uid) => {
        setIsLoaded(true);
        let _url=process.env.REACT_APP_API + 'EggSale/GetPaymentHistoryByCustId?CustId=&CompanyId=' + localStorage.getItem('companyid');
        if(uid!=null)
        {
            let _url=process.env.REACT_APP_API + 'EggSale/GetPaymentHistoryByCustId?CustId='
            + uid + '&CompanyId=' + localStorage.getItem('companyid');
        }
        fetch(_url,
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
                    let _result=data.Result.filter((x)=>x.PaymentType==='Out');
                    setPaymentHistoryList(_result);
                    setPaymentHistoryListFilter(_result);
                    setCount(_result.length);
                    setTotalPages(Math.ceil(_result.length / itemsPerPage));
                    setIsLoaded(false);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found !!", "danger")
                }
                else {
                    props.showAlert("Error occurred !!", "danger")
                }
            });

        setIsLoaded(false);
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
    //const itemsPerPage = variables.PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
    const endIndex = startIndex + parseInt(itemsPerPage);
    const itemsToDiaplay = paymenthistorylist.slice(startIndex, endIndex);

    if (itemsToDiaplay.length === 0 && paymenthistorylist.length > 0) {
        setCurrentPage(currentPage - 1);
    }

    let addCount = (num) => {
        setCount(num + 1);
    };

    const selectPaginationChange = (e) => {
        setItemsPerPage(e.target.value);
        addCount(count);
    }

    let addUCount = (num) => {
        setUCount(num + 1);
    };

    const filterSupplierChange = (e) => {

        if (e.target.value > 0) {
            const _medd = paymenthistorylistFilter.filter((c) => c.CustomerId === parseInt(e.target.value));
            setPaymentHistoryList(_medd);
        }
        else {
            setPaymentHistoryList(paymenthistorylistFilter);
        }

        addUCount(ucount);
    }
    return (
        <div>
            {isloaded && <Loading />}
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <h4> Payment history</h4>
            </div>
            <div className="container" style={{ marginTop: '30px', marginBottom: '20px' }}>

                <div className="row align-items-center" style={{ fontSize: 13 }}>
                    <div className="col-2">
                        <p><strong>Supplier</strong></p>

                        <Form.Select style={{ fontSize: '13px' }}
                            onChange={filterSupplierChange}>
                            <option selected value="">Choose...</option>
                            {
                                clientlist.map((item) => {
                                    return (
                                        <option
                                            key={item.ID}
                                            defaultValue={item.Id == null ? null : item.ID}
                                            value={item.ID}
                                        >{item.FirstName + " " + item.LastName}</option>
                                    );
                                })
                            }
                        </Form.Select>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                {
                    itemsToDiaplay && itemsToDiaplay.length > 0 &&
                    <>
                       
                        <div class="overflow-y-visible">
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr className="tr-custom" align='center'>
                                        <th>Date</th>
                                        <th>Customer name</th>
                                        <th>Amount (<span>&#8377;</span>)</th>
                                        <th>Mode </th>
                                        <th>Type </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.filter(x=>x.PaymentType==='Out').map((p) => {
                                            return (
                                                !isloaded && <tr align='center' style={{ fontSize: 13 }} key={p.Id}>

                                                    <td align='center'>{moment(p.Date).format('DD-MMM-YYYY')}</td>
                                                    <td>{p.CustomerName}</td>
                                                    <td align='center'>
                                                        {new Intl.NumberFormat('en-IN', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }).format(parseFloat(p.Amount).toFixed(2))}
                                                    </td>

                                                    <td>{p.PaymentMode}</td>
                                                    <td> {p.PaymentType}</td>

                                                </tr>
                                            )
                                        }) : <tr>
                                            <td style={{ textAlign: "center", fontSize: '13px' }} colSpan={14}>
                                                No Records
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>

                            {
                                paymenthistorylist && paymenthistorylist.length > itemsPerPage &&
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
                        </div>
                    </>
                }
            </div>

        </div>
    )
}

export default PaymentHistory
