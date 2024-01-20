import 'bootstrap/dist/css/bootstrap.min.css';  
import { useState } from 'react';  
import {Container, Button , Alert} from 'react-bootstrap';  
function AlertComponent(props) {  
   const [show, setShow] = useState(props.isSuccess)  
if (show){  
  return (  
    <div className="App">  
   <Container className='p-4'>  
   <Alert variant="success">  
   <Alert.Heading>Ooops! an error occured!</Alert.Heading>  
   <p>  
     Please try again</p>  
     <Button variant="danger" onClick={() => setShow(false)}>Hide me</Button>  
   </Alert>  
</Container>  
    </div>  
  );  
}  
return(  
  <>  
  <Button className='p-3 m-3' variant='primary' onClick={() => setShow(true)}>Show Alert</Button>  
  </>  
)  
}  
export default AlertComponent;  