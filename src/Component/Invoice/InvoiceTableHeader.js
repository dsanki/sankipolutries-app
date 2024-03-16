import React from 'react';
import {Text, View, StyleSheet, Font} from '@react-pdf/renderer';

const borderColor = '#dee2e6'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#dee2e6',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1
    },
   
    cat: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold'
    },
    qty: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold'
    },
    rate: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold'
    },
    discnt: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold'
    },
    amount: {
        width: '15%',
        textAlign: 'right',
        marginRight:5,
        fontFamily: 'Helvetica-Bold',
        borderRightColor: borderColor,
        borderRightWidth: 1
    },
    FinalAmount: {
        width: '20%',
        textAlign: 'right',
        marginRight:5,
        fontFamily: 'Helvetica-Bold'
    }
  });

  const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.cat}>Cat</Text>
        <Text style={styles.qty}>Qty</Text>
        <Text style={styles.rate}>Rate</Text>
        <Text style={styles.amount}>Total Cost</Text>
        <Text style={styles.discnt}>Discnt/Egg</Text>
        <Text style={styles.discnt}>Total Discnt</Text>
        <Text style={styles.FinalAmount}>Final Amount</Text>
    </View>
  );
  
  export default InvoiceTableHeader