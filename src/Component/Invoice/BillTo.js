import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  headerBillToContainer: {
    textAlign: 'left',
    width: '40%',
    marginTop: 20
  },
  headerBillToContainergap: {
    width: '10%',
    marginTop: 20
  },
  billTo: {
    paddingBottom: 3,
    fontFamily: 'Helvetica-Bold',
    fontSize: 14
  },
});


const BillTo = (props) => (
  <Fragment>
    <View style={styles.headerBillToContainergap}></View>
    <View style={styles.headerBillToContainer}>
      <Text style={styles.billTo}>Bill To:</Text>
      <Text>{props.customerdetails.FirstName + " " + props.customerdetails.LastName}</Text>
      <Text>{props.customerdetails.MobileNo}</Text>
      <Text>{props.customerdetails.Email}</Text>
    </View>
  </Fragment>
);

export default BillTo