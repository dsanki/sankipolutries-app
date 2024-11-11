import React,{useState} from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";


import PaymentControl from '../ReuseableComponent/PaymentControl'

function Test() {

   //const _data= [{"paymentmethod":"cash","amount":"455"},{"paymentmethod":"phonepay","amount":"8000"}];
    const _data=[{ paymentmethod: '', amount: '' }];
    const [formFieldsdata, setFormFieldsData] = useState(_data)


    const addFields = () => {
        let object = {
          paymentmethod: '',
          amount: ''
        }
    
        setFormFieldsData([...formFieldsdata, object])
      }

      const removeFields = (index) => {
        let data = [...formFieldsdata];
        data.splice(index, 1)
        setFormFieldsData(data)
      }
    const onChangeFunc1 = (data) => {
        setFormFieldsData(data);
        // alert(formFields);
        // alert(index);
        //let data = [...formFields];
       // data[index][event.target.name] = event.target.value;
      // console.log(JSON.stringify(data));
      //  setFormFields(data);
       
    }


    return (
        <div>

            <PaymentControl onChangeFunc={onChangeFunc1} 
            dataList={formFieldsdata} 
            addFields={addFields} removeFields={removeFields}/>

           
             <p>{JSON.stringify(formFieldsdata)}</p> 
           
            {/* <Modal show={true}>
                <Modal.Header>Hi</Modal.Header>
                <Modal.Body>asdfasdf</Modal.Body>
                <Modal.Footer>This is the footer</Modal.Footer>
            </Modal>
            <button type="button" className="btn btn-primary"
                data-toggle="modal" data-target="#exampleModal" >
                Add
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">edit</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            hello
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default Test
