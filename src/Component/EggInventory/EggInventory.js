import React, { useState, useEffect, useMemo } from 'react'
import { Button, ButtonToolbar, Table, Modal, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import DateComponent from '../DateComponent';
import {HandleLogout,downloadExcel,FecthEggCategory } from './../../Utility'
import Loading from '../Loading/Loading'



const EggInventory = (props) => {
    let history = useNavigate();
    const [eggtrackerlist, setEggDailyTrackerList] = useState([]);
    const [eggtrackerlistForFilter, setEggtrackerlistForFilter] = useState([]);
    const [isloaded, setIsLoaded] = useState(true);
    const [eggsalelist, setEggSaleList] = useState([]);
    const [eggcategory, setEggCategory] = useState([]);

    const [eggsaleinventory, setEggSaleInventory] = useState([]);
    const [eggprodinventory, setEggProdInventory] = useState([]);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            setIsLoaded(true);
            fetchEggDailyTrackerList();
            fetchEggSaleDetails(filterFromDate,filterToDate);
            fetchEggCategory();
            setIsLoaded(false);
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);

    const fetchEggCategory = async () => {
        FecthEggCategory(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setEggCategory(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                }
            })
    }

    const fetchEggInventory = async () => {
        
        fetch(process.env.REACT_APP_API + 'EggInventory/GetEggInventory',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.StatusCode === 200) {

                   
                    setEggSaleInventory(data.ResultEggSaleInventory);
                    setEggSaleInventory(data.ResultEggProductionInventory);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found GetEggDailyTrackerList!!", "danger")
                }
                else {
                    props.showAlert("Error occurred GetEggDailyTrackerList!!", "danger")
                }
            });

        setIsLoaded(false);
    }

    const fetchEggDailyTrackerList = async () => {
        
        fetch(process.env.REACT_APP_API + 'EggProductionDailyTracker/GetEggDailyTrackerList',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.StatusCode === 200) {
                    setEggDailyTrackerList(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found GetEggDailyTrackerList!!", "danger")
                }
                else {
                    props.showAlert("Error occurred GetEggDailyTrackerList!!", "danger")
                }
            });

        setIsLoaded(false);
    }

    const fetchEggSaleDetails = async (fromdate,todate) => {
        setIsLoaded(true);
        FectAllEggSaleInvoiceList(fromdate,todate, process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setEggSaleList(data.Result);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                    setIsLoaded(false);
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger")
                    setIsLoaded(false);
                }
                else {
                    props.showAlert("Error occurred!!", "danger")
                    setIsLoaded(false);
                }
            });
    }

    let addCount = (num) => {
        setCount(num + 1);
    };
  return (
    <div>
       {
                                                        eggcategory.map((item) => {

                                                            //const [eggsaleinventory, setEggSaleInventory] = useState([]);
                                                           //const [eggprodinventory, setEggProdInventory] = useState([]);
                                                            let totalCP=eggtrackerlist.Select()
                                                            return (
                                                               <div></div>
                                                            );
                                                        })
                                                    }
    </div>
  )
}

export default EggInventory
