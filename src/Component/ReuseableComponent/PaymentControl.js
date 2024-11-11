import React, { useEffect, useState } from 'react'
import { Button, ButtonToolbar, Table, Modal, Row, Col, Form } from 'react-bootstrap';

import {
  FetchPaymentMode, HandleLogout
} from './../../Utility'

import InputField from '../ReuseableComponent/InputField'

function PaymentControl(props) {

  const options = [
    { value: 'cash', label: 'Cash' },
    { value: 'phonepay', label: 'Phone Pay' },
    { value: 'netbanking', label: 'Net Banking' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'upi', label: 'UPI' }
  ]

  

  const [formFields, setFormFields] = useState(props.dataList)

  const [paymentmodelist, setPaymentModeList] = useState([])


  // const [formFields, setFormFields] = useState([
  //   { paymentmethod: '', amount: '' },
  // ])

  const fetchPaymentMode = async () => {
    FetchPaymentMode(process.env.REACT_APP_API)
      .then(data => {
        if (data.StatusCode === 200) {
          setPaymentModeList(data.Result);
        }
        else if (data.StatusCode === 401) {
          HandleLogout();
        }
        else if (data.StatusCode === 404) {
          //props.showAlert("Data not found!!", "danger")
        }
        else {
          //  props.showAlert("Error occurred!!", "danger")
        }
      });
  }

  useEffect((e) => {
    fetchPaymentMode();
  }, []);

  // const handleFormChange = (event, index) => {
  //   let data = [...formFields];
  //   data[index][event.target.name] = event.target.value;
  //   setFormFields(data);

  //   props.onChangeFunc(data);
  // }

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    // setFormFields(data);

    props.onChangeFunc(data);
  }

  const addFields = () => {
    let object = {
      paymentmethod: '',
      amount: ''
    }
    props.addFields();
    setFormFields([...formFields, object])
  }

  // const removeFields = (index) => {
  //   let data = [...formFields];
  //   data.splice(index, 1)
  //   setFormFields(data)
  // }

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);

    props.removeFields(index);
  }

  // const removeFields = (index) => {
  //   let data = [...formFields];
  //   data.splice(index, 1)
  //   setFormFields(data)
  // }

  const changeHandler = (e, index) => {
    let value = null;
    if (e) value = e.value;
    //setFormFields(data);
    props.onChangeFunc(e, index);
  }

  return (
    <div className="row">
      <form>

<i class="fa-regular fa-circle-plus" onClick={addFields }></i>
        {/* <button onClick={addFields} style={{ width: 37, marginLeft: 10, marginTop: 10 }}>+</button> */}
        {formFields.map((form, index) => {
          return (
            <div key={index} style={{ marginTop: 10 }}>
              <Row className="mb-12">
                <div className="col">
                  <Form.Select
                    style={{ width: 200 }} name="paymentmethod" id="paymentmethod"
                    //onChange={e => changeHandler(e, index)}
                    onChange={event => handleFormChange(event, index)}
                    required>
                    <option selected disabled value="">Choose...</option>
                    {
                      paymentmodelist.map((item) => {
                        return (
                          <option
                            key={item.Id}
                            defaultValue={item.Id == null ? null : item.Id}
                            selected={item.Id === form.paymentmethod}
                            value={item.Id}
                          >{item.PaymentMode}</option>
                        );
                      })
                    }
                  </Form.Select>
                </div>

                  <InputField controlId="amount"
                    label=""
                    type="text"
                    value={form.amount}
                    name="amount"
                    placeholder="amount"
                    errormessage="Amount"
                    required={true}
                    disabled={false}
                    onChange={event => handleFormChange(event, index)}
                    style={{ width: 150, marginLeft: 10, width: 200 }}
                  />
              
                <div className="col">
                  <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }}
                    onClick={() => removeFields(index)}></i>
                  {/* <button style={{ width: 37, marginLeft: 10 }} 
                onClick={() => removeFields(index)}>-</button> */}
                </div>
              </Row>
            </div>
          )
        })}
      </form>
    </div>
  )
}

export default PaymentControl;
