import React, { Fragment } from 'react';
import { Text, View, StyleSheet, Svg, Rect } from '@react-pdf/renderer';

const styles = StyleSheet.create({

    titleContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    companyTitle: {
        fontSize: 12,
        textTransform: 'uppercase',
        width: '100%',
        textAlign: 'right',
        borderTopColor: '#dee2e6',
        borderRightColor: '#fff',
        borderRightWidth: 1,
        paddingRight: 2
    },

    reportTitle: {
        fontSize: 12,
        width: '100%',
        textAlign: 'right',
        borderTopColor: '#dee2e6',
        borderRightColor: '#fff',
        borderRightWidth: 1,
        paddingRight: 2
    },

    Footer: {
        position: 'absolute',
        left: 0,
        bottom: 40,
        right: 40,
        textAlign: 'right'
    },
    FooterSignature: {
        position: 'absolute',
        left: 0,
        bottom: 70,
        right: 40,
        textAlign: 'right'
    },
   

    FooterBankDetails:{
        position: 'absolute',
        left: 60,
        bottom:70,
        right: 60,
        textAlign: 'left',
        border:1,
        borderColor:  '#dee2e6',
        padding:5,
        fontSize:10,
        width: '50%'
    },

    bankdetails:
    {
        fontFamily: 'Helvetica-Bold'
    },
    
    client:{
        position: 'absolute',
        left: 60,
        bottom: 140,
        right: 40,
        textAlign: 'left',
        fontSize: 9
    }
});

const InvoiceThankYouMsg = (props) => (
    
<>
<View  style={styles.client}><Text>Customer Signature</Text></View>
<View style={styles.FooterBankDetails}>
<Text style={{fontFamily: 'Helvetica-Bold',fontSize:8}}>Bank Details of {" "}
     {props.companydetails[0].CompanyName}:</Text>
<Text><Text style={{fontFamily: 'Helvetica-Bold',fontSize: 8}}>Bank Name: </Text>
<Text style={{fontSize: 8}}>{props.companydetails[0].BankName}</Text></Text>
<Text><Text style={{fontFamily: 'Helvetica-Bold', fontSize: 8}}>A/C No: </Text><Text style={{fontSize: 8}}>{props.companydetails[0].AccountNo}</Text></Text>
<Text><Text style={{fontFamily: 'Helvetica-Bold', fontSize: 8}}>Branch IFSC Code: </Text><Text style={{fontSize: 8}}>{props.companydetails[0].IFSCCode}</Text></Text>
<Text><Text style={{fontFamily: 'Helvetica-Bold', fontSize: 8}}>Branch Name: </Text><Text style={{fontSize: 8}}>{props.companydetails[0].BranchName}</Text></Text>
</View>

{/* <View style={styles.Footer}>

<Svg viewBox="-210 -0 200 100">

            <Rect
                width="70"
                height="50"
                fill="white"
                stroke="gray"
            />
        </Svg>
</View> */}

    <View style={styles.FooterSignature}>
    
        <Text style={{fontSize:'9px'}}>Authorized Signature For</Text><br />
        <Text style={{fontFamily: 'Helvetica-Bold', fontSize:8}} >
            {props.companydetails[0].CompanyName}</Text>
    </View>
    </>
);

export default InvoiceThankYouMsg