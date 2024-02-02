import { useState } from "react"
import Form from "react-bootstrap/Form";

// export default function DropDownComponent(props) {
//     const [selectedValue, setDropdownValue] = useState(props.selectedValue);
//     return (
//         <>
//             <Form.Select aria-label="Default select example"
//                 onChange={(e) => setDropdownValue(e.target.value)} required>
//                 <option>{props.firstValue}</option>
//                 {
//                     props.listItems.map((item) => {
//                         return (
//                             <option
//                                 key={item.Id} defaultValue={item.Id == null ? null : item.Id}
//                             // selected={item.Id === selectedValue}
//                             //value={item.Id}
//                             >{item.ClientName}</option>
//                         );
//                     })
//                 }
//             </Form.Select>
//             <Form.Control.Feedback type="invalid">
//                 Please select client
//             </Form.Control.Feedback>
//         </>
//     );
// }


export default function DDL({ selected, setSelected, listItems }) {
    return (
        <>
            <Form.Control
                as="select"
                value={selected}
                onChange={(e) => {
                    setSelected(e.target.value);
                }}
            >
<option value="-1" >--Select Client--</option>
                {
                    
                    listItems.map((item) => {
                        return (
                            <option value={item.Id} >{item.ClientName}</option>
                        );
                    })
                }
            </Form.Control>
        </>
    );
}