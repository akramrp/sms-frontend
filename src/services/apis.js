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
export const userStatusAPI = async (id) => {
    return await axios.get(GlobalConfig.USER_STATUS + `/${id}`, { headers });
}
export const userDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.USER_DELETE + `/${id}`, { headers });
}

// country apis
export const countriesListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.COUNTRIES_LIST, dataObj, { headers });
}
export const citiesListAPI = async (id) => {
    return await axios.get(GlobalConfig.CITIES_LIST + "/" + id, { headers });
}

// patient apis
export const patientListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.PATIENT_LIST, dataObj, { headers });
}
export const patientSaveAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.PATIENT_SAVE, dataObj, { headers });
}
export const patientStatusAPI = async (dataObj) => {
    return await axios.get(GlobalConfig.PATIENT_STATUS, dataObj, { headers });
}
export const patientUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.PATIENT_UPDATE, dataObj, { headers });
}

// test apis
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
    return await axios.get(GlobalConfig.TEST_STATUS + `/${id}`, { headers });
}
export const testDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.TEST_DELETE + `/${id}`, { headers });
}

// department apis
export const departmentListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.DEPARTMENT_LIST, dataObj, { headers });
}
export const departmentCreateAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.DEPARTMENT_CREATE, dataObj, { headers });
}
export const departmentUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.DEPARTMENT_UPDATE, dataObj, { headers });
}
export const departmentStatusAPI = async (id) => {
    return await axios.get(GlobalConfig.DEPARTMENT_STATUS + `/${id}`, { headers });
}
export const departmentDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.DEPARTMENT_DELETE + `/${id}`, { headers });
}

// designation apis
export const designationListAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.DESIGNATION_LIST, dataObj, { headers });
}
export const designationCreateAPI = async (dataObj) => {
    return await axios.post(GlobalConfig.DESIGNATION_CREATE, dataObj, { headers });
}
export const designationUpdateAPI = async (dataObj) => {
    return await axios.patch(GlobalConfig.DESIGNATION_UPDATE, dataObj, { headers });
}
export const designationStatusAPI = async (id) => {
    return await axios.get(GlobalConfig.DESIGNATION_STATUS + `/${id}`, { headers });
}
export const designationDeleteAPI = async (id) => {
    return await axios.delete(GlobalConfig.DESIGNATION_DELETE + `/${id}`, { headers });
}