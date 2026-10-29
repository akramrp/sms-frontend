import { useEffect, useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Input, InputNumber, Modal, Select, notification } from 'antd';
import { BACKEND_BASE_URL, INVALID_MESSAGE } from '../../constants';
import { payrollAPI, staffAttendanceByStaffAPI } from '../../services/apis';
import LS_SERVICE from '../../utils/localStorage';
import noImage from '../../assets/images/no_image.png';

type PayrollRecord = Record<string, any> & { id?: number | string };
type MasterOption = { id: number | string; name: string };
type PayrollStatus = 'Not Generated' | 'Generated' | 'Paid';
type PayrollLine = { id: number; name: string; amount: number | null };
type PayrollLineSetter = Dispatch<SetStateAction<PayrollLine[]>>;
type PayrollTotals = {
    basicSalary: number;
    earnings: number;
    deductions: number;
    grossSalary: number;
    tax: number;
    netSalary: number;
};
type AttendanceCounts = { present: number; late: number; absent: number; halfDay: number; holiday: number; vacation: number };
type AttendanceMonth = { label: string; month: number; year: number; counts: AttendanceCounts };

const emptyAttendanceCounts = (): AttendanceCounts => ({
    present: 0,
    late: 0,
    absent: 0,
    halfDay: 0,
    holiday: 0,
    vacation: 0,
});

const getAttendanceMonthsForPeriod = (month: string, year: string): AttendanceMonth[] => (
    Array.from({ length: 3 }, (_, index) => {
        const date = new Date(Number(year), Number(month) - 1 - index, 1);
        return {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            label: date.toLocaleString('en', { month: 'long' }),
            counts: emptyAttendanceCounts(),
        };
    })
);

const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(2000, index, 1);
    return { value: String(index + 1).padStart(2, '0'), label: date.toLocaleString('en', { month: 'long' }) };
});

const getNestedValue = (record: PayrollRecord, paths: string[]) => {
    for (const path of paths) {
        const value = path.split('.').reduce<any>((current, key) => current?.[key], record);
        if (value !== undefined && value !== null && value !== '') return value;
    }
    return '';
};

const getStaffId = (record: PayrollRecord) => {
    const staffId = record.staff_id;
    if (staffId !== null && typeof staffId === 'object') {
        return staffId.id ?? record.staff?.id ?? record.employee?.id ?? record.id;
    }
    return staffId ?? record.staff?.id ?? record.employee?.id ?? record.id;
};

const getStaffName = (record: PayrollRecord) => {
    const name = getNestedValue(record, ['full_name', 'name', 'staff.full_name', 'staff.name', 'employee.full_name']);
    if (name) return String(name);
    return `${getNestedValue(record, ['first_name', 'staff.first_name'])} ${getNestedValue(record, ['last_name', 'staff.last_name'])}`.trim() || '-';
};

const getStatus = (record?: PayrollRecord): PayrollStatus => {
    if (!record) return 'Not Generated';
    const status = String(record.status ?? record.payroll_status ?? '').trim().toLowerCase();
    return status === 'paid' ? 'Paid' : 'Generated';
};

const getAmount = (value: unknown) => {
    const amount = Number(value);
    return Number.isFinite(amount) && amount >= 0 ? amount : 0;
};

const formatMoney = (value: number) => value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const getMasterName = (
    record: PayrollRecord,
    idField: string,
    cachedOptions: MasterOption[],
    nestedNamePaths: string[],
) => {
    const nestedName = getNestedValue(record, nestedNamePaths);
    if (nestedName) return String(nestedName);

    const relation = record[idField];
    const id = relation !== null && typeof relation === 'object'
        ? relation.id
        : relation;
    if (id === undefined || id === null || id === '') return '-';

    return cachedOptions.find((option) => String(option.id) === String(id))?.name || '-';
};

const getAttendanceCounts = (records: unknown[]): AttendanceCounts => records.reduce((counts, value) => {
    if (value === null || typeof value !== 'object') return counts;
    const record = value as PayrollRecord;
    const status = String(record.attendance ?? record.status ?? record.attendance_status ?? '').trim().toLowerCase();
    if (status === 'present' || status === 'p') counts.present += 1;
    else if (status === 'late' || status === 'l') counts.late += 1;
    else if (status === 'absent' || status === 'a') counts.absent += 1;
    else if (status === 'half day' || status === 'half-day' || status === 'half_day' || status === 'halfday' || status === 'f') counts.halfDay += 1;
    else if (status === 'holiday' || status === 'h') counts.holiday += 1;
    else if (status === 'vacation' || status === 'leave' || status === 'v') counts.vacation += 1;
    return counts;
}, emptyAttendanceCounts());

const getAttendanceDate = (record: PayrollRecord) => {
    const date = getNestedValue(record, ['attendance_date', 'date', 'created_at']);
    return typeof date === 'string' ? date.slice(0, 10) : '';
};

export default function Payroll() {
    const now = new Date();
    const [staff, setStaff] = useState<PayrollRecord[]>([]);
    const [departments] = useState<MasterOption[]>(() => LS_SERVICE.get('departmentList') || []);
    const [designations] = useState<MasterOption[]>(() => LS_SERVICE.get('designationList') || []);
    const [designationId, setDesignationId] = useState('all');
    const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, '0'));
    const [year, setYear] = useState(String(now.getFullYear()));
    const [keyword, setKeyword] = useState('');
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [updatingPaidId, setUpdatingPaidId] = useState<number | string | null>(null);
    const [modalStaff, setModalStaff] = useState<PayrollRecord | null>(null);
    const [basicSalary, setBasicSalary] = useState<number | null>(null);
    const [tax, setTax] = useState<number | null>(0);
    const [earnings, setEarnings] = useState<PayrollLine[]>([]);
    const [deductions, setDeductions] = useState<PayrollLine[]>([]);
    const [totals, setTotals] = useState<PayrollTotals | null>(null);
    const [attendanceMonths, setAttendanceMonths] = useState<AttendanceMonth[]>([]);
    const [attendanceLoading, setAttendanceLoading] = useState(false);

    useEffect(() => {
        if (!modalStaff) return;

        let active = true;
        const staffId = getStaffId(modalStaff);
        const months = getAttendanceMonthsForPeriod(month, year);

        const loadAttendance = async () => {
            setAttendanceLoading(true);
            try {
                const response = await staffAttendanceByStaffAPI(staffId);
                if (!active) return;
                if (response?.data?.statusCode !== 200 || !Array.isArray(response.data.data)) {
                    throw new Error(response?.data?.message || 'Unable to load staff attendance.');
                }
                const records = response.data.data as PayrollRecord[];
                const results = months.map((item) => ({
                    ...item,
                    counts: getAttendanceCounts(records.filter((record) => {
                        const attendanceDate = getAttendanceDate(record);
                        return attendanceDate.startsWith(`${item.year}-${String(item.month).padStart(2, '0')}-`);
                    })),
                }));
                setAttendanceMonths(results);
            } catch (error: any) {
                if (active) {
                    setAttendanceMonths([]);
                    notification.error({
                        message: 'Staff Attendance',
                        description: error?.response?.data?.message || error?.message || INVALID_MESSAGE,
                    });
                }
            } finally {
                if (active) setAttendanceLoading(false);
            }
        };

        if (staffId === undefined || staffId === null || staffId === '') {
            notification.error({ message: 'Staff Attendance', description: 'Unable to identify this staff member.' });
            return;
        }
        void loadAttendance();
        return () => {
            active = false;
        };
    }, [modalStaff, month, year]);

    const searchPayroll = async () => {
        setLoading(true);
        try {
            const response = await payrollAPI.list({
                page: 1,
                month: Number(month),
                year: Number(year),
                pay_month: `${year}-${month}`,
                ...(designationId !== 'all' ? { designation_id: Number(designationId) } : {}),
            });
            if (response?.data?.statusCode !== 200 || !Array.isArray(response.data.data)) {
                throw new Error(response?.data?.message || 'Unable to load payroll records.');
            }

            setStaff(response.data.data);
            setSearched(true);
        } catch (error: any) {
            notification.error({
                message: 'Payroll',
                description: error?.response?.data?.message || error?.message || INVALID_MESSAGE,
            });
        } finally {
            setLoading(false);
        }
    };

    const resetFilters = () => {
        setDesignationId('all');
        setMonth(String(now.getMonth() + 1).padStart(2, '0'));
        setYear(String(now.getFullYear()));
        setStaff([]);
        setKeyword('');
        setSearched(false);
    };

    const listedStaff = useMemo(() => {
        const needle = keyword.trim().toLowerCase();
        return staff
            .filter((record) => {
                if (!needle) return true;
                const values = [
                    getStaffName(record),
                    getNestedValue(record, ['emp_code', 'employee_code', 'staff.emp_code']),
                    getNestedValue(record, ['phone', 'staff.phone']),
                    getMasterName(record, 'designation_id', designations, ['designation.name', 'designation_name']),
                    getMasterName(record, 'department_id', departments, ['department.name', 'department_name']),
                ];
                return values.some((value) => String(value).toLowerCase().includes(needle));
            })
            .map((record) => ({
                staff: record,
                payroll: record.payroll && typeof record.payroll === 'object'
                    ? record.payroll as PayrollRecord
                    : undefined,
            }));
    }, [staff, keyword, departments, designations]);

    const openGenerateModal = (record: PayrollRecord) => {
        setModalStaff(record);
        setAttendanceMonths(getAttendanceMonthsForPeriod(month, year));
        const staffId = getStaffId(record);
        setAttendanceLoading(staffId !== undefined && staffId !== null && staffId !== '');
        const staffSalary = record.basic_salary ?? record.salary ?? record.basicSalary;
        setBasicSalary(staffSalary === undefined || staffSalary === null ? null : getAmount(staffSalary));
        setTax(0);
        setEarnings([]);
        setDeductions([]);
        setTotals(null);
    };

    const closeGenerateModal = () => {
        if (saving) return;
        setModalStaff(null);
        setTotals(null);
        setAttendanceMonths([]);
        setAttendanceLoading(false);
    };

    const updateLine = (
        setter: PayrollLineSetter,
        id: number,
        updates: Partial<PayrollLine>,
    ) => {
        setter((current) => current.map((line) => line.id === id ? { ...line, ...updates } : line));
        setTotals(null);
    };

    const addLine = (setter: PayrollLineSetter) => {
        setter((current) => [...current, { id: Date.now() + Math.random(), name: '', amount: null }]);
        setTotals(null);
    };

    const calculatePayroll = () => {
        if (basicSalary === null || basicSalary < 0) {
            notification.error({ message: 'Payroll', description: 'Enter a valid basic salary before calculating.' });
            return;
        }
        const incompleteLines = [...earnings, ...deductions].some((line) => (
            !line.name.trim() || line.amount === null || !Number.isFinite(line.amount) || line.amount < 0
        ));
        if (incompleteLines) {
            notification.error({ message: 'Payroll', description: 'Complete or remove each earning and deduction row before calculating.' });
            return;
        }
        const earningsTotal = earnings.reduce((sum, line) => sum + getAmount(line.amount), 0);
        const deductionsTotal = deductions.reduce((sum, line) => sum + getAmount(line.amount), 0);
        const grossSalary = basicSalary + earningsTotal;
        const taxAmount = getAmount(tax);
        setTotals({
            basicSalary,
            earnings: earningsTotal,
            deductions: deductionsTotal,
            grossSalary,
            tax: taxAmount,
            netSalary: grossSalary - deductionsTotal - taxAmount,
        });
    };

    const savePayroll = async () => {
        if (!modalStaff || !totals) {
            notification.error({ message: 'Payroll', description: 'Calculate the payroll before saving.' });
            return;
        }
        const earningDetails = earnings
            .filter((line) => line.name.trim() || getAmount(line.amount) > 0)
            .map(({ name, amount }) => ({ name: name.trim(), amount: getAmount(amount) }));
        const deductionDetails = deductions
            .filter((line) => line.name.trim() || getAmount(line.amount) > 0)
            .map(({ name, amount }) => ({ name: name.trim(), amount: getAmount(amount) }));
        const staffId = getStaffId(modalStaff);
        if (staffId === undefined || staffId === null || staffId === '') {
            notification.error({ message: 'Payroll', description: 'Unable to identify this staff member.' });
            return;
        }

        setSaving(true);
        try {
            const response = await payrollAPI.create({
                staff_id: staffId,
                pay_month: `${year}-${month}`,
                basic_salary: totals.basicSalary,
                allowances: totals.earnings,
                deductions: totals.deductions,
                earning_details: earningDetails,
                deduction_details: deductionDetails,
                gross_salary: totals.grossSalary,
                tax: totals.tax,
                net_salary: totals.netSalary,
                status: 'Generated',
            });
            if ([200, 201].includes(response?.data?.statusCode)) {
                notification.success({
                    message: 'Payroll',
                    description: response.data.message || 'Payroll generated successfully.',
                });
                setModalStaff(null);
                setTotals(null);
                await searchPayroll();
            } else {
                notification.error({
                    message: 'Payroll',
                    description: response?.data?.message || INVALID_MESSAGE,
                });
            }
        } catch (error: any) {
            notification.error({
                message: 'Payroll',
                description: error?.response?.data?.message || INVALID_MESSAGE,
            });
        } finally {
            setSaving(false);
        }
    };

    const markAsPaid = async (record: PayrollRecord) => {
        if (record.id === undefined || record.id === null) {
            notification.error({ message: 'Payroll', description: 'Unable to identify this payroll record.' });
            return;
        }
        setUpdatingPaidId(record.id);
        try {
            const response = await payrollAPI.status(record.id, 'Paid');
            if (response?.data?.statusCode === 200) {
                notification.success({ message: 'Payroll', description: response.data.message || 'Payroll marked as paid.' });
                await searchPayroll();
            } else {
                notification.error({ message: 'Payroll', description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({
                message: 'Payroll',
                description: error?.response?.data?.message || INVALID_MESSAGE,
            });
        } finally {
            setUpdatingPaidId(null);
        }
    };

    const renderLines = (
        title: string,
        lines: PayrollLine[],
        setter: PayrollLineSetter,
    ) => (
        <section className="payroll-editor-panel">
            <header className="payroll-editor-heading">
                <h3>{title}</h3>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addLine(setter)} aria-label={`Add ${title.toLowerCase()}`}>
                    <i className="bi bi-plus-lg" />
                </button>
            </header>
            {lines.length === 0 ? (
                <p className="payroll-empty-lines">No {title.toLowerCase()} added.</p>
            ) : lines.map((line) => (
                <div className="payroll-line" key={line.id}>
                    <Input
                        aria-label={`${title} name`}
                        placeholder={`${title} name`}
                        value={line.name}
                        onChange={(event) => updateLine(setter, line.id, { name: event.target.value })}
                    />
                    <InputNumber
                        aria-label={`${title} amount`}
                        placeholder="Amount"
                        min={0}
                        precision={2}
                        value={line.amount}
                        onChange={(amount) => updateLine(setter, line.id, { amount })}
                    />
                    <button
                        type="button"
                        className="payroll-remove-line"
                        onClick={() => {
                            setter((current) => current.filter((item) => item.id !== line.id));
                            setTotals(null);
                        }}
                        aria-label={`Remove ${title.toLowerCase()}`}
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                </div>
            ))}
        </section>
    );

    const yearOptions = Array.from({ length: 11 }, (_, index) => {
        const optionYear = now.getFullYear() - 5 + index;
        return { value: String(optionYear), label: String(optionYear) };
    });
    const modalStaffPhoto = modalStaff ? getNestedValue(modalStaff, ['photo', 'staff.photo']) : '';

    return (
        <main className="app-main master-page payroll-page">
            <div className="container-fluid">
                <section className="card sms-card">
                    <header className="card-header sms-toolbar">
                        <div className="sms-toolbar-row">
                            <div className="master-title">
                                <span className="master-title-icon"><i className="bi bi-cash-stack" /></span>
                                <span><strong>Payroll</strong><small>Generate and manage staff payroll</small></span>
                            </div>
                            <div className="payroll-filter-toolbar">
                                <div className="payroll-filter">
                                    <label htmlFor="payroll-designation-filter">Designation</label>
                                    <Select
                                        id="payroll-designation-filter"
                                        value={designationId}
                                        options={[
                                            { value: 'all', label: 'All designations' },
                                            ...designations.map((item) => ({ value: String(item.id), label: item.name })),
                                        ]}
                                        loading={designations.length === 0}
                                        onChange={setDesignationId}
                                    />
                                </div>
                                <div className="payroll-filter">
                                    <label htmlFor="payroll-month-filter">Month</label>
                                    <Select id="payroll-month-filter" value={month} options={monthOptions} onChange={setMonth} />
                                </div>
                                <div className="payroll-filter">
                                    <label htmlFor="payroll-year-filter">Year</label>
                                    <Select id="payroll-year-filter" value={year} options={yearOptions} onChange={setYear} />
                                </div>
                                <button type="button" className="btn btn-sm btn-outline-success" onClick={() => void searchPayroll()} disabled={loading}>
                                    <i className="bi bi-search me-1" />{loading ? 'Searching...' : 'Search'}
                                </button>
                                <button type="button" className="btn btn-sm sms-reset-search" onClick={resetFilters} title="Reset filters" aria-label="Reset filters">
                                    <i className="bi bi-arrow-counterclockwise" />
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="payroll-list-heading">
                        <h2>Staff List</h2>
                        <Input
                            className="payroll-search-input"
                            type="search"
                            placeholder="Search staff..."
                            aria-label="Search staff"
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="table master-table payroll-table mb-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Staff ID</th>
                                    <th>Name</th>
                                    {/* <th>Role</th> */}
                                    <th>Department</th>
                                    <th>Designation</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!searched ? (
                                    <tr><td colSpan={9} className="master-empty">Select filters and search to view staff payroll.</td></tr>
                                ) : loading ? (
                                    <tr><td colSpan={9} className="master-empty">Loading payroll records...</td></tr>
                                ) : listedStaff.length === 0 ? (
                                    <tr><td colSpan={9} className="master-empty">No staff records found.</td></tr>
                                ) : listedStaff.map(({ staff: record, payroll }, index) => {
                                    const status = getStatus(payroll);
                                    const staffId = getStaffId(record);
                                    return (
                                        <tr key={String(staffId ?? index)}>
                                            <td>{index + 1}</td>
                                            <td>{getNestedValue(record, ['emp_code', 'employee_code', 'staff_code']) || '-'}</td>
                                            <td>{getStaffName(record)}</td>
                                            {/* <td>{getNestedValue(record, ['role', 'designation.name', 'designation_name']) || '-'}</td> */}
                                            <td>{getMasterName(record, 'department_id', departments, ['department.name', 'department_name'])}</td>
                                            <td>{getMasterName(record, 'designation_id', designations, ['designation.name', 'designation_name'])}</td>
                                            <td>{getNestedValue(record, ['phone', 'mobile', 'staff.phone']) || '-'}</td>
                                            <td>
                                                <span className={`payroll-status payroll-status-${status.toLowerCase().replaceAll(' ', '-')}`}>
                                                    <i
                                                        className={`bi ${status === 'Paid' ? 'bi-check-circle-fill' : status === 'Generated' ? 'bi-file-earmark-check-fill' : 'bi-hourglass-split'} me-1`}
                                                        aria-hidden="true"
                                                    />
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                {status === 'Not Generated' ? (
                                                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => openGenerateModal(record)}>
                                                        <i className="bi bi-calculator me-1" aria-hidden="true" />
                                                        Generate Payroll
                                                    </button>
                                                ) : status === 'Generated' && payroll ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-success"
                                                        disabled={updatingPaidId === payroll.id}
                                                        onClick={() => void markAsPaid(payroll)}
                                                    >
                                                        <i className={`bi ${updatingPaidId === payroll.id ? 'bi-arrow-repeat' : 'bi-cash-coin'} me-1`} aria-hidden="true" />
                                                        {updatingPaidId === payroll.id ? 'Updating...' : 'Mark Paid'}
                                                    </button>
                                                ) : <span className="text-muted">-</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <Modal
                centered
                open={Boolean(modalStaff)}
                onCancel={closeGenerateModal}
                destroyOnHidden
                footer={null}
                width={1100}
                className="payroll-generate-modal"
                title="Generate Payroll"
            >
                {modalStaff && (
                    <div className="payroll-modal-content">
                        <div className="payroll-modal-top">
                            <section className="payroll-staff-summary">
                                <img
                                    className="payroll-staff-photo"
                                    src={typeof modalStaffPhoto === 'string' && modalStaffPhoto.trim()
                                        ? new URL(modalStaffPhoto, BACKEND_BASE_URL).toString()
                                        : noImage}
                                    alt={`${getStaffName(modalStaff)} profile`}
                                    onError={(event) => {
                                        event.currentTarget.onerror = null;
                                        event.currentTarget.src = noImage;
                                    }}
                                />
                                <div className="payroll-staff-details">
                                    <div className="payroll-staff-info-column">
                                        <div><strong>Name</strong><span>{getStaffName(modalStaff)}</span></div>
                                        <div><strong>Staff ID</strong><span>{getNestedValue(modalStaff, ['emp_code', 'employee_code', 'staff_code']) || getStaffId(modalStaff) || '-'}</span></div>
                                        <div><strong>Phone</strong><span>{getNestedValue(modalStaff, ['phone', 'mobile']) || '-'}</span></div>
                                        <div><strong>Email</strong><span>{getNestedValue(modalStaff, ['email']) || '-'}</span></div>
                                    </div>
                                    <div className="payroll-staff-info-column">
                                        <div><strong>EPF No</strong><span>{getNestedValue(modalStaff, ['epf_no']) || '-'}</span></div>
                                        <div><strong>Basic Salary</strong><span>{getNestedValue(modalStaff, ['basic_salary']) || '-'}</span></div>
                                        <div><strong>Department</strong><span>{getMasterName(modalStaff, 'department_id', departments, ['department.name', 'department_name'])}</span></div>
                                        <div><strong>Designation</strong><span>{getMasterName(modalStaff, 'designation_id', designations, ['designation.name', 'designation_name'])}</span></div>
                                    </div>
                                </div>
                            </section>
                            <section className="payroll-attendance-panel">
                                <h3>ATTENDANCE</h3>
                                {attendanceLoading ? (
                                    <div className="payroll-attendance-loading">Loading attendance...</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-sm payroll-attendance-table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Month</th>
                                                    <th title="Present">P</th>
                                                    <th title="Late">L</th>
                                                    <th title="Absent">A</th>
                                                    <th title="Half Day">F</th>
                                                    <th title="Holiday">H</th>
                                                    <th title="Vacation">V</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceMonths.map(({ label, year: attendanceYear, counts }) => (
                                                    <tr key={`${attendanceYear}-${label}`}>
                                                        <td>{label}{attendanceYear !== Number(year) ? ` ${attendanceYear}` : ''}</td>
                                                        <td>{counts.present}</td>
                                                        <td>{counts.late}</td>
                                                        <td>{counts.absent}</td>
                                                        <td>{counts.halfDay}</td>
                                                        <td>{counts.holiday}</td>
                                                        <td>{counts.vacation}</td>
                                                    </tr>
                                                ))}
                                                {!attendanceMonths.length && (
                                                    <tr><td colSpan={7}>Attendance unavailable.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        </div>

                        <div className="payroll-calculation-grid">
                            {renderLines('Earning', earnings, setEarnings)}
                            {renderLines('Deduction', deductions, setDeductions)}
                            <section className="payroll-editor-panel payroll-summary-panel">
                                <header className="payroll-editor-heading">
                                    <h3>Payroll Summary</h3>
                                    <button type="button" className="btn btn-sm btn-outline-info" onClick={calculatePayroll}>
                                        <i className="bi bi-calculator me-1" />Calculate
                                    </button>
                                </header>
                                <label className="payroll-summary-input">
                                    <span>Basic Salary</span>
                                    <InputNumber min={0} precision={2} value={basicSalary} onChange={(value) => { setBasicSalary(value); setTotals(null); }} />
                                </label>
                                <label className="payroll-summary-input payroll-tax-input">
                                    <span>Tax</span>
                                    <InputNumber min={0} precision={2} value={tax} onChange={(value) => { setTax(value); setTotals(null); }} />
                                </label>
                                {totals ? (
                                    <>
                                        <div className="payroll-total-row"><span>Earning</span><strong>{formatMoney(totals.earnings)}</strong></div>
                                        <div className="payroll-total-row payroll-deduction-value"><span>Deduction</span><strong>{formatMoney(totals.deductions)}</strong></div>
                                        <div className="payroll-total-row"><span>Gross Salary</span><strong>{formatMoney(totals.grossSalary)}</strong></div>
                                        <div className="payroll-total-row payroll-net-value"><span>Net Salary</span><strong>{formatMoney(totals.netSalary)}</strong></div>
                                    </>
                                ) : (
                                    <div className="payroll-summary-placeholder" role="status">
                                        <i className="bi bi-info-circle-fill" aria-hidden="true" />
                                        <span>Review the salary, earnings, and deductions, then click <strong>Calculate</strong> to view the payroll totals.</span>
                                    </div>
                                )}
                            </section>
                        </div>
                        <footer className="payroll-modal-actions">
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={closeGenerateModal} disabled={saving}>Cancel</button>
                            <button type="button" className="btn btn-sm btn-outline-success" onClick={() => void savePayroll()} disabled={saving || !totals}>
                                {saving ? 'Saving...' : 'Save Payroll'}
                            </button>
                        </footer>
                    </div>
                )}
            </Modal>
        </main>
    );
}
