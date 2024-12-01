import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logoSP from '../../image/logo.png'
import logoKP from '../../image/kalandi_logo.JPG'
import InvoiceTitle from './InvoiceTitle'
import BillTo from './BillTo'
import InvoiceNo from './InvoiceNo'
import InvoiceItemsTable from './InvoiceItemsTable'
import InvoiceThankYouMsg from './InvoiceThankYouMsg'

// Create styles
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
    logo: {
        width: 56,
        height: 48,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
});

// Create Document Component
const Invoice = (props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Image style={styles.logo} src={logoSP} />
            <InvoiceTitle title='Invoice' />
            <InvoiceNo invoice={props.invoice} />
            <BillTo invoice={props.invoice} />
            <InvoiceItemsTable invoice={props.invoice} />
            <InvoiceThankYouMsg bankdetails={props.bankdetails} companydetails={props.companydetails} />
        </Page>
    </Document>
);

export default Invoice