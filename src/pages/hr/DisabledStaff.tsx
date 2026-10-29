import HrCrudPage from './HrCrudPage';
import { disabledStaffConfig } from './hrConfigs';

export default function DisabledStaff() {
    return <HrCrudPage config={disabledStaffConfig} />;
}
