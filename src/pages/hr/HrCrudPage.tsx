import { useCallback, useEffect, useRef, useState } from 'react';
import { downloadExcel } from 'react-export-table-to-excel';
import { Form, Input, Modal, Pagination, Select, Switch, notification } from 'antd';
import { BACKEND_BASE_URL, INVALID_MESSAGE, DISPLAY_DATE } from '../../constants';
import { leaveTypeAPI, staffDirectoryAPI } from '../../services/apis';
import defaultFemale from '../../assets/images/default_female.jpg';
import defaultMale from '../../assets/images/default_male.jpg';
import './HrCrudPage.css';
import HrStaffProfileModal from './HrStaffProfileModal';

export type HrField = {
    name: string;
    label: string;
    type?: 'text' | 'number' | 'date' | 'time' | 'url' | 'textarea' | 'select';
    options?: string[];
    displayName?: string;
    withAvatar?: boolean;
    required?: boolean;
    displayOnly?: boolean;
    formHidden?: boolean;
    computed?: 'dateRangeDays';
};

type HrStatusValue = string | number;

export type HrApi = {
    list: (payload: object) => Promise<any>;
    create: (payload: object) => Promise<any>;
    update: (payload: object) => Promise<any>;
    status: (id: number | string, status: HrStatusValue) => Promise<any>;
    remove: (id: number | string) => Promise<any>;
};

export type HrPageConfig = {
    title: string;
    singular: string;
    icon: string;
    api: HrApi;
    fields: HrField[];
    statuses: string[];
    statusField?: string;
    statusSwitch?: { on: HrStatusValue; off: HrStatusValue; onLabel?: string; offLabel?: string };
    staffProfile?: boolean;
    leaveRequestForm?: boolean;
    currentUserStaffId?: boolean;
};

type HrRecord = Record<string, unknown> & { id: number | string };
type PaginationData = { perPage?: number; totalRecords?: number };
type FormOption = { value: number | string; label: string };

const getCurrentUserId = () => {
    const currentUserValue = window.localStorage.getItem('CURRENT_USER');
    const currentUser: unknown = currentUserValue ? JSON.parse(currentUserValue) : null;
    const currentUserId = currentUser !== null && typeof currentUser === 'object'
        ? (currentUser as Record<string, unknown>).id
        : undefined;
    if ((typeof currentUserId !== 'number' && typeof currentUserId !== 'string') || currentUserId === '') {
        throw new Error('Unable to identify the logged-in staff member. Please sign in again.');
    }
    return currentUserId;
};

export default function HrCrudPage({
    config,
    onAdd,
    onEdit,
}: {
    config: HrPageConfig;
    onAdd?: () => void;
    onEdit?: (record: HrRecord) => void;
}) {
    const [records, setRecords] = useState<HrRecord[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<HrRecord | null>(null);
    const [profileTarget, setProfileTarget] = useState<HrRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<HrRecord | null>(null);
    const [staffOptions, setStaffOptions] = useState<FormOption[]>([]);
    const [leaveTypeOptions, setLeaveTypeOptions] = useState<FormOption[]>([]);
    const [formOptionsLoading, setFormOptionsLoading] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestId = useRef(0);
    const [form] = Form.useForm();
    const showStaffField = config.fields.some((field) => field.name === 'staff_id' && !field.formHidden);

    useEffect(() => {
        if (!config.leaveRequestForm) return;
        let active = true;

        const loadOptions = async (list: HrApi['list'], label: string, staffList = false) => {
            const response = await list({ page: 1, keyword: 'all' });
            if (response?.data?.statusCode !== 200 || !Array.isArray(response.data.data)) {
                throw new Error(response?.data?.message || `Unable to load ${label.toLowerCase()}.`);
            }

            return response.data.data.flatMap((record: HrRecord) => {
                const fullName = [record.first_name, record.last_name]
                    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
                    .join(' ');
                const name = staffList
                    ? record.full_name ?? fullName ?? record.name
                    : record.name ?? record.leave_type ?? record.title;
                return record.id !== undefined && name
                    ? [{ value: record.id, label: String(name) }]
                    : [];
            });
        };

        const loadLeaveOptions = async () => {
            setFormOptionsLoading(true);
            try {
                const [staff, leaveTypes] = await Promise.all([
                    showStaffField ? loadOptions(staffDirectoryAPI.list, 'staff', true) : Promise.resolve([]),
                    loadOptions(leaveTypeAPI.list, 'leave types'),
                ]);
                if (!active) return;
                setStaffOptions(staff);
                setLeaveTypeOptions(leaveTypes);
            } catch (error: any) {
                if (active) {
                    notification.error({
                        message: config.singular,
                        description: error?.response?.data?.message || error?.message || INVALID_MESSAGE,
                    });
                }
            } finally {
                if (active) setFormOptionsLoading(false);
            }
        };

        void loadLeaveOptions();
        return () => {
            active = false;
        };
    }, [config.leaveRequestForm, config.singular, showStaffField]);

    const loadRecords = useCallback(async (nextPage = 1, keyword = '') => {
        const currentRequest = ++requestId.current;
        try {
            const response = await config.api.list({
                page: nextPage,
                ...(keyword ? { keyword } : {}),
                ...(config.currentUserStaffId ? { staff_id: getCurrentUserId() } : {}),
            });
            if (currentRequest !== requestId.current) return;
            if (response?.data?.statusCode === 200) {
                setRecords(response.data.data || []);
                setPagination(response.data.pagination || {});
                setPage(nextPage);
            } else {
                notification.error({ message: config.title, description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            if (currentRequest === requestId.current) {
                notification.error({ message: config.title, description: error?.response?.data?.message || error?.message || INVALID_MESSAGE });
            }
        } finally {
            if (currentRequest === requestId.current) setLoading(false);
        }
    }, [config]);

    const refreshRecords = useCallback(async (nextPage = 1, keyword = '') => {
        setLoading(true);
        await loadRecords(nextPage, keyword);
    }, [loadRecords]);

    useEffect(() => {
        void loadRecords();
        return () => {
            requestId.current += 1;
            if (searchTimer.current) clearTimeout(searchTimer.current);
        };
    }, [loadRecords]);

    const search = () => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            void refreshRecords(1, searchRef.current?.value.trim() || '');
        }, 300);
    };

    const resetSearch = () => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        if (searchRef.current) searchRef.current.value = '';
        void refreshRecords(1);
    };

    const openCreate = () => {
        setEditing(null);
        form.resetFields();
        form.setFieldValue('status', config.statuses[0]);
        setModalOpen(true);
    };

    const openEdit = (record: HrRecord) => {
        setEditing(record);
        form.setFieldsValue(Object.fromEntries([
            ...config.fields.filter(({ displayOnly, formHidden }) => !displayOnly && !formHidden).map(({ name }) => {
                if (config.leaveRequestForm && name === 'staff_id') {
                    const staff = record.staff as Record<string, unknown> | undefined;
                    return [name, record.staff_id ?? staff?.id ?? ''];
                }
                if (config.leaveRequestForm && name === 'leave_type_id') {
                    const leaveType = record.leave_type as Record<string, unknown> | undefined;
                    return [name, record.leave_type_id ?? leaveType?.id ?? ''];
                }
                return [name, record[name] ?? ''];
            }),
            ['status', record.status ?? config.statuses[0]],
        ]));
        setModalOpen(true);
    };

    const save = async (values: Record<string, string | number>) => {
        setSaving(true);
        try {
            const createPayload = { ...values };
            if (!editing && config.currentUserStaffId) {
                createPayload.staff_id = getCurrentUserId();
            }
            const response = editing
                ? await config.api.update({ ...values, id: editing.id })
                : await config.api.create(createPayload);
            if ([200, 201].includes(response?.data?.statusCode)) {
                notification.success({ message: config.singular, description: response.data.message });
                setModalOpen(false);
                await refreshRecords(page, searchRef.current?.value.trim() || '');
            } else {
                notification.error({ message: config.singular, description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: config.singular, description: error?.response?.data?.message || error?.message || INVALID_MESSAGE });
        } finally {
            setSaving(false);
        }
    };

    const updateStatus = async (record: HrRecord, status: HrStatusValue) => {
        try {
            notification.destroy();
            const response = await config.api.status(record.id, status);
            if (response?.data?.statusCode === 200) {
                await refreshRecords(page, searchRef.current?.value.trim() || '');
                notification.success({ message: config.singular, description: response.data.message });
            } else {
                notification.error({ message: config.singular, description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: config.singular, description: error?.response?.data?.message || INVALID_MESSAGE });
        }
    };

    const remove = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const response = await config.api.remove(deleteTarget.id);
            if (response?.data?.statusCode === 200) {
                notification.success({ message: config.singular, description: response.data.message });
                setDeleteTarget(null);
                await refreshRecords(page, searchRef.current?.value.trim() || '');
            } else {
                notification.error({ message: config.singular, description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: config.singular, description: error?.response?.data?.message || INVALID_MESSAGE });
        } finally {
            setDeleting(false);
        }
    };

    const exportRecords = () => {
        if (records.length === 0) return;
        setExporting(true);
        try {
            downloadExcel({
                fileName: config.title.toLowerCase().replaceAll(' ', '-'),
                sheet: config.title,
                tablePayload: {
                    header: [...config.fields.map((field) => field.label), 'Status'],
                    body: records.map((record) => [
                        ...config.fields.map((field) => String(fieldValue(record, field) ?? '')),
                        String(record[statusField] ?? ''),
                    ]),
                },
            });
        } finally {
            setExporting(false);
        }
    };

    const displayValue = (value: unknown) => value === null || value === undefined || value === '' ? '-' : String(value);
    const fieldValue = (record: HrRecord, field: HrField) => {
        if (field.computed === 'dateRangeDays') {
            const startDate = record.start_date;
            const endDate = record.end_date;
            if (typeof startDate !== 'string' || typeof endDate !== 'string') return undefined;
            const toUtcDays = (date: string) => {
                const datePart = date.slice(0, 10);
                if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return undefined;
                const timestamp = Date.parse(`${datePart}T00:00:00Z`);
                return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === datePart
                    ? Math.floor(timestamp / 86_400_000)
                    : undefined;
            };
            const start = toUtcDays(startDate);
            const end = toUtcDays(endDate);
            return start === undefined || end === undefined || end < start ? undefined : end - start + 1;
        }
        if (!field.displayName) return record[field.name];
        const value = field.displayName.split('.').reduce<unknown>((current, key) => (
            current !== null && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined
        ), record);
        return value;
    };
    const displayFieldValue = (record: HrRecord, field: HrField) => {
        const value = fieldValue(record, field);
        return field.type === 'date' && typeof value === 'string' && value
            ? DISPLAY_DATE(value.slice(0, 10))
            : displayValue(value);
    };
    const genderMarker = (record: HrRecord) => {
        const gender = String(record.gender ?? '').trim().toLowerCase();
        return gender === 'male' ? 'M' : gender === 'female' ? 'F' : '';
    };
    const avatarFallback = (record: HrRecord) => genderMarker(record) === 'F' ? defaultFemale : defaultMale;
    const avatarSource = (record: HrRecord) => {
        const photo = record.photo;
        return typeof photo === 'string' && photo.trim() ? new URL(photo, BACKEND_BASE_URL).toString() : avatarFallback(record);
    };
    const statusSwitch = config.statusSwitch;
    const statusField = config.statusField || 'status';
    const isStatusOn = (record: HrRecord) => statusSwitch !== undefined && String(record[statusField]) === String(statusSwitch.on);
    const changeSwitchStatus = (record: HrRecord, checked: boolean) => {
        if (statusSwitch) void updateStatus(record, checked ? statusSwitch.on : statusSwitch.off);
    };

    return (
        <main className="app-main master-page">
            <div className="container-fluid">
                <section className="card sms-card">
                    <header className="card-header sms-toolbar">
                        <div className="sms-toolbar-row">
                            <div className="master-title">
                                <span className="master-title-icon"><i className={`bi ${config.icon}`} /></span>
                                <span><strong>{config.title}</strong><small>Manage {config.title.toLowerCase()} records</small></span>
                            </div>
                            <div className="sms-toolbar-controls">
                                <div className="input-group input-group-sm sms-search">
                                    <input
                                        type="search"
                                        ref={searchRef}
                                        className="form-control"
                                        placeholder={`Search ${config.title.toLowerCase()}`}
                                        aria-label={`Search ${config.title.toLowerCase()}`}
                                        onKeyDown={(event) => event.key === 'Enter' && search()}
                                    />
                                    <button type="button" className="input-group-text" onClick={search} aria-label="Search">
                                        <i className="bi bi-search" />
                                    </button>
                                </div>
                                <button type="button" className="btn btn-sm sms-reset-search" onClick={resetSearch} title="Reset search" aria-label="Reset search">
                                    <i className="bi bi-arrow-counterclockwise" />
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={exportRecords} disabled={exporting || records.length === 0}>
                                    <i className="bi bi-cloud-download me-1" />{exporting ? 'Exporting...' : 'Export Records'}
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-success fw-medium" onClick={onAdd || openCreate}>
                                    <i className="bi bi-plus-lg" /> New {config.singular}
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="table-responsive">
                        <table className="table master-table mb-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    {config.fields.map((field) => <th key={field.name}>{field.label}</th>)}
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={config.fields.length + 3} className="master-empty">Loading records...</td></tr>
                                ) : records.length === 0 ? (
                                    <tr><td colSpan={config.fields.length + 3} className="master-empty">No records found.</td></tr>
                                ) : records.map((record, index) => (
                                    <tr key={record.id}>
                                        <td>{(page - 1) * (pagination.perPage || 10) + index + 1}</td>
                                        {config.fields.map((field) => (
                                            <td key={field.name}>
                                                {field.withAvatar ? (
                                                    <button
                                                        type="button"
                                                        className="hr-profile-trigger d-flex align-items-center gap-2"
                                                        onClick={() => config.staffProfile && setProfileTarget(record)}
                                                        disabled={!config.staffProfile}
                                                        aria-label={`View profile for ${displayFieldValue(record, field)}`}
                                                    >
                                                        <img
                                                            src={avatarSource(record)}
                                                            alt=""
                                                            className="hr-staff-avatar rounded-circle object-fit-cover flex-shrink-0"
                                                            width={36}
                                                            height={36}
                                                            onError={(event) => {
                                                                event.currentTarget.onerror = null;
                                                                event.currentTarget.src = avatarFallback(record);
                                                            }}
                                                        />
                                                        <span>
                                                            {displayFieldValue(record, field)}
                                                            {genderMarker(record) && ` (${genderMarker(record)})`}
                                                        </span>
                                                    </button>
                                                ) : displayFieldValue(record, field)}
                                            </td>
                                        ))}
                                        <td>
                                            {statusSwitch ? (
                                                <div className="d-flex flex-column align-items-center gap-1">
                                                    <Switch
                                                        size="small"
                                                        checked={isStatusOn(record)}
                                                        onChange={(checked) => changeSwitchStatus(record, checked)}
                                                        aria-label={`Toggle ${config.singular} status`}
                                                    />
                                                    <span className={isStatusOn(record) ? 'text-primary small fw-medium' : 'text-secondary small'}>
                                                        {isStatusOn(record)
                                                            ? statusSwitch.onLabel || statusSwitch.on
                                                            : config.statuses.includes(String(record[statusField]))
                                                                ? String(record[statusField])
                                                                : statusSwitch.offLabel || statusSwitch.off}
                                                    </span>
                                                </div>
                                            ) : (
                                                <Select
                                                    size="small"
                                                    value={String(record[statusField] ?? config.statuses[0])}
                                                    options={config.statuses.map((status) => ({ value: status, label: status }))}
                                                    onChange={(status) => void updateStatus(record, status)}
                                                    aria-label={`Update ${config.singular} status`}
                                                />
                                            )}
                                        </td>
                                        <td className="text-end">
                                            <div className="master-row-actions">
                                                {config.staffProfile && (
                                                    <button type="button" onClick={() => setProfileTarget(record)} title="View profile" aria-label={`View profile for ${String(record.full_name || config.singular)}`}>
                                                        <i className="bi bi-eye" />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => config.staffProfile && onEdit ? onEdit(record) : openEdit(record)}
                                                    title="Edit"
                                                    aria-label={`Edit ${config.singular}`}
                                                >
                                                    <i className="bi bi-pencil" />
                                                </button>
                                                <button type="button" className="danger" onClick={() => setDeleteTarget(record)} title="Delete" aria-label={`Delete ${config.singular}`}>
                                                    <i className="bi bi-trash" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <footer className="sms-pagination-footer">
                        <span className="sms-record-count"><i className="bi bi-list-ul" /> <strong>{pagination.totalRecords ?? records.length}</strong> total records</span>
                        <Pagination
                            size="small"
                            current={page}
                            pageSize={pagination.perPage || 10}
                            total={pagination.totalRecords || records.length}
                            onChange={(nextPage) => void refreshRecords(nextPage, searchRef.current?.value.trim() || '')}
                        />
                    </footer>
                </section>
            </div>
            <Modal
                centered
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                destroyOnHidden
                footer={null}
                width={config.leaveRequestForm ? 720 : undefined}
                className={config.leaveRequestForm ? 'hr-leave-request-modal' : undefined}
                title={`${editing ? 'Edit' : 'Create'} ${config.singular}`}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={save}
                    className={`master-form${config.leaveRequestForm ? ' hr-leave-request-form' : ''}`}
                >
                    {config.fields.filter(({ displayOnly, formHidden }) => !displayOnly && !formHidden).map((field) => {
                        const required = field.required !== false;
                        const dateRules = config.leaveRequestForm && (field.name === 'start_date' || field.name === 'end_date')
                            ? [
                                { required, message: `Select ${field.label.toLowerCase()}` },
                                {
                                    validator: async (_: unknown, value: string) => {
                                        const fromDate = field.name === 'start_date' ? value : form.getFieldValue('start_date');
                                        const toDate = field.name === 'end_date' ? value : form.getFieldValue('end_date');
                                        if (fromDate && toDate && fromDate > toDate) {
                                            throw new Error('To Date must be the same as or later than From Date.');
                                        }
                                    },
                                },
                            ]
                            : undefined;
                        const rules = dateRules || [{
                            required,
                            message: field.type === 'select'
                                ? `Select ${field.label.toLowerCase()}`
                                : `Enter ${field.label.toLowerCase()}`,
                        }];
                        const options = config.leaveRequestForm && field.name === 'staff_id'
                            ? staffOptions
                            : config.leaveRequestForm && field.name === 'leave_type_id'
                                ? leaveTypeOptions
                                : (field.options || []).map((option) => ({ value: option, label: option }));

                        return (
                            <Form.Item
                                key={field.name}
                                name={field.name}
                                label={field.label}
                                rules={rules}
                                dependencies={dateRules ? ['start_date', 'end_date'] : undefined}
                            >
                            {field.type === 'textarea' ? (
                                <Input.TextArea rows={3} />
                            ) : field.type === 'select' ? (
                                <Select
                                    options={options}
                                    loading={config.leaveRequestForm && (field.name === 'staff_id' || field.name === 'leave_type_id') ? formOptionsLoading : false}
                                    showSearch
                                    optionFilterProp="label"
                                />
                            ) : (
                                <Input type={field.type || 'text'} />
                            )}
                            </Form.Item>
                        );
                    })}
                    <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Select status' }]}>
                        <Select options={config.statuses.map((status) => ({ value: status, label: status }))} />
                    </Form.Item>
                    <div className="master-form-actions">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-sm btn-outline-success" disabled={saving}>
                            {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </Form>
            </Modal>
            <HrStaffProfileModal
                record={profileTarget}
                onClose={() => setProfileTarget(null)}
            />
            <Modal
                centered
                open={Boolean(deleteTarget)}
                onCancel={() => setDeleteTarget(null)}
                destroyOnHidden
                footer={null}
                title={`Delete ${config.singular.toLowerCase()}`}
            >
                <div className="master-delete">
                    <i className="bi bi-trash3-fill" />
                    <p>Delete this {config.singular.toLowerCase()} record? This action cannot be undone.</p>
                    <div className="master-form-actions">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => void remove()} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </div>
                </div>
            </Modal>
        </main>
    );
}
