import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
    },
    date: {
        width: '40%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    qty: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    rate: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    amount: {
        width: '20%',
        textAlign: 'right',
        paddingRight: 8,
    },
});


// const InvoiceTableRow = ({items}) => {
//     const rows = items.map( item => 
//         <View style={styles.row} key={item.sno.toString()}>
//             <Text style={styles.description}>{item.desc}</Text>
//             <Text style={styles.qty}>{item.qty}</Text>
//             <Text style={styles.rate}>{item.rate}</Text>
//             <Text style={styles.amount}>{(item.qty * item.rate).toFixed(2)}</Text>
//         </View>
//     )
//     return (<Fragment>{rows}</Fragment> )
// };

const InvoiceTableRow = (props) => {
    return (
        // <Fragment>
        //     <View style={styles.row} key={item.sno.toString()}>
        //         <Text style={styles.description}>{item.desc}</Text>
        //         <Text style={styles.qty}>{item.qty}</Text>
        //         <Text style={styles.rate}>{item.rate}</Text>
        //         <Text style={styles.amount}>{(item.qty * item.rate).toFixed(2)}</Text>
        //     </View>
        // </Fragment>

        <Fragment>
        <View style={styles.row} key={props.eggsaledata.Id}>
        <Text style={styles.date}>{moment(props.eggsaledata.PurchaseDate).format('DD-MMM-YYYY')}</Text>
            <Text style={styles.qty}>{props.eggsaledata.Quantity}</Text>
            <Text style={styles.rate}>{props.eggsaledata.EggRate}</Text>
            <Text style={styles.amount}>{Number.parseFloat(props.eggsaledata.TotalCost).toFixed(2)}</Text>
        </View>
    </Fragment>
    )

};


export default InvoiceTableRow