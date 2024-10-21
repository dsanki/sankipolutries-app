import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

const borderColor = '#dee2e6'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#dee2e6',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
    },
    qty: {
        width: '25%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
    },
    rate: {
        width: '25%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
    },
    amount: {
        width: '25%',
        textAlign: 'right',
        paddingRight: 8,
        borderRightColor: borderColor,
        borderRightWidth: 1,
    }
    
});

const InvoiceTableRow = (props) => {
    return (

        <Fragment>
             <View style={styles.row} key={props.birdsaledata.Id}>
                        {/* <Text style={styles.cat}>{props.birdsaledata.Date}</Text> */}
                        <Text style={styles.qty}>{props.birdsaledata.BirdCount}</Text>
                        <Text style={styles.rate}>{props.birdsaledata.TotalWeight}</Text>
                        <Text style={styles.rate}>{props.birdsaledata.Rate}</Text>
                        <Text style={styles.amount}>{Number.parseFloat(props.birdsaledata.TotalAmount).toFixed(2)}</Text>
                    </View>

        </Fragment>

    )

};


export default InvoiceTableRow