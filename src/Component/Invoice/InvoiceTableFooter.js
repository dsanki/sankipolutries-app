import React from 'react';
import { Text, View, StyleSheet,Image, Svg  } from '@react-pdf/renderer';
import rup from '../../image/rupee-sign-solid.png'
// import { numberToWords } from "amount-to-words";

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
    

    // totalinwords: {
    //     width: '100%',
    //     textAlign: 'right',
    //     borderRightColor: borderColor,
    //     borderRightWidth: 1,
    //     paddingRight: 8,
    // }
});


const InvoiceTableFooter = (props) => {
    // const total = items.map(item => item.qty * item.rate)
    //     .reduce((accumulator, currentValue) => accumulator + currentValue , 0)
    return (
        <>
            <View style={styles.row}> 
                <Text style={styles.description}>Total </Text> 
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />{Number.parseFloat(props.eggsaledata.TotalCost).toFixed(2)}</Text>

            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Discount</Text>
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />{Number.parseFloat(props.eggsaledata.TotalDiscount).toFixed(2)}</Text>

            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Final Total</Text>
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />{Number.parseFloat(props.eggsaledata.FinalCostInvoice).toFixed(2)}</Text>

            </View>
            <View style={styles.row}>
                
                <Text style={styles.amountinwords}>{`Amount in words: ${props.eggsaledata.AmountInWords}`}</Text>

            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Paid</Text>
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />{Number.parseFloat(props.eggsaledata.Paid).toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Balance</Text>
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />{Number.parseFloat(props.eggsaledata.Due).toFixed(2)}</Text>

            </View>

            {/* <View style={styles.row}>
            
                <Text style={styles.totalinwords}>{`Total Amount (in words)${numberToWords(Number.parseFloat(props.eggsaledata.Due).toFixed(2))}`}</Text>

            </View> */}
            
        </>
    )
};

export default InvoiceTableFooter