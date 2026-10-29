import axios from 'axios';
import * as GlobalConfig from '../constants';
import LS_SERVICE from '../utils/localStorage';

const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
};

axios.interceptors.request.use(function (config) {
    if (LS_SERVICE.get('AUTH_TOKEN') !== null) {
        config.headers.Authorization = "Bearer " + LS_SERVICE.get('AUTH_TOKEN');
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});
const patchStatus = (url, id, status) => axios.patch(`${url}/${id}/${encodeURIComponent(status)}`, { headers });

const redirectToLogin = () => {
    LS_SERVICE.delete('AUTH_TOKEN');

    if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.replace('/login');
    }
};

const isUnauthorizedResponse = (response) => {
    return response?.status === 401 ||
        (response?.data?.statusCode === 401 && response?.data?.message === 'Not Authorization Or Invalid!');
};

axios.interceptors.response.use(function (response) {
    if (isUnauthorizedResponse(response)) {
        redirectToLogin();
    }
    return response;
}, function (error) {
    if (isUnauthorizedResponse(error.response)) {
        redirectToLogin();
    }
    return Promise.reject(error);
});

/*===================================  master route  ===================================*/
export const userLoginAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.USER_LOGIN, dataObj, { headers });
}
export const userListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.USER_LIST, dataObj, { headers });
}
export const userSaveAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.USER_SAVE, dataObj, { headers });
}
export const userUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.USER_UPDATE, dataObj, { headers });
}
export const userStatusAPI = async (id, status) => {
    return await patchStatus(GlobalConfig.USER_STATUS, id, status);
}
export const userDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.USER_DELETE + `/${id}`, { headers });
}
// country APIs
export const countriesListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.COUNTRIES_LIST, dataObj, { headers });
}
export const citiesListAPI = async (id) => {
    return await axios.get(GlobalConfig.CITIES_LIST + "/" + id, { headers });
}
// department APIs
export const departmentListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.DEPARTMENT_LIST, dataObj, { headers });
}
export const departmentCreateAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.DEPARTMENT_CREATE, dataObj, { headers });
}
export const departmentUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.DEPARTMENT_UPDATE, dataObj, { headers });
}
export const departmentStatusAPI = async (id, status) => {
    return await patchStatus(GlobalConfig.DEPARTMENT_STATUS, id, status);
}
export const departmentDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.DEPARTMENT_DELETE + `/${id}`, { headers });
}
// designation APIs
export const designationListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.DESIGNATION_LIST, dataObj, { headers });
}
export const designationCreateAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.DESIGNATION_CREATE, dataObj, { headers });
}
export const designationUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.DESIGNATION_UPDATE, dataObj, { headers });
}
export const designationStatusAPI = async (id, status) => {
    return await patchStatus(GlobalConfig.DESIGNATION_STATUS, id, status);
}
export const designationDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.DESIGNATION_DELETE + `/${id}`, { headers });
}
/*===================================  master route  ===================================*/


/*=================================== academic route ===================================*/
// subjects APIs
export const subjectListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.SUBJECT_LIST, dataObj, { headers });
}
export const subjectCreateAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.SUBJECT_CREATE, dataObj, { headers });
}
export const subjectUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.SUBJECT_UPDATE, dataObj, { headers });
}
export const subjectStatusAPI = async (id, status) => {
    return await patchStatus(GlobalConfig.SUBJECT_STATUS, id, status);
}
export const subjectDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.SUBJECT_DELETE + `/${id}`, { headers });
}
// classes APIs
export const classListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.CLASS_LIST, dataObj, { headers });
}
export const classCreateAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.CLASS_CREATE, dataObj, { headers });
}
export const classUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.CLASS_UPDATE, dataObj, { headers });
}
export const classStatusAPI = async (id, status) => {
    return await patchStatus(GlobalConfig.CLASS_STATUS, id, status);
}
export const classDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.CLASS_DELETE + `/${id}`, { headers });
}
// sections APIs
export const sectionListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.SECTION_LIST, dataObj, { headers });
}
export const sectionCreateAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.SECTION_CREATE, dataObj, { headers });
}
export const sectionUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.SECTION_UPDATE, dataObj, { headers });
}
export const sectionStatusAPI = async (id, status) => {
    return await patchStatus(GlobalConfig.SECTION_STATUS, id, status);
}
export const sectionDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.SECTION_DELETE + `/${id}`, { headers });
}
// subject group APIs
export const subjectGroupListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.SUBJECT_GROUP_LIST, dataObj, { headers });
}
export const subjectGroupCreateAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.SUBJECT_GROUP_CREATE, dataObj, { headers });
}
export const subjectGroupUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.SUBJECT_GROUP_UPDATE, dataObj, { headers });
}
export const subjectGroupStatusAPI = async (id, status) => {
    return await patchStatus(GlobalConfig.SUBJECT_GROUP_STATUS, id, status);
}
export const subjectGroupDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.SUBJECT_GROUP_DELETE + `/${id}`, { headers });
}
/*=================================== academic route ===================================*/

/*=================================== human resources APIs ===================================*/
const createHrApi = (listUrl, createUrl, updateUrl, statusUrl, deleteUrl) => ({
    list: async (dataObj) => axios.post(listUrl, dataObj, { headers }),
    create: async (dataObj) => axios.post(createUrl, dataObj, {
        headers: dataObj instanceof FormData ? { Accept: headers.Accept } : headers,
    }),
    update: async (dataObj) => axios.patch(updateUrl, dataObj, {
        headers: dataObj instanceof FormData ? { Accept: headers.Accept } : headers,
    }),
    status: async (id, status) => patchStatus(statusUrl, id, status),
    remove: async (id) => axios.delete(`${deleteUrl}/${id}`, { headers }),
});

export const staffDirectoryAPI = createHrApi(GlobalConfig.HR_STAFF_DIRECTORY_LIST, GlobalConfig.HR_STAFF_DIRECTORY_CREATE, GlobalConfig.HR_STAFF_DIRECTORY_UPDATE, GlobalConfig.HR_STAFF_DIRECTORY_STATUS, GlobalConfig.HR_STAFF_DIRECTORY_DELETE);
export const staffDirectoryChangePasswordAPI = async (dataObj) => axios.patch(GlobalConfig.HR_STAFF_DIRECTORY_CHANGE_PASSWORD, dataObj, { headers });
export const staffAttendanceAPI = createHrApi(GlobalConfig.HR_STAFF_ATTENDANCE_LIST, GlobalConfig.HR_STAFF_ATTENDANCE_CREATE, GlobalConfig.HR_STAFF_ATTENDANCE_UPDATE, GlobalConfig.HR_STAFF_ATTENDANCE_STATUS, GlobalConfig.HR_STAFF_ATTENDANCE_DELETE);
export const staffAttendanceByStaffAPI = async (staffId) => axios.get(`${GlobalConfig.HR_STAFF_ATTENDANCE_BY_STAFF}/${encodeURIComponent(staffId)}`, { headers });
export const payrollAPI = createHrApi(GlobalConfig.HR_PAYROLL_LIST, GlobalConfig.HR_PAYROLL_CREATE, GlobalConfig.HR_PAYROLL_UPDATE, GlobalConfig.HR_PAYROLL_STATUS, GlobalConfig.HR_PAYROLL_DELETE);
export const leaveRequestAPI = createHrApi(GlobalConfig.HR_LEAVE_REQUEST_LIST, GlobalConfig.HR_LEAVE_REQUEST_CREATE, GlobalConfig.HR_LEAVE_REQUEST_UPDATE, GlobalConfig.HR_LEAVE_REQUEST_STATUS, GlobalConfig.HR_LEAVE_REQUEST_DELETE);
export const applyLeaveAPI = createHrApi(GlobalConfig.HR_APPLY_LEAVE_LIST, GlobalConfig.HR_APPLY_LEAVE_CREATE, GlobalConfig.HR_APPLY_LEAVE_UPDATE, GlobalConfig.HR_APPLY_LEAVE_STATUS, GlobalConfig.HR_APPLY_LEAVE_DELETE);
export const leaveTypeAPI = createHrApi(GlobalConfig.HR_LEAVE_TYPE_LIST, GlobalConfig.HR_LEAVE_TYPE_CREATE, GlobalConfig.HR_LEAVE_TYPE_UPDATE, GlobalConfig.HR_LEAVE_TYPE_STATUS, GlobalConfig.HR_LEAVE_TYPE_DELETE);
export const teacherRatingAPI = createHrApi(GlobalConfig.HR_TEACHER_RATING_LIST, GlobalConfig.HR_TEACHER_RATING_CREATE, GlobalConfig.HR_TEACHER_RATING_UPDATE, GlobalConfig.HR_TEACHER_RATING_STATUS, GlobalConfig.HR_TEACHER_RATING_DELETE);
export const disabledStaffAPI = createHrApi(GlobalConfig.HR_DISABLED_STAFF_LIST, GlobalConfig.HR_DISABLED_STAFF_CREATE, GlobalConfig.HR_DISABLED_STAFF_UPDATE, GlobalConfig.HR_DISABLED_STAFF_STATUS, GlobalConfig.HR_DISABLED_STAFF_DELETE);
/*=================================== human resources APIs ===================================*/


// patient APIs
export const patientListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.PATIENT_LIST, dataObj, { headers });
}
export const patientSaveAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.PATIENT_SAVE, dataObj, { headers });
}
export const patientStatusAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.PATIENT_STATUS, dataObj, { headers });
}
export const patientUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.PATIENT_UPDATE, dataObj, { headers });
}

// test APIs
export const testListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.TEST_LIST, dataObj, { headers });
}
export const testSaveAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.TEST_SAVE, dataObj, { headers });
}
export const testUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.TEST_UPDATE, dataObj, { headers });
}
export const testStatusAPI = async (id) => {
    return await axios.patch(GlobalConfig.TEST_STATUS + `/${id}`, null, { headers });
}
export const testDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.TEST_DELETE + `/${id}`, { headers });
}