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
        id: "hr",
        title: "HR",
        icon: "bi-person-badge",
        children: [
            {
                id: "staff-directory",
                title: "Staff Directory",
                icon: "bi-person-vcard-fill",
                path: "/hr/staff-directory",
            },
            {
                id: "staff-attendance",
                title: "Staff Attendance",
                icon: "bi-calendar-check",
                path: "/hr/staff-attendance",
            },
            {
                id: "payroll",
                title: "Payroll",
                icon: "bi-cash-stack",
                path: "/hr/payroll",
            },
            {
                id: "approve-leave-request",
                title: "Approve Leave Request",
                icon: "bi-calendar2-check",
                path: "/hr/approve-leave-request",
            },
            {
                id: "apply-leave",
                title: "Apply Leave",
                icon: "bi-calendar2-plus",
                path: "/hr/apply-leave",
            },
            {
                id: "leave-type",
                title: "Leave Type",
                icon: "bi-list-check",
                path: "/hr/leave-type",
            },
            {
                id: "teachers-rating",
                title: "Teachers Rating",
                icon: "bi-star",
                path: "/hr/teachers-rating",
            },
            {
                id: "disabled-staff",
                title: "Disabled Staff",
                icon: "bi-person-x",
                path: "/hr/disabled-staff",
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
                id: "class-timetable",
                title: "Class Timetable",
                icon: "bi-calendar3",
                path: "/academics/class-timetable",
            },
            {
                id: "teacher-timetable",
                title: "Teacher Timetable",
                icon: "bi-calendar2-week",
                path: "/academics/teacher-timetable",
            },
            {
                id: "assign-class-teacher",
                title: "Assign Class Teacher",
                icon: "bi-person-workspace",
                path: "/academics/assign-class-teacher",
            },
            {
                id: "promote-students",
                title: "Promote Students",
                icon: "bi-person-up",
                path: "/academics/promote-students",
            },
            {
                id: "subject-group",
                title: "Subject Group",
                icon: "bi-collection",
                path: "/academics/subject-group",
            },
            {
                id: "subjects",
                title: "Subjects",
                icon: "bi-journal-bookmark-fill",
                path: "/academics/subjects",
            },
            {
                id: "classes",
                title: "Classes",
                icon: "bi-easel2",
                path: "/academics/classes",
            },
            {
                id: "sections",
                title: "Sections",
                icon: "bi-easel2-fill",
                path: "/academics/sections",
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