import Form from "react-bootstrap/Form";
import { useState } from "react";
import moment from 'moment';

export default function DateComponent(props) {

    const [date, setDate] = useState(props!=null && props.date!=null ?  props.date:null);

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
            value={date ? dateForPicker(date) : ''}
            onfocus={dateForPicker(date)}
            placeholder={date ? dateForPicker(date) : "dd/mm/yyyy"}
            onChange={(e) => setDate(dateFromDateString(e.target.value))}
        />
    );
}