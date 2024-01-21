import React, { Component, useState, useEffect,componentDidMount,componentDidUpdate } from 'react'
import { variables } from './../../Variables';
import { Button, ButtonToolbar, Table } from 'react-bootstrap';
import Moment from 'moment';
import EditLotComponent from './EditLotComponent'

function LotListComponent() {

    const [lots, setLots] = useState([]);
    const [addModalShow, setAddModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);

    const initialvalues = {
        lotid: "",
        lotname: "",
        startdate: "",
        enddate: ""
    };

    const [lotdata, setLotData] = useState(initialvalues);

    //   const [lotdata, setLotData] = useState(  lotid= "",
    //   lotname= "",
    //   startdate="",
    //   enddate="");

    //   const handleClick = (e) => {
    //     setData({ ...data, [e.target.name]: e.target.value });
    //   };

    let addModalClose = () => {setAddModalShow({ addModalShow: false })

};
    let editModalClose = () => {
        
        setEditModalShow(false)
        window.location.reload();
    };
    useEffect(() => {
        fetchLots();
    }, []);

    const fetchLots = async () => {
        fetch(variables.REACT_APP_API + 'LotMaster')
            .then(response => response.json())
            .then(data => {
                setLots(data);
                console.log(data);
            });

    }

    // componentDidMount(() => {
    //     fetchLots();
    // }, []);

    // componentDidUpdate(() => {
    //     fetchLots();
    // }, []);


    return (
        <Table className="mt-4" striped bordered hover size="sm">
            <thead>
                <tr align='center'>
                    <th>Lot Name</th>
                    <th>Start Date</th>
                    <th>End Name</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                {
                        lots.map((p) => (
                            <tr key={p.Id} align='center'>
                            <td align='center'>{p.LotName}</td>
                            <td align='center'>{Moment(p.StartDate).format('DD-MMM-YYYY')}</td>
                            <td align='center'>{p.EndDate? Moment(p.EndDate).format('DD-MMM-YYYY'):''}</td>

                             <td align='center'>
                                <ButtonToolbar>
                                <Button className="mr-2" variant="info" style={{ marginRight: "17.5px" }} onClick={() => {setEditModalShow(true);  
                                setLotData(prev => ({...prev,
                                    lotid: p.Id,
                                    lotname: p.LotName,
                                    startdate: p.StartDate,
                                    enddate: p.EndDate
                                }
                                ));
                               }}>Edit</Button>


                                    <Button className="mr-2" variant="danger" size="sm" 
                                        onClick={() => this.deleteLot(p.Id)}>
                                        Delete
                                    </Button>

                                    <EditLotComponent show={editModalShow}
                                        onHide={editModalClose}
                                        lotid={lotdata.lotid}
                                        lotname={lotdata.lotname}
                                        startdate={lotdata.startdate}
                                        enddate={lotdata.enddate} 
                                    /> 
                                </ButtonToolbar>
                            </td>
                            </tr>
                        ))
                }
            </tbody>
        </Table>
    )
}
export default LotListComponent;
