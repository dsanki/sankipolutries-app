import React, { useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import DateComponent from '../DateComponent';
import moment from 'moment';


function EditClient(props) {

  const [validated, setValidated] = useState(false);
  const [selectedValue, setDropdownValue] = useState(props.selectedValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    else {

      fetch(variables.REACT_APP_API + 'Client', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Id: e.target.Id.value,
          ClientName: e.target.ClientName.value,
          ClientType: e.target.ClientType.value

        })
      })
        .then(res => res.json())
        .then((result) => {
          closeModal();
          props.showAlert("Data has been updated successfully", "info")
        },
          (error) => {
            props.showAlert("Error occurred!!", "danger")
          })
    }

    setValidated(true);
  }



  const closeModal = () => {
    setValidated(false);
    props.onCountAdd(props.count);
    props.onHide();
  };

  return (
    <div className="container">

      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Client
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={12}>
              {/* <LotFormComponent
                buttonLabel='Update'
                post={props}
                handleSubmit={handleEditSubmit}
                closeModal={closeModal}
              /> */}


              <div>
                <Form onSubmit={handleSubmit} noValidate validated={validated}>
                  <Row className="mb-12">
                    <Form.Group controlId="Id" as={Col} hidden>
                      <Form.Label hidden>Id</Form.Label>
                      <Form.Control type="text" name="Id" required
                        disabled
                        defaultValue={props.id}
                        placeholder="Id"
                        hidden />

                    </Form.Group>
                    <Form.Group controlId="ClientName" as={Col} >
                      <Form.Label>Client Name</Form.Label>
                      <Form.Control type="text" name="ClientName" required
                        defaultValue={props.clientname}
                        //onChange={onChangeValues}
                        placeholder="ClientName" />
                      <Form.Control.Feedback type="invalid">
                        Please enter Client name
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* <Form.Group controlId="ClientType" as={Col} >
                      <Form.Label>Client type</Form.Label>
                      <Form.Control type="text" name="ClientType" required
                        defaultValue={props.clienttype}
                        //onChange={onChangeValues}
                        placeholder="ClientType" />
                      <Form.Control.Feedback type="invalid">
                        Please enter Client type
                      </Form.Control.Feedback>
                    </Form.Group> */}

                    <Form.Group controlId="ClientType" as={Col} >
                      <Form.Label>Client type</Form.Label>
                      <Form.Select aria-label="Default select example"
                        onChange={(e) => setDropdownValue(e.target.value)} required>
                        <option>--Select type--</option>
                        {
                          props.clientTypes.map((item) => {
                            return (
                              <option
                                key={item.ProductId}
                                defaultValue={item.ProductId == null ? null : item.ProductId}
                                selected={item.ProductId === props.clienttype}
                                value={item.ProductId}
                              >{item.ProductName}</option>
                            );
                          })
                        }
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select client
                      </Form.Control.Feedback>

                    </Form.Group>



                    <Form.Group>
                      <Button variant="primary" type="submit" style={{ marginTop: "10px" }} >
                        Update
                      </Button>
                      <Button variant="danger" style={{ marginTop: "10px", marginLeft: "10px" }} onClick={() => {
                        closeModal();
                      }
                      }>Close</Button>
                    </Form.Group>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default EditClient
