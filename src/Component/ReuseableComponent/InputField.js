import React from "react";
import { Button, ButtonToolbar, Table, Form, Row, Col, Modal} from 'react-bootstrap';

const InputField = ({ controlid, label, type, value, name, placeholder, onChange, errormessage,required,disabled }) => (
  <Form.Group controlId={controlid} as={Col} >
    <Form.Label>{label}</Form.Label>
    <Form.Control type={type}
      value={value}
      name={name}
      className="form-control"
      placeholder={placeholder}
      onChange={onChange} 
      required={required}
      disabled={disabled}/>
    <Form.Control.Feedback type="invalid">
      {errormessage}
    </Form.Control.Feedback>
  </Form.Group>
);

export default InputField;


