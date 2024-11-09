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
        fontSize:10,
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
        width: '17%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold'
    },
    weight: {
        width: '25%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold'
    },
    amount: {
        width: '25%',
        textAlign: 'right',
        //marginRight:5,
        fontFamily: 'Helvetica-Bold',
        borderRightColor: borderColor,
        //borderRightWidth: 1
        paddingRight: 8,
    },
    slno:
    {
        width: '8%',
        textAlign: 'center',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        fontFamily: 'Helvetica-Bold'
    }
  });

  const InvoiceTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.slno}>Sl.No.</Text>
        <Text style={styles.qty}>Total Birds</Text>
        <Text style={styles.weight}>Total Weight</Text>
        <Text style={styles.rate}>Rate</Text>
        <Text style={styles.amount}>Total Cost</Text>
       
    </View>
  );
  
  export default InvoiceTableHeader