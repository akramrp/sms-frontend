import {
    applyLeaveAPI,
    disabledStaffAPI,
    leaveRequestAPI,
    leaveTypeAPI,
    payrollAPI,
    staffAttendanceAPI,
    staffDirectoryAPI,
    teacherRatingAPI,
} from '../../services/apis';
import type { HrPageConfig } from './HrCrudPage';

export const staffDirectoryConfig: HrPageConfig = {
    title: 'Staff Directory',
    singular: 'Staff',
    icon: 'bi-person-vcard-fill',
    api: staffDirectoryAPI,
    fields: [
        { name: 'full_name', label: 'Full Name', withAvatar: true },
        { name: 'emp_code', label: 'Employee Code' },
        { name: 'email', label: 'Email' },
        { name: 'phone', label: 'Phone' },
        { name: 'qualification', label: 'Qualification' },
        { name: 'department_id', label: 'Department', displayName: 'department.name' },
        { name: 'designation_id', label: 'Designation', displayName: 'designation.name' },
        { name: 'date_of_joining', label: 'DOJ', type: 'date' },
        { name: 'work_experience', label: 'Work Exp.' },
    ],
    statuses: ['Active', 'Inactive'],
    statusField: 'is_active',
    statusSwitch: { on: 1, off: 0, onLabel: 'Active', offLabel: 'Inactive' },
    staffProfile: true,
};

export const staffAttendanceConfig: HrPageConfig = {
    title: 'Staff Attendance',
    singular: 'Attendance',
    icon: 'bi-calendar-check',
    api: staffAttendanceAPI,
    fields: [
        { name: 'emp_code', label: 'Staff ID' },
        { name: 'staff_name', label: 'Name' },
        { name: 'designation_id', label: 'Designation', displayName: 'designation.name' },
        { name: 'attendance_date', label: 'Attendance Date', type: 'date' },
        { name: 'source', label: 'Source' },
        { name: 'remarks', label: 'Remarks' },
    ],
    statuses: ['Present', 'Late', 'Absent', 'Half Day', 'Holiday'],
    statusField: 'status',
};

export const payrollConfig: HrPageConfig = {
    title: 'Payroll',
    singular: 'Payroll Record',
    icon: 'bi-cash-stack',
    api: payrollAPI,
    fields: [
        { name: 'staff_name', label: 'Staff Name' },
        { name: 'pay_month', label: 'Pay Month', type: 'date' },
        { name: 'basic_salary', label: 'Basic Salary', type: 'number' },
        { name: 'allowances', label: 'Allowances', type: 'number' },
        { name: 'deductions', label: 'Deductions', type: 'number' },
    ],
    statuses: ['Pending', 'Paid', 'On Hold'],
};

export const approveLeaveConfig: HrPageConfig = {
    title: 'Approve Leave Request',
    singular: 'Leave Request',
    icon: 'bi-calendar2-check',
    api: leaveRequestAPI,
    fields: [
        { name: 'staff_id', label: 'Staff Name', type: 'select', displayName: 'staff.full_name' },
        { name: 'leave_type_id', label: 'Leave Type', type: 'select', displayName: 'leave_type.name' },
        { name: 'start_date', label: 'From Date', type: 'date' },
        { name: 'end_date', label: 'To Date', type: 'date' },
        { name: 'total_days', label: 'Day(s)', computed: 'dateRangeDays', displayOnly: true },
        { name: 'createdAt', label: 'Apply Date', type: 'date', displayOnly: true },
        { name: 'reason', label: 'Reason' },
    ],
    statuses: ['Pending', 'Approved', 'Disapproved'],
    leaveRequestForm: true,
};

export const applyLeaveConfig: HrPageConfig = {
    title: 'Apply Leave',
    singular: 'Leave Application',
    icon: 'bi-calendar2-plus',
    api: leaveRequestAPI,
    fields: [
        { name: 'staff_id', label: 'Staff Name', type: 'select', displayName: 'staff.full_name', formHidden: true },
        { name: 'leave_type_id', label: 'Leave Type', type: 'select', displayName: 'leave_type.name' },
        { name: 'start_date', label: 'From Date', type: 'date' },
        { name: 'end_date', label: 'To Date', type: 'date' },
        { name: 'total_days', label: 'Day(s)', computed: 'dateRangeDays', displayOnly: true },
        { name: 'createdAt', label: 'Apply Date', type: 'date', displayOnly: true },
        { name: 'reason', label: 'Reason' },
    ],
    statuses: ['Pending', 'Approved', 'Rejected'],
    leaveRequestForm: true,
    currentUserStaffId: true,
};

export const leaveTypeConfig: HrPageConfig = {
    title: 'Leave Type',
    singular: 'Leave Type',
    icon: 'bi-list-check',
    api: leaveTypeAPI,
    fields: [
        { name: 'name', label: 'Name' },
        { name: 'days_allowed', label: 'Days Allowed', type: 'number' },
        { name: 'description', label: 'Description', type: 'textarea' },
    ],
    statuses: ['Active', 'Inactive'],
    statusSwitch: { on: 'Active', off: 'Inactive' },
};

export const teacherRatingConfig: HrPageConfig = {
    title: 'Teachers Rating',
    singular: 'Teacher Rating',
    icon: 'bi-star',
    api: teacherRatingAPI,
    fields: [
        { name: 'teacher_name', label: 'Teacher Name' },
        { name: 'academic_year', label: 'Academic Year' },
        { name: 'rating', label: 'Rating (1-5)', type: 'number' },
        { name: 'comments', label: 'Comments', type: 'textarea' },
    ],
    statuses: ['Active', 'Inactive'],
    statusSwitch: { on: 'Active', off: 'Inactive' },
};

export const disabledStaffConfig: HrPageConfig = {
    title: 'Disabled Staff',
    singular: 'Staff Record',
    icon: 'bi-person-x',
    api: disabledStaffAPI,
    fields: [
        { name: 'staff_code', label: 'Staff ID' },
        { name: 'name', label: 'Name' },
        { name: 'disabled_date', label: 'Disabled Date', type: 'date' },
        { name: 'reason', label: 'Reason', type: 'textarea' },
    ],
    statuses: ['Disabled', 'Enabled'],
    statusSwitch: { on: 'Enabled', off: 'Disabled' },
};
