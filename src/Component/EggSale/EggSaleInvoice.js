import React, { useEffect,useCallback,useMemo ,useState} from 'react'
// const { useTable } = ReactTable;
import { useTable } from "react-table";

// table data


const data = [
    {
        name: "John",
        workingHours: 40
    },
    {
        name: "Doe",
        workingHours: 40
    }
];

const AddEmployee = ({ onSubmit }) => {
    const [name, setName] = useState("");
    const [workingHours, setWorkingHours] = useState("");

    const handleSubmit = (e) => {
        onSubmit(e);
        setName("");
        setWorkingHours("");
    }

    return (
        <fieldset style={{ width: "200px" }}>
            <legend>Add Employee:</legend>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br />
                <input
                    type="text"
                    name="workingHours"
                    placeholder="Working Hours"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                />
                <br />
                <button type="submit">Add</button>
            </form>
        </fieldset>
    )
}

const EditEmployee = ({ row, onSave }) => {
    const { originalRow, rowIndex } = row;
    const [name, setName] = useState(originalRow.name);
    const [workingHours, setWorkingHours] = useState(originalRow.workingHours);

    return (
        <fieldset style={{ width: "200px" }}>
            <legend>Edit Employee:</legend>
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
                type="text"
                name="workingHours"
                placeholder="Working Hours"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
            />
            <br />
            <button onClick={() => onSave({ name, workingHours }, rowIndex)}>Save</button>
        </fieldset>
    )
}

function EggSaleInvoice(props) {

    const [tableData, setTableData] = useState(data);
    const [editingRow, setEditingRow] = useState();

    const handleDelete = useCallback((index) => {
        setTableData(tableData.filter((v, i) => i !== index));
    },[tableData]);

    const tableColumns = useMemo(() => [
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Working Hours',
            accessor: 'workingHours'
        },
        {
            Header: 'Action',
            id: 'action',
            accessor: (originalRow, rowIndex) => {
                return (
                    <div>
                        <button onClick={() => setEditingRow({ originalRow, rowIndex })}>
                            Edit
                        </button>
                        <button onClick={() => handleDelete(rowIndex)}>
                            Delete
                        </button>
                    </div>   
                )
            }
        }
    ], [handleDelete]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns: tableColumns,
        data: tableData,
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newData = {};
        formData.forEach((value, key) => newData[key] = value);
        setTableData((prevData) => {
            return [...prevData, newData];
        });
    };

    const handleEdit = useCallback((row, rowIndex) => {
        const editedData = tableData.map((rowData, index) => {
            if (index === rowIndex) {
               return row;
            }
            return rowData;
        });
        setTableData(editedData);
        setEditingRow();
    },[tableData])

    return (
        <div>
            <h3>React-table v.7</h3>
            <br />
            { editingRow ? <EditEmployee row={editingRow} onSave={handleEdit} /> : <AddEmployee onSubmit={handleSubmit} /> }
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}> 
                                    {column.render('Header')}
                                </th>
                            ))}
                    </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}> 
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
export default EggSaleInvoice