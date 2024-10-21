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
    qty: {
        width: '25%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold'
    },
    rate: {
        width: '25%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold'
    },
    amount: {
        width: '25%',
        textAlign: 'right',
        marginRight:5,
        fontFamily: 'Helvetica-Bold',
        borderRightColor: borderColor,
        borderRightWidth: 1
    }
  });

  const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.qty}>Total Birds</Text>
        <Text style={styles.qty}>Total Weight</Text>
        <Text style={styles.rate}>Rate</Text>
        <Text style={styles.amount}>Total Cost</Text>
       
    </View>
  );
  
  export default InvoiceTableHeader