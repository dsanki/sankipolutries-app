import React, { useState, useEffect, useMemo } from 'react'
import { Button, ButtonToolbar, Table, Modal, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import DateComponent from '../DateComponent';
import { HandleLogout, downloadExcel, FecthEggStockInventory } from './../../Utility'
import Loading from '../Loading/Loading'
import InputField from '../ReuseableComponent/InputField'


const EggStockInventory = (props) => {
    let history = useNavigate();
    const [eggtStockInventoryList, setEggStockInventoryList] = useState([]);
    const [isloaded, setIsLoaded] = useState(true);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            setIsLoaded(true);
            fetchEggStockInventory();
            setIsLoaded(false);
        }
        else {
            HandleLogout();
            history("/login")
        }
    }, [obj]);

    // const fetchEggCategory = async () => {
    //     FecthEggCategory(process.env.REACT_APP_API)
    //         .then(data => {
    //             if (data.StatusCode === 200) {
    //                 setEggCategory(data.Result);
    //             }
    //             else if (data.StatusCode === 401) {
    //                 HandleLogout();
    //                 history("/login")
    //             }
    //             else if (data.StatusCode === 404) {
    //                 props.showAlert("Data not found!!", "danger")
    //             }
    //             else {
    //                 props.showAlert("Error occurred!!", "danger")
    //             }
    //         })
    // }

    const fetchEggStockInventory = async () => {

        FecthEggStockInventory(process.env.REACT_APP_API)
            .then(response => response.json())
            .then(data => {
                if (data.StatusCode === 200) {
                    setEggStockInventoryList(data.Result);
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

    let addCount = (num) => {
        setCount(num + 1);
    };

    const clickAddEggStockInventory = (e) => {

    }
    return (
        <div>
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <h2>Egg Stock Inventory</h2>
            </div>

            <div class="row">
                <div class="col-md-6" style={{ textAlign: 'right' }}> <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => clickAddEggStockInventory()}>Add</Button></div>


            </div>
            {
                <div class="card">
                    <div class="card-header">
                        Featured
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">Special title treatment</h5>
                        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            }
        </div>
    )
}

export default EggStockInventory
