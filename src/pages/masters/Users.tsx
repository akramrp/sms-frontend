import React, { useEffect, useState, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { downloadExcel } from 'react-export-table-to-excel';
import Loader from "../../assets/img/loader.gif"
import { COLOR_BGFN, getCityList as fetchCityList, getCountryList as fetchCountryList, INVALID_MESSAGE, titleCase } from '../../constants';
import { Form, Input, Pagination, Select, Radio, notification, Modal } from 'antd';
import { userListAPI, userSaveAPI, userUpdateAPI, userStatusAPI, userDeleteAPI } from '../../services/apis';
import LS_SERVICE from '../../utils/localStorage';
// import './Users.css';
const { Option } = Select;

export default function Users() {
    const [dataLoader, setDataLoader] = useState(true);
    const [recordList, setRecordList] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [addModal, setAddModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formMode, setFormMode] = useState('Create');
    const [formAction, setFormAction] = useState('View');
    const [editData, setEditData] = useState(null);
    const [pagination, setPagination] = useState({});
    const [departmentList] = useState(() => LS_SERVICE.get('departmentList') || []);
    const [designationList] = useState(() => LS_SERVICE.get('designationList') || []);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [exportClick, setExportClick] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [deleteUserName, setDeleteUserName] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const addFormRef = useRef(null);
    const searchInputRef = useRef(null);
    const activePageRef = useRef(1);
    const requestIdRef = useRef(0);
    const searchDebounceRef = useRef(null);

    useEffect(() => {
        getRecordList(1);
        return () => searchDebounceRef.current?.cancel();
    }, []);

    const getRecordList = useCallback(async (pageNumber = activePageRef.current, keyword = null) => {
        const requestId = ++requestIdRef.current;
        const page = pageNumber || 1;
        activePageRef.current = page;
        setDataLoader(true);

        try {
            let payloadData = { page };
            if (keyword) payloadData.keyword = keyword;

            let apiResp = await userListAPI(payloadData);
            if (requestId !== requestIdRef.current) return;

            if (apiResp?.data?.statusCode == 200) {
                let apiList = apiResp.data.data || [];
                let pagination = apiResp.data.pagination || {};
                setRecordList(apiList);
                setPagination(pagination);
                setDataLoader(false);
            }
            else {
                notification.error({
                    message: 'User',
                    description: apiResp?.data?.message || INVALID_MESSAGE
                });
            }
        } catch (err) {
            if (err.response?.data) {
                notification.error({
                    message: 'User',
                    description: err.response?.data?.message || INVALID_MESSAGE
                });
            }
            console.log('get-user-list-err:', err);
        }
    }, []);

    const handleChangePage = useCallback((pageNo) => {
        setActivePage(pageNo);
        activePageRef.current = pageNo;
        getRecordList(pageNo, searchInputRef.current?.value?.trim() || null);
    }, [getRecordList]);

    const handleFilterList = useCallback(() => {
        searchDebounceRef.current?.();
    }, [getRecordList]);

    if (!searchDebounceRef.current) {
        searchDebounceRef.current = debounce(() => {
            const searchKeyword = searchInputRef.current?.value?.trim() || '';
            if (!searchKeyword) {
                searchInputRef.current?.focus();
                notification.error({ message: 'User', description: "Please enter search value!" });
                return;
            }
            setActivePage(1);
            activePageRef.current = 1;
            getRecordList(1, searchKeyword);
        }, 350);
    }

    const handleRefreshList = useCallback(() => {
        searchDebounceRef.current?.cancel();
        setActivePage(1);
        activePageRef.current = 1;
        getRecordList(1);
        if (searchInputRef.current) searchInputRef.current.value = "";
    }, [getRecordList]);

    const handleEdit = async (data, type) => {
        setFormMode("Update");
        setFormAction(type);
        setIsSubmitted(false);
        setAddModal(true);
        setEditData(data);
        const [countries] = await Promise.all([
            getCountryList(),
            getAllCity(data.state_id),
        ]);
        getAllState(data.country_id, countries);
    };

    const handleDelete = async (id) => {
        if (id) {
            try {
                setDeleteLoading(true);
                let response = await userDeleteAPI(id);
                if (response?.data?.statusCode == 200) {
                    notification.success({ message: response?.data?.message });
                    setDeleteModal(false);
                    setDeleteUserId(null);
                    setDeleteUserName('');
                    getRecordList(activePageRef.current, searchInputRef.current?.value?.trim() || null);
                }
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    const openDeleteModal = (id, name) => {
        setDeleteUserId(id);
        setDeleteUserName(name);
        setDeleteModal(true);
    };

    const handleCreateBtn = useCallback(async () => {
        setFormMode('Create');
        setEditData(null);
        setAddModal(true);
        await getCountryList();
    }, []);

    const handleExportList = async () => {
        try {
            setExportClick(true);
            let payloadData = { page: activePage };
            let apiResp = await userListAPI(payloadData);
            var exportData = [];
            if (apiResp?.data?.statusCode == 200) {
                let apiList = apiResp.data.data || [];
                let pagination = apiResp.data.pagination || {};
                exportData = await apiList.map((val, index) => {
                    let fullName = `${val?.first_name || ""} ${val?.middle_name || ""} ${val?.last_name || ""}`;
                    return {
                        emp_code: val.emp_code,
                        name: titleCase(fullName),
                        email: val.email,
                        mobile: val.mobile,
                        gender: val.gender,
                        department: val.department.name || "",
                        designation: val.designation.name || "",
                        country: val.country.name || "",
                        state: val.state.name || "",
                        city: val.city.name || "",
                        pincode: val.pincode || "",
                        address1: val.address1 || "",
                        address2: val.address2 || "",
                        is_verified: val.is_verified == "1" ? 'Verified' : 'notVerified',
                        is_active: val.is_active == "1" ? 'Active' : 'Inactive',
                    };
                });
                const header = ["Emp Code", "Full Name", "Email", "Mobile", "Gender", "Department", "Designation", "country", "State", "City", "Pincode", "Address1", "Address2", "Verify Statue", "Active"];
                downloadExcel({
                    fileName: "user-list",
                    sheet: "Users List",
                    tablePayload: {
                        header: header,
                        body: exportData,
                    },
                });
            }
        } catch (err) {
            if (err.response?.data) {
                notification.error({
                    message: 'User Export',
                    description: err.response?.data?.message || INVALID_MESSAGE
                });
            }
            console.log('user-export-err:', err);
        } finally {
            setExportClick(false);
        }
    }

    const getCountryList = async () => {
        let apiList = await fetchCountryList();
        setCountryList(apiList);
        return apiList;
    };

    const getAllState = async (country_id, countries = countryList) => {
        const getState = Array.isArray(countries)
            ? countries.find(item => item.id == country_id)
            : null;
        setStateList(Array.isArray(getState?.states) ? getState.states : []);
    }

    const getAllCity = async (state_id) => {
        let list = await fetchCityList(state_id);
        setCityList(list);
    }

    const handleAddRecord = async (formValues) => {
        try {
            setIsSubmitted(true);
            notification.destroy();
            if (editData) {
                formValues.id = editData.id;
                formValues.pincode  = formValues.pincode ? +formValues.pincode : null;
                delete formValues.email;
                let response = await userUpdateAPI(formValues);
                if (response?.data?.statusCode == 200) {
                    setAddModal(false);
                    setIsSubmitted(false);
                    notification.success({ message: 'User', description: response.data.message });
                }
            } else {
                formValues.pincode  = formValues.pincode ? +formValues.pincode : null;
                let response = await userSaveAPI(formValues);
                let statusCode = response?.data?.statusCode;
                if (statusCode == 201 || statusCode == 200) {
                    setAddModal(false);
                    setIsSubmitted(false);
                    notification.success({ message: 'User', description: response.data.message });
                } else {
                    notification.error({ message: 'User', description: response.data.message });
                }
            }
            getRecordList();
        } catch (err) {
            if (err.response?.data) {
                notification.error({
                    description: err.response?.data?.message || INVALID_MESSAGE
                });
            }
            console.log('add-user-err:', err);
        }
    };

    return (
        <main className="app-main">
            <div className="app-content sms-page mt-2">
                <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                    <div className="card sms-card mb-4">
                        <div className="card-header sms-toolbar">
                            <div className="sms-toolbar-row">
                                <div className="sms-toolbar-title"><span className="toolbar-label"><i className="bi bi-people-fill" aria-hidden="true" /> Directory Records</span></div>
                                <div className="sms-toolbar-controls">
                                    <div className="input-group input-group-sm sms-search">
                                        <input ref={searchInputRef} type="search" id="userSearchId" className="form-control" placeholder="Search by name" aria-label="Search users" onKeyDown={(event) => event.key === 'Enter' && handleFilterList()}/>
                                        <span className="input-group-text" onClick={handleFilterList}>
                                            <i className="bi bi-search cursor-pointer" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <button type="button" className="btn btn-sm sms-reset-search" aria-label="Reset user search" title="Reset search" onClick={handleRefreshList}>
                                        <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
                                    </button>
                                    <select id="user-role-filter" className="form-select form-select-sm sms-role-filter" aria-label="Filter by role" defaultValue="all">
                                        <option value="all">All roles</option>
                                        <option value="administrator">Administrator</option>
                                        <option value="editor">Editor</option>
                                        <option value="author">Author</option>
                                        <option value="subscriber">Subscriber</option>
                                    </select>
                                    <button type="button" className="btn btn-sm btn-outline-success" onClick={handleCreateBtn} > 
                                        <i className="bi bi-person-plus-fill me-1" aria-hidden="true"></i> New User
                                    </button>
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleExportList()} disabled={exportClick}>
                                        <i className="bi bi-cloud-download me-1" aria-hidden="true"></i> Export Records {exportClick ? Loader : null}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle m-0">
                            <thead>
                                <tr className="uppercase">
                                    <th>SN</th>
                                    <th>Employee Code</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataLoader ?
                                    <tr>
                                        <td className="text-center" colSpan="9"><img src={Loader} width="150" /></td>
                                    </tr>
                                    : null
                                }

                                {recordList.length > 0 ? recordList.map((data, i) => {
                                    let fullName = `${data?.first_name || ""} ${data?.middle_name || ""} ${data?.last_name || ""}`;
                                    return (
                                    <tr key={i}>
                                        <td>{activePage ? (((activePage - 1) * 10) + i + 1) : i + 1}</td>
                                        <td>{data.emp_code}</td>
                                        <td>{titleCase(fullName)} {`(${data?.gender[0]})`}</td>
                                        <td>{data.email}</td>
                                        <td>{data.mobile}</td>
                                        <td>{data.department.name || ""}</td>
                                        <td>{data.designation.name || ""}</td>
                                        <td>{COLOR_BGFN(data.is_active == 1 ? "success" : "secondary", data.is_active == 1 ? "Active" : "Inactive")}</td>
                                        <td className="text-end">
                                            <div className="btn-group btn-group-sm">
                                                <button type="button" className="btn btn-outline-secondary sms-action sms-action-view" aria-label="View" title="View user" onClick={() => handleEdit(data, "View")}>
                                                    <i className="bi bi-eye" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-secondary sms-action sms-action-edit" aria-label="Edit" title="Edit user" onClick={() => handleEdit(data, "Edit")}>
                                                    <i className="bi bi-pencil" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className="btn btn-outline-danger sms-action sms-action-delete" 
                                                aria-label="Delete" title="Delete user"
                                                onClick={() => openDeleteModal(data.id, titleCase(fullName))}
                                                >
                                                    <i className="bi bi-trash" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    )}) : <tr><td colSpan="9" className="text-center">No Record found.</td></tr> }
                            </tbody>
                            </table>
                        </div>
                        </div>
                        <div className="card-footer sms-pagination-footer">
                            <div className="sms-record-count">
                                <i className="bi bi-list-ul" aria-hidden="true" />
                                <span><strong>{pagination?.totalRecords ?? recordList.length}</strong> Total Record(s)</span>
                            </div>
                            <Pagination pageSize={pagination.perPage || 10} total={pagination.totalRecords || recordList.length} onChange={(pageNo) => handleChangePage(pageNo)} />
                        </div>
                    </div>
                    </div>
                </div>

                <Modal
                    centered
                    width={'70%'}
                    open={addModal}
                    className="antd-modal"
                    onCancel={() => setAddModal(false)}
                    destroyOnHidden
                    footer={false}
                    title={
                        <div className="antd-modal-title sms-modal-title">
                            <span className="sms-modal-title-icon"><i className="bi bi-person-plus-fill" aria-hidden="true" /></span>
                            <span><strong>{formMode} User</strong><small>Account details and access settings</small></span>
                        </div>
                    }
                >
                    <Form
                        layout="vertical"
                        autoComplete="off"
                        className='sms-modal-form'
                        ref={addFormRef}
                        onFinish={(e) => handleAddRecord(e)}
                        initialValues={{ remember: true }}
                    >
                        <div className='row'>
                            <div className='col-3'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData?.title : null}
                                        name="title"
                                        label="Title"
                                        rules={[{ required: true, message: "Require", },]}
                                    >
                                        <Select
                                            showSearch
                                            style={{ width: "100%" }}
                                            placeholder="Search to Select Title"
                                            // optionFilterProp="children"
                                            // autoFocus={true}
                                            // loading={roleFetched != true ? true : false}
                                            // initialvalue={editData ? editData.role : null}
                                            filterOption={(input, option) => {
                                                return option?.children?.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                            }}
                                        >
                                            <Option key="Mr." value="Mr.">Mr.</Option>
                                            <Option key="Mrs." value="Mrs.">Mrs.</Option>
                                            <Option key="Dr." value="Dr.">Dr.</Option>
                                            <Option key="Er." value="Er.">Er.</Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-3'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.first_name : null}
                                        name="first_name"
                                        label="First Name"
                                        rules={[
                                            { required: true, message: "Require", },
                                            { pattern: /^[a-z\s]+$/i, message: "Only characters allowed", }
                                        ]}
                                    >
                                        <Input minLength={3} maxLength={100} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-3'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.middle_name : null}
                                        name="middle_name"
                                        label="Middle Name"
                                        rules={[
                                            { required: false, message: "Require", },
                                            { pattern: /^[a-z\s]+$/i, message: "Only characters allowed", }
                                        ]}
                                    >
                                        <Input minLength={3} maxLength={100} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-3'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.last_name : null}
                                        name="last_name"
                                        label="Last Name"
                                        rules={[
                                            { required: false, message: "Require", },
                                            { pattern: /^[a-z\s]+$/i, message: "Only characters allowed", }
                                        ]}
                                    >
                                        <Input minLength={3} maxLength={100} />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='col-4'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.email : null}
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: 'Require' },
                                            { pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Enter a valid email address!' }
                                        ]}
                                    >
                                        <Input disabled={editData && editData.email} minLength={3} maxLength={100} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.mobile : null}
                                        name="mobile"
                                        label="Mobile"
                                        rules={[
                                            { required: true, message: "Require", },
                                            { pattern: /^\d+$/, message: 'Required(only numbers allowed)!' }
                                        ]}
                                    >
                                        <Input minLength={3} maxLength={10} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div>
                                    <Form.Item name="gender" label="Gender"
                                        rules={[
                                            { required: true, message: 'Reuired' }
                                        ]}
                                        initialValue={editData ? editData.gender : null}
                                    >
                                        <Radio.Group>
                                            <Radio value="Male">Male</Radio>
                                            <Radio value="Female">Female</Radio>
                                            <Radio value="Other">Other</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='col-4'>
                                <div>
                                    <Form.Item
                                        // initialValue={editData ? editData.password : null}
                                        name="password"
                                        label="Password"
                                        rules={[{ required: true, message: "Require", }]}
                                    >
                                        <Input minLength={3} maxLength={100} />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.department_id : null}
                                        name="department_id"
                                        label="Department"
                                        rules={[{ required: true, message: "Require", },]}
                                    >
                                        <Select
                                            showSearch
                                            style={{ width: "100%" }}
                                            placeholder="Search to Select Department"
                                            filterOption={(input, option) => {
                                                return option?.children?.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                            }}
                                        >
                                            {departmentList.length && departmentList.map((item, index) => (
                                                <Option key={item.id} value={item.id}>{`${item.name} (${item.code})`}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.designation_id : null}
                                        name="designation_id"
                                        label="Designation"
                                        rules={[{ required: true, message: "Require", },]}
                                    >
                                        <Select
                                            showSearch
                                            style={{ width: "100%" }}
                                            placeholder="Search to Select Designation"
                                            filterOption={(input, option) => {
                                                return option?.children?.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                            }}
                                        >
                                            {designationList.length && designationList.map((item, index) => (
                                                <Option key={item.id} value={item.id}>{`${item.name} (${item.code})`}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='col-3'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.country_id : null}
                                        name="country_id"
                                        label="Country"
                                        rules={[{ required: false, message: "Require", },]}
                                    >
                                        <Select
                                            showSearch
                                            style={{ width: "100%" }}
                                            placeholder="Search to Select Country"
                                            optionFilterProp="children"
                                            // autoFocus={true}
                                            // loading={roleFetched != true ? true : false}
                                            onChange={(val) => getAllState(val)}
                                            initialvalue={editData ? editData.country_id : null}
                                            filterOption={(input, option) => {
                                                return option?.children?.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                            }}
                                        >
                                            {countryList.length && countryList.map((item, index) => (
                                                <Option key={item.id} value={item.id}>{`${item.name} (${item.shortname})`}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-3'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.state_id : null}
                                        name="state_id"
                                        label="State"
                                        rules={[{ required: false, message: "Require", },]}
                                    >
                                        <Select
                                            showSearch
                                            style={{ width: "100%" }}
                                            placeholder="Search to Select State"
                                            // optionFilterProp="children"
                                            // autoFocus={true}
                                            // loading={roleFetched != true ? true : false}
                                            onChange={(val) => getAllCity(val)}
                                            initialvalue={editData ? editData.state_id : null}
                                            filterOption={(input, option) => {
                                                return option?.children?.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                            }}
                                        >
                                            {Array.isArray(stateList) && stateList.map((item, index) => (
                                                <Option key={item.id} value={item.id}>{item.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-3'>
                                <div>
                                    <Form.Item
                                        name="city_id"
                                        label="Select City"
                                        rules={[{ required: false, message: "Require" },]}
                                        initialValue={editData ? editData.city_id : null}
                                    >
                                        <Select
                                            showSearch
                                            style={{ width: "100%" }}
                                            placeholder="Search to Select City"
                                            // optionFilterProp="children"
                                            filterOption={(input, option) => {
                                                return option?.children?.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                            }}
                                        >
                                            {cityList.length && cityList.map((item, index) => (
                                                <Option key={item.id} value={item.id}>{item.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-3'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.pincode : null}
                                        name="pincode"
                                        label="Pincode"
                                        rules={[
                                            { required: false, message: "Require", },
                                            { pattern: /^\d+$/, message: 'Required(only numbers allowed)!' }
                                        ]}
                                    >
                                        <Input minLength={3} maxLength={100} />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className='col-6'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.address1 : null}
                                        name="address1"
                                        label="Address1"
                                        rules={[{ required: false, message: "Require", }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div>
                                    <Form.Item
                                        initialValue={editData ? editData.address2 : null}
                                        name="address2"
                                        label="Address2"
                                        rules={[{ required: false, message: "Require", }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>                    
                        <div className="row mt-4">
                            <div className='col-4'>
                                <div>
                                    <Form.Item name="is_active" label="Active Status"
                                        rules={[
                                            { required: true, message: 'Reuired' }
                                        ]}
                                        initialValue={editData ? editData.is_active : null}
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>Active</Radio>
                                            <Radio value={0}>inActive</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div>
                                    <Form.Item name="is_verified" label="Verify Status"
                                        rules={[
                                            { required: true, message: 'Reuired' }
                                        ]}
                                        initialValue={editData ? editData.is_verified : null}
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>Verified</Radio>
                                            <Radio value={0}>NotVerifiy</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                        {formAction === 'Edit' && (
                            <div className='row mt-4'>
                                <div className='col-12 d-flex justify-content-center gap-2'>
                                    <button type="button" className='btn btn-sm btn-outline-secondary' onClick={() => setAddModal(false)}>Cancel</button>
                                    <button disabled={isSubmitted} type="submit" className='btn btn-sm btn-primary'>{formMode}</button>
                                </div>
                            </div>
                        )}
                    </Form>
                </Modal>

                <Modal
                    centered
                    open={deleteModal}
                    className="sms-delete-modal"
                    onCancel={() => !deleteLoading && setDeleteModal(false)}
                    closable={!deleteLoading}
                    maskClosable={!deleteLoading}
                    destroyOnHidden
                    footer={null}
                    title={
                        <div className="sms-delete-title">
                            <span className="sms-delete-icon"><i className="bi bi-trash3-fill" aria-hidden="true" /></span>
                            <span>Delete User Confirmation</span>
                        </div>
                    }
                >
                    <div className="sms-delete-content">
                        <p>Are you sure you want to delete this user?</p>
                        <strong className="sms-delete-name">{deleteUserName}</strong>
                        <p>This action cannot be undone.</p>
                        <div className="sms-delete-actions">
                            <button type="button" className="btn btn-sm btn-outline-secondary" disabled={deleteLoading} onClick={() => setDeleteModal(false)}>No, Keep User</button>
                            <button type="button" className="btn btn-sm btn-danger" disabled={deleteLoading} onClick={() => handleDelete(deleteUserId)}>
                                {deleteLoading ? 'Deleting...' : 'Yes, Delete User'}
                            </button>
                        </div>
                    </div>
                </Modal>

                </div>
            </div>
        </main>
    );
};