import React, { useState, useEffect } from 'react'
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';

function InputGroupCET(props) {

    const [input_values, set_inputvalues] = useState({
        chicks: props.chicks
    });
    const [totalextrachicks, set_extrachicks] = useState(props.extrachicks);
    const [totalchicks, set_total] = useState(props.totalchicks);
    const [_chicks, set_chicks] = useState(props.chicks);


    useEffect(() => {
        const arrValues = Object.values(input_values);
        const inputTotals = arrValues.reduce((accum, curr) => (accum += curr), 0);
        const _inputextraTotals = inputTotals * variables.FIVE_PERCENTAGE;

        set_extrachicks(_inputextraTotals);
        set_total(inputTotals + _inputextraTotals);
    }, [input_values]);

    const changeValues = ({ name, value }) => {
        set_inputvalues({ ...input_values, [name]: parseInt(value) });
    };

    return (

        <Row className="mb-12">
            <Form.Group as={Col} controlId="Chicks">
                <Form.Label>Chicks</Form.Label>
                <Col>
                    <Form.Control type="number" name="Chicks" required
                        defaultValue={input_values.chicks}
                        placeholder="Chicks" onChange={({ target }) => changeValues(target)} />

                    <Form.Control.Feedback type="invalid">
                        Please provide a chicks number.
                    </Form.Control.Feedback>
                </Col>

            </Form.Group>
            <Form.Group controlId="ExtraChicks" as={Col} >
                <Form.Label>Extra chicks</Form.Label>
                <Col >
                    <Form.Control type="number" name="ExtraChicks" required disabled
                        value={totalextrachicks}
                        placeholder="Extra chicks" />
                    <Form.Control.Feedback type="invalid">
                        Please provide total extra chicks number.
                    </Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group controlId="TotalChicks" as={Col}>
                <Form.Label>Total chicks</Form.Label>
                <Form.Control type="number" name="TotalChicks" required disabled 
                    value={totalchicks}
                    placeholder="Total chicks" />
                <Form.Control.Feedback type="invalid">
                    Please provide total chicks number.
                </Form.Control.Feedback>
            </Form.Group>
        </Row>
    )
}

export default InputGroupCET
