import React from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../image/logo.png'

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 16
    },
    company: {
        // marginTop: 20,
        // paddingBottom: 3,
        // fontFamily: 'Helvetica-Oblique',
        // fontSize:20px

        // color: '#61dafb',
        letterSpacing: 1,
        fontSize: 18,
        // textAlign: 'center',
        textTransform: 'uppercase'
    },
    logo: {
      width: 40,
      height: 40,
      marginBottom:10
      // marginLeft: 'auto',
      // marginRight: 'auto'
  }
  });


  const Company = (props) => (
    <View style={styles.headerContainer}>
       <Image style={styles.logo} src={logo} />
        <Text style={styles.company}>{props.companydetails[0].CompanyName}</Text>
                <Text>{props.companydetails[0].Address}</Text>
               
                <Text>{`Phone no: ${props.companydetails[0].PhoneNo}`}</Text>
                <Text>{`Email: ${props.companydetails[0].Email}`}</Text>
                <Text>{`PAN: ${props.companydetails[0].PAN}`}</Text>
    </View>
  );
  
  export default Company