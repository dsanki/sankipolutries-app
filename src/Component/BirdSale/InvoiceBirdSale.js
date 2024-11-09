import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../image/logo.png'
import InvoiceTitle from './../Invoice/InvoiceTitle'
import BillTo from './../Invoice/BillTo'
import InvoiceNo from './../Invoice/InvoiceNo'
import InvoiceItemsTable from './InvoiceItemsTable'
import InvoiceThankYouMsg from './../Invoice/InvoiceThankYouMsg'
import Company from './../Invoice/Company'

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

    compContainer: {
        width: '50%',
    },
    rowComp: {
        flexDirection: 'row',
        marginTop: 25
    },
    row: {
        flexDirection: 'row'
    },
    gap:
    {
        marginBottom: 30
    }
});

// Create Document Component
const InvoiceBirdSale = (props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <InvoiceTitle title='Invoice' eggsaledata={props.birdsaledata} 
            invoiceno={props.birdsaledata.InvoiceNo} date={props.birdsaledata.Date} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
            <View style={styles.rowComp}>
                <Company companydetails={props.companydetails} />
                <BillTo customerdetails={props.customerdetails} vehicle={props.birdsaledata.VehicleNo} />
            </View>
            <View style={styles.gap}></View>
            <InvoiceItemsTable birdsaledata={props.birdsaledata} />
            <InvoiceThankYouMsg bankdetails={props.bankdetails}/>
        </Page>
    </Document>
);

export default InvoiceBirdSale