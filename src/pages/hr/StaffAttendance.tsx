import { useState } from 'react';
import { Input, Select, notification } from 'antd';
import moment from 'moment';
import { INVALID_MESSAGE } from '../../constants';
import { staffAttendanceAPI, staffDirectoryAPI } from '../../services/apis';
import LS_SERVICE from '../../utils/localStorage';

type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Half Day' | 'Holiday';
type Designation = { id: number | string; name: string };
type AttendanceRow = Record<string, any> & {
    id?: number | string;
    staff_id?: number | string;
    emp_code?: string;
    attendance_date?: string;
    status?: AttendanceStatus;
    attendance?: AttendanceStatus;
    note?: string;
};

const attendanceStatuses: AttendanceStatus[] = ['Present', 'Late', 'Absent', 'Half Day', 'Holiday'];

const getNestedValue = (record: AttendanceRow, keys: string[]) => {
    for (const key of keys) {
        const value = key.split('.').reduce<any>((current, part) => current?.[part], record);
        if (value !== undefined && value !== null && value !== '') return value;
    }
    return '';
};

const getStaffCode = (record: AttendanceRow) => String(getNestedValue(record, [
    'emp_code', 'employee_code', 'staff.emp_code', 'staff.employee_code',
    'employee.emp_code', 'employee.employee_code', 'staff_id',
]));

const getStaffName = (record: AttendanceRow) => {
    const name = getNestedValue(record, [
    'full_name', 'name', 'staff.full_name', 'staff.name', 'employee.full_name', 'employee.name',
    ]);
    if (name) return String(name);
    const firstName = getNestedValue(record, ['first_name', 'staff.first_name', 'employee.first_name']);
    const lastName = getNestedValue(record, ['last_name', 'staff.last_name', 'employee.last_name']);
    return `${firstName} ${lastName}`.trim() || '-';
};

const getStaffId = (record: AttendanceRow) => (
    record.staff_id ?? record.staff?.id ?? record.employee?.id ?? record.id ?? getStaffCode(record)
);

const getDesignationId = (record: AttendanceRow) => (
    record.designation_id ?? record.staff?.designation_id ?? record.employee?.designation_id ??
    record.designation?.id ?? record.staff?.designation?.id ?? record.employee?.designation?.id
);

const getDesignationName = (record: AttendanceRow) => String(getNestedValue(record, [
    'designation.name', 'staff.designation.name', 'employee.designation.name', 'designation_name',
]) || '-');

const getStatus = (record: AttendanceRow): AttendanceStatus => {
    const value = String(record.attendance ?? record.status ?? 'Present');
    return attendanceStatuses.includes(value as AttendanceStatus) ? value as AttendanceStatus : 'Present';
};

export default function StaffAttendance() {
    const [rows, setRows] = useState<AttendanceRow[]>([]);
    const [designations] = useState<Designation[]>(() => LS_SERVICE.get('designationList') || []);
    const [designationId, setDesignationId] = useState('all');
    const [attendanceDate, setAttendanceDate] = useState(moment().format('YYYY-MM-DD'));
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const searchRecords = async () => {
        if (!attendanceDate) {
            notification.error({ message: 'Staff Attendance', description: 'Select an attendance date.' });
            return;
        }
        setLoading(true);
        try {
            const response = await staffDirectoryAPI.list({
                page: 1,
                ...(designationId !== 'all' ? { designation_id: Number(designationId) } : {}),
            });
            if (response?.data?.statusCode === 200 && Array.isArray(response.data.data)) {
                setRows(response.data.data.map((row: AttendanceRow) => {
                    const hasAttendanceRecord = Boolean(
                        row.attendance_id || row.attendance_record_id ||
                        row.attendance !== undefined || row.status !== undefined ||
                        row.attendance_date || row.date,
                    );
                    return {
                        ...row,
                        attendance_record_exists: hasAttendanceRecord,
                        attendance_date: attendanceDate,
                        status: getStatus(row),
                        note: String(row.remarks ?? ''),
                    };
                }));
                setSearched(true);
            } else {
                notification.error({
                    message: 'Staff Attendance',
                    description: response?.data?.message || INVALID_MESSAGE,
                });
            }
        } catch (error: any) {
            notification.error({
                message: 'Staff Attendance',
                description: error?.response?.data?.message || INVALID_MESSAGE,
            });
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        const today = moment().format('YYYY-MM-DD');
        setDesignationId('all');
        setAttendanceDate(today);
        setRows([]);
        setSearched(false);
    };

    const updateRow = (target: AttendanceRow, updates: Partial<AttendanceRow>) => {
        setRows((current) => current.map((row) => row === target ? { ...row, ...updates } : row));
    };

    const setAllStatuses = (status: AttendanceStatus) => {
        setRows((current) => current.map((row) => ({ ...row, status })));
    };

    const saveAttendance = async () => {
        if (!rows.length) return;
        setSaving(true);
        try {
            const payload = {
                attendance_date: attendanceDate,
                records: rows.map((row) => ({
                    staff_id: getStaffId(row),
                    attendance: getStatus(row),
                    source: row.source || 'Manual',
                    remarks: row.remarks ?? '',
                })),
            };
            const response = await staffAttendanceAPI.create(payload);
            if ([200, 201].includes(response?.data?.statusCode)) {
                setRows((current) => current.map((row) => ({
                    ...row,
                    attendance_record_exists: true,
                })));
                notification.success({
                    message: 'Staff Attendance',
                    description: response.data.message || 'Attendance saved successfully.',
                });
            } else {
                notification.error({
                    message: 'Staff Attendance',
                    description: response?.data?.message || INVALID_MESSAGE,
                });
            }
        } catch (error: any) {
            notification.error({
                message: 'Staff Attendance',
                description: error?.response?.data?.message || INVALID_MESSAGE,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="app-main master-page staff-attendance-page">
            <div className="container-fluid">
                <section className="card sms-card">
                    <header className="card-header sms-toolbar">
                        <div className="sms-toolbar-row">
                            <div className="master-title">
                                <span className="master-title-icon"><i className="bi bi-calendar-check" /></span>
                                <span><strong>Staff Attendance</strong><small>Manage daily staff attendance</small></span>
                            </div>
                            <div className="staff-attendance-toolbar">
                                <div className="staff-attendance-toolbar-filter">
                                    <label htmlFor="attendance-designation-filter">Designation</label>
                                    <Select
                                        id="attendance-designation-filter"
                                        value={designationId}
                                        options={[
                                            { value: 'all', label: 'All designations' },
                                            ...designations.map((designation) => ({
                                                value: String(designation.id),
                                                label: designation.name,
                                            })),
                                        ]}
                                        loading={designations.length === 0}
                                        onChange={setDesignationId}
                                    />
                                </div>
                                <div className="staff-attendance-toolbar-filter">
                                    <label htmlFor="attendance-date-filter">Attendance Date</label>
                                    <Input
                                        id="attendance-date-filter"
                                        type="date"
                                        value={attendanceDate}
                                        onChange={(event) => setAttendanceDate(event.target.value)}
                                    />
                                </div>
                                <button type="button" className="btn btn-sm btn-outline-success" onClick={() => void searchRecords()} disabled={loading}>
                                    <i className="bi bi-search me-1" />{loading ? 'Searching...' : 'Search'}
                                </button>
                                <button type="button" className="btn btn-sm sms-reset-search" onClick={resetFilters} title="Reset filters">
                                    <i className="bi bi-arrow-counterclockwise me-1" />
                                </button>
                            </div>
                        </div>
                    </header>

                    {searched && (
                        <>
                            <div className="staff-attendance-bulk">
                                <div className="staff-attendance-bulk-options">
                                    <strong>Set attendance for all staff as</strong>
                                    {attendanceStatuses.map((status) => (
                                        <label key={status} className="staff-attendance-radio">
                                            <input
                                                type="radio"
                                                name="bulk-attendance"
                                                checked={rows.length > 0 && rows.every((row) => getStatus(row) === status)}
                                                onChange={() => setAllStatuses(status)}
                                            />
                                            <span>{status}</span>
                                        </label>
                                    ))}
                                </div>
                                <button type="button" className="btn btn-sm btn-outline-success" onClick={() => void saveAttendance()} disabled={saving || rows.length === 0}>
                                    <i className="bi bi-save me-1" />{saving ? 'Saving...' : 'Save Attendance'}
                                </button>
                            </div>

                            <div className="table-responsive">
                                <table className="table master-table staff-attendance-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Staff ID</th>
                                            <th>Name</th>
                                            <th>Designation</th>
                                            <th>Attendance</th>
                                            <th>Source</th>
                                            <th className="text-end">Note</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan={7} className="master-empty">Loading staff attendance...</td></tr>
                                        ) : rows.length === 0 ? (
                                            <tr><td colSpan={7} className="master-empty">No staff attendance records found.</td></tr>
                                        ) : rows.map((row, index) => (
                                            <tr key={row.attendance_id ?? row.attendance_record_id ?? row.id ?? getStaffCode(row)}>
                                                <td>{index + 1}</td>
                                                <td>{getStaffCode(row) || '-'}</td>
                                                <td>{getStaffName(row)}</td>
                                                <td>{getDesignationName(row) !== '-'
                                                    ? getDesignationName(row)
                                                    : designations.find((item) => String(item.id) === String(getDesignationId(row)))?.name ?? '-'}</td>
                                                <td>
                                                    <div className="staff-attendance-row-options">
                                                        {attendanceStatuses.map((status) => (
                                                            <label key={status} className="staff-attendance-radio">
                                                                <input
                                                                    type="radio"
                                                                    name={`attendance-${row.id ?? getStaffCode(row)}`}
                                                                    value={status}
                                                                    checked={getStatus(row) === status}
                                                                    onChange={() => updateRow(row, { status })}
                                                                />
                                                                <span>{status}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>{row.source ?? 'Manual'}</td>
                                                <td>
                                                    <Input
                                                        size="small"
                                                        aria-label={`Attendance remarks for ${getStaffName(row)}`}
                                                        onChange={(event) => updateRow(row, { remarks: event.target.value })}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}
