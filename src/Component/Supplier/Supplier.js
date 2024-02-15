import React, { useState, useEffect, useMemo } from 'react'
import { variables } from '../../Variables';
import { Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

function Supplier(props) {

    let history = useNavigate();
    const [supplier, setSupplierList] = useState([]);
    const [type, setSupplierType] = useState([]);
    const [validated, setValidated] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);

    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);

    const [supplierdata, SetSupplierData] = useState([]);


    useEffect((e) => {

      if (localStorage.getItem('token')) {
        
      }
      else {
          history("/login")
      }
  }, [obj]);

  return (
    <div>
      
    </div>
  )
}

export default Supplier
    