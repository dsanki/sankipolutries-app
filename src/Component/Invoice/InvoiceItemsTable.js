import React from 'react';
import { View, StyleSheet, Text } from '@react-pdf/renderer';
import InvoiceTableHeader from './InvoiceTableHeader'
import InvoiceTableRow from './InvoiceTableRow'
import InvoiceTableBlankSpace from './InvoiceTableBlankSpace'
import InvoiceTableFooter from './InvoiceTableFooter'

const tableRowsCount = 11;

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#dee2e6',
    textAlign: 'center'
  },
});

const InvoiceItemsTable = (props) => (
  <View style={styles.tableContainer}>
    <InvoiceTableHeader />
    <InvoiceTableRow eggsaledata={props.eggsaledata.EggSale} eggcategory={props.eggcategory}  />

    {/* <InvoiceTableBlankSpace rowsCount={ tableRowsCount - props.invoice.items.length} /> */}
    <InvoiceTableBlankSpace rowsCount={1} amountinwords={props.eggsaledata.AmountInWords} />
    <InvoiceTableFooter eggsaledata={props.eggsaledata} advancedata={props.advancedata}/>
  </View>
);

export default InvoiceItemsTable