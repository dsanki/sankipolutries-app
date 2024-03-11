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
        bottom: 100,
        right: 40,
        textAlign: 'right'
    }
});


// function drawRectangle(x, y, w, h) {
//     ctx.strokeStyle = color;
//     ctx.strokeRect(x, y, w, h);
// }

const InvoiceThankYouMsg = () => (
    // <Fragment style={styles.Footer}>
    //     <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 90 }}>
    //         <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
    //     </View>
    //     <View style={styles.titleContainer}>
    //         <Text style={styles.reportTitle}>Authorized Signature For</Text>
    //     </View>
    //     <View >
    //         <Text style={styles.reportTitle}>SANKI POULTRIES</Text>
    //     </View>
    // </Fragment>
    <>
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