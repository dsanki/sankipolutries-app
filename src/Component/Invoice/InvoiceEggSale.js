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
        marginBottom: 10
    },
    sectionROW: {
        margin: 10,
        padding: 10,
       // flexGrow: 1,
        flexDirection: 'row'
      }
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
            <InvoiceTitle title='Invoice' eggsaledata={props.eggsaledata} 
             invoiceno={props.eggsaledata.InvoiceNo} date={props.eggsaledata.PurchaseDate} />
            {/* <InvoiceNo invoice={props.eggsaledata} /> */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                {/* <View>
                    <Text style={{ width: 50, textAlign: 'center' }}>Hello</Text>
                </View> */}
                <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
            </View>
            {/* <Image style={styles.logo} src={props.companydetails.CompanyLogo} /> */}
            {/* <Image style={styles.logo} src={logo} /> */}
            <View style={styles.sectionROW}>
                <Company style={{marginTop:10}} companydetails={props.companydetails} />
                <BillTo style={{marginTop:10}}  customerdetails={props.customerdetails}  
                eggsaledata={props.eggsaledata} />
            </View>
            <View style={styles.gap}></View>



            {/* <BillTo customerdetails={props.customerdetails} /> */}


            <InvoiceItemsTable eggsaledata={props.eggsaledata} eggcategory={props.eggcategory} />
            <InvoiceThankYouMsg />
        </Page>
    </Document>
);

export default InvoiceEggSale