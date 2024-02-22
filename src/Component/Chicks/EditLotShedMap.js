import React, { useState ,useEffect} from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { variables } from '../../Variables';
import DateComponent from '../DateComponent';
import moment from 'moment';

function EditLotShedMap(props) {

  const [validated, setValidated] = useState(false);

  const initialvalues = {
    lotid: props.lotid,
    shedid: props.shedid
  }

  const [shedlot, setShedLotData] = useState(initialvalues);
  const [selectedLotValue, setLotValue] = useState(props.lotid);
  const [selectedShedValue, setShedValue] = useState(props.shedid);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
        e.stopPropagation();
    }
    else {

        fetch(variables.REACT_APP_API + 'ChicksMaster/LotShedMapUpdate', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                ShedId: props.shedid,
                LotId: e.target.lotid.value
               
            })
        }).then(res => res.json())
            .then((result) => {
                if (result> 0|| result.StatusCode === 200 || result.StatusCode === "OK") {
                    closeModal();
                    props.showAlert("Successfully added", "info")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }

            },
                (error) => {
                    props.showAlert("Error occurred!!", "danger")
                });
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
            Edit Shed Lot Mapping
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col sm={12}>
              <div>
                <Form onSubmit={handleSubmit} noValidate validated={validated}>
                  <Row className="mb-12">
                  <Form.Group controlId="ShedId" as={Col} >
                        <Form.Label>Shed</Form.Label>
                        <Form.Select aria-label="Default select example" disabled 
                            onChange={(e) => setShedValue(e.target.value)} required>
                            <option>--Select shed--</option>
                            {
                                props.shedlist.map((item) => {
                                    return (
                                        <option
                                            key={item.ShedId}
                                            defaultValue={item.ShedId == null ? null : item.ShedId}
                                            selected={item.ShedId === props.shedid}
                                            value={item.ShedId}
                                        >{item.ShedName}</option>
                                    );
                                })
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please select Shed
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="lotid" as={Col} >
                        <Form.Label>Lot</Form.Label>
                        <Form.Select aria-label="Default select example" 
                            onChange={(e) => setLotValue(e.target.value)} required>
                            <option>--Select Lot--</option>
                            {
                                props.lotlist.map((item) => {
                                    return (
                                        <option
                                            key={item.Id}
                                            defaultValue={item.Id == null ? null : item.Id}
                                            selected={item.Id === props.lotid}
                                            value={item.Id}
                                        >{item.LotName}</option>
                                    );
                                })
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please select lot
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

export default EditLotShedMap
