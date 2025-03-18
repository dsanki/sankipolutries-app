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
        marginBottom: 5
    },
    sectionROW: {
        margin: 5,
        padding: 5,
        flexDirection: 'row'
      }
});

// Create Document Component
const InvoiceEggSale = (props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <InvoiceTitle title='Invoice' eggsaledata={props.eggsaledata} 
            companydetails={props.companydetails}
             invoiceno={props.eggsaledata.InvoiceNo} date={props.eggsaledata.PurchaseDate} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
            <View style={styles.sectionROW}>
                <Company style={{marginTop:2}} companydetails={props.companydetails} />
                <BillTo style={{marginTop:2}}  customerdetails={props.customerdetails}  
                vehicle={props.eggsaledata} />
            </View>
            {/* <View style={styles.gap}></View> */}
            <InvoiceItemsTable eggsaledata={props.eggsaledata} 
            eggcategory={props.eggcategory} advancedata={props.advancedata} />
            <InvoiceThankYouMsg bankdetails={props.bankdetails} 
            companydetails={props.companydetails}/>
        </Page>
    </Document>
);

export default InvoiceEggSale