import React, { Fragment } from 'react'
import { Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import InvoiceNo from './InvoiceNo'
import moment from 'moment';
import logo from '../../image/SPLogo1.png'
import logoKP from '../../image/kpf/kalandi_logo.jpg'

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
    fontSize: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    width: '50%',
    fontFamily: 'Helvetica-Bold',
  },

  date: {
    width: '50%',
    textAlign: 'right',
    paddingLeft: 5,
  },
  invoiceDateContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end'
},
logo: {
  width: 80,
  height: 80,
  //marginBottom: 10
  // marginLeft: 'auto',
  // marginRight: 'auto'
},
logokp: {
  width: 80,
  height: 80,
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
    {
      props.companydetails[0].Id==1 ?  <Image style={styles.logo} src={logo} /> :
      <Image style={styles.logokp} src={logoKP} />
    }

    <Text style={styles.reportTitle}>{props.title}</Text>
    <Fragment style={styles.date}>
        <View style={styles.invoiceDateContainer}>
        <Text><Text style={{fontFamily: 'Helvetica-Bold'}}>Invoice No:</Text><Text> {props.invoiceno}</Text></Text><br/>
        <Text><Text style={{fontFamily: 'Helvetica-Bold'}}>Date: </Text><Text>{moment(props.date).format('DD/MM/YYYY')}</Text></Text>
          {/* <Text style={{fontFamily: 'Helvetica-Bold'}}>{`Invoice No: ${props.invoiceno}`}</Text><br/>
          <Text style={{fontFamily: 'Helvetica-Bold'}}>{`Date: ${moment(props.date).format('DD/MM/YYYY')}`}</Text> */}
        </View >
       
    </Fragment>
  </View>
);

export default InvoiceTitle
