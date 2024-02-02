import React, { useState, useEffect } from 'react'
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

function InputGroupTPD(props) {

  const [input_amount_values, set_inputamtvalues] = useState({
    TotalAmount: props.totalamount,
    Paid: props.paid
  });

  const [due, set_dueamount] = useState(0);


  useEffect(() => {
    const arrValues = Object.values(input_values);
    const inputTotals = arrValues.reduce((accum, curr) => (accum += curr), 0);

    const totalPrice = arrValues.reduce((accumulator, item) => {
      // if(isNaN(item) || item === undefined || item === null)
      // {
      //   item=0;
      // }

      if (item > 0) {

      }
      else {
        item = 0;
      }
      return accumulator += item;
    }, 0)

    set_due(totalPrice);

  }, [input_values]);

  const changeValues = ({ name, value }) => {
    // const copy = {...input_values};

    // 👇️ remove salary key from object
    // delete copy[name];

    set_inputamtvalues({ ...input_amount_values, [name]: parseInt(value) });
  };

  return (


    <Row className="mb-12">

      <Form.Group controlId="TotalAmount" as={Col}>
        <Form.Label>Total amount</Form.Label>
        <Form.Control type="number" name="TotalAmount" required
          defaultValue={input_values.TotalAmount}
          placeholder="Total amount" />
        <Form.Control.Feedback type="invalid">
          Please provide total.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="Paid" as={Col}>
        <Form.Label>Paid</Form.Label>
        <Form.Control type="number" name="Paid" required
          defaultValue={input_values.Paid}
          placeholder="Paid" />
        <Form.Control.Feedback type="invalid">
          Please provide paid amount.
        </Form.Control.Feedback>
      </Form.Group>


      <Form.Group controlId="Due" as={Col}>
        <Form.Label>Due</Form.Label>
        <Form.Control type="number" name="Due" required disabled
          defaultValue={due}
          placeholder="Due" />
      </Form.Group>


      <Form.Group controlId="LambChicks" as={Col}>
        <Form.Label>Lamb chicks</Form.Label>
        <Form.Control type="number" name="LambChicks" required
          value={input_values.LambChicks}
          placeholder="Lamb chicks" onChange={({ target }) => changeValues(target)} />

        <Form.Control.Feedback type="invalid">
          Please provide lamb chicks number.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="DueChicks" as={Col}>
        <Form.Label>Due chicks</Form.Label>
        <Form.Control type="number" name="DueChicks" required
          value={_due}
          placeholder="Due chicks" />
      </Form.Group>
    </Row>
  )
}

export default InputGroupTPD
