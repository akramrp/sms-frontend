export const BACKEND_BASE_URL = "http://localhost:1339";
export const BACKEND_API_URL = `${BACKEND_BASE_URL}/api/v1`;

export const HC_AUTOLOGIN = `${BACKEND_API_URL}api/auto-login`;
export const HC_LOGOUT = `${BACKEND_API_URL}api/logout`;
export const GET_ARRAY_BUFFER_FORM_URL = `${BACKEND_API_URL}/file-Buffer`;


/*========================= master / user route =========================*/
export const USER_LOGIN = `${BACKEND_API_URL}/user/login`;
export const USER_LIST = `${BACKEND_API_URL}/user/getUserList`;
export const USER_SAVE = `${BACKEND_API_URL}/user/save`;
export const USER_UPDATE = `${BACKEND_API_URL}/user/update`;
export const USER_STATUS = `${BACKEND_API_URL}/user/status`;
export const USER_DELETE = `${BACKEND_API_URL}/user/delete`;
// country route
export const COUNTRIES_LIST = `${BACKEND_API_URL}/location/countries`;
export const CITIES_LIST = `${BACKEND_API_URL}/location/cities`;
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
/*========================= master / user route =========================*/

/*=========================   academic route    =========================*/
// subject route
export const SUBJECT_LIST = `${BACKEND_API_URL}/subjects/list`;
export const SUBJECT_CREATE = `${BACKEND_API_URL}/subjects/create`;
export const SUBJECT_UPDATE = `${BACKEND_API_URL}/subjects/update`;
export const SUBJECT_STATUS = `${BACKEND_API_URL}/subjects/status`;
export const SUBJECT_DELETE = `${BACKEND_API_URL}/subjects/delete`;
// class route
export const CLASS_LIST = `${BACKEND_API_URL}/classes/list`;
export const CLASS_CREATE = `${BACKEND_API_URL}/classes/create`;
export const CLASS_UPDATE = `${BACKEND_API_URL}/classes/update`;
export const CLASS_STATUS = `${BACKEND_API_URL}/classes/status`;
export const CLASS_DELETE = `${BACKEND_API_URL}/classes/delete`;
// section route
export const SECTION_LIST = `${BACKEND_API_URL}/sections/list`;
export const SECTION_CREATE = `${BACKEND_API_URL}/sections/create`;
export const SECTION_UPDATE = `${BACKEND_API_URL}/sections/update`;
export const SECTION_STATUS = `${BACKEND_API_URL}/sections/status`;
export const SECTION_DELETE = `${BACKEND_API_URL}/sections/delete`;
// subject group route
export const SUBJECT_GROUP_LIST = `${BACKEND_API_URL}/subject-groups/list`;
export const SUBJECT_GROUP_CREATE = `${BACKEND_API_URL}/subject-groups/create`;
export const SUBJECT_GROUP_UPDATE = `${BACKEND_API_URL}/subject-groups/update`;
export const SUBJECT_GROUP_STATUS = `${BACKEND_API_URL}/subject-groups/status`;
export const SUBJECT_GROUP_DELETE = `${BACKEND_API_URL}/subject-groups/delete`;
/*=========================   academic route    =========================*/

/*========================= human resources route =========================*/
export const HR_STAFF_DIRECTORY_LIST = `${BACKEND_API_URL}/hr/staff-directory/list`;
export const HR_STAFF_DIRECTORY_CREATE = `${BACKEND_API_URL}/hr/staff-directory/create`;
export const HR_STAFF_DIRECTORY_UPDATE = `${BACKEND_API_URL}/hr/staff-directory/update`;
export const HR_STAFF_DIRECTORY_STATUS = `${BACKEND_API_URL}/hr/staff-directory/status`;
export const HR_STAFF_DIRECTORY_CHANGE_PASSWORD = `${BACKEND_API_URL}/hr/staff-directory/change-password`;
export const HR_STAFF_DIRECTORY_DELETE = `${BACKEND_API_URL}/hr/staff-directory/delete`;
export const HR_STAFF_ATTENDANCE_LIST = `${BACKEND_API_URL}/hr/staff-attendance/list`;
export const HR_STAFF_ATTENDANCE_BY_STAFF = `${BACKEND_API_URL}/hr/staff-attendance/by-staff`;
export const HR_STAFF_ATTENDANCE_CREATE = `${BACKEND_API_URL}/hr/staff-attendance/create`;
export const HR_STAFF_ATTENDANCE_UPDATE = `${BACKEND_API_URL}/hr/staff-attendance/update`;
export const HR_STAFF_ATTENDANCE_STATUS = `${BACKEND_API_URL}/hr/staff-attendance/status`;
export const HR_STAFF_ATTENDANCE_DELETE = `${BACKEND_API_URL}/hr/staff-attendance/delete`;
export const HR_PAYROLL_LIST = `${BACKEND_API_URL}/hr/payroll/list`;
export const HR_PAYROLL_CREATE = `${BACKEND_API_URL}/hr/payroll/create`;
export const HR_PAYROLL_UPDATE = `${BACKEND_API_URL}/hr/payroll/update`;
export const HR_PAYROLL_STATUS = `${BACKEND_API_URL}/hr/payroll/status`;
export const HR_PAYROLL_DELETE = `${BACKEND_API_URL}/hr/payroll/delete`;
export const HR_LEAVE_REQUEST_LIST = `${BACKEND_API_URL}/hr/leave-requests/list`;
export const HR_LEAVE_REQUEST_CREATE = `${BACKEND_API_URL}/hr/leave-requests/create`;
export const HR_LEAVE_REQUEST_UPDATE = `${BACKEND_API_URL}/hr/leave-requests/update`;
export const HR_LEAVE_REQUEST_STATUS = `${BACKEND_API_URL}/hr/leave-requests/status`;
export const HR_LEAVE_REQUEST_DELETE = `${BACKEND_API_URL}/hr/leave-requests/delete`;
export const HR_APPLY_LEAVE_LIST = `${BACKEND_API_URL}/hr/apply-leave/list`;
export const HR_APPLY_LEAVE_CREATE = `${BACKEND_API_URL}/hr/apply-leave/create`;
export const HR_APPLY_LEAVE_UPDATE = `${BACKEND_API_URL}/hr/apply-leave/update`;
export const HR_APPLY_LEAVE_STATUS = `${BACKEND_API_URL}/hr/apply-leave/status`;
export const HR_APPLY_LEAVE_DELETE = `${BACKEND_API_URL}/hr/apply-leave/delete`;
export const HR_LEAVE_TYPE_LIST = `${BACKEND_API_URL}/hr/leave-type/list`;
export const HR_LEAVE_TYPE_CREATE = `${BACKEND_API_URL}/hr/leave-type/create`;
export const HR_LEAVE_TYPE_UPDATE = `${BACKEND_API_URL}/hr/leave-type/update`;
export const HR_LEAVE_TYPE_STATUS = `${BACKEND_API_URL}/hr/leave-type/status`;
export const HR_LEAVE_TYPE_DELETE = `${BACKEND_API_URL}/hr/leave-type/delete`;
export const HR_TEACHER_RATING_LIST = `${BACKEND_API_URL}/hr/teachers-rating/list`;
export const HR_TEACHER_RATING_CREATE = `${BACKEND_API_URL}/hr/teachers-rating/create`;
export const HR_TEACHER_RATING_UPDATE = `${BACKEND_API_URL}/hr/teachers-rating/update`;
export const HR_TEACHER_RATING_STATUS = `${BACKEND_API_URL}/hr/teachers-rating/status`;
export const HR_TEACHER_RATING_DELETE = `${BACKEND_API_URL}/hr/teachers-rating/delete`;
export const HR_DISABLED_STAFF_LIST = `${BACKEND_API_URL}/hr/disabled-staff/list`;
export const HR_DISABLED_STAFF_CREATE = `${BACKEND_API_URL}/hr/disabled-staff/create`;
export const HR_DISABLED_STAFF_UPDATE = `${BACKEND_API_URL}/hr/disabled-staff/update`;
export const HR_DISABLED_STAFF_STATUS = `${BACKEND_API_URL}/hr/disabled-staff/status`;
export const HR_DISABLED_STAFF_DELETE = `${BACKEND_API_URL}/hr/disabled-staff/delete`;
/*========================= human resources route =========================*/

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



export const INVALID_MESSAGE = "Oops! something went wrong!!";
// export const COLOR_CODE = ["primary", "secondary", "success", "danger", "warning", "info", "light", "dark"];
export const COLOR_BGFN = (code="primary", text="Active") => { 
    return <span className={`badge text-bg-${code}`}>{text}</span>;
};

export const randomOTP = () => Math.floor(100000 + Math.random() * 900000);
export const formatCurrentData = () => new Date().toISOString().slice(0, 10);

export const DISPLAY_DATE = (date: string) => {
    const formattedDate = date ? new Date(date + "T00:00:00") : new Date();
    return formattedDate.toLocaleDateString("en-GB", {day: "2-digit",month: "short",year: "numeric"}).replace(/ (\d{4})$/, ", $1");
};

export const titleCase = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return;
    return String(value).split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

export const getCountryList = async () => {
    try {
        const { countriesListAPI } = await import("./services/apis");
        const response = await countriesListAPI({ keyword: "all" });
        return response?.data?.statusCode === 200 ? response.data.data || [] : [];
    } catch (error) {
        console.log("get-country-list-err:", error);
        return [];
    }
};

export const getCityList = async (stateId: number | string) => {
    try {
        const { citiesListAPI } = await import("./services/apis");
        const response = await citiesListAPI(stateId);
        return response?.data?.statusCode === 200 ? response.data.data || [] : [];
    } catch (error) {
        console.log("get-cities-list-err:", error);
        return [];
    }
};