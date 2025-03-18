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
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
       fontFamily: 'Helvetica-Bold',
        fontSize:9,
        //fontStyle: 'bold'
    },
    qty: {
        width: '13%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize:9
    },
    rate: {
        width: '8%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize:9
    },
    discnt: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize:9
    },

    totaldiscnt: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize:9
    },
    amount: {
        width: '15%',
        textAlign: 'center',
        marginRight:5,
        //fontFamily: 'Helvetica-Bold',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        fontFamily: 'Helvetica-Bold',
        fontSize:9
    },
    FinalAmount: {
        width: '20%',
        textAlign: 'right',
        marginRight:5,
        fontFamily: 'Helvetica-Bold',
        fontSize:9
    },
    totaldiscntH: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        paddingRight: 8,
        fontSize:9,
       
    },
    qtyH: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize:9
    },
    catH: {
        width: '12%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
       fontFamily: 'Helvetica-Bold',
        fontSize:9,
        //fontStyle: 'bold'
    },
    discntH: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize:9,
        paddingRight: 8,
    },
    rateH: {
        width: '8%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
       fontFamily: 'Helvetica-Bold',
        fontSize:9
    },
    amountH: {
        width: '19%',
        textAlign: 'center',
        paddingRight: 8,
        borderRightColor: borderColor,
        borderRightWidth: 1,
        fontFamily: 'Helvetica-Bold',
        fontSize:9
    },
    finalamountH: {
        width: '18%',
        textAlign: 'right',
        fontFamily: 'Helvetica-Bold',
        fontSize:9,
        paddingRight: 8,
    },
  
    containerH: {
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

    SLNoH: {
        width: '8%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        fontFamily: 'Helvetica-Bold',
        fontSize:9
    }


  });

  const InvoiceTableHeader = () => (
    
    <View style={styles.containerH}>
    <Text style={styles.SLNoH}>Sl.No</Text>
    <Text style={styles.catH}>Product</Text>
    <Text style={styles.qtyH}>Quantity</Text>
    <Text style={styles.rateH}>Rate</Text>
    <Text style={styles.amountH}>Total</Text>
    <Text style={styles.discntH}>Disnt</Text>
    <Text style={styles.totaldiscntH}>Total Disnt</Text>
    <Text style={styles.finalamountH}>Final Amount</Text>
</View>
  );
  
  export default InvoiceTableHeader