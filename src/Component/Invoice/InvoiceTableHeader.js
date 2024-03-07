import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        backgroundColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
    },
   
    date: {
        width: '40%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    qty: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    rate: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    amount: {
        width: '20%'
    },
  });

  const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.date}>Date</Text>
        <Text style={styles.qty}>Qty</Text>
        <Text style={styles.rate}>Rate</Text>
        <Text style={styles.amount}>Amount</Text>
    </View>
  );
  
  export default InvoiceTableHeader