import React from 'react';
import { Text, View, StyleSheet, Image, Svg, Font } from '@react-pdf/renderer';
import rup from '../../image/rupee-sign-solid.png'

// Font.register({ family: 'Times-Italic', src: source, fontStyle: 
//     'italic', fontWeight: 'normal'});

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
        fontFamily: 'Helvetica-Bold',
        fontSize: 9
    },
    total: {
        width: '20%',
        textAlign: 'right',
        paddingRight: 8,
        fontSize: 9
    },

    logoRupee: {
        width: 9,
        height: 9
    },

    amountinwordslblarea: {
        width: '100%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingRight: 10,
        paddingLeft: 9
    },
    amountinwordslbl: {

        fontFamily: 'Helvetica-Bold',
        fontSize: 9
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
        fontSize: 9
    },
    col1: {
        width: '40%',
    },
    paymentMode: {
        // width: '100%',
        textAlign: 'right',
        width: '80%',
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        paddingRight: 8
    },
    paymentModeLbl: {
        // fontFamily:'italic',
        fontSize: 8,
        textAlign: 'left',
        marginLeft: 5
    },

    msgEggCount: {
        fontSize: 8,
        textAlign: 'left',
        marginLeft: 5
    }
});


const InvoiceTableFooter = (props) => {
    let paymentmode = "";
    if (props.eggsaledata.Cash != null) {
        paymentmode = paymentmode + " Cash- "
            + Number.parseFloat(props.eggsaledata.Cash).toFixed(2)
    }
    if (props.eggsaledata.PhonePay != null) {
        paymentmode = paymentmode + " PhonePay/UPI- "
            + Number.parseFloat(props.eggsaledata.PhonePay).toFixed(2)
    }
    if (props.eggsaledata.NetBanking != null) {
        paymentmode = paymentmode + " Net Banking- "
            + Number.parseFloat(props.eggsaledata.NetBanking).toFixed(2)
    }

    if (props.eggsaledata.CashDeposite != null) {
        paymentmode = paymentmode + " CashDeposite- "
            + Number.parseFloat(props.eggsaledata.CashDeposite).toFixed(2)
    }

    if (props.eggsaledata.Cheque != null) {
        paymentmode = paymentmode + " Cheque- "
            + Number.parseFloat(props.eggsaledata.Cheque).toFixed(2)
    }



    return (
        <>
            {/* <View style={styles.row}> 
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

            </View> */}
            {
                <View style={styles.row}>
                    <Text style={styles.description}>Additional Charges</Text>
                    <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />
                        {Number.parseFloat(props.eggsaledata.AdditionalCharge || 0).toFixed(2)}</Text>
                </View>
            }

            <View style={styles.row}>
                <Text style={styles.description}>Payble Amount</Text>
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />
                    {parseFloat(Number.parseFloat(props.eggsaledata.FinalCostInvoice) +
                        Number.parseFloat(props.eggsaledata.AdditionalCharge || 0)).toFixed(2)}</Text>
            </View>


            <View style={styles.row}>
                <Text style={styles.amountinwordslblarea}>
                    <Text style={styles.amountinwordslbl}>
                        Amount:</Text>
                    <Text style={styles.amountinwords}> {props.eggsaledata.AmountInWords}</Text></Text>
            </View>


            <View style={styles.row}>
                <Text style={styles.description}>Paid
                </Text>
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />
                    {Number.parseFloat(props.eggsaledata.Paid).toFixed(2)}</Text>
            </View>


            {/* <View style={styles.row}>
            <Text style={styles.paymentMode}> Payment mode</Text>
            <Text style={styles.total}> </Text>
                </View> */}

            {/* {
    props.eggsaledata.Cash !=null && paymentmode.concat(paymentmode+ "Cash-"
    +Number.parseFloat(props.eggsaledata.Cash).toFixed(2))
}
{

    props.eggsaledata.PhonePay !=null && paymentmode.concat(paymentmode+ "Phone Pay-"
        +Number.parseFloat(props.eggsaledata.PhonePay).toFixed(2))
        
}

{

props.eggsaledata.NetBanking !=null && paymentmode.concat(paymentmode+ "Net Banking-"
    +Number.parseFloat(props.eggsaledata.NetBanking).toFixed(2))
    
} */}

            {/* {

props.eggsaledata.UPI !=null && paymentmode.concat(paymentmode+ "UPI-"
    +Number.parseFloat(props.eggsaledata.UPI).toFixed(2))
    
}

{

props.eggsaledata.Cheque !=null && paymentmode.concat(paymentmode+ ", Cheque-"
    +Number.parseFloat(props.eggsaledata.Cheque).toFixed(2))
    
} */}

            {/* {
     props.eggsaledata.Cash !=null &&  <View style={styles.row}>
     {
        <><Text style={styles.description}>Cash</Text>
        <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />
        {Number.parseFloat(props.eggsaledata.Cash).toFixed(2)}</Text></>
       
     }
     </View>
}
{
    props.eggsaledata.PhonePay !=null &&  <View style={styles.row}>
    {
       <><Text style={styles.description}>Phone Pay</Text>
       <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />
       {Number.parseFloat(props.eggsaledata.PhonePay).toFixed(2)}</Text></>
    }
    </View>
}

{
    props.eggsaledata.NetBanking !=null &&  <View style={styles.row}>
    {
       <><Text style={styles.description}>Net Banking</Text>
       <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />
       {Number.parseFloat(props.eggsaledata.NetBanking).toFixed(2)}</Text></>
    }
    </View>
}

{
    props.eggsaledata.UPI !=null && <View style={styles.row}>
    {
       <><Text style={styles.description}>UPI</Text>
       <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />
       {Number.parseFloat(props.eggsaledata.UPI).toFixed(2)}</Text></>
    }
    </View>
}

{
    props.eggsaledata.Cheque !=null && <View style={styles.row}>
    {
       <><Text style={styles.description}>Cheque</Text>
       <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />
       {Number.parseFloat(props.eggsaledata.Cheque).toFixed(2)}</Text></>
    }
    </View>
} */}


            <View style={styles.row}>
                <Text style={styles.description}>Balance</Text>
                <Text style={styles.total}><Image src={rup} style={styles.logoRupee} />
                    {Number.parseFloat(props.eggsaledata.Due).toFixed(2)}</Text>
            </View>



            <View style={styles.row}>
                <Text style={styles.amountinwordslblarea}>
                    <Text style={styles.msgEggCount}>
                        N.B.</Text>
                    <Text style={styles.msgEggCount}> 1 box contains 210 eggs</Text></Text>
            </View>
           
            <Text style={styles.paymentModeLbl}>Payment mode: {paymentmode}</Text>
           
           

        </>
    )
};

export default InvoiceTableFooter