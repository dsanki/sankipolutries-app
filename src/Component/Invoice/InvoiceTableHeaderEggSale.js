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
    large: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    qty: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    normal: {
        width: '15%'
    },
  });

  const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.normal}>Date</Text>
        <Text style={styles.normal}>Qty</Text>
        <Text style={styles.normal}>@</Text>
        <Text style={styles.normal}>Amount</Text>
        <Text style={styles.normal}>Disnt</Text>
        <Text style={styles.normal}>Final</Text>
        <Text style={styles.normal}>Due</Text>
    </View>
  );
  
  export default InvoiceTableHeader