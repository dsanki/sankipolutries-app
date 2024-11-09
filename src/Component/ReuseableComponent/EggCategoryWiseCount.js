import React, { useState,useEffect} from 'react'
import {FecthEggCategory } from './../../Utility'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';

function EggCategoryWiseCount({data,onChange,handleClick, handleDelete}) {

   // const [data,setData]=useState([{category:"",pack:"",lose:"", count:""}])
    const [eggcategory, setEggCategory] = useState([]);
    // const handleClick=(e)=>{
    //     e.preventDefault();
    //     setData([...data,{category:"",pack:"",lose:"", count:""}])
    //     return false;
    // }

    const fetchEggCategory = async () => {
        FecthEggCategory(process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setEggCategory(data.Result);
                }
                // else if (data.StatusCode === 401) {
                //     HandleLogout();
                //     history("/login")
                // }
                // else if (data.StatusCode === 404) {
                //     props.showAlert("Data not found!!", "danger")
                // }
                else {
                    //props.showAlert("Error occurred!!", "danger")
                }
            })
    }

    // const eggCategoryChange=(e,i)=>
    // {
    //     const {name,value}=e.target
    //     const onchangeVal = [...data]
    //     onchangeVal[i][name]=value
    //     setData(onchangeVal)
    // }

    // const handleChange=(e,i)=>{
    //     const {name,value}=e.target
    //     const onchangeVal = [...data]
    //     onchangeVal[i][name]=value
    //     setData(onchangeVal)
    // }
    // const handleDelete=(i)=>{
    //     const deleteVal = [...data]
    //     deleteVal.splice(i,1)
    //     setData(deleteVal)
    // }

    useEffect((e) => {

        fetchEggCategory();
    }, []);

  return (
    <div className="col">
       <i className="fa-solid fa-plus" style={{ color: '#f81616', marginLeft: '15px' }} 
       onClick={e => handleClick(e)}></i>
    {/* <button onClick={e=>handleClick(e)}><i class="fa-solid fa-plus"></i></button> */}
    {
        data.map((val,i)=>
        <div class="row">
            <select class="form-select"  onChange={(e)=>onChange(e,i)} name="category" style={{width:140}}>
               
                <option selected disabled value="">Choose...</option>
                                                    {
                                                        eggcategory.map((item) => {
                                                            return (
                                                                <option
                                                                    key={item.Id}
                                                                    defaultValue={item.Id == null ? null : item.Id}
                                                                   // selected={item.Id === parseInt(eggsaledata.EggCategory)}
                                                                    value={item.Id}
                                                                >{item.EggCategoryName}</option>
                                                            );
                                                        })
                                                    }
            </select>
            <input class="form-control" name="pack" style={{width:100, marginLeft: 10}} value={val.pack} onChange={(e)=>onChange(e,i)} />
            <input class="form-control" name="lose" style={{width:100, marginLeft: 10}} value={val.lose} onChange={(e)=>onChange(e,i)} />
            <input class="form-control" name="count" style={{width:100, marginLeft: 10}} value={val.count} onChange={(e)=>onChange(e,i)} />
            <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => handleDelete(i)}></i>
        </div>
        )
    }
    <p>{JSON.stringify(data)}</p>
</div>
  )
} 

export default EggCategoryWiseCount
