import React from 'react';
import { Text, View, StyleSheet,Image, Svg  } from '@react-pdf/renderer';
import rup from '../../image/rupee-sign-solid.png'

const borderColor = '#dee2e6'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#dee2e6',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontSize: 12,
        fontStyle: 'bold',
    },
    description: {
        width: '80%',
        textAlign: 'right',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingRight: 8,
        fontFamily: 'Helvetica-Bold'
    },
    total: {
        width: '20%',
        textAlign: 'right',
        paddingRight: 8
    },

    logoRupee: {
        width: 9,
        height: 9
    },
    amountinwords: {
        width: '100%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingRight: 10,
        paddingLeft: 10,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'capitalize',
    }
});


const InvoiceTableFooter = (props) => {
    return (
        <>
            <View style={styles.row}> 
                <Text style={styles.description}>Total </Text> 
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />{Number.parseFloat(props.birdsaledata.TotalAmount).toFixed(2)}</Text>

            </View>
            
            <View style={styles.row}>
                <Text style={styles.amountinwords}>{`Amount in words: ${props.birdsaledata.AmountInWords}`}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Paid</Text>
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />{Number.parseFloat(props.birdsaledata.Paid).toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Balance</Text>
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />{Number.parseFloat(props.birdsaledata.Due).toFixed(2)}</Text>

            </View>
            
        </>
    )
};

export default InvoiceTableFooter