import React, { useState} from 'react'
import { Button, ButtonToolbar, Table, Modal, Row, Col, Form } from 'react-bootstrap';

function PaymentControl(props) {

    const options = [
        { value: 'cash', label: 'Cash' },
        { value: 'phonepay', label: 'Phone Pay' },
        { value: 'netbanking', label: 'Net Banking' },
        { value: 'cheque', label: 'Cheque' },
        { value: 'upi', label: 'UPI' }
      ]

    const [formFields, setFormFields] = useState([
        { paymentmethod: '', amount: '' },
      ])

      const handleFormChange = (event, index) => {
        let data = [...formFields];
        data[index][event.target.name] = event.target.value;
        setFormFields(data);
      }

      const addFields = () => {
        let object = {
            paymentmethod: '',
            amount: ''
        }
    
        setFormFields([...formFields, object])
      }



      const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data)
      }
      
      const changeHandler = (e, index, props) => {
        let value = null;
        if (e) value = e.value;
        props.onChangeFunc(value, props.name, e);
      
        // if (!props.onValidateFunc) return;
      
        // let msg = null;
        // if (!value && props.isReq) {
        //   msg = `Please select ${props.title}.`;
        // }
      
        // props.onValidateFunc(msg, props.name);
      }
    
     // const InputField = ({ controlid, label, type, value, name, placeholder, onChange, errormessage,required,disabled }) => (

  return (
    <div className="row">
      <form>
        {formFields.map((form, index) => {
          return (
            <div key={index}>
                 <Row className="mb-12">
 <Form.Select aria-label="Default select example" style={{width:125}} name="paymentmethod" id="paymentmethod" 
 onChange={e => changeHandler(e, index, props)}
                                                // onChange={event => handleFormChange(event, index)} 
                                                required>
                                                <option selected disabled value="">Choose...</option>
                                                {
                                                    options.map((item) => {
                                                        return (
                                                            <option
                                                                key={item.value}
                                                                defaultValue={item.value == null ? null : item.value}
                                                              //  selected={item.value === eggdata.ShedId}
                                                                value={item.value}
                                                            >{item.label}</option>
                                                        );
                                                    })
                                                }
                                            </Form.Select>

                         {/* <select><option>
                            1
                         </option>
                            </select>                    */}
              
              {/* <input
                name='name'
                placeholder='Name'
                onChange={event => handleFormChange(event, index)}
                value={form.name}
              /> */}
              <input style={{width:150, marginLeft:10}}
                name='amount'
                placeholder='amount'
                onChange={event => handleFormChange(event, index)}
                value={form.amount}
              />
              <button style={{width:37, marginLeft:10}} onClick={() => removeFields(index)}>-</button>
              <button onClick={addFields} style={{width:37, marginLeft:10}}>+</button>
              </Row>
            </div>
          )
        })}
      </form>
     
      {/* <br /> */}
      {/* <button >Submit</button> */}
    </div>
  )
}

export default PaymentControl;
