import { countriesListAPI, citiesListAPI } from "./apis";

const helpers = {
    randomOTP: function () {
        return Math.floor(100000 + Math.random() * 900000);
    },

    formatCurrentData: function () {
        var d = new Date(),
            month = d.getMonth() + 1,
            day = d.getDate(),
            year = d.getFullYear();

        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        return [year, month, day].join('-');
    },

    titleCase: function (string) {
        if (string !== null && string !== "" && string !== undefined) {
            let newString = string.toString();
            return newString.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        } else {
            return;
        }
    },

    getCountryList: async () => {
        try {
            let payloadData = { keyword: "all" };
            let apiResp = await countriesListAPI(payloadData);
            if (apiResp?.data?.statusCode == 200) {
                let apiList = apiResp.data.data || [];
                return apiList;
            }
            return [];
        } catch (err) {
            console.log('get-country-list-err:', err);
            return [];
        }
    },

    getCityList: async (state_id) => {
        try {
            let apiResp = await citiesListAPI(state_id);
            if (apiResp?.data?.statusCode == 200) {
                let apiList = apiResp.data.data || [];
                return apiList;
            }
            return [];
        } catch (err) {
            console.log('get-cities-list-err:', err);
            return [];
        }
    }

}

export default helpers;