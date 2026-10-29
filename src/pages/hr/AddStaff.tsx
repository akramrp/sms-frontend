import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Collapse, Form, Input, Select, notification } from 'antd';
import moment from 'moment';
import { staffDirectoryAPI } from '../../services/apis';
import { INVALID_MESSAGE } from '../../constants';
import LS_SERVICE from '../../utils/localStorage';

type FileField = 'photo' | 'resume' | 'joining_letter' | 'resignation_letter' | 'other_documents';
type StaffFormValues = Record<string, string | number | undefined>;
type StaffRecord = Record<string, unknown> & { id: number | string };

const documentFields: { name: Exclude<FileField, 'photo'>; label: string }[] = [
    { name: 'resume', label: 'Resume' },
    { name: 'joining_letter', label: 'Joining Letter' },
    { name: 'resignation_letter', label: 'Resignation Letter' },
    { name: 'other_documents', label: 'Other Documents' },
];

export default function AddStaff() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [form] = Form.useForm<StaffFormValues>();
    const [files, setFiles] = useState<Partial<Record<FileField, File>>>({});
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(Boolean(id));
    const [staffRecord, setStaffRecord] = useState<StaffRecord | null>(null);
    const [loadError, setLoadError] = useState(false);
    const today = moment().format('YYYY-MM-DD');
    const editing = Boolean(id);

    useEffect(() => {
        if (!id) return;
        let active = true;
        const routeRecord = (location.state as { record?: StaffRecord } | null)?.record;

        const populateForm = (record: StaffRecord) => {
            const fullName = String(record.full_name ?? '').trim().split(/\s+/);
            const formValues: StaffFormValues = {};
            [
                'department_id', 'designation_id', 'email', 'father_name', 'mother_name', 'gender',
                'phone', 'emergency_contact_number', 'marital_status', 'qualification', 'address',
                'permanent_address', 'work_experience', 'note', 'epf_no', 'basic_salary',
                'contract_type', 'work_shift', 'work_location', 'leave_type_1', 'account_title',
                'bank_account_number', 'bank_name', 'ifsc_code', 'bank_branch_name',
                'facebook_url', 'twitter_url', 'linkedin_url', 'instagram_url',
            ].forEach((field) => {
                const value = record[field];
                if (typeof value === 'string' || typeof value === 'number') formValues[field] = value;
            });
            formValues.first_name = String(record.first_name ?? fullName.shift() ?? '');
            formValues.last_name = String(record.last_name ?? fullName.join(' '));
            formValues.date_of_birth = typeof record.date_of_birth === 'string' ? record.date_of_birth.slice(0, 10) : '';
            formValues.date_of_joining = typeof record.date_of_joining === 'string' ? record.date_of_joining.slice(0, 10) : '';
            setStaffRecord(record);
            form.setFieldsValue(formValues);
        };

        const loadStaff = async () => {
            try {
                if (routeRecord && String(routeRecord.id) === id) {
                    populateForm(routeRecord);
                    return;
                }
                const response = await staffDirectoryAPI.list({ page: 1, keyword: id });
                const records = response?.data?.data;
                const found = Array.isArray(records)
                    ? records.find((item: StaffRecord) => String(item.id) === id)
                    : undefined;
                if (!found) {
                    throw new Error('Staff record was not found.');
                }
                if (active) populateForm(found);
            } catch (error: any) {
                if (!active) return;
                setLoadError(true);
                notification.error({
                    message: 'Staff',
                    description: error?.response?.data?.message || error?.message || 'Unable to load staff record.',
                });
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadStaff();
        return () => {
            active = false;
        };
    }, [form, id, location.state]);

    const submit = async (values: StaffFormValues) => {
        setSaving(true);
        try {
            const payload = new FormData();
            Object.entries(values).forEach(([name, value]) => {
                if (value !== undefined && value !== null) payload.append(name, String(value));
            });
            Object.entries(files).forEach(([name, file]) => {
                if (file) payload.append(name, file);
            });
            if (id) payload.append('id', id);
            const response = id
                ? await staffDirectoryAPI.update(payload)
                : await staffDirectoryAPI.create(payload);
            if ([200, 201].includes(response?.data?.statusCode)) {
                notification.success({
                    message: 'Staff',
                    description: response.data.message || (id ? 'Staff member updated successfully.' : 'Staff member created successfully.'),
                });
                navigate('/hr/staff-directory');
            } else {
                notification.error({ message: 'Staff', description: response?.data?.message || INVALID_MESSAGE });
            }
        } catch (error: any) {
            notification.error({ message: 'Staff', description: error?.response?.data?.message || INVALID_MESSAGE });
        } finally {
            setSaving(false);
        }
    };

    const chooseFile = (name: FileField, file?: File) => {
        setFiles((current) => {
            const next = { ...current };
            if (file) next[name] = file;
            else delete next[name];
            return next;
        });
    };

    const fileField = (name: FileField, label: string, accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png') => (
        <div>
            <label className="staff-file-picker">
                <input type="file" accept={accept} onChange={(event) => chooseFile(name, event.target.files?.[0])} />
                <span><i className="bi bi-cloud-arrow-up me-1" />{files[name]?.name || `Choose ${label}`}</span>
            </label>
            {!files[name] && typeof staffRecord?.[name] === 'string' && staffRecord[name] && (
                <a className="staff-existing-file" href={String(staffRecord[name])} target="_blank" rel="noreferrer">
                    Current {label}
                </a>
            )}
        </div>
    );

    const textField = (name: string, label: string, type = 'text', required = false) => (
        <Form.Item name={name} label={label} rules={required ? [{ required: true, message: `Enter ${label.replace(' *', '').toLowerCase()}` }] : undefined}>
            <Input type={type} />
        </Form.Item>
    );

    const textAreaField = (name: string, label: string) => (
        <Form.Item name={name} label={label}>
            <Input.TextArea rows={2} />
        </Form.Item>
    );

    const selectField = (name: string, label: string, options: { value: string | number; label: string }[], required = false) => (
        <Form.Item name={name} label={label} rules={required ? [{ required: true, message: `Select ${label.replace(' *', '').toLowerCase()}` }] : undefined}>
            <Select placeholder="Select" options={options} />
        </Form.Item>
    );

    return (
        <main className="app-main master-page staff-form-page sms-modal-form">
            <div className="container-fluid">
                {loading ? (
                    <section className="card sms-card staff-form-panel">Loading staff record...</section>
                ) : loadError ? (
                    <section className="card sms-card staff-form-panel">
                        <p>Unable to load this staff record.</p>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/hr/staff-directory')}>Back to Staff Directory</button>
                    </section>
                ) : (
                <Form form={form} layout="vertical" onFinish={submit} className="master-form">
                    <section className="card sms-card staff-form-panel">
                        {!editing && (
                            <div className="alert alert-info staff-login-note">
                                Staff email is their login username. Password is generated automatically and sent to staff email.
                                Superadmin can change staff password on their staff profile page.
                            </div>
                        )}
                        <div className="staff-section-heading">
                            <strong>{editing ? 'Edit Staff Information' : 'Basic Information'}</strong>
                            <button type="button" className="btn btn-sm btn-secondary" disabled><i className="bi bi-plus-lg me-1" />Import Staff</button>
                        </div>
                        <div className="staff-form-grid">
                            {selectField('department_id', 'Department', (LS_SERVICE.get("departmentList") || []).map((item) => ({ value: item.id, label: item.name })), true)}
                            {selectField('designation_id', 'Designation', (LS_SERVICE.get("designationList") || []).map((item) => ({ value: item.id, label: item.name })), true)}
                            {textField('first_name', 'First Name *', 'text', true)}
                            {textField('last_name', 'Last Name')}
                            {textField('email', 'Email (Login Username) *', 'email', true)}

                            {textField('father_name', 'Father Name')}
                            {textField('mother_name', 'Mother Name')}
                            {selectField('gender', 'Gender *', ['Male', 'Female', 'Other'].map((value) => ({ value, label: value })), true)}

                            <Form.Item name="date_of_birth" label="Date Of Birth *" rules={[{ required: true, message: 'Enter date of birth' }]}>
                                <Input type="date" max={today} />
                            </Form.Item>
                            <Form.Item name="date_of_joining" label="Date Of Joining">
                                <Input type="date" min={editing ? undefined : today} />
                            </Form.Item>

                            {textField('phone', 'Phone', 'tel', true)}
                            {textField('emergency_contact_number', 'Emergency Contact Number', 'tel')}
                            {selectField('marital_status', 'Marital Status', ['Single', 'Married', 'Widowed', 'Divorced'].map((value) => ({ value, label: value })), true)}

                            <Form.Item label="Photo">{fileField('photo', 'Photo', 'image/*')}</Form.Item>
                            {textField('qualification', 'Qualification', 'text', true)}

                            <div className="staff-grid-span-2">{textAreaField('address', 'Address')}</div>
                            <div className="staff-grid-span-2">{textAreaField('permanent_address', 'Permanent Address')}</div>
                            {textField('work_experience', 'Work Experience', 'text', true)}
                            <div className="staff-grid-span-2">{textField('note', 'Note')}</div>
                        </div>
                    </section>

                    <Collapse
                        className="staff-more-details"
                        expandIconPosition="end"
                        items={[{
                            key: 'details',
                            label: 'Add More Details',
                            children: (
                                <div className="staff-extra-sections">
                                    <section>
                                        <div className="staff-section-heading"><strong>Payroll</strong></div>
                                        <div className="staff-form-grid staff-grid-five">
                                            {textField('epf_no', 'EPF No.')}
                                            {textField('basic_salary', 'Basic Salary', 'number')}
                                            {selectField('contract_type', 'Contract Type', ['Permanent', 'Contract', 'Temporary'].map((value) => ({ value, label: value })))}
                                            {textField('work_shift', 'Work Shift')}
                                            {textField('work_location', 'Work Location')}
                                        </div>
                                    </section>
                                    <section>
                                        <div className="staff-section-heading"><strong>Leaves</strong></div>
                                        <div className="staff-form-grid">
                                            {textField('leave_type_1', 'Leave Type 1 (Number Of Leaves)', 'number')}
                                        </div>
                                    </section>
                                    <section>
                                        <div className="staff-section-heading"><strong>Bank Account Details</strong></div>
                                        <div className="staff-form-grid staff-grid-five">
                                            {textField('account_title', 'Account Title')}
                                            {textField('bank_account_number', 'Bank Account Number')}
                                            {textField('bank_name', 'Bank Name')}
                                            {textField('ifsc_code', 'IFSC Code')}
                                            {textField('bank_branch_name', 'Bank Branch Name')}
                                        </div>
                                    </section>
                                    <section>
                                        <div className="staff-section-heading"><strong>Social Media Links</strong></div>
                                        <div className="staff-form-grid staff-grid-four">
                                            {textField('facebook_url', 'Facebook URL', 'url')}
                                            {textField('twitter_url', 'Twitter URL', 'url')}
                                            {textField('linkedin_url', 'Linkedin URL', 'url')}
                                            {textField('instagram_url', 'Instagram URL', 'url')}
                                        </div>
                                    </section>
                                    <section>
                                        <div className="staff-section-heading"><strong>Upload Documents</strong></div>
                                        <div className="staff-document-grid">
                                            {documentFields.map((document) => (
                                                <div className="staff-document-row" key={document.name}>
                                                    <span>{document.label}</span>
                                                    {fileField(document.name, document.label)}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            ),
                        }]}
                    />

                    <div className="staff-form-footer">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/hr/staff-directory')}>Cancel</button>
                        <button type="submit" className="btn btn-outline-success" disabled={saving}>{saving ? (editing ? 'Updating...' : 'Saving...') : (editing ? 'Update Staff' : 'Save')}</button>
                    </div>
                </Form>
                )}
            </div>
        </main>
    );
}
