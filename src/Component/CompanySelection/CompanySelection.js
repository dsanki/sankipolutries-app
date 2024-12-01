import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useParams, useLocation, useHistory } from 'react-router-dom'
import moment from 'moment';
import InputField from '../ReuseableComponent/InputField'
import PaymentControl from '../ReuseableComponent/PaymentControl'
import DateComponent from '../DateComponent';
import {
  dateyyyymmdd, HandleLogout, ErrorMessageHandle,
  FetchCompanyDetails
} from './../../Utility'
import Loading from '../Loading/Loading'
import { createEntityAdapter } from '@reduxjs/toolkit';

function CompanySelection(props) {

  let history = useNavigate();
  //const { uid } = useParams();
  const search = useLocation().search;
  const [uid, setUid] = useState(new URLSearchParams(search).get('uid'));
  const [companydetails, setCompanyDetails] = useState([]);
  const [companylist, setCompanyList] = useState([]);
  const [comid, setComid] = useState();
  const [compname, setCompname] = useState();

  useEffect((e) => {

    if (localStorage.getItem('token')) {
      fetchCompanyDetails();

    }
    else {
      HandleLogout();
      history("/login")
    }
  }, []);

  const onCompanyChange = (e) => {
    setComid(e.target.value);
    let comdet = companylist.filter(x => x.Id == e.target.value);
    setCompanyDetails(comdet);
    localStorage.setItem('companyid', e.target.value);
    localStorage.setItem('companydetails', JSON.stringify(comdet[0]));
  }

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

  const handleGO = (e) => {

    // localStorage.setItem('companyid', comid);
    //localStorage.setItem('companydetails', JSON.stringify(companydetails[0]));
    //history("/home?companyid=" + comid);
    // history("/home?companyid=" + comid);
  }
  return (
    <div>
      <Row>
      <div className="col-3" style={{alignContent:'center'}}>
        <Form.Group controlId="ShedId" className='Col-3'>
          <Form.Label style={{ fontSize: 13 }}>Select Company</Form.Label>
          <Form.Select style={{ fontSize: 13 }}
            onChange={onCompanyChange} required>
            <option selected disabled value="">Choose...</option>
            {
              companylist.map((item) => {
                return (
                  <option
                    key={item.Id}
                    defaultValue={item.Id == null ? null : item.Id}
                    value={item.Id}
                  >{item.CompanyName}</option>
                );
              })
            }
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please select Company
          </Form.Control.Feedback>

        </Form.Group>
        <Form.Group>
          <a className="mr-2 btn btn-primary" style={{marginTop:'10px'}} href={`/home?companyid=${comid}`}>GO</a>
        
        </Form.Group>
        </div>
      </Row>
    </div>
  )
}

export default CompanySelection
