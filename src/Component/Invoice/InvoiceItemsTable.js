import React from 'react';
import {View, StyleSheet } from '@react-pdf/renderer';
import InvoiceTableHeader from './InvoiceTableHeader'
import InvoiceTableRow from './InvoiceTableRow'
import InvoiceTableBlankSpace from './InvoiceTableBlankSpace'
import InvoiceTableFooter from './InvoiceTableFooter'

const tableRowsCount = 11;

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#bff0fd',
    },
});

  const InvoiceItemsTable = (props) => (
    <View style={styles.tableContainer}>
        <InvoiceTableHeader />
        <InvoiceTableRow eggsaledata={props.eggsaledata} />
        {/* <InvoiceTableBlankSpace rowsCount={ tableRowsCount - props.invoice.items.length} /> */}
        <InvoiceTableBlankSpace rowsCount={1} />
        <InvoiceTableFooter eggsaledata={props.eggsaledata} />
    </View>
  );
  
  export default InvoiceItemsTable