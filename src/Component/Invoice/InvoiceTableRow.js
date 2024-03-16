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
        fontStyle: 'bold',
    },
    cat: {
        width: '10%',
        textAlign: 'center',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    qty: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
    },
    rate: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
    },
    discnt: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
    },
    tdiscnt: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
    },
    amount: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    finalamount: {
        width: '20%',
        textAlign: 'right',
        paddingRight: 8,
    }
});


// const InvoiceTableRow = ({items}) => {
//     const rows = items.map( item => 
//         <View style={styles.row} key={item.sno.toString()}>
//             <Text style={styles.description}>{item.desc}</Text>
//             <Text style={styles.qty}>{item.qty}</Text>
//             <Text style={styles.rate}>{item.rate}</Text>
//             <Text style={styles.amount}>{(item.qty * item.rate).toFixed(2)}</Text>
//         </View>
//     )
//     return (<Fragment>{rows}</Fragment> )
// };

const InvoiceTableRow = (props) => {
    //eggsaledata,eggcategory
    return (

        <Fragment>
            {
                 props.eggsaledata.map((p, i) => {
                    let catname=props.eggcategory.filter(x=>x.Id===p.EggCategory);
                    return(
                    <View style={styles.row} key={p.Id}>
                        <Text style={styles.cat}>{catname[0].EggCategoryName}</Text>
                        <Text style={styles.qty}>{p.Quantity}</Text>
                        <Text style={styles.rate}>{p.EggRate}</Text>
                        <Text style={styles.amount}>{Number.parseFloat(p.TotalCost).toFixed(2)}</Text>
                        <Text style={styles.discnt}>{Number.parseFloat(p.DiscountPerEgg).toFixed(2)}</Text>
                        <Text style={styles.discnt}>{Number.parseFloat(p.TotalDiscount).toFixed(2)}</Text>
                        <Text style={styles.finalamount}>{Number.parseFloat(p.FinalCost).toFixed(2)}</Text>
                    </View>
                    )
                 })
            }

        </Fragment>

    )

};


export default InvoiceTableRow