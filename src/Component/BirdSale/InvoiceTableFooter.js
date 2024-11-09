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
        fontSize: 10,
        fontStyle: 'bold',
    },

    lastrow: {
        flexDirection: 'row',
        borderBottomColor: '#dee2e6',
       // borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontSize: 10,
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
    // amountinwords: {
    //     width: '100%',
    //     textAlign: 'left',
    //     borderRightColor: borderColor,
    //     borderRightWidth: 1,
    //     paddingRight: 10,
    //     paddingLeft: 10,
    //     fontFamily: 'Helvetica-Bold',
    //     textTransform: 'capitalize',
    // },

    amountinwordslblarea: {
        width: '100%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingRight: 10,
        paddingLeft: 10
    },
    amountinwordslbl: {
        
        fontFamily: 'Helvetica-Bold',
        fontSize:9
    },

    amountinwords: {
        // width: '100%',
        textAlign: 'left',
       // borderRightColor: borderColor,
        // borderRightWidth: 1,
        // paddingRight: 10,
        // paddingLeft: 10,
        //fontFamily: 'Helvetica-Bold',
        textTransform: 'capitalize',
        fontSize:9
    },
    paymentMode: {
        // width: '100%',
        textAlign: 'right',
         width: '80%',
         fontSize:10,
         fontFamily: 'Helvetica-Bold',
         paddingRight: 8
      },
      paymentModeLbl:{
       // fontFamily:'italic',
        fontSize:8,
        textAlign: 'left',
        marginLeft:5
      }
});


const InvoiceTableFooter = (props) => {

    let paymentmode="";
    if(props.birdsaledata.Cash!=null)
    {
        paymentmode= paymentmode+ " Cash- "
        +Number.parseFloat(props.birdsaledata.Cash).toFixed(2)
    }
    if(props.birdsaledata.PhonePay!=null)
        {
            paymentmode= paymentmode+ " PhonePay- "
            +Number.parseFloat(props.birdsaledata.PhonePay).toFixed(2)
        }
        if(props.birdsaledata.NetBanking!=null)
            {
                paymentmode= paymentmode+ " Net Banking- "
                +Number.parseFloat(props.birdsaledata.NetBanking).toFixed(2)
            }
    
            if(props.birdsaledata.UPI!=null)
                {
                    paymentmode= paymentmode+ " UPI- "
                    +Number.parseFloat(props.birdsaledata.UPI).toFixed(2)
                }
    
                if(props.birdsaledata.Cheque!=null)
                    {
                        paymentmode= paymentmode+ " Cheque- "
                        +Number.parseFloat(props.birdsaledata.Cheque).toFixed(2)
                    }
    return (
        <>
            {/* <View style={styles.row}> 
                <Text style={styles.description}>Total </Text> 
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />{Number.parseFloat(props.birdsaledata.TotalAmount).toFixed(2)}</Text>

            </View> */}

{
    <View style={styles.row}>
    <Text style={styles.description}>Additional Charges</Text>
    <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />
    {Number.parseFloat(props.birdsaledata.AdditionalCharge||0).toFixed(2)}</Text>
</View>
}

{/* <View style={styles.row}>
                <Text style={styles.description}>Payble Amount</Text>
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />
                {parseFloat(Number.parseFloat(props.eggsaledata.FinalCostInvoice) +
                Number.parseFloat(props.eggsaledata.AdditionalCharge||0)).toFixed(2)}</Text>
            </View> */}
            
            <View style={styles.row}>
            <Text style={styles.amountinwordslblarea}> 
                <Text style={styles.amountinwordslbl}>Amount in words: </Text>
                <Text style={styles.amountinwords}>{props.birdsaledata.AmountInWords}</Text>
            </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.description}>Paid</Text>
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />{Number.parseFloat(props.birdsaledata.Paid).toFixed(2)}</Text>
            </View>
            <View style={styles.lastrow}>
                <Text style={styles.description}>Balance</Text>
                <Text style={styles.total}>
                    <Image src={rup} style={styles.logoRupee} />{Number.parseFloat(props.birdsaledata.Due).toFixed(2)}</Text>

            </View>
            <Text style={styles.paymentModeLbl}>N.B: Payment mode used: {paymentmode}</Text>
        </>
    )
};

export default InvoiceTableFooter