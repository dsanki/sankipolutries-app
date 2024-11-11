import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button, ButtonToolbar, Table, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { FecthStockListById, HandleLogout, dateyyyymmdd, downloadExcel } from './../../Utility'
import Loading from '../Loading/Loading'
import InputField from '../ReuseableComponent/InputField'

export const categoryList = {
    categories: [
        { Key: 1, Value: 'MEDICINE' },
        { Key: 2, Value: 'VACCINE' },
        { Key: 3, Value: 'EGG' },
        { Key: 4, Value: 'PACKAGING' },
        { Key: 5, Value: 'RAW MATERIALS' },
        { Key: 6, Value: 'FEED' },
        { Key: 7, Value: 'PACKAGING' }
    ]
}


function Stock(props) {

    let history = useNavigate();

    const [stockList, setStockList] = useState([]);
    const [stockListForFilter, setStockForFilter] = useState([]);
    const [validated, setValidated] = useState(false);
    const [count, setCount] = useState(0);
    const obj = useMemo(() => ({ count }), [count]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [addModalShow, setAddModalShow] = useState(false);
    const [isloaded, setIsLoaded] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    let addModalClose = () => {
        setAddModalShow(false);
        setValidated(false);
    };

    const initialvalues = {
        modaltitle: "",
        ItemId: 0,
        ItemName: "",
        GST: "",
        PurchasePrice: "",
        Category: ""

    };

    const [stockdata, setStockData] = useState(initialvalues);

    const clickAddStock = () => {
        setAddModalShow({ addModalShow: true });
        setStockData({
            modaltitle: "Add Stock",
            ItemId: 0,
            ItemName: "",
            GST: "",
            PurchasePrice: "",
            Category: ""
        })
    }

    const clickEditStock = (md) => {
        setAddModalShow({ addModalShow: true });
        setStockData({
            modaltitle: "Edit Stock",
            ItemId: md.ItemId,
            ItemName: md.ItemName,
            GST: md.GST,
            PurchasePrice: md.PurchasePrice,
            Category: md.Category
        })
    }

    const categoryChange = (e) => {
        setStockData({ ...stockdata, Category: e.target.value });
    }
    const itemChange = (e) => {
        setStockData({ ...stockdata, ItemName: e.target.value });
    }
    const gstChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setStockData({ ...stockdata, GST: e.target.value });
        }
    }

    const purchasePriceChange = (e) => {
        const re = /^\d*\.?\d{0,2}$/
        if (e.target.value === '' || re.test(e.target.value)) {
            setStockData({ ...stockdata, PurchasePrice: e.target.value });
        }
    }

    useEffect((e) => {

        if (localStorage.getItem('token')) {
            fetchStockListById("");
        }
        else {

            history("/login")
        }
    }, [obj]);

    const fetchStockListById = async (catid) => {
        setIsLoaded(true);
        FecthStockListById(catid, process.env.REACT_APP_API)
            .then(data => {
                if (data.StatusCode === 200) {
                    setStockList(data.Result);
                    setStockForFilter(data.Result);
                    setCount(data.Result.length);
                    setTotalPages(Math.ceil(data.Result.length / itemsPerPage));
                    setIsLoaded(false);
                }
                else if (data.StatusCode === 401) {
                    HandleLogout();
                    history("/login")
                }
                else if (data.StatusCode === 404) {
                    props.showAlert("Data not found!!", "danger");
                    setIsLoaded(false);

                }
                else {
                    props.showAlert("Error occurred!!", "danger");
                    setIsLoaded(false);

                }
            })
    }

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API + 'Stock/UpdateStock', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    ItemId: stockdata.ItemId,
                    ItemName: stockdata.ItemName,
                    GST: stockdata.GST,
                    PurchasePrice: stockdata.PurchasePrice,
                    Category: stockdata.Category

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result.StatusCode === 200) {
                        addCount(count);
                        setAddModalShow(false);

                        props.showAlert("Successfully updated", "info")
                    }
                    else {
                        props.showAlert("Error occurred!!", "danger")
                    }

                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    });
        }

        setValidated(true);
    }

    let addCount = (num) => {
        setCount(num + 1);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        var form = e.target.closest('.needs-validation');
        if (form.checkValidity() === false) {

            e.stopPropagation();
            setValidated(true);
        }
        else {

            fetch(process.env.REACT_APP_API+ 'Stock/AddStock', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    ItemId: stockdata.ItemId,
                    ItemName: stockdata.ItemName,
                    GST: stockdata.GST,
                    PurchasePrice: stockdata.PurchasePrice,
                    Category: stockdata.Category

                })
            }).then(res => res.json())
                .then((result) => {
                    if (result > 0 || result.StatusCode === 200 || result.StatusCode === "OK") {
                        addCount(count);
                        setAddModalShow(false);
                        props.showAlert("Successfully added", "info")
                    }
                    else {
                        props.showAlert("Error occurred!!", "danger")
                    }

                },
                    (error) => {
                        props.showAlert("Error occurred!!", "danger")
                    });
        }

        setValidated(true);
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }
    const handleNextClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }
    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }
    const preDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages
    //const itemsPerPage = variables.PAGE_PAGINATION_NO;
    const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
    const endIndex = startIndex + parseInt(itemsPerPage);
    const itemsToDiaplay = stockList.slice(startIndex, endIndex);
    if (itemsToDiaplay.length === 0 && stockList.length > 0) {
        setCurrentPage(currentPage - 1);
    }

    const selectPaginationChange = (e) => {
        setItemsPerPage(e.target.value);
        addCount(count);
    }

    const onDownloadExcel = () => {
        const _list = stockList.map((p) => {
            return ({
                ItemName: p.ItemName,
                GST: p.GST,
                PurchasePrice: p.PurchasePrice.toFixed(2),
                Category: p.Category
            });
        });

        downloadExcel(_list, "StockList");
    }

    const deleteStock = () => {
    }

    const [filtercategory, setFilterCategory] = useState("");

    const onCategoryFilterChange = (e) => {
        let _filterList = stockListForFilter;
        let category = e.target.value;
        setFilterCategory(category);
        // getFilterData(filterFromDate, filterToDate, e.target.value)

        if (category !== "") {
            _filterList = stockListForFilter.filter((c) => c.Category === category);

        }

        setStockList(_filterList);
    }

    return (
        <div>
            {isloaded && <Loading />}
            <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
                <h2> Stock List</h2>
            </div>


            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row align-items-center">

                    <div className="col-4">
                        <p><strong>Category</strong></p>
                        <Form.Select aria-label="Default select example"
                            onChange={onCategoryFilterChange}>
                            <option selected value="">Choose...</option>
                            {
                                categoryList.categories.map((item) => {
                                    return (
                                        <option
                                            key={item.Key}
                                            defaultValue={item.Value == null ? null : item.Value}
                                            selected={item.Value === stockdata.Category}
                                            value={item.Value}
                                        >{item.Value}</option>
                                    );
                                })
                            }
                        </Form.Select>
                    </div>
                </div>
            </div>


            <div class="row">
                <div class="col-md-9">  <i className="fa-regular fa-file-excel fa-2xl" style={{ color: '#bea2a2' }} title='Download Egg Sale List' onClick={() => onDownloadExcel()} ></i></div>
                <div class="col-md-3"> <div class="row"><div class="col-md-6" style={{ textAlign: 'right' }}> <Button className="mr-2" variant="primary"
                    style={{ marginRight: "17.5px" }}
                    onClick={() => clickAddStock()}>Add</Button></div>

                    <div class="col-md-6">
                        <select className="form-select" aria-label="Default select example" style={{ width: "80px" }} onChange={selectPaginationChange}>
                            <option selected value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                        </select></div></div></div>
            </div>

            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr align='center' className="tr-custom">
                        <th align='left'>Item Name</th>
                        <th>GST</th>
                        <th>Purchase Price</th>
                        <th>Category</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        itemsToDiaplay && itemsToDiaplay.length > 0 ? itemsToDiaplay.map((p) => {
                            return (
                                !isloaded && <tr align='center' style={{ fontSize: 13 }} key={p.ItemId}>
                                    <td align='left' style={{ maxWidth: '50%', width: '50%' }}>{p.ItemName}</td>
                                    <td >{parseFloat(p.GST).toFixed(2)}</td>
                                    <td >{parseFloat(p.PurchasePrice).toFixed(2)}</td>
                                    <td >{p.Category}</td>
                                    <td align='center'>
                                        {
                                            <ButtonToolbar>
                                                <i className="fa-solid fa-pen-to-square" style={{ color: '#0545b3', marginLeft: '15px' }} onClick={() => clickEditStock(p)}></i>
                                                {localStorage.getItem('isadmin') === 'true' &&
                                                    <i className="fa-solid fa-trash" style={{ color: '#f81616', marginLeft: '15px' }} onClick={() => deleteStock(p.Id)}></i>}
                                            </ButtonToolbar>
                                        }
                                    </td>
                                </tr>
                            )
                        }) : <tr>
                            <td style={{ textAlign: "center" }} colSpan={14}>
                                No Records
                            </td>
                        </tr>
                    }
                </tbody>
            </Table >

            {
                stockList && stockList.length > itemsPerPage &&
                <>
                    <button
                        onClick={handlePrevClick}
                        disabled={preDisabled}
                    >

                        Prev
                    </button>
                    {


                        Array.from({ length: totalPages }, (_, i) => {
                            return (
                                <button
                                    onClick={() => handlePageChange(i + 1)}
                                    key={i}
                                    disabled={i + 1 === currentPage}
                                >
                                    {i + 1}
                                </button>
                            )
                        })
                    }
                    <button
                        onClick={handleNextClick}
                        disabled={nextDisabled}
                    >
                        Next
                    </button>
                </>
            }

            <div className="container" id="exampleModal">
                <Modal
                    show={addModalShow}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {stockdata.modaltitle}
                        </Modal.Title>
                        <button type="button" class="btn-close" aria-label="Close" onClick={addModalClose}> </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <div>
                                    <Form noValidate validated={validated} className="needs-validation">
                                        <Row className="mb-12">
                                            <InputField controlId="ItemName" label="Item name"
                                                type="text"
                                                value={stockdata.ItemName}
                                                name="ItemName"
                                                placeholder="Item name"
                                                errormessage="Please enter item name"
                                                required={true}
                                                disabled={false}
                                                onChange={itemChange}
                                            />
                                            <InputField controlId="GST" label="GST %"
                                                type="text"
                                                value={stockdata.GST}
                                                name="GST"
                                                placeholder="GST"
                                                errormessage="Please enter GST"
                                                required={true}
                                                disabled={false}
                                                onChange={gstChange}
                                            />

                                            <InputField controlId="PurchasePrice" label="Purchase price"
                                                type="text"
                                                value={stockdata.PurchasePrice}
                                                name="PurchasePrice"
                                                placeholder="Purchase price"
                                                errormessage="Please enter purchase price"
                                                required={true}
                                                disabled={false}
                                                onChange={purchasePriceChange}
                                            />

                                            <Form.Group controlId="Category" as={Col} >
                                                <Form.Label style={{fontSize:13}}>Category name</Form.Label>
                                                <Form.Select style={{fontSize:13}}
                                                    onChange={categoryChange} required>
                                                    <option selected disabled value="">Choose...</option>
                                                    {
                                                        categoryList.categories.map((item) => {
                                                            return (
                                                                <option
                                                                    key={item.Key}
                                                                    defaultValue={item.Value == null ? null : item.Value}
                                                                    selected={item.Value === stockdata.Category}
                                                                    value={item.Value}
                                                                >{item.Value}</option>
                                                            );
                                                        })
                                                    }
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please select category name
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>
                                        <Form.Group as={Col}>
                                            {stockdata.ItemId <= 0 ?

                                                <Button variant="primary" className="btn-primary-custom" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitAdd(e)}>
                                                    Add
                                                </Button>
                                                : null
                                            }

                                            {stockdata.ItemId > 0 ?

                                                <Button variant="primary" type="submit" style={{ marginTop: "30px" }} onClick={(e) => handleSubmitEdit(e)}>
                                                    Update
                                                </Button>
                                                : null
                                            }

                                            <Button variant="danger" className="btn-danger-custom" style={{ marginTop: "30px", marginLeft: "10px" }} onClick={() => {
                                                addModalClose();
                                            }
                                            }>Close</Button>

                                        </Form.Group>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>
                </Modal>
            </div >

        </div>
    )
}

export default Stock
