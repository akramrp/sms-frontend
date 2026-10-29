import { useCallback, useEffect, useRef, useState } from 'react';
import { downloadExcel } from 'react-export-table-to-excel';
import { Form, Input, Modal, Pagination, Radio, Switch, notification } from 'antd';
import { INVALID_MESSAGE } from '../../constants';
import { subjectCreateAPI, subjectDeleteAPI, subjectListAPI, subjectStatusAPI, subjectUpdateAPI, } from '../../services/apis';
type SubjectType = 'Theory' | 'Practical';

type SubjectRecord = {
    id: number;
    name?: string;
    code?: string;
    type?: SubjectType;
    is_active?: number | string;
};

type PaginationData = {
    perPage?: number;
    totalRecords?: number;
};

export default function Subjects() {
    const [records, setRecords] = useState<SubjectRecord[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<SubjectRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SubjectRecord | null>(null);
    const [deleting, setDeleting] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const requestId = useRef(0);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [form] = Form.useForm();

    const loadRecords = useCallback(async (nextPage = 1, keyword = '') => {
        const currentRequest = ++requestId.current;
        try {
            const response = await subjectListAPI({ page: nextPage, ...(keyword ? { keyword } : {}) });
            if (currentRequest !== requestId.current) return;
            if (response?.data?.statusCode === 200) {
                setRecords(response.data.data || []);
                setPagination(response.data.pagination || {});
                setPage(nextPage);
            } else {
                notification.error({ message: 'Subjects', description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            if (currentRequest === requestId.current) {
                notification.error({ message: 'Subjects', description: error?.response?.data?.message || INVALID_MESSAGE });
            }
        } finally {
            if (currentRequest === requestId.current) setLoading(false);
        }
    }, []);

    const refreshRecords = useCallback(async (nextPage = 1, keyword = '') => {
        setLoading(true);
        await loadRecords(nextPage, keyword);
    }, [loadRecords]);

    useEffect(() => {
        void loadRecords();
        return () => {
            if (searchTimer.current) clearTimeout(searchTimer.current);
            requestId.current += 1;
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
        form.setFieldValue('is_active', 1);
        form.setFieldValue('type', 'Theory');
        setModalOpen(true);
    };

    const openEdit = (record: SubjectRecord) => {
        setEditing(record);
        form.setFieldsValue({
            name: record.name,
            code: record.code,
            type: record.type,
            is_active: record.is_active == 1 || record.is_active === '1' ? 1 : 0,
        });
        setModalOpen(true);
    };

    const save = async (values: { name: string; code: string; type: SubjectType; is_active: number }) => {
        setSaving(true);
        try {
            const response = editing
                ? await subjectUpdateAPI({ ...values, id: editing.id })
                : await subjectCreateAPI(values);
            if ([200, 201].includes(response?.data?.statusCode)) {
                notification.success({ message: 'Subject', description: response.data.message });
                setModalOpen(false);
                await refreshRecords(page, searchRef.current?.value.trim() || '');
            } else {
                notification.error({ message: 'Subject', description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: 'Subject', description: error?.response?.data?.message || INVALID_MESSAGE });
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (record: SubjectRecord) => {
        const status = record.is_active == 1 || record.is_active === '1' ? 0 : 1;
        try {
            const response = await subjectStatusAPI(record.id, status);
            if (response?.data?.statusCode === 200) {
                await refreshRecords(page, searchRef.current?.value.trim() || '');
            } else {
                notification.error({ message: 'Subject', description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: 'Subject', description: error?.response?.data?.message || INVALID_MESSAGE });
        }
    };

    const remove = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const response = await subjectDeleteAPI(deleteTarget.id);
            if (response?.data?.statusCode === 200) {
                notification.success({ message: 'Subject', description: response.data.message });
                setDeleteTarget(null);
                await refreshRecords(page, searchRef.current?.value.trim() || '');
            } else {
                notification.error({ message: 'Subject', description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: 'Subject', description: error?.response?.data?.message || INVALID_MESSAGE });
        } finally {
            setDeleting(false);
        }
    };

    const exportRecords = () => {
        if (records.length === 0) return;
        setExporting(true);
        try {
            downloadExcel({
                fileName: 'subjects',
                sheet: 'Subjects',
                tablePayload: {
                    header: ['Name', 'Code', 'Type', 'Status'],
                    body: records.map((record) => [
                        record.name || '',
                        record.code || '',
                        record.type || '',
                        record.is_active == 1 || record.is_active === '1' ? 'Active' : 'Inactive',
                    ]),
                },
            });
        } finally {
            setExporting(false);
        }
    };

    return (
        <main className="app-main master-page">
            <div className="container-fluid">
                <section className="card sms-card">
                    <header className="card-header sms-toolbar">
                        <div className="sms-toolbar-row">
                            <div className="master-title">
                                <span className="master-title-icon"><i className="bi bi-journal-bookmark-fill" /></span>
                                <span><strong>Subjects</strong><small>Manage subjects and access data</small></span>
                            </div>
                            <div className="sms-toolbar-controls">
                                <div className="input-group input-group-sm sms-search">
                                    <input
                                        type="search"
                                        ref={searchRef}
                                        className="form-control"
                                        placeholder="Search subjects"
                                        aria-label="Search subjects"
                                        onKeyDown={(event) => event.key === 'Enter' && search()}
                                    />
                                    <button type="button" className="input-group-text" onClick={search} aria-label="Search subjects">
                                        <i className="bi bi-search" />
                                    </button>
                                </div>
                                <button type="button" className="btn btn-sm sms-reset-search" onClick={resetSearch} title="Reset search" aria-label="Reset search">
                                    <i className="bi bi-arrow-counterclockwise" />
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={exportRecords} disabled={exporting || records.length === 0}>
                                    <i className="bi bi-cloud-download me-1" />{exporting ? 'Exporting...' : 'Export Records'}
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-success" onClick={openCreate}>
                                    <i className="bi bi-plus-lg" /> New Subject
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="table-responsive">
                        <table className="table master-table mb-0">
                            <thead>
                                <tr><th>#</th><th>Name</th><th>Code</th><th>Type</th><th>Status</th><th className="text-end">Actions</th></tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="master-empty">Loading records...</td></tr>
                                ) : records.length === 0 ? (
                                    <tr><td colSpan={6} className="master-empty">No records found.</td></tr>
                                ) : records.map((record, index) => (
                                    <tr key={record.id}>
                                        <td>{(page - 1) * (pagination.perPage || 10) + index + 1}</td>
                                        <td className="master-name">{record.name || '-'}</td>
                                        <td>{record.code || '-'}</td>
                                        <td>{record.type || '-'}</td>
                                        <td>
                                            <Switch
                                                size="small"
                                                checked={record.is_active == 1 || record.is_active === '1'}
                                                onChange={() => void toggleStatus(record)}
                                                aria-label={`Toggle ${record.name || 'subject'} status`}
                                            />
                                        </td>
                                        <td className="text-end">
                                            <div className="master-row-actions">
                                                <button type="button" onClick={() => openEdit(record)} title="Edit" aria-label={`Edit ${record.name || 'subject'}`}>
                                                    <i className="bi bi-pencil" />
                                                </button>
                                                <button type="button" className="danger" onClick={() => setDeleteTarget(record)} title="Delete" aria-label={`Delete ${record.name || 'subject'}`}>
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
                title={`${editing ? 'Edit' : 'Create'} Subject`}
                width="32%"
            >
                <Form form={form} layout="vertical" onFinish={save} className="master-form">
                    <div className="row">
                        <div className='col-6'>
                            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter subject name' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Select subject type' }]}>
                                <Radio.Group><Radio value="Theory">Theory</Radio><Radio value="Practical">Practical</Radio></Radio.Group>
                            </Form.Item>
                        </div>
                        <div className='col-6'>
                            <Form.Item name="code" label="Code" rules={[{ required: true, message: 'Enter subject code' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="is_active" label="Status" rules={[{ required: true, message: 'Select status' }]}>
                                <Radio.Group><Radio value={1}>Active</Radio><Radio value={0}>Inactive</Radio></Radio.Group>
                            </Form.Item>
                        </div>
                    </div>
                    <div className="master-form-actions">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </Form>
            </Modal>
            <Modal
                centered
                open={Boolean(deleteTarget)}
                onCancel={() => setDeleteTarget(null)}
                destroyOnHidden
                footer={null}
                title="Delete subject"
            >
                <div className="master-delete">
                    <i className="bi bi-trash3-fill" />
                    <p>Delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.</p>
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