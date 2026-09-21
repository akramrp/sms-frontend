export interface SidebarMenuItem {
    id: string;
    title: string;
    icon?: string;
    path?: string;
    children?: SidebarMenuItem[];
}

export const sidebarMenus: SidebarMenuItem[] = [
    { id: "dashboard", title: "Home", icon: "bi-speedometer2", path: "/home" },
    // { id: "users", title: "Users", icon: "bi-people", path: "/users" },
    {
        id: "masters",
        title: "Masters",
        icon: "bi-database",
        children: [
            {
                id: "countries",
                title: "Countries",
                icon: "bi-globe",
                path: "/countries",
            },
            {
                id: "states",
                title: "States",
                icon: "bi-map",
                path: "/states",
            },
            {
                id: "cities",
                title: "Cities",
                icon: "bi-buildings",
                path: "/cities",
            },
            {
                id: "departments",
                title: "Departments",
                icon: "bi-diagram-3",
                path: "/departments",
            },
            {
                id: "designations",
                title: "Designations",
                icon: "bi-person-badge",
                path: "/designations",
            },
            {
                id: "users",
                title: "Users",
                icon: "bi-people",
                path: "/users",
            },
        ],
    },

    {
        id: "students",
        title: "Students",
        icon: "bi-people",
        children: [
            {
                id: "students-list",
                title: "All Students",
                icon: "bi-person-lines-fill",
                path: "/students",
            },
            {
                id: "student-add",
                title: "Add Student",
                icon: "bi-person-plus-fill",
                path: "/students/add",
            },
            {
                id: "student-attendance",
                title: "Attendance",
                icon: "bi-calendar-check",
                path: "/students/attendance",
            },
        ],
    },

    {
        id: "staff",
        title: "Staff",
        icon: "bi-person-badge",
        children: [
            {
                id: "staff-list",
                title: "All Staff",
                icon: "bi-person-vcard-fill",
                path: "/staff",
            },
            {
                id: "staff-add",
                title: "Add Staff",
                icon: "bi-person-plus-fill",
                path: "/staff/add",
            },
            {
                id: "staff-attendance",
                title: "Attendance",
                icon: "bi-calendar-check",
                path: "/staff/attendance",
            },
        ],
    },

    {
        id: "fees",
        title: "Fees",
        icon: "bi-cash-stack",
        children: [
            {
                id: "fee-structure",
                title: "Fee Structure",
                icon: "bi-receipt",
                path: "/fees/structure",
            },
            {
                id: "fee-collect",
                title: "Collect Fees",
                icon: "bi-wallet2",
                path: "/fees/collect",
            },
            {
                id: "fee-payments",
                title: "Payments",
                icon: "bi-credit-card-2-front",
                path: "/fees/payments",
            },
            {
                id: "fee-pending",
                title: "Pending Fees",
                icon: "bi-hourglass-split",
                path: "/fees/pending",
            },
        ],
    },

    {
        id: "academics",
        title: "Academics",
        icon: "bi-book",
        children: [
            {
                id: "classes",
                title: "Classes",
                icon: "bi-easel2",
                path: "/academics/classes",
            },
            {
                id: "subjects",
                title: "Subjects",
                icon: "bi-journal-bookmark-fill",
                path: "/academics/subjects",
            },
            {
                id: "timetable",
                title: "Timetable",
                icon: "bi-calendar3",
                path: "/academics/timetable",
            },
            {
                id: "exams",
                title: "Exams",
                icon: "bi-clipboard2-check",
                path: "/academics/exams",
            },
        ],
    },

    {
        id: "reports",
        title: "Reports",
        icon: "bi-bar-chart",
        children: [
            {
                id: "student-reports",
                title: "Student Reports",
                icon: "bi-person-lines-fill",
                path: "/reports/students",
            },
            {
                id: "fee-reports",
                title: "Fee Reports",
                icon: "bi-file-earmark-bar-graph",
                path: "/reports/fees",
            },
            {
                id: "attendance-reports",
                title: "Attendance Reports",
                icon: "bi-calendar2-check",
                path: "/reports/attendance",
            },
        ],
    },

    {
        id: "settings",
        title: "Settings",
        icon: "bi-gear",
        children: [
            {
                id: "school-profile",
                title: "School Profile",
                icon: "bi-building",
                path: "/settings/school",
            },
            {
                id: "users",
                title: "Users",
                icon: "bi-people-fill",
                path: "/settings/users",
            },
            {
                id: "roles",
                title: "Roles & Permissions",
                icon: "bi-shield-lock-fill",
                path: "/settings/roles",
            },
        ],
    },
    
];