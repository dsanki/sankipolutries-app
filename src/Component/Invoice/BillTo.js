import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  headerBillToContainer: {
    textAlign: 'left',
    width: '40%',
    marginTop: 8,
    justifyContent: 'flex-start',
    fontSize:10
  },
  headerBillToContainergap: {
    width: '10%',
    marginTop: 8
  },
  billTo: {
    paddingBottom: 3,
    fontFamily: 'Helvetica-Bold',
    fontSize: 14
  }
});


const BillTo = (props) => (
  <Fragment>
    <View style={styles.headerBillToContainergap}></View>
    <View style={styles.headerBillToContainer}>
      <Text style={styles.billTo}>Bill To:</Text>
      <Text>{props.customerdetails.MiddleName!="" && props.customerdetails.MiddleName!=null?
       props.customerdetails.FirstName+ " " +props.customerdetails.MiddleName+ " " + props.customerdetails.LastName:
       props.customerdetails.FirstName+ " " +props.customerdetails.LastName}</Text>
      <Text>{props.customerdetails.MobileNo}</Text>
      <Text>{props.customerdetails.Email}</Text>
      <Text>{props.customerdetails.Address}</Text>
      <Text style={{fontFamily: 'Helvetica-Bold'}}>Motor Vehicle No:</Text><br/>
      <Text style={{fontSize:10}}>{props.vehicle.VehicleNo}</Text>
    </View>
  </Fragment>
);

export default BillTo