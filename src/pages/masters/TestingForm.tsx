import React, { useState, createRef } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Row, Col, Typography, Input, Form, Button, Select, Space, Divider, notification, DatePicker, Radio } from 'antd';
import * as GlobalConfig from '../../constants';

const { Title } = Typography;
const { Option } = Select;

const TestingForm = () => {
    const [countriesList, setCountriesList] = useState([]);
    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);

    const VERIFY = [
        { id: 0, title: "No" },
        { id: 1, title: "Yes" }
    ];

    const STATUS = [
        { id: 0, title: "InActive" },
        { id: 1, title: "Active" }
    ];

    const STATUS_COLOR = ['volcano', 'green', 'geekblue'];

    const ROLE = [
        { id: 1, title: "Super Admin" },
        { id: 2, title: "Admin" },
        { id: 3, title: "User" },
    ];


    const routeFormRef = createRef();
    const [form] = Form.useForm();
    // const history = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (values: any) => {
        setLoading(true);
        try {
            values.dob = moment(values.dob).format('YYYY-MM-DD');
            console.log('------------------------values:', values);
            // setLoading(false);
        }
        catch (err) {
            // toast.error(err.response.data.message);
            notification.error({
                message: "Error",
                description: "Sorry, Something went wrong"
            });
            setLoading(false);
        }

        // axios.post(`http://localhost:5000/users`, values).then(res => {
        //     setLoading(false);
        //     message.success('User Added Successfully!');
        //     history('/list');
        // })
        // .catch(error => {
        //     setLoading(false);
        //     message.error(error);
        // })
    }

    return (
        <main className="app-main">
            <div className="app-content mt-4">
                <div className="container-fluid">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="mb-4">
                        <Col span={24}>
                            <Title style={{ textAlign: 'left' }} level={3}>Create New User</Title>
                        </Col>
                    </Row>

                    <Form
                        form={form}
                        layout='vertical'
                        colon={true}
                        onFinish={handleSubmit}
                        className="mt-4"
                        name="userForm"
                        initialValues={{ remember: true }}
                    // ref={routeFormRef}
                    // autoComplete="off"
                    // onFinishFailed={() => alert('Failed to submit')}
                    >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="colWidth" span={6} >
                                <Form.Item name="first_name" label="First Name"
                                    rules={[
                                        { required: true, message: 'Require' }
                                    ]}
                                >
                                    <Input placeholder="Enter First Name" size="middle" />
                                </Form.Item>
                            </Col>
                            <Col className="colWidth" span={6} >
                                <Form.Item name="last_name" label="Last Name"
                                    rules={[
                                        { required: false, message: 'Require' }
                                    ]}
                                >
                                    <Input placeholder="Enter Last Name" size="middle" />
                                </Form.Item>
                            </Col>
                            <Col className="colWidth" span={6}>
                                <Form.Item name="mobile" label="Mobile"
                                    rules={[
                                        { required: true, message: 'Require' },
                                        { pattern: /^\d+$/, message: 'Required(only numbers allowed)!' }
                                    ]}
                                >
                                    <Input placeholder="Enter Mobile Number" maxLength={10} size="middle" />
                                </Form.Item>
                            </Col>
                            <Col className="colWidth" span={6}>
                                <Form.Item name="email" label="Email"
                                    rules={[
                                        { required: true, message: 'Require' },
                                        { pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Enter a valid email address!' }
                                    ]}
                                >
                                    <Input placeholder="Enter Email Address" size="middle" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="colWidth" span={6}>
                                <Form.Item name="gender" label="Gender"
                                    rules={[
                                        { required: true, message: 'Reuired' }
                                    ]}
                                >
                                    <Radio.Group>
                                        <Radio value="Male">Male</Radio>
                                        <Radio value="Female">Female</Radio>
                                        <Radio value="Others">Others</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col className="colWidth" span={6}>
                                <Form.Item name="dob" label="DOB"
                                    rules={[
                                        { required: false, message: 'Require' }
                                    ]}
                                >
                                    <DatePicker
                                        showToday={false}
                                        format={['DD/MM/YYYY', 'DD/MM/YY']}
                                        style={{ width: "100%", "height": "32px" }}
                                        disabledDate={(current: any) => current.isAfter(moment().subtract(0, "day"))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col className="colWidth" span={12}>
                                <Form.Item name="address" label="Address"
                                    rules={[
                                        { required: false, message: 'Require' }
                                    ]}
                                >
                                    <Input placeholder="Enter Address" size="middle" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="colWidth" span={6}>
                                <Form.Item name="pincode" label="Pincode"
                                    rules={[
                                        { required: true, message: 'Require' },
                                        { pattern: /^\d+$/, message: 'Required(only numbers allowed)!' }
                                    ]}
                                >
                                    <Input placeholder="Enter Pincode" maxLength={6} size="middle" />
                                </Form.Item>
                            </Col>
                            <Col className="colWidth" span={6} >
                                <Form.Item name="country" label="Select Country"
                                    rules={[
                                        { required: true, message: 'Require' }
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Search to Select Country"
                                        optionFilterProp="children"
                                        filterOption={(input, option: any) => {
                                            return option?.children?.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                        }}
                                    >
                                        {
                                            countriesList !== undefined && countriesList.length ?
                                                countriesList.map((item: any, index) => (
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                ))
                                                : null
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="colWidth" span={6}>
                                <Form.Item name="state" label="Select State"
                                    rules={[
                                        { required: true, message: 'Require' }
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Search to Select State"
                                        optionFilterProp="children"
                                        filterOption={(input, option: any) => {
                                            return option?.children?.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                        }}
                                    >
                                        {
                                            statesList !== undefined && statesList.length ?
                                                statesList.map((item: any, index) => (
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                ))
                                                : null
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="colWidth" span={6}>
                                <Form.Item name="city" label="Select City"
                                    rules={[
                                        { required: true, message: 'Require' }
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Search to Select City"
                                        optionFilterProp="children"
                                        filterOption={(input, option: any) => {
                                            return option?.children?.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                                        }}
                                    >
                                        {
                                            citiesList !== undefined && citiesList.length ?
                                                citiesList.map((item: any, index) => (
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                ))
                                                : null
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col className="colWidth" span={6}>
                                <Form.Item name="role" label="Select Role"
                                    rules={[
                                        { required: true, message: 'Require' }
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Select Role"
                                        optionFilterProp="children"
                                    >
                                        {
                                            ROLE !== undefined && ROLE.length ?
                                                ROLE.map((item: any, index) => (
                                                    <Option key={item.id} value={item.id}>{item.title}</Option>
                                                ))
                                                : null
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="colWidth" span={6} >
                                <Form.Item name="status" label="Select Status"
                                    rules={[
                                        { required: true, message: 'Require' }
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Select Status"
                                        optionFilterProp="children"
                                    >
                                        {
                                            STATUS !== undefined && STATUS.length ?
                                                STATUS.map((item: any, index) => (
                                                    <Option key={item.id} value={item.id}>{item.title}</Option>
                                                ))
                                                : null
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col className="colWidth" span={6} >
                                <Form.Item name="isVerified" label="Select Verified"
                                    rules={[
                                        { required: true, message: 'Require' }
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Is Verified"
                                        optionFilterProp="children"
                                    >
                                        {
                                            VERIFY !== undefined && VERIFY.length ?
                                                VERIFY.map((item: any, index) => (
                                                    <Option key={item.id} value={item.id}>{item.title}</Option>
                                                ))
                                                : null
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider orientation="left"></Divider>
                        <div style={{ textAlign: "center" }}>
                            {/* <Space direction="vertical" size={10} style={{ display: 'flex' }}></Space> */}
                            <Space size={10} direction="horizontal">
                                <Link to={`/others/testing-form`}>
                                    <Button htmlType="button" type='primary' shape='round'>Back </Button>
                                </Link>
                                <Link to={`/others/testing-form`}>
                                    <Button htmlType="button" type="primary" danger shape='round'>Reset </Button>
                                </Link>

                                {/* <Button htmlType="button" type='primary' danger shape='round'>Back </Button>
                                <Button htmlType="button" type="primary" danger shape='round'>Reset </Button> */}
                                <Button type="primary" disabled={loading} shape='round' htmlType="submit">Submit {loading ? GlobalConfig.LOADER_BLACK : null}</Button>
                            </Space>
                        </div>
                    </Form>
                </div>
            </div>
        </main>
    );
}
export default TestingForm;