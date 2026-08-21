import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import moment from 'moment';
import {
    GetCustPendingEggSaleInvoiceList, HandleLogout
} from './../../Utility'

import { useNavigate, useParams } from 'react-router-dom'

function CustomerDueList({ clickInclude  }) {

     let history = useNavigate();
        const { uid, invid } = useParams();
    //checkchange,onchange,
    // let history = useNavigate();
    // const search = useLocation().search;
  //  const [custid, setCustId] = useState(customerid);
    const [_duelist, setEggSaleDueList] = useState([]);


    const fetchPendingEggSaleInvoiceList = async () => {
        GetCustPendingEggSaleInvoiceList(uid,process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setEggSaleDueList(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                   // history("/login")
                }
                else if (data.StatusCode === 404) {
                    //props.showAlert("Data not found!!", "danger")
                }
                else {
                   // props.showAlert("Error occurred!!", "danger")
                }
            })
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchPendingEggSaleInvoiceList();
        }
        else {
            HandleLogout();
            //history("/login")
        }
    }, []);

    const handleChange = (e) => {
        const { name, checked } = e.target;
        if (name === "0") {
            let tempUser = _duelist.map((user) => {
                return { ...user, IsChecked: checked };
            });
            //setUsers(tempUser);
            setEggSaleDueList(tempUser);
        } else {
            let tempUser = _duelist.map((user) =>
                user.Id === parseInt(name) ? { ...user, IsChecked: checked } : user
            );
            setEggSaleDueList(tempUser);
            // setUsers(tempUser);
        }
    };

    return (
        <div>
            {
                <>
                <div className="alert" role="alert">
                    <strong>Due List:</strong>
                    <Table className="mt-4" striped bordered hover size="sm">
                        <thead>
                            <tr style={{ fontSize: 12 }}>
                                <th>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="0"
                                        checked={!_duelist?.some((user) => user?.IsChecked !== true)}
                                    //checked={()=>checkchange(custduelist)}
                                    //onChange={()=>onchange()}
                                    onChange={handleChange}
                                    />
                                </th>
                                <th>Invoice no</th>
                                <th>Purchase Date</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {_duelist &&
                                _duelist.map((data, index) => (
                                    <tr id={index} style={{ fontSize: 12 }}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name={data.Id}
                                                checked={data?.IsChecked || false}
                                             onChange={handleChange}
                                            />
                                        </td>
                                        <td>{data.InvoiceNo}</td>
                                        <td>{moment(data.PurchaseDate).format('DD-MMM-YYYY')}</td>
                                        <td>{new Intl.NumberFormat('en-IN', {
                                        }).format(data.Due.toFixed(2))}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>

                </div>
                 <div class="col-md-6" style={{ textAlign: 'right' }}> 
                                    <Button className="mr-2" variant="primary"
                                    style={{ marginRight: "17.5px" }}
                                    onClick={(e) => clickInclude(e, _duelist)}
                                   // onClick={() => clickInclude()}
                                    >Attach</Button>
                                    </div>
                                    </>
            }
        </div>
    )
}

export default CustomerDueList
