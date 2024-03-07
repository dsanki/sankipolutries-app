import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
    invoiceNoContainer: {
        flexDirection: 'row',
        marginTop: 36,
        justifyContent: 'flex-end'
    },
    invoiceDateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    invoiceDate: {
        fontSize: 12,
        fontStyle: 'bold',
    },
    label: {
        width: 60
    }

});

function leftFillNum(num, targetLength) {
    return num.toString().padStart(targetLength, '0');
}

const InvoiceNo = (props) => (
    <Fragment>

        <View style={styles.invoiceNoContainer}>
            <Text style={styles.invoiceDate}>{`Invoice No: ${leftFillNum(props.invoice.Id, 5)}`}</Text>
        </View >
        <View style={styles.invoiceDateContainer}>
            <Text style={styles.invoiceDate}>{`Date: ${moment(props.invoice.PurchaseDate).format('DD/MM/YYYY')}`}</Text>
        </View>
        {/* <View style={styles.invoiceNoContainer}>
                <Text style={styles.label}>Invoice No:</Text>
                <Text style={styles.invoiceDate}>{leftFillNum(props.invoice.Id,5)}</Text>
            </View >
            <View style={styles.invoiceDateContainer}>
                <Text style={styles.label}>Date: </Text>
                <Text >{moment(props.invoice.PurchaseDate).format('DD/MM/YYYY')}</Text>
            </View > */}
    </Fragment>
);

export default InvoiceNo