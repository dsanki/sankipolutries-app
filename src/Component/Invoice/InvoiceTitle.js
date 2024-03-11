import React, { Fragment } from 'react'
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import InvoiceNo from './InvoiceNo'
import moment from 'moment';
import logo from '../../image/logo4.png'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  titleContainer: {
    // flexDirection: 'row',
    marginTop: 14,
  },
  frag: {
    justifyContent: 'flex-end'
  },
  reportTitle: {
    color: 'black',
    letterSpacing: 4,
    fontSize: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '70%',
    fontFamily: 'Helvetica-Bold',
  },

  date: {
    width: '30%',
    textAlign: 'right',
    paddingLeft: 5,
  },
  invoiceDateContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end'
},
logo: {
  width: 70,
  height: 70,
  //marginBottom: 10
  // marginLeft: 'auto',
  // marginRight: 'auto'
}
});

function leftFillNum(num, targetLength) {
  return num.toString().padStart(targetLength, '0');
}
const InvoiceTitle = (props) => (
  <View style={styles.row}>
 <Image style={styles.logo} src={logo} />
    <Text style={styles.reportTitle}>{props.title}</Text>
    <Fragment style={styles.date}>
        <View style={styles.invoiceDateContainer}>
          <Text style={{fontFamily: 'Helvetica-Bold'}}>{`Invoice No: ${leftFillNum(props.eggsaledata.Id, 5)}`}</Text><br/>
          <Text style={{fontFamily: 'Helvetica-Bold'}}>{`Date: ${moment(props.eggsaledata.PurchaseDate).format('DD/MM/YYYY')}`}</Text>
        </View >
       
    </Fragment>
  </View>
);

export default InvoiceTitle
