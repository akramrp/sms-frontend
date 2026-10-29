import { useState } from 'react';
import { Button, Empty, Form, Input, Modal, Tabs, notification } from 'antd';
import { BACKEND_BASE_URL, DISPLAY_DATE } from '../../constants';
import defaultFemale from '../../assets/images/default_female.jpg';
import defaultMale from '../../assets/images/default_male.jpg';
import { staffDirectoryChangePasswordAPI } from '../../services/apis';

type StaffRecord = Record<string, unknown> & { id: number | string };

type ProfileProps = {
    record: StaffRecord | null;
    onClose: () => void;
};

const displayValue = (value: unknown) => {
    if (value === null || value === undefined || value === '') return '-';
    return String(value);
};

const displayDate = (value: unknown) => {
    if (typeof value !== 'string' || !value) return '-';
    return DISPLAY_DATE(value);
};

export default function HrStaffProfileModal({ record, onClose }: ProfileProps) {
    const [passwordForm] = Form.useForm();
    const [passwordSaving, setPasswordSaving] = useState(false);

    if (!record) return null;

    const gender = String(record.gender ?? '').toLowerCase();
    const fallbackPhoto = gender === 'female' ? defaultFemale : defaultMale;
    const photo = typeof record.photo === 'string' && record.photo.trim()
        ? new URL(record.photo, BACKEND_BASE_URL).toString()
        : fallbackPhoto;
    const name = displayValue(record.full_name);
    const fileUrl = (value: unknown) => typeof value === 'string' && value
        ? new URL(value, BACKEND_BASE_URL).toString()
        : null;
    const socialUrl = (value: unknown) => {
        if (typeof value !== 'string' || !value.trim()) return null;
        try {
            const url = new URL(value);
            return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
        } catch {
            return null;
        }
    };
    const rows = (items: [string, unknown][]) => (
        <dl className="hr-profile-details">
            {items.map(([label, value]) => (
                <div className="hr-profile-detail" key={label}>
                    <dt>{label}</dt>
                    <dd>{displayValue(value)}</dd>
                </div>
            ))}
        </dl>
    );
    const documentLink = (label: string, value: unknown) => {
        const url = fileUrl(value);
        return (
            <div className="hr-profile-document" key={label}>
                <span><i className="bi bi-file-earmark-text me-2" />{label}</span>
                {url
                    ? <a href={url} target="_blank" rel="noreferrer">Open document</a>
                    : <span className="text-secondary">Not provided</span>}
            </div>
        );
    };
    const documents: [string, unknown][] = [
        ['Resume', record.resume],
        ['Joining Letter', record.joining_letter],
        ['Resignation Letter', record.resignation_letter],
        ['Other Documents', record.other_documents],
    ];
    const changePassword = async (values: { new_password: string; confirm_password: string }) => {
        setPasswordSaving(true);
        try {
            const response = await staffDirectoryChangePasswordAPI({
                id: record.id,
                new_password: values.new_password,
                confirm_password: values.confirm_password,
            });
            if ([200, 201].includes(response?.data?.statusCode)) {
                notification.success({ message: 'Password updated', description: response.data.message || 'Staff password changed successfully.' });
                passwordForm.resetFields();
            } else {
                notification.error({ message: 'Change password', description: response?.data?.message || 'Unable to change the staff password.' });
            }
        } catch (error: any) {
            notification.error({ message: 'Change password', description: error?.response?.data?.message || 'Unable to change the staff password.' });
        } finally {
            setPasswordSaving(false);
        }
    };
    const socialLinks = (
        <span className="hr-profile-social-links">
            {([
                ['Facebook', 'facebook_url', 'bi-facebook'],
                ['Twitter', 'twitter_url', 'bi-twitter-x'],
                ['LinkedIn', 'linkedin_url', 'bi-linkedin'],
                ['Instagram', 'instagram_url', 'bi-instagram'],
            ] as const).map(([label, field, icon]) => {
                const url = socialUrl(record[field]);
                return url
                    ? (
                        <a href={url} target="_blank" rel="noreferrer" title={label} aria-label={`Open ${label} profile`} key={field}>
                            <i className={`bi ${icon}`} aria-hidden="true" />
                        </a>
                    )
                    : (
                        <span className="is-unavailable" title={`${label} not provided`} aria-label={`${label} not provided`} key={field}>
                            <i className={`bi ${icon}`} aria-hidden="true" />
                        </span>
                    );
            })}
        </span>
    );
    const passwordSection = (
        <div className="hr-profile-password-card">
            <div className="hr-profile-password-heading">
                <span className="hr-profile-password-icon"><i className="bi bi-shield-lock-fill" /></span>
                <span>
                    <strong>Change Password</strong>
                    <small>Set a new sign-in password for this staff member.</small>
                </span>
            </div>
            <Form
                form={passwordForm}
                layout="vertical"
                onFinish={changePassword}
                className="hr-profile-password-form"
            >
                <div className="hr-profile-password-fields">
                    <Form.Item
                        name="new_password"
                        label="New Password"
                        rules={[
                            { required: true, message: 'Enter a new password' },
                            { min: 8, message: 'Use at least 8 characters' },
                        ]}
                    >
                        <Input.Password autoComplete="new-password" placeholder="Enter new password" />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        label="Confirm Password"
                        dependencies={['new_password']}
                        rules={[
                            { required: true, message: 'Confirm the new password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new_password') === value) return Promise.resolve();
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password autoComplete="new-password" placeholder="Confirm new password" />
                    </Form.Item>
                </div>
                <div className="hr-profile-password-actions">
                    <Button htmlType="button" onClick={() => passwordForm.resetFields()} disabled={passwordSaving}>
                        Clear
                    </Button>
                    <Button type="primary" htmlType="submit" loading={passwordSaving} icon={<i className="bi bi-key-fill" />}>
                        Update Password
                    </Button>
                </div>
            </Form>
        </div>
    );
    return (
        <Modal
            centered
            open
            onCancel={onClose}
            footer={null}
            width="90%"
            title="Staff Profile"
            className="hr-profile-modal"
            destroyOnHidden
        >
            <div className="hr-profile-layout">
                <aside className="hr-profile-sidebar">
                    <div className="hr-profile-person">
                        <img
                            src={photo}
                            alt=""
                            className="hr-profile-photo"
                            onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = fallbackPhoto;
                            }}
                        />
                        <h2>{name}</h2>
                        <span>{displayValue(record.designation && typeof record.designation === 'object' ? (record.designation as Record<string, unknown>).name : undefined)}</span>
                    </div>
                    {rows([
                        ['Staff ID', record.emp_code ?? record.id],
                        ['Department', record.department && typeof record.department === 'object' ? (record.department as Record<string, unknown>).name : undefined],
                        ['Designation', record.designation && typeof record.designation === 'object' ? (record.designation as Record<string, unknown>).name : undefined],
                        ['EPF No.', record.epf_no],
                        ['Basic Salary', record.basic_salary],
                        ['Contract Type', record.contract_type],
                        ['Work Shift', record.work_shift],
                        ['Work Location', record.work_location],
                        ['Date Of Joining', displayDate(record.date_of_joining)],
                    ])}
                    <dl className="hr-profile-details">
                        <div className="hr-profile-detail hr-profile-social-row">
                            <dt>Social</dt>
                            <dd>{socialLinks}</dd>
                        </div>
                    </dl>
                </aside>

                <section className="hr-profile-content">
                    <Tabs
                        items={[
                            {
                                key: 'profile',
                                label: 'Profile',
                                children: (
                                    <>
                                        <h3 className="hr-profile-section-title">Personal Details</h3>
                                        {rows([
                                            ['Phone', record.phone],
                                            ['Emergency Contact Number', record.emergency_contact_number],
                                            ['Email', record.email],
                                            ['Gender', record.gender],
                                            ['Date Of Birth', displayDate(record.date_of_birth)],
                                            ['Marital Status', record.marital_status],
                                            ['Father Name', record.father_name],
                                            ['Mother Name', record.mother_name],
                                            ['Qualification', record.qualification],
                                            ['Work Experience', record.work_experience],
                                            ['Note', record.note],
                                            ['Current Address', record.address],
                                            ['Permanent Address', record.permanent_address]
                                        ])}
                                    </>
                                ),
                            },
                            {
                                key: 'payroll',
                                label: 'Payroll',
                                children: (
                                    <>
                                        <h3 className="hr-profile-section-title">Payroll Details</h3>
                                        {rows([
                                            ['Basic Salary', record.basic_salary],
                                            ['EPF No.', record.epf_no],
                                            ['Contract Type', record.contract_type],
                                            ['Account Title', record.account_title],
                                            ['Bank Name', record.bank_name],
                                            ['Bank Branch Name', record.bank_branch_name],
                                            ['Bank Account Number', record.bank_account_number],
                                            ['IFSC Code', record.ifsc_code],
                                        ])}
                                    </>
                                ),
                            },
                            {
                                key: 'leaves',
                                label: 'Leaves',
                                children: rows([['Leave Type 1 (Number Of Leaves)', record.leave_type_1]]),
                            },
                            {
                                key: 'attendance',
                                label: 'Attendance',
                                children: (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="Attendance history is not included in the staff profile response."
                                    />
                                ),
                            },
                            {
                                key: 'documents',
                                label: 'Documents',
                                children: (
                                    <div className="hr-profile-documents">
                                        {documents.map(([label, value]) => documentLink(label, value))}
                                    </div>
                                ),
                            },
                            {
                                key: 'password',
                                label: 'Change Password',
                                children: passwordSection,
                            },
                            {
                                key: 'timeline',
                                label: 'Timeline',
                                children: (
                                    <div className="hr-profile-timeline">
                                        {Boolean(record.date_of_joining) && (
                                            <div><strong>Joined</strong><span>{displayDate(record.date_of_joining)}</span></div>
                                        )}
                                        {Boolean(record.disable_at) && (
                                            <div><strong>Disabled</strong><span>{displayDate(record.disable_at)}</span></div>
                                        )}
                                        {!record.date_of_joining && !record.disable_at && (
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No timeline events available." />
                                        )}
                                    </div>
                                ),
                            },
                        ]}
                    />
                </section>
            </div>
        </Modal>
    );
}
