// import React, { useState, useEffect, useMemo, Fragment } from 'react'
// import { variables } from '../../Variables';
// import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
// import { useNavigate, useParams, useLocation } from 'react-router-dom'
// import moment from 'moment';
// import DateComponent from '../DateComponent';
// import InputField from '../ReuseableComponent/InputField'
// import {
//     FetchUnit, FetchShedsList, FetchLots, FetchLotById, FetchShedLotMapList, FetchBirdSaleList,
//     dateyyyymmdd, downloadExcel, HandleLogout, NumberInputKeyDown, FetchCompanyDetails,
//     AmountInWords, ReplaceNonNumeric, Commarize, ConvertNumberToWords, GetCustomerByTypeId
// } from '../../Utility'

// import Loading from '../Loading/Loading'

// import { PDFViewer } from '@react-pdf/renderer';
// import InvoiceBirdSale from './InvoiceBirdSale';

// function BirdSaleList(props) {
//     let history = useNavigate();
//     const search = useLocation().search;
//     const [birdSaleList, setBirdSaleList] = useState([]);
//     const [count, setCount] = useState(0);
//     const obj = useMemo(() => ({ count }), [count]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(0);
//     const [addModalShow, setAddModalShow] = useState(false);
//     const [customerdetails, setCustomerDetails] = useState([]);
//     const [custname, setCustomerName] = useState([]);
//     const [birdSaleListFilter, setBirdSaleListFilter] = useState([]);
//     const [filterFromDate, setFilterFromDate] = useState("");
//     const [filterToDate, setFilterToDate] = useState("");
//     const [filterShed, setFilterShed] = useState();
//     const [isloaded, setIsLoaded] = useState(true);
//     const [companydetails, setCompanyDetails] = useState([]);
//     const [invoiceModalShow, setInvoiceModalShow] = useState(false);
//     const [_unitname, setUnitName] = useState();
//     const [clientlist, setClientList] = useState([]);

//     let addModalClose = () => {
//         setAddModalShow(false);
//         setValidated(false);
//     };

//     const fetchCompanyDetails = async () => {
//             FetchCompanyDetails(process.env.REACT_APP_API)
//                 .then(data => {
//                     if (data.StatusCode === 200) {
//                         let _companydetils = data.Result.filter((x) => x.Id == localStorage.getItem('companyid'));
//                         setCompanyDetails(_companydetils);
//                     }
//                     else if (data.StatusCode === 401) {
//                         HandleLogout();
//                         history("/login")
//                     }
//                     else if (data.StatusCode === 404) {
//                         props.showAlert("Data not found!!", "danger")
//                     }
//                     else {
//                         props.showAlert("Error occurred!!", "danger")
//                     }
//                 })
//         }

//          useEffect((e) => {
        
//                 if (localStorage.getItem('token')) {
//                     fetchUnit();
//                     fetchSheds();
//                     fetchLots();
//                     fetchShedLotsMapList();
//                     setBirdSaleData({ ...birdsaledata, CustomerId: uid });
//                     fetchCompanyDetails();
//                     fetchClient();
//                 }
//                 else {
//                     HandleLogout();
//                     history("/login")
//                 }
//             }, []);
        
//             useEffect((e) => {
        
//                 if (localStorage.getItem('token')) {
//                     _birdSaleList(uid);
//                 }
//                 else {
//                     HandleLogout();
//                     history("/login")
//                 }
//             }, [obj]);


//              const fetchUnit = () => {
//                     FetchUnit(process.env.REACT_APP_API)
//                         .then(data => {
//                             if (data.StatusCode === 200) {
//                                 setUnitList(data.Result);
//                             }
//                             else {
//                                 errorHandle(data.StatusCode);
//                             }
//                         });
//                 }
            
//                 const fetchSheds = () => {
//                     FetchShedsList(process.env.REACT_APP_API)
//                         .then(data => {
//                             if (data.StatusCode === 200) {
//                                 setShedList(data.Result);
//                             }
//                             else {
//                                 errorHandle(data.StatusCode);
//                             }
//                         });
//                 }
            
//                 const fetchLots = () => {
//                     FetchLots(process.env.REACT_APP_API)
//                         .then(data => {
//                             if (data.StatusCode === 200) {
//                                 setLots(data.Result);
//                             }
//                             else {
//                                 errorHandle(data.StatusCode);
//                             }
//                         });
//                 }
            
//                 const fetchShedLotsMapList = () => {
//                     FetchShedLotMapList(process.env.REACT_APP_API)
//                         .then(data => {
//                             if (data.StatusCode === 200) {
//                                 SetShedLotMapList(data.Result);
//                             }
//                             else {
//                                 errorHandle(data.StatusCode);
//                             }
//                         });
//                 }
            
//                 const errorHandle = (code) => {
//                     if (code === 300) {
//                         props.showAlert("Data is exists!!", "danger")
//                     }
//                     else if (code === 401) {
//                         HandleLogout();
//                         history("/login")
//                     }
//                     else if (code === 404) {
//                         props.showAlert("Data not found!!", "danger")
//                     }
//                     else {
//                         props.showAlert("Error occurred!!", "danger")
//                     }
//                 }
            
//                 const _birdSaleList = (uid) => {
//                     setIsLoaded(true);
//                     FetchBirdSaleList(uid, null, process.env.REACT_APP_API)
//                         .then(data => {
//                             if (data.StatusCode === 200) {
//                                 setBirdSaleList(data.Result);
//                                 setBirdSaleListFilter(data.Result);
//                                 setTotalPages(Math.ceil(data.Result.length / process.env.REACT_APP_PAGE_PAGINATION_NO));
//                                 setIsLoaded(false);
//                             }
//                             else if (data.StatusCode === 401) {
//                                 setIsLoaded(false);
//                                 HandleLogout();
//                                 history("/login")
//                             }
//                             else if (data.StatusCode === 500) {
//                                 setIsLoaded(false);
//                                 HandleLogout();
//                                 history("/login")
//                             }
//                             else {
//                                 setIsLoaded(false);
//                                 errorHandle(data.StatusCode);
//                             }
//                         });
//                 }

//                 //  const dateForPicker = (dateString) => {
//                 //         return moment(new Date(dateString)).format('YYYY-MM-DD')
//                 //     };
                
//                     let addCount = (num) => {
//                         setCount(num + 1);
//                     };

//                      const deleteBirdSale = (id) => {
//                             if (window.confirm('Are you sure?')) {
//                                 fetch(process.env.REACT_APP_API + 'BirdSale/' + id, {
//                                     method: 'DELETE',
//                                     headers: {
//                                         'Authorization': localStorage.getItem('token')
//                                     }
//                                 })
//                                     .then(res => res.json())
//                                     .then((result) => {
//                                         if (result.StatusCode === 200) {
//                                             addCount(count);
//                                             props.showAlert("Successfully deleted", "info")
//                                         }
//                                         else if (result.StatusCode === 401) {
//                                             HandleLogout();
//                                             history("/login")
//                                         }
//                                         else {
//                                             props.showAlert("Error occurred!!", "danger")
//                                         }
                    
//                                     },
//                                         (error) => {
//                                             props.showAlert("Error occurred!!", "danger")
//                                         });
//                             }
//                         }
                    
//                         const onDateFilterFromChange = (e) => {
//                             setFilterFromDate(e.target.value);
//                             getFilterData(e.target.value, filterToDate, filterShed);
//                         }
                    
                    
//                         const getFilterData = (fromDate, toDate, shedid) => {
//                             let _filterList = [];
//                             if (fromDate !== "" && toDate !== "") {
//                                 _filterList = birdSaleListFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate) && dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
//                             }
//                             else if (fromDate === "" && toDate !== "") {
//                                 _filterList = birdSaleListFilter.filter((c) => dateyyyymmdd(c.Date) <= dateyyyymmdd(toDate));
//                             }
//                             else if (fromDate !== "" && toDate === "") {
//                                 _filterList = birdSaleListFilter.filter((c) => dateyyyymmdd(c.Date) >= dateyyyymmdd(fromDate));
//                             }
//                             else {
//                                 _filterList = birdSaleListFilter;
//                             }
                    
//                             if (shedid > 0) {
//                                 _filterList = _filterList.filter((c) => c.ShedId === parseInt(shedid));
//                             }
                    
                    
//                             setBirdSaleList(_filterList);
//                         }
                    
//                         const onDateFilterToChange = (e) => {
//                             setFilterToDate(e.target.value);
//                             getFilterData(filterFromDate, e.target.value, filterShed);
//                         }
                    
//                         const onShedFilterChange = (e) => {
//                             setFilterShed(e.target.value);
//                             getFilterData(filterFromDate, filterToDate, e.target.value)
//                         }


//                         const handlePageChange = (newPage) => {
//                             setCurrentPage(newPage)
//                         }
//                         const handleNextClick = () => {
//                             if (currentPage < totalPages) {
//                                 setCurrentPage(currentPage + 1)
//                             }
//                         }
//                         const handlePrevClick = () => {
//                             if (currentPage > 1) {
//                                 setCurrentPage(currentPage - 1)
//                             }
//                         }
                    
//                         const preDisabled = currentPage === 1;
//                         const nextDisabled = currentPage === totalPages
                    
//                         const itemsPerPage = process.env.REACT_APP_PAGE_PAGINATION_NO;
//                         const startIndex = (currentPage - 1) * itemsPerPage;
//                         const endIndex = startIndex + itemsPerPage;
                    
//                         let itemsToDiaplay = birdSaleList.slice(startIndex, endIndex);
                    
//                         if (itemsToDiaplay.length === 0 && birdSaleList.length > 0) {
//                             setCurrentPage(currentPage - 1);
//                         }

//     return (
//         <div>

//         </div>
//     )
// }

// export default BirdSaleList
