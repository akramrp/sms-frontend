import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { downloadExcel } from 'react-export-table-to-excel';
import { Form, Input, Modal, Pagination, Radio, Select, Switch, notification } from 'antd';
import { INVALID_MESSAGE } from '../../constants';
import { classListAPI, sectionListAPI, subjectGroupCreateAPI, subjectGroupDeleteAPI, subjectGroupListAPI, subjectGroupStatusAPI, subjectGroupUpdateAPI, subjectListAPI, } from '../../services/apis';

type Id = number | string;
type OptionRecord = { id: Id; name: string; class_id?: Id };
type ClassOption = OptionRecord & {
    section_id?: Id | Id[];
    section_ids?: Id[];
    sections?: Array<Id | OptionRecord>;
};
type SubjectGroup = {
    id: Id;
    name?: string;
    class_id?: Id;
    class_name?: string;
    section_id?: Id | Id[];
    section_ids?: Id[];
    section_name?: string | string[];
    sections?: Array<Id | OptionRecord>;
    subject_id?: Id | Id[];
    subject_ids?: Id[];
    subject_name?: string | string[];
    subjects?: Array<Id | OptionRecord>;
    status?: number | string;
    is_active?: number | string;
    description?: string;
};
type PageData = { perPage?: number; totalRecords?: number };
type FormValues = {
    name: string;
    class_id: Id;
    section_id: Id[];
    subject_id: Id[];
    is_active: number;
    description?: string;
};

const toOptions = (records: OptionRecord[] = []) =>
    records.filter((record) => record.id !== undefined && record.name).map(({ id, name }) => ({ value: id, label: name }));

const asIdArray = (value?: Id | Id[]) => value === undefined ? [] : Array.isArray(value) ? value : [value];
const relationIds = (ids: Id[] | undefined, id: Id | Id[] | undefined, relations?: Array<Id | OptionRecord>) =>
    ids || asIdArray(id).length > 0
        ? ids || asIdArray(id)
        : relations?.map((relation) => typeof relation === 'object' ? relation.id : relation).filter((value): value is Id => value !== undefined) || [];

export default function SubjectGroup() {
    const [records, setRecords] = useState<SubjectGroup[]>([]);
    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [sections, setSections] = useState<OptionRecord[]>([]);
    const [subjects, setSubjects] = useState<OptionRecord[]>([]);
    const [pagination, setPagination] = useState<PageData>({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<SubjectGroup | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SubjectGroup | null>(null);
    const [selectedClass, setSelectedClass] = useState<Id | undefined>();
    const searchRef = useRef<HTMLInputElement>(null);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestId = useRef(0);
    const [form] = Form.useForm<FormValues>();

    const loadRecords = useCallback(async (nextPage = 1, keyword = '') => {
        const currentRequest = ++requestId.current;
        try {
            const response = await subjectGroupListAPI({ page: nextPage, ...(keyword ? { keyword } : {}) });
            if (currentRequest !== requestId.current) return;
            if (response?.data?.statusCode === 200) {
                setRecords(response.data.data || []);
                setPagination(response.data.pagination || {});
                setPage(nextPage);
            } else {
                notification.error({ message: 'Subject Groups', description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            if (currentRequest === requestId.current) {
                notification.error({ message: 'Subject Groups', description: error?.response?.data?.message || INVALID_MESSAGE });
            }
        } finally {
            if (currentRequest === requestId.current) setLoading(false);
        }
    }, []);

    const refreshRecords = useCallback(async (nextPage = 1, keyword = '') => {
        setLoading(true);
        await loadRecords(nextPage, keyword);
    }, [loadRecords]);

    const loadDropdownOptions = useCallback(async () => {
        try {
            const [classResponse, sectionResponse, subjectResponse] = await Promise.all([
                classListAPI({ keyword: 'all' }),
                sectionListAPI({ keyword: 'all' }),
                subjectListAPI({ keyword: 'all' }),
            ]);
            if (classResponse?.data?.statusCode === 200) setClasses(classResponse.data.data || []);
            else notification.error({ message: 'Classes', description: classResponse?.data?.message || INVALID_MESSAGE });
            if (sectionResponse?.data?.statusCode === 200) setSections(sectionResponse.data.data || []);
            else notification.error({ message: 'Sections', description: sectionResponse?.data?.message || INVALID_MESSAGE });
            if (subjectResponse?.data?.statusCode === 200) setSubjects(subjectResponse.data.data || []);
            else notification.error({ message: 'Subjects', description: subjectResponse?.data?.message || INVALID_MESSAGE });
        } catch (error: any) {
            notification.error({ message: 'Subject Group options', description: error?.response?.data?.message || INVALID_MESSAGE });
        }
    }, []);

    useEffect(() => {
        void loadRecords();
        void loadDropdownOptions();
        return () => {
            requestId.current += 1;
            if (searchTimer.current) clearTimeout(searchTimer.current);
        };
    }, [loadDropdownOptions, loadRecords]);

    const classOptions = useMemo(() => toOptions(classes), [classes]);
    const subjectOptions = useMemo(() => toOptions(subjects), [subjects]);
    const sectionOptions = useMemo(() => {
        if (selectedClass === undefined) return [];
        const selected = classes.find((item) => String(item.id) === String(selectedClass));
        const classSections = selected?.sections;
        if (Array.isArray(classSections) && classSections.length > 0) {
            const related = classSections.map((item) => typeof item === 'object'
                ? item as OptionRecord
                : sections.find((section) => String(section.id) === String(item))
            ).filter((item): item is OptionRecord => Boolean(item?.id && item.name));
            if (related.length > 0) return toOptions(related);
        }
        const ids = [
            ...(selected?.section_ids || []),
            ...(selected?.section_id === undefined ? [] : Array.isArray(selected.section_id) ? selected.section_id : [selected.section_id]),
        ];
        if (ids.length > 0) {
            const related = sections.filter((section) => ids.some((id) => String(id) === String(section.id)));
            if (related.length > 0) return toOptions(related);
        }
        const linkedSections = sections.filter((section) => section.class_id !== undefined && String(section.class_id) === String(selectedClass));
        return toOptions(linkedSections.length > 0 ? linkedSections : sections);
    }, [classes, sections, selectedClass]);

    const search = () => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => void refreshRecords(1, searchRef.current?.value.trim() || ''), 300);
    };

    const resetSearch = () => {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        if (searchRef.current) searchRef.current.value = '';
        void refreshRecords(1);
    };

    const openCreate = () => {
        setEditing(null);
        setSelectedClass(undefined);
        form.resetFields();
        form.setFieldValue('is_active', 1);
        setModalOpen(true);
    };

    const openEdit = (record: SubjectGroup) => {
        setEditing(record);
        setSelectedClass(record.class_id);
        form.setFieldsValue({
            name: record.name || '',
            class_id: record.class_id,
            section_id: relationIds(record.section_ids, record.section_id, record.sections),
            subject_id: relationIds(record.subject_ids, record.subject_id, record.subjects),
            is_active: Number(record.is_active ?? record.status ?? 0) === 1 ? 1 : 0,
            description: record.description || '',
        });
        setModalOpen(true);
    };

    const save = async (values: FormValues) => {
        setSaving(true);
        try {
            const response = editing
                ? await subjectGroupUpdateAPI({ ...values, id: editing.id })
                : await subjectGroupCreateAPI(values);
            if ([200, 201].includes(response?.data?.statusCode)) {
                notification.success({ message: 'Subject Group', description: response.data.message || 'Saved successfully.' });
                setModalOpen(false);
                await refreshRecords(page, searchRef.current?.value.trim() || '');
            } else {
                notification.error({ message: 'Subject Group', description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: 'Subject Group', description: error?.response?.data?.message || INVALID_MESSAGE });
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (record: SubjectGroup) => {
        const active = Number(record.is_active ?? record.status ?? 0) === 1;
        try {
            const response = await subjectGroupStatusAPI(record.id, active ? 0 : 1);
            if (response?.data?.statusCode === 200) {
                await refreshRecords(page, searchRef.current?.value.trim() || '');
            } else {
                notification.error({ message: 'Subject Group', description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: 'Subject Group', description: error?.response?.data?.message || INVALID_MESSAGE });
        }
    };

    const remove = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const response = await subjectGroupDeleteAPI(deleteTarget.id);
            if (response?.data?.statusCode === 200) {
                notification.success({ message: 'Subject Group', description: response.data.message || 'Deleted successfully.' });
                setDeleteTarget(null);
                await refreshRecords(page, searchRef.current?.value.trim() || '');
            } else {
                notification.error({ message: 'Subject Group', description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: 'Subject Group', description: error?.response?.data?.message || INVALID_MESSAGE });
        } finally {
            setDeleting(false);
        }
    };

    const resolveNames = (recordIds: Id | Id[] | undefined, options: OptionRecord[], fallback?: string | string[]) => {
        const names = asIdArray(recordIds)
            .map((id) => options.find((option) => String(option.id) === String(id))?.name)
            .filter((name): name is string => Boolean(name));
        if (names.length > 0) return names.join(', ');
        if (Array.isArray(fallback)) return fallback.join(', ') || '-';
        return fallback || '-';
    };

    const exportRecords = () => {
        if (records.length === 0) return;
        setExporting(true);
        try {
            downloadExcel({
                fileName: 'subject-groups',
                sheet: 'Subject Groups',
                tablePayload: {
                    header: ['Name', 'Class', 'Section', 'Subject', 'Status', 'Description'],
                    body: records.map((record) => [
                        record.name || '',
                        resolveNames(record.class_id, classes, record.class_name),
                        resolveNames(relationIds(record.section_ids, record.section_id, record.sections), sections, record.section_name),
                        resolveNames(relationIds(record.subject_ids, record.subject_id, record.subjects), subjects, record.subject_name),
                        Number(record.is_active ?? record.status ?? 0) === 1 ? 'Active' : 'Inactive',
                        record.description || '',
                    ]),
                },
            });
        } finally {
            setExporting(false);
        }
    };

    const displayName = (record: SubjectGroup, field: 'class' | 'section' | 'subject') => {
        const id = record[`${field}_id` as 'class_id' | 'section_id' | 'subject_id'];
        const fallback = record[`${field}_name` as 'class_name' | 'section_name' | 'subject_name'];
        const options = field === 'class' ? classes : field === 'section' ? sections : subjects;
        if (field === 'section') {
            const sectionIds = relationIds(record.section_ids, record.section_id, record.sections);
            return resolveNames(sectionIds, options, record.section_name);
        }
        if (field === 'subject') {
            const subjectIds = relationIds(record.subject_ids, record.subject_id, record.subjects);
            return resolveNames(subjectIds, options, record.subject_name);
        }
        return resolveNames(id, options, fallback);
    };

    return (
        <main className="app-main master-page">
            <div className="container-fluid">
                <section className="card sms-card">
                    <header className="card-header sms-toolbar">
                        <div className="sms-toolbar-row">
                            <div className="master-title">
                                <span className="master-title-icon"><i className="bi bi-collection-fill" /></span>
                                <span><strong>Subject Groups</strong><small>Manage subject groups and class assignments</small></span>
                            </div>
                            <div className="sms-toolbar-controls">
                                <div className="input-group input-group-sm sms-search">
                                    <input
                                        type="search"
                                        ref={searchRef}
                                        className="form-control"
                                        placeholder="Search subject groups"
                                        aria-label="Search subject groups"
                                        onKeyDown={(event) => event.key === 'Enter' && search()}
                                    />
                                    <button type="button" className="input-group-text" onClick={search} aria-label="Search subject groups">
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
                                    <i className="bi bi-plus-lg" /> New Subject Group
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="table-responsive">
                        <table className="table master-table mb-0">
                            <thead>
                                <tr><th>#</th><th>Name</th><th>Class</th><th>Section</th><th>Subject</th><th>Status</th><th>Description</th><th className="text-end">Actions</th></tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={8} className="master-empty">Loading records...</td></tr>
                                ) : records.length === 0 ? (
                                    <tr><td colSpan={8} className="master-empty">No records found.</td></tr>
                                ) : records.map((record, index) => (
                                    <tr key={record.id}>
                                        <td>{(page - 1) * (pagination.perPage || 10) + index + 1}</td>
                                        <td className="master-name">{record.name || '-'}</td>
                                        <td>{displayName(record, 'class')}</td>
                                        <td>{displayName(record, 'section')}</td>
                                        <td>{displayName(record, 'subject')}</td>
                                        <td>
                                            <Switch
                                                size="small"
                                                checked={Number(record.is_active ?? record.status ?? 0) === 1}
                                                onChange={() => void toggleStatus(record)}
                                                aria-label={`Toggle ${record.name || 'subject group'} status`}
                                            />
                                        </td>
                                        <td>{record.description || '-'}</td>
                                        <td className="text-end">
                                            <div className="master-row-actions">
                                                <button type="button" onClick={() => openEdit(record)} title="Edit" aria-label={`Edit ${record.name || 'subject group'}`}>
                                                    <i className="bi bi-pencil" />
                                                </button>
                                                <button type="button" className="danger" onClick={() => setDeleteTarget(record)} title="Delete" aria-label={`Delete ${record.name || 'subject group'}`}>
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
                title={`${editing ? 'Edit' : 'Create'} Subject Group`}
                width="35%"
            >
                <Form form={form} layout="vertical" onFinish={save} className="master-form">
                    <div className="row">
                        <div className='col-6'>
                            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter subject group name' }]}>
                        <Input />
                    </Form.Item>
                        </div>
                        <div className='col-6'>
                            <Form.Item name="class_id" label="Class" rules={[{ required: true, message: 'Select a class' }]}>
                        <Select
                            placeholder="Select class"
                            options={classOptions}
                            onChange={(value: Id) => {
                                setSelectedClass(value);
                                form.setFieldValue('section_id', undefined);
                            }}
                        />
                    </Form.Item>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-6'>
                             <Form.Item name="section_id" label="Section" rules={[{ required: true, type: 'array', message: 'Select at least one section' }]}>
                        <Select mode="multiple" placeholder={selectedClass === undefined ? 'Select class first' : 'Select sections'} options={sectionOptions} disabled={selectedClass === undefined} />
                    </Form.Item>
                        </div>
                        <div className='col-6'>
                            <Form.Item name="subject_id" label="Subject" rules={[{ required: true, type: 'array', message: 'Select at least one subject' }]}>
                        <Select mode="multiple" placeholder="Select subjects" options={subjectOptions} />
                    </Form.Item>
                        </div>
                    </div>
                    <div className="row">
                        <div className='col-4'>
                            <Form.Item name="is_active" label="Status" rules={[{ required: true, message: 'Select status' }]}>
                        <Radio.Group><Radio value={1}>Active</Radio><Radio value={0}>Inactive</Radio></Radio.Group>
                    </Form.Item>
                        </div>
                         <div className='col-8'>
                            <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                        </div>
                    </div>
                    <div className="master-form-actions">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-sm btn-outline-success" disabled={saving}>
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
                title="Delete subject group"
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
