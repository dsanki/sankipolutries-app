import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

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
        width: '15%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    qty: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    amount: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
  });


const InvoiceTableRow = ({items}) => {
    const rows = items.map( item => 
        <View style={styles.row} key={moment(p.PurchaseDate).format('DD-MMM-YYYY')}>
            <Text style={styles.date}>{p.Quantity}</Text>
            <Text style={styles.rate}>{p.EggRate}</Text>
            <Text style={styles.amount}>{p.TotalCost.toFixed(2)}</Text>
            <Text style={styles.amount}>{p.Discount.toFixed(2)}</Text>
            <Text style={styles.amount}>{p.FinalCost.toFixed(2)}</Text>
            <Text style={styles.amount}>{p.Paid.toFixed(2)}</Text>
            <Text style={styles.amount}>{p.Due.toFixed(2)}</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default InvoiceTableRow