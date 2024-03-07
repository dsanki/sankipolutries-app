import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    headerContainer: {
      
        // marginTop: 36
    },
    billTo: {
        // marginTop: 20,
        paddingBottom: 3,
        fontFamily: 'Helvetica-Oblique'
    },
  });


  const BillTo = (props) => (
    <View style={styles.headerContainer}>
        {/* <Text style={styles.billTo}>Bill To:</Text>
        <Text>{props.company}</Text>
        <Text>{props.address}</Text>
        <Text>{props.phone}</Text>
        <Text>{props.email}</Text> */}
        <Text style={styles.billTo}>Bill To:</Text>
                <Text>{props.customerdetails.FirstName+ " " + props.customerdetails.LastName}</Text>
                <Text>{props.customerdetails.MobileNo}</Text>
                <Text>{props.customerdetails.Email}</Text>
    </View>
  );
  
  export default BillTo