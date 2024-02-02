import React, { useState, useEffect } from 'react'
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

function InputGroupMLD(props) {

  const [input_values, set_inputvalues] = useState({
    Mortality: props.mortality,
    LambChicks: props.lamb
  });

  //const [_mortality, set_mortality] = useState(props.mortality);
  //const [_lamb, set_lamb] = useState(props.lamb);

  const [_due, set_due] = useState(0);


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

    set_inputvalues({ ...input_values, [name]: parseInt(value) });
  };



  // function handleIncrementClick(index) {
  //   const nextCounters = input_values.map((c, i) => {
  //     if (i === index) {
  //       // Increment the clicked counter
  //       return c + 1;
  //     } else {
  //       // The rest haven't changed
  //       return c;
  //     }
  //   });
  //   setCounters(nextCounters);
  // }

  return (


    <Row className="mb-12">

      <Form.Group controlId="Mortality" as={Col}>
        <Form.Label>Mortality</Form.Label>
        <Form.Control type="number" name="Mortality" required
          value={input_values.Mortality}
          placeholder="Mortality" onChange={({ target }) => changeValues(target)} />
        <Form.Control.Feedback type="invalid">
          Please provide mortality.
        </Form.Control.Feedback>
      </Form.Group>

      {/* <input
        type="number"
        value={input_values.mortality}
        onChange={({ target }) => changeValues(target)}
        name="mortality"
      /> */}

      <Form.Group controlId="LambChicks" as={Col}>
        <Form.Label>Lamb chicks</Form.Label>
        <Form.Control type="number" name="LambChicks" required
          value={input_values.LambChicks}
          placeholder="Lamb chicks" onChange={({ target }) => changeValues(target)} />

<Form.Control.Feedback type="invalid">
          Please provide lamb chicks number.
        </Form.Control.Feedback>
      </Form.Group>


      {/* <input
        type="number"
        value={input_values.lamb}
        onChange={({ target }) => changeValues(target)}
        name="lamb"
      /> */}

      <Form.Group controlId="DueChicks" as={Col}>
        <Form.Label>Due chicks</Form.Label>
        <Form.Control type="number" name="DueChicks" required disabled 
          value={_due}
          placeholder="Due chicks" />
      </Form.Group>

      {/* <input
        type="number"
        //defaultValue={props.due}
        value={_due}
        name="due"
      /> */}
    </Row>
  )
}

export default InputGroupMLD
