import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
// import { numberToWords } from "amount-to-words";

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontSize: 12,
        fontStyle: 'bold',
    },
    description: {
        width: '85%',
        textAlign: 'right',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingRight: 8,
    },
    total: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
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
                <Text style={styles.description}>Total</Text>
                <Text style={styles.total}>{Number.parseFloat(props.eggsaledata.TotalCost).toFixed(2)}</Text>

            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Discount</Text>
                <Text style={styles.total}>{Number.parseFloat(props.eggsaledata.Discount).toFixed(2)}</Text>

            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Final Total</Text>
                <Text style={styles.total}>{Number.parseFloat(props.eggsaledata.FinalCost).toFixed(2)}</Text>

            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Paid</Text>
                <Text style={styles.total}>{Number.parseFloat(props.eggsaledata.Paid).toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Due</Text>
                <Text style={styles.total}>{Number.parseFloat(props.eggsaledata.Due).toFixed(2)}</Text>

            </View>

            {/* <View style={styles.row}>
            
                <Text style={styles.totalinwords}>{`Total Amount (in words)${numberToWords(Number.parseFloat(props.eggsaledata.Due).toFixed(2))}`}</Text>

            </View> */}
            
        </>
    )
};

export default InvoiceTableFooter