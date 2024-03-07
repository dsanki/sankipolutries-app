import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../image/logo.png'
import InvoiceTitle from './InvoiceTitle'
import BillTo from './BillTo'
import InvoiceNo from './InvoiceNo'
import InvoiceItemsTable from './InvoiceItemsTable'
import InvoiceThankYouMsg from './InvoiceThankYouMsg'
import Company from './Company'

// Create styles
const borderColor = '#90e5fc'
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 60,
        paddingRight: 60,
        lineHeight: 1.5,
        flexDirection: 'column',
    },
    // logo: {
    //     width: 40,
    //     height: 40,
    //     marginLeft: 'auto',
    //     marginRight: 'auto'
    // },

//     container: {
//         flexDirection: 'row',
//         borderBottomColor: '#bff0fd',
//         backgroundColor: '#bff0fd',
//         borderBottomWidth: 1,
//         alignItems: 'center',
//         height: 24,
//         textAlign: 'center',
//         fontStyle: 'bold',
//         flexGrow: 1,
//     },
//     date: {
//         width: '40%',
//         borderRightColor: borderColor,
//         borderRightWidth: 1,
//     },
//     qty: {
//         width: '20%',
//         borderRightColor: borderColor,
//         borderRightWidth: 1,
//     },
//     rate: {
//         width: '20%',
//         borderRightColor: borderColor,
//         borderRightWidth: 1,
//     },
//     amount: {
//         width: '20%'
//     }
 });

// Create Document Component
const InvoiceEggSale = (props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* <Image style={styles.logo} src={props.companydetails.CompanyLogo} /> */}
            {/* <Image style={styles.logo} src={logo} /> */}
            <Company companydetails={props.companydetails}/>
            <InvoiceTitle title='Invoice' />
            <InvoiceNo invoice={props.eggsaledata} />
            <BillTo customerdetails={props.customerdetails} />
            <InvoiceItemsTable eggsaledata={props.eggsaledata} />
            <InvoiceThankYouMsg />
        </Page>
    </Document>
);

export default InvoiceEggSale