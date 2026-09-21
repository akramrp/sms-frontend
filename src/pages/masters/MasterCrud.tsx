import { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { Form, Input, Modal, Pagination, Radio, Switch, notification } from 'antd';
import { COLOR_BGFN, INVALID_MESSAGE } from '../../constants';
import {
    departmentCreateAPI,
    departmentDeleteAPI,
    departmentListAPI,
    departmentStatusAPI,
    departmentUpdateAPI,
    designationCreateAPI,
    designationDeleteAPI,
    designationListAPI,
    designationStatusAPI,
    designationUpdateAPI,
} from '../../services/apis';
import './MasterCrud.css';

type MasterKind = 'department' | 'designation';
type MasterRecord = { id: number; name?: string; code?: string; description?: string; is_active?: number | string };

type MasterConfig = {
    kind: MasterKind;
    title: string;
    singular: string;
    icon: string;
    list: (payload: object) => Promise<any>;
    create: (payload: object) => Promise<any>;
    update: (payload: object) => Promise<any>;
    status: (id: number) => Promise<any>;
    remove: (id: number) => Promise<any>;
};

const configs: Record<MasterKind, MasterConfig> = {
    department: {
        kind: 'department', title: 'Departments', singular: 'Department', icon: 'bi-diagram-3-fill',
        list: departmentListAPI, create: departmentCreateAPI, update: departmentUpdateAPI,
        status: departmentStatusAPI, remove: departmentDeleteAPI,
    },
    designation: {
        kind: 'designation', title: 'Designations', singular: 'Designation', icon: 'bi-person-badge-fill',
        list: designationListAPI, create: designationCreateAPI, update: designationUpdateAPI,
        status: designationStatusAPI, remove: designationDeleteAPI,
    },
};

export default function MasterCrud({ kind }: { kind: MasterKind }) {
    const config = configs[kind];
    const [records, setRecords] = useState<MasterRecord[]>([]);
    const [pagination, setPagination] = useState<Record<string, number>>({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<MasterRecord | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<MasterRecord | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const requestId = useRef(0);
    const searchRefDebounced = useRef<ReturnType<typeof debounce> | null>(null);
    const [form] = Form.useForm();

    const loadRecords = useCallback(async (nextPage = 1, keyword = '') => {
        const currentRequest = ++requestId.current;
        setLoading(true);
        try {
            const response = await config.list({ page: nextPage, ...(keyword ? { keyword } : {}) });
            if (currentRequest !== requestId.current) return;
            if (response?.data?.statusCode === 200) {
                setRecords(response.data.data || []);
                setPagination(response.data.pagination || {});
                setPage(nextPage);
            } else {
                notification.error({ message: config.singular, description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: config.singular, description: error?.response?.data?.message || INVALID_MESSAGE });
        } finally {
            if (currentRequest === requestId.current) setLoading(false);
        }
    }, [config]);

    useEffect(() => {
        loadRecords();
        return () => searchRefDebounced.current?.cancel();
    }, [loadRecords]);

    const search = () => {
        searchRefDebounced.current?.cancel();
        searchRefDebounced.current = debounce(() => {
            const keyword = searchRef.current?.value.trim() || '';
            loadRecords(1, keyword);
        }, 300);
        searchRefDebounced.current();
    };

    const resetSearch = () => {
        searchRefDebounced.current?.cancel();
        if (searchRef.current) searchRef.current.value = '';
        loadRecords(1);
    };

    const openCreate = () => {
        setEditing(null);
        form.resetFields();
        form.setFieldValue('is_active', 1);
        setModalOpen(true);
    };

    const openEdit = (record: MasterRecord) => {
        setEditing(record);
        form.setFieldsValue({ name: record.name, code: record.code, description: record.description, is_active: record.is_active == 1 || record.is_active === '1' ? 1 : 0 });
        setModalOpen(true);
    };

    const save = async (values: Record<string, string | number>) => {
        setSaving(true);
        try {
            const response = editing ? await config.update({ ...values, id: editing.id }) : await config.create(values);
            if ([200, 201].includes(response?.data?.statusCode)) {
                notification.success({ message: config.singular, description: response.data.message });
                setModalOpen(false);
                await loadRecords(page, searchRef.current?.value.trim() || '');
            } else {
                notification.error({ message: config.singular, description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: config.singular, description: error?.response?.data?.message || INVALID_MESSAGE });
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (id: number) => {
        try {
            const response = await config.status(id);
            if (response?.data?.statusCode === 200) 
                await loadRecords(page, searchRef.current?.value.trim() || '');
            else 
                notification.error({ message: config.singular, description: response?.data?.message || INVALID_MESSAGE });
        } catch (error: any) {
            notification.error({ message: config.singular, description: error?.response?.data?.message || INVALID_MESSAGE });
        }
    };

    const remove = async () => {
        if (!deleteTarget) return;
        try {
            const response = await config.remove(deleteTarget.id);
            if (response?.data?.statusCode === 200) {
                notification.success({ message: config.singular, description: response.data.message });
                setDeleteTarget(null);
                await loadRecords(page, searchRef.current?.value.trim() || '');
            } else notification.error({ message: config.singular, description: response?.data?.message || INVALID_MESSAGE });
        } catch (error: any) {
            notification.error({ message: config.singular, description: error?.response?.data?.message || INVALID_MESSAGE });
        }
    };

    return (
        <main className="app-main master-page">
            <div className="container-fluid">
                <section className="master-card">
                    <header className="master-toolbar">
                        <div className="master-title"><span className="master-title-icon"><i className={`bi ${config.icon}`} /></span><span><strong>{config.title}</strong><small>Manage {config.title.toLowerCase()} and access data</small></span></div>
                        <div className="master-actions">
                            <div className="master-search"><i className="bi bi-search" /><input ref={searchRef} placeholder={`Search ${config.title.toLowerCase()}`} onKeyDown={(event) => event.key === 'Enter' && search()} /><button type="button" onClick={search} aria-label="Search"><i className="bi bi-arrow-right" /></button></div>
                            <button type="button" className="master-reset" onClick={resetSearch} title="Reset search"><i className="bi bi-arrow-counterclockwise" /></button>
                            <button type="button" className="btn btn-sm master-create" onClick={openCreate}><i className="bi bi-plus-lg" /> New {config.singular}</button>
                        </div>
                    </header>
                    <div className="table-responsive">
                        <table className="table master-table mb-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>About</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? <tr><td colSpan={6} className="master-empty">Loading records...</td></tr> : records.length === 0 ? <tr><td colSpan={6} className="master-empty">No records found.</td></tr> : records.map((record, index) => (
                                    <tr key={record.id}>
                                        <td>{(page - 1) * (pagination.perPage || 10) + index + 1}</td>
                                        <td className="master-name">{record.name || '-'}</td>
                                        <td>{record.code || '-'}</td>
                                        <td>{record.about || '-'}</td>
                                        <td><Switch size="small" checked={record.is_active == 1 || record.is_active === '1'} onChange={() => toggleStatus(record.id)} /></td>
                                        <td className="text-end"><div className="master-row-actions"><button type="button" onClick={() => openEdit(record)} title="Edit"><i className="bi bi-pencil" /></button><button type="button" className="danger" onClick={() => setDeleteTarget(record)} title="Delete"><i className="bi bi-trash" /></button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <footer className="master-footer"><span><i className="bi bi-list-ul" /> <strong>{pagination.totalRecords ?? records.length}</strong> total records</span><Pagination size="small" current={page} pageSize={pagination.perPage || 10} total={pagination.totalRecords || records.length} onChange={(nextPage) => loadRecords(nextPage, searchRef.current?.value.trim() || '')} /></footer>
                </section>
            </div>
            <Modal centered open={modalOpen} onCancel={() => setModalOpen(false)} destroyOnHidden footer={null} title={`${editing ? 'Edit' : 'Create'} ${config.singular}`}>
                <Form form={form} layout="vertical" onFinish={save} className="master-form">
                    <Form.Item name="name" label="Name" rules={[{ required: true, message: `Enter ${config.singular.toLowerCase()} name` }]}><Input /></Form.Item>
                    <div className="row">
                        <div className="col-md-6"><Form.Item name="code" label="Code" rules={[{ required: true, message: `Enter ${config.singular.toLowerCase()} code` }]}><Input /></Form.Item></div>
                        <div className="col-md-6"><Form.Item name="is_active" label="Status" rules={[{ required: true, message: 'Select active status' }]}>
                            <Radio.Group><Radio value={1}>Active</Radio><Radio value={0}>inActive</Radio></Radio.Group>
                        </Form.Item></div>
                    </div>
                    <Form.Item name="about" label="About"><Input.TextArea rows={3} /></Form.Item>
                    <div className="master-form-actions"><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="btn btn-sm master-create" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button></div>
                </Form>
            </Modal>
            <Modal centered open={Boolean(deleteTarget)} onCancel={() => setDeleteTarget(null)} destroyOnHidden footer={null} title="Delete record">
                <div className="master-delete"><i className="bi bi-trash3-fill" /><p>Delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.</p><div className="master-form-actions"><button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button><button type="button" className="btn btn-sm btn-danger" onClick={remove}>Yes, Delete</button></div></div>
            </Modal>
        </main>
    );
}

export { configs };