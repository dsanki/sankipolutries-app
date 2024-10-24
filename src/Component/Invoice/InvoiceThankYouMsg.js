import React, { Fragment } from 'react';
import { Text, View, StyleSheet, Svg, Rect } from '@react-pdf/renderer';

const styles = StyleSheet.create({

    titleContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    companyTitle: {
        fontSize: 12,
        // textAlign: 'center',
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
        // textAlign: 'center',
        //  textTransform: 'uppercase',
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

    FooterBankDetails:{
        position: 'absolute',
        left: 60,
        bottom:190,
        right: 60,
        textAlign: 'left',
        border:1,
        borderColor:  '#dee2e6',
        padding:5

    },
    bankdetails:
    {
        fontFamily: 'Helvetica-Bold'
    },
    client:{
        position: 'absolute',
        left: 60,
        bottom: 40,
        right: 40,
        textAlign: 'left'
    }


});


// function drawRectangle(x, y, w, h) {
//     ctx.strokeStyle = color;
//     ctx.strokeRect(x, y, w, h);
// }
const Square=()=>
{
    
}
const InvoiceThankYouMsg = () => (
    
    <>
    
<View style={styles.FooterBankDetails}>
<Text style={{fontFamily: 'Helvetica-Bold'}}>Bank Details of Sanki Poultries:</Text>
<Text><Text style={{fontFamily: 'Helvetica-Bold',fontSize: 10}}>Bank Name: </Text><Text>Canara Bank Pvt Ltd</Text></Text>
<Text><Text style={{fontFamily: 'Helvetica-Bold', fontSize: 10}}>A/C No: </Text><Text>00000000</Text></Text>
<Text><Text style={{fontFamily: 'Helvetica-Bold', fontSize: 10}}>Branch IFSC Code: </Text><Text>CANARA001</Text></Text>
</View>
<View  style={styles.client}><Text>Client Signature</Text></View>
<View style={styles.Footer}>
<Svg viewBox="-210 -05 200 100">
            <Rect
                width="70"
                height="50"
                fill="white"
                stroke="gray"
            />
        </Svg>
</View>
    <View style={styles.Footer}>

       
        <Text >Authorized Signature For</Text><br />
        <Text style={{fontFamily: 'Helvetica-Bold'}} >SANKI POULTRIES</Text>
    </View>
    </>
);

export default InvoiceThankYouMsg