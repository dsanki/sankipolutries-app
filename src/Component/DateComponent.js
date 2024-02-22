import Form from "react-bootstrap/Form";
import { useState } from "react";
import moment from 'moment';

export default function DateComponent(props) {

    const [date, setDate] = useState(props!=null && props.date!=null ?  props.date:null);
    const isrequired=(props!=null && props.isRequired===true ? 'true':'false');

    //functions called
    const dateFromDateString = (dateString) => {
        return moment(new Date(dateString)).format('YYYY-MM-DDT00:00:00.000');
    };

    const dateForPicker = (dateString) => {
        return moment(new Date(dateString)).format('YYYY-MM-DD')
    };

    return (
        <Form.Control
            type="date"
            required={isrequired}
            value={props.value ? dateForPicker(props.value) : ''}
            onfocus={dateForPicker(date)}
            placeholder={date ? dateForPicker(date) : "dd/mm/yyyy"}
            //onChange={(e) => setDate(dateFromDateString(e.target.value))}
            onChange={props.onChange}
        />
    );
}