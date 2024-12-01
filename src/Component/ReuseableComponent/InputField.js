import React from "react";
import { Button, ButtonToolbar, Table, Form, Row, Col, Modal} from 'react-bootstrap';

const InputField = ({ controlid, label, type, value, name, placeholder, 
  onChange, errormessage,required,disabled, collength }) => (
  <Form.Group controlId={controlid} as={Col} className={collength}>
    {
      label !==""?<Form.Label style={{fontSize:13}}>{label}</Form.Label>:""
    }
    
    <Form.Control type={type}
      value={value}
      name={name}
      className="form-control"
      placeholder={placeholder}
      onChange={onChange} 
      required={required}
      disabled={disabled} 
      style={{fontSize:13}}/>
    <Form.Control.Feedback type="invalid" style={{fontSize:'13px'}}>
      {errormessage}
    </Form.Control.Feedback>
  </Form.Group>
);

export default InputField;


