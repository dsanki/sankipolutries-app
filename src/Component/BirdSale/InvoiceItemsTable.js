import React from 'react';
import { View, StyleSheet, Text } from '@react-pdf/renderer';
import InvoiceTableHeader from './InvoiceTableHeader'
import InvoiceTableRow from './InvoiceTableRow'
import InvoiceTableBlankSpace from './../Invoice/InvoiceTableBlankSpace'
import InvoiceTableFooter from './InvoiceTableFooter'

const tableRowsCount = 11;

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#dee2e6',
    textAlign: 'center'
  },
});

const InvoiceItemsTable = (props) => (
  <View style={styles.tableContainer}>
    <InvoiceTableHeader />
    <InvoiceTableRow birdsaledata={props.birdsaledata}/>
    <InvoiceTableBlankSpace rowsCount={1} amountinwords={props.birdsaledata.AmountInWords} />
    <InvoiceTableFooter birdsaledata={props.birdsaledata} />
  </View>
);

export default InvoiceItemsTable