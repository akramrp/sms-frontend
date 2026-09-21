// call from any component syntex
// import { menuArr, serviceList } from '../../utils/sampledata';

export const menuArr = [
    { label: "dashboard", frequency:"0", route: "dashboard", subRouteFlag: false, subRouteArr: [] },
    { label: "routes", frequency:"1", route: "add-route", subRouteFlag: false, subRouteArr: [] },
    {
        label: "users", frequency:"2", route: "users", subRoute: true, subRouteArr: [
            { subLabel: "users", subRoute: "users" },
            { subLabel: "add user", subRoute: "add-user" },
        ]
    },
    {
        label: "vendors", frequency:"3", route: "vendors", subRoute: true,
        subRouteArr: [
            { subLabel: "vendors", subRoute: "vendors" },
            { subLabel: "add vendor", subRoute: "add-vendor" },
        ]
    },
    {
        label: "products", frequency:"4", route: "products", subRoute: true, subRouteArr: [
            { subLabel: "in stock", subRoute: "in-stock" },
            { subLabel: "out of stock", subRoute: "out of stock" },
            { subLabel: "feature stock", subRoute: "feature stock" },
            { subLabel: "add product", subRoute: "add-product" },
        ]
    },
    {
        label: "orders", frequency:"5", route: "orders", subRoute: true,
        subRouteArr: [
            { subLabel: "new orders", subRoute: "new-orders" },
            { subLabel: "pending orders", subRoute: "pending-orders" },
            { subLabel: "shipped orders", subRoute: "shipped-orders" },
            { subLabel: "delivered orders", subRoute: "delivered-orders" },
            { subLabel: "cancel orders", subRoute: "cancel-orders" },
        ]
    },
    {
        label: "other", frequency:"6", route: "other", subRoute: true, subRouteArr: [
            { subLabel: "countries", subRoute: "countries" },
            { subLabel: "states", subRoute: "states" },
            { subLabel: "cities", subRoute: "cities" },
            { subLabel: "categories", subRoute: "categories" },
            { subLabel: "sub categories", subRoute: "sub-categories" },
        ]
    },
];


export const countries = [
    {id: 1, name:"country-1"},
    {id: 2, name:"country-2"},
    {id: 3, name:"country-3"},
    {id: 4, name:"country-4"},
    {id: 5, name:"country-5"},
    {id: 6, name:"country-6"},
    {id: 7, name:"country-7"},
    {id: 8, name:"country-8"},
    {id: 9, name:"country-9"},
    {id: 10, name:"country-10"},
];

export const states = [
    {id: 1, name:"state-1"},
    {id: 2, name:"state-2"},
    {id: 3, name:"state-3"},
    {id: 4, name:"state-4"},
    {id: 5, name:"state-5"},
    {id: 6, name:"state-6"},
    {id: 7, name:"state-7"},
    {id: 8, name:"state-8"},
    {id: 9, name:"state-9"},
    {id: 10, name:"state-10"},
];

export const cities = [
    {id: 1, name:"city-1"},
    {id: 2, name:"city-2"},
    {id: 3, name:"city-3"},
    {id: 4, name:"city-4"},
    {id: 5, name:"city-5"},
    {id: 6, name:"city-6"},
    {id: 7, name:"city-7"},
    {id: 8, name:"city-8"},
    {id: 9, name:"city-9"},
    {id: 10, name:"city-10"},
];