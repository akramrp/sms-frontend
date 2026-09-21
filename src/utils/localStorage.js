const LS_SERVICE = {
    get: function (key) {
        var value = window.localStorage.getItem(key);
        var decoded = JSON.parse(value);
        return decoded;
    },

    set: function (key, value) {
        if (value !== "") window.localStorage.setItem(key, JSON.stringify(value));
        else window.localStorage.removeItem(key);
    },

    edit: function (key, value) {
        var decoded = JSON.parse(value);

        if (decoded) {
            this.set(key, value);
        }
    },

    delete: function (key) {
        this.set(key, "");
    },

    has: function (key) {
        return window.localStorage.hasOwnProperty(key) ? true : false;
    },

    clear: function () {
        window.localStorage.clear();
    },
};

export default LS_SERVICE;