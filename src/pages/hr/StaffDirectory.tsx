import { useNavigate } from 'react-router-dom';
import HrCrudPage from './HrCrudPage';
import { staffDirectoryConfig } from './hrConfigs';

export default function StaffDirectory() {
    const navigate = useNavigate();
    return (
        <HrCrudPage
            config={staffDirectoryConfig}
            onAdd={() => navigate('/hr/staff-directory/add')}
            onEdit={(record) => navigate(`/hr/staff-directory/edit/${record.id}`, { state: { record } })}
        />
    );
}
