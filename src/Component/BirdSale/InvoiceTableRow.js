import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

const borderColor = '#dee2e6'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#dee2e6',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontSize:9,
        fontStyle: 'bold',
    },
    qty: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center'
       // paddingRight: 8,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        //paddingRight: 8,
    },
    AddnCharge: {
        width: '17%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        //paddingRight: 8,
    },
    weight: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        //paddingRight: 8,
    },
    amount: {
        width: '25%',
        textAlign: 'right',
        paddingRight: 8,
        borderRightColor: borderColor,
        //borderRightWidth: 1,
    },
    slno:
    {
        width: '8%',
        textAlign: 'center',
        borderRightColor: borderColor,
        borderRightWidth: 1
    }
    
});

const InvoiceTableRow = (props) => {
    return (

        <Fragment>
            {
               props.birdsaledata.BirdSaleDetailsList.map((p, i) => {
                return(
                      <View style={styles.row} key={p.Id}>
                         <Text style={styles.slno}>{i+1}</Text>
                         <Text style={styles.qty}>{p.BirdTypeName}</Text>
                        {/* <Text style={styles.cat}>{props.birdsaledata.Date}</Text> */}
                        <Text style={styles.qty}>{p.BirdCount}</Text>
                        <Text style={styles.weight}>{p.TotalWeight+" "+p.UnitName}</Text>
                        <Text style={styles.rate}>{p.Rate}</Text>
                        <Text style={styles.amount}>{Number.parseFloat(p.Amount).toFixed(2)}</Text>
                        {/* <Text style={styles.rate}>{props.birdsaledata.AdditionalCharge}</Text>
                        <Text style={styles.amount}>{Number.parseFloat(props.birdsaledata.TotalAmount).toFixed(2)}</Text> */}
                    </View>
                       )
                    })
                }

        </Fragment>

    )

};


export default InvoiceTableRow