import HrCrudPage from './HrCrudPage';
import { leaveTypeConfig } from './hrConfigs';

export default function LeaveType() {
    return <HrCrudPage config={leaveTypeConfig} />;
}
