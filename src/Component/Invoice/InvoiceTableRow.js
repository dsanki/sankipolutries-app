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
        height:35,
        // fontStyle: 'bold',
        fontSize:9
    },
    cat: {
        width: '12%',
        textAlign: 'center',
        borderRightColor: borderColor,
        borderRightWidth: 1,
       // paddingLeft: 8,
        fontSize:9
    },

    // catH: {
    //     width: '16%',
    //     borderRightColor: borderColor,
    //     borderRightWidth: 1,
    //     textAlign: 'center',
    //    fontFamily: 'Helvetica-Bold',
    //     fontSize:10,
    //     //fontStyle: 'bold'
    // },
    qty: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        //paddingRight: 8,
        fontSize:9
    },
    // qtyH: {
    //     width: '13%',
    //     borderRightColor: borderColor,
    //     borderRightWidth: 1,
    //     textAlign: 'center',
    //     fontFamily: 'Helvetica-Bold',
    //     fontSize:10
    // },
    rate: {
        width: '8%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
        fontSize:9
    },
    // rateH: {
    //     width: '8%',
    //     borderRightColor: borderColor,
    //     borderRightWidth: 1,
    //     textAlign: 'center',
    //     paddingRight: 8,
    //    fontFamily: 'Helvetica-Bold',
    //     fontSize:10
    // },
    discnt: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
        fontSize:9
    },
    // discntH: {
    //     width: '10%',
    //     borderRightColor: borderColor,
    //     borderRightWidth: 1,
    //     textAlign: 'center',
    //     fontFamily: 'Helvetica-Bold',
    //     fontSize:10,
    //     paddingRight: 8,
    // },

    // totaldiscntH: {
    //     width: '15%',
    //     borderRightColor: borderColor,
    //     borderRightWidth: 1,
    //     textAlign: 'center',
    //     fontFamily: 'Helvetica-Bold',
    //     paddingRight: 8,
    //     fontSize:10,
       
    // },
    totaltdiscnt: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
        fontSize:9
    },
    amount: {
        width: '19%',
        textAlign: 'center',
        paddingRight: 8,
        borderRightColor: borderColor,
        borderRightWidth: 1,
        fontSize:9
    },
    // amountH: {
    //     width: '20%',
    //     textAlign: 'center',
    //     paddingRight: 8,
    //     borderRightColor: borderColor,
    //     borderRightWidth: 1,
    //     fontFamily: 'Helvetica-Bold',
    //     fontSize:10
    // },
    finalamount: {
        width: '18%',
        textAlign: 'right',
        paddingRight: 8,
       // borderRightColor: borderColor,
        fontSize:9
    },

    SLNo: {
        width: '8%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'center',
        paddingRight: 8,
        fontSize:9
    }
    // finalamountH: {
    //     width: '20%',
    //     textAlign: 'right',
    //    // marginRight:8,
    //     fontFamily: 'Helvetica-Bold',
    //     //borderRightColor: borderColor,
    //     fontSize:10,
    //     paddingRight: 8,
    // },
  
    // containerH: {
    //     flexDirection: 'row',
    //     borderBottomColor: '#dee2e6',
    //     backgroundColor: '#fff',
    //     borderBottomWidth: 1,
    //     alignItems: 'center',
    //     height: 24,
    //     textAlign: 'center',
    //     fontStyle: 'bold',
    //     flexGrow: 1
    // }
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
        {/* <View style={styles.containerH}>
        <Text style={styles.catH}>Product</Text>
        <Text style={styles.qtyH}>Quantity</Text>
        <Text style={styles.rateH}>Rate</Text>
        <Text style={styles.amountH}>Total</Text>
        <Text style={styles.discntH}>Disnt</Text>
        <Text style={styles.totaldiscntH}>Total Disnt</Text>
        <Text style={styles.finalamountH}>Final Amount</Text>
    </View> */}
            {
                
                 props.eggsaledata.map((p, i) => {
                    let catname=props.eggcategory.filter(x=>x.Id===p.EggCategory);
                    let _loseEgg=p.EggLose>0?"\n" +p.EggLose +" piece(s)":"";
                    let _eggpack=p.EggPack>0?p.EggPack +" Box":p.Quantity;
                    let _height=_loseEgg===""?25:50;
                    let type="";
                    if(p.EggDiscountType==1){
                        type= "/egg"}
                        else if(p.EggDiscountType==2)
                        {
                            type= "%"
                        }

                    return(
                    <View style={styles.row} key={p.Id}>
                        <Text style={styles.SLNo}>{i+1}</Text>
                        <Text style={styles.cat}>{catname[0].EggCategoryName}</Text>
                        <Text style={styles.qty}>{_eggpack}{_loseEgg}</Text>
                        <Text style={styles.rate}>{p.EggRate}</Text>
                        <Text style={styles.amount}>{Number.parseFloat(p.TotalCost).toFixed(2)}</Text>
                        <Text style={styles.discnt}>{p.DiscountPerEgg!=null?Number.parseFloat(p.DiscountPerEgg).toFixed(2):"0.00"}{type}</Text>
                        <Text style={styles.totaltdiscnt}>{Number.parseFloat(p.TotalDiscount).toFixed(2)}</Text>
                        <Text style={styles.finalamount}>{Number.parseFloat(p.FinalCost).toFixed(2)}</Text>
                    </View>
                    )
                 })
            }

        </Fragment>

    )

};


export default InvoiceTableRow