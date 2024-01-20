import { useState } from "react"
import Form from "react-bootstrap/Form";

export default function DropDownComponent(props) {
    const [selectedValue, setDropdownValue] = useState(props.selectedValue);
    return (
        <Form.Select aria-label="Default select example" onChange={(e) => setDropdownValue(e.target.value)}>
            <option>{props.firstValue}</option>
            {
                props.listItems.map((item) => {
                    return (
                        <option
                            key={item.Id} defaultValue={item.Id}
                            // selected={item.Id === selectedValue}
                            //value={item.Id}
                            >{item.ClientName}</option>
                    );
                })
            }
        </Form.Select>
    );
}