import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  headerBillToContainer: {
    textAlign: 'left',
    width: '30%',
    marginTop: 5,
    justifyContent: 'flex-start',
    fontSize:10
  },
  headerBillToContainergap: {
    width: '10%',
    marginTop: 5
  },
  billTo: {
    paddingBottom: 3,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10
  },
  textSize: {
    fontSize: 8
  }
});


const BillTo = (props) => (
  <Fragment>
    <View style={styles.headerBillToContainergap}></View>
    <View style={styles.headerBillToContainer}>
      <Text style={styles.billTo}>Bill To:</Text>
      <Text style={{fontFamily: 'Helvetica-Bold', fontSize:9}}>{props.customerdetails.MiddleName!="" 
      && props.customerdetails.MiddleName!=null?
       props.customerdetails.FirstName+ " " +props.customerdetails.MiddleName+ " " + props.customerdetails.LastName:
       props.customerdetails.FirstName+ " " +props.customerdetails.LastName}</Text>
      <Text style={styles.textSize}>{props.customerdetails.MobileNo}</Text>
      <Text style={styles.textSize}>{props.customerdetails.Email}</Text>
      <Text style={styles.textSize}>{props.customerdetails.Address}</Text>
      <Text style={{fontFamily: 'Helvetica-Bold', fontSize:8}}>Motor Vehicle No:</Text><br/>
      <Text style={styles.textSize}>{props.vehicle.VehicleNo}</Text>
    </View>
  </Fragment>
);

export default BillTo