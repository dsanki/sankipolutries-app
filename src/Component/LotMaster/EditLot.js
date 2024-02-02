import React, { useState } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import DateComponent from './../DateComponent';
import moment from 'moment';


function EditLot(props) {

  const [validated, setValidated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    else {

      fetch(variables.REACT_APP_API + 'LotMaster', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Id: e.target.Id.value,
          LotName: e.target.LotName.value,
          StartDate: e.target.StartDate.value,
          EndDate: e.target.EndDate.value,
          ModifiedDate:new Date()

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

  const dateFromDateString = (dateString) => {
    return moment(new Date(dateString)).format('YYYY-MM-DDT00:00:00.000');
  };

  const dateForPicker = (dateString) => {
    return dateString !== "" ? moment(new Date(dateString)).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD');
  };

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
            Add Lot
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
                        defaultValue={props.lotid}
                        placeholder="Id"
                        hidden />

                    </Form.Group>
                    <Form.Group controlId="LotName" as={Col} >
                      <Form.Label>Lot Name</Form.Label>
                      <Form.Control type="text" name="LotName" required
                        defaultValue={props.lotname}
                        //onChange={onChangeValues}
                        placeholder="LotName" />
                      <Form.Control.Feedback type="invalid">
                        Please enter Lot name
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="StartDate" as={Col} >
                      <Form.Label>Start Date</Form.Label>
                      <DateComponent date={props.startdate} />
                    </Form.Group>

                    <Form.Group controlId="EndDate" as={Col} >
                      <Form.Label>End Date</Form.Label>
                      <DateComponent date={props.enddate} />
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

export default EditLot
