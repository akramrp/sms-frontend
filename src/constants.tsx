export const BACKEND_BASE_URL = "http://localhost:1339";
export const BACKEND_API_URL = `${BACKEND_BASE_URL}/api/v1`;

export const HC_AUTOLOGIN = `${BACKEND_API_URL}api/auto-login`;
export const HC_LOGOUT = `${BACKEND_API_URL}api/logout`;
export const GET_ARRAY_BUFFER_FORM_URL = `${BACKEND_API_URL}/file-Buffer`;

export const INVALID_MESSAGE = "Oops! something went wrong!!";
// export const COLOR_CODE = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];
export const COLOR_BGFN = (code="primary", text="Active") => { 
    return <span className={`badge text-bg-${code}`}>{text}</span>;
};

// user route
export const USER_LOGIN = `${BACKEND_API_URL}/user/login`;
export const USER_LIST = `${BACKEND_API_URL}/user/getUserList`;
export const USER_SAVE = `${BACKEND_API_URL}/user/save`;
export const USER_UPDATE = `${BACKEND_API_URL}/user/update`;
export const USER_STATUS = `${BACKEND_API_URL}/user/status`;
export const USER_DELETE = `${BACKEND_API_URL}/user/delete`;

// country route
export const COUNTRIES_LIST = `${BACKEND_API_URL}/location/countries`;
export const CITIES_LIST = `${BACKEND_API_URL}/location/cities`;

// patient route
export const PATIENT_LIST = `${BACKEND_API_URL}/patient/getPatientList`;
export const PATIENT_SAVE = `${BACKEND_API_URL}/patient/save`;
export const PATIENT_UPDATE = `${BACKEND_API_URL}/patient/update`;
export const PATIENT_STATUS = `${BACKEND_API_URL}/patient/status`;

// test route
export const TEST_LIST = `${BACKEND_API_URL}/test/getTestList`;
export const TEST_SAVE = `${BACKEND_API_URL}/test/save`;
export const TEST_UPDATE = `${BACKEND_API_URL}/test/update`;
export const TEST_STATUS = `${BACKEND_API_URL}/test/status`;
export const TEST_DELETE = `${BACKEND_API_URL}/test/delete`;

// department route
export const DEPARTMENT_LIST = `${BACKEND_API_URL}/department/list`;
export const DEPARTMENT_CREATE = `${BACKEND_API_URL}/department/create`;
export const DEPARTMENT_UPDATE = `${BACKEND_API_URL}/department/update`;
export const DEPARTMENT_STATUS = `${BACKEND_API_URL}/department/status`;
export const DEPARTMENT_DELETE = `${BACKEND_API_URL}/department/delete`;

// designation route
export const DESIGNATION_LIST = `${BACKEND_API_URL}/designation/list`;
export const DESIGNATION_CREATE = `${BACKEND_API_URL}/designation/create`;
export const DESIGNATION_UPDATE = `${BACKEND_API_URL}/designation/update`;
export const DESIGNATION_STATUS = `${BACKEND_API_URL}/designation/status`;
export const DESIGNATION_DELETE = `${BACKEND_API_URL}/designation/delete`;