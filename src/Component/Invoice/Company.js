import React, { Fragment } from 'react';
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../image/logo.png'
import moment from 'moment';

const styles = StyleSheet.create({
  headerContainer: {
    width: '60%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 4
  },
  company: {
    // marginTop: 20,
    // paddingBottom: 3,
    // fontFamily: 'Helvetica-Oblique',
    // fontSize:20px

    // color: '#61dafb',
    letterSpacing: 1,
    fontSize: 10,
    // textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold'
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 5
    // marginLeft: 'auto',
    // marginRight: 'auto'
  },
  row: {
    flexDirection: 'row'
  },
  invoiceDateContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end'
  }
});

function leftFillNum(num, targetLength) {
  return num.toString().padStart(targetLength, '0');
}

const Company = (props) => (
  
    <View style={styles.headerContainer}>
      <Text style={styles.company}>{props.companydetails[0].CompanyName}</Text><br />
      <Text style={{fontSize:9}}>{props.companydetails[0].Address}</Text><br />
      <Text style={{fontSize:9}}>{`Phone no: ${props.companydetails[0].PhoneNo}`}</Text><br />
      <Text style={{fontSize:9}}>{`Email: ${props.companydetails[0].Email}`}</Text><br />
      <Text style={{fontSize:9}}>{`PAN: ${props.companydetails[0].PAN}`}</Text>
    </View>
  
);

export default Company