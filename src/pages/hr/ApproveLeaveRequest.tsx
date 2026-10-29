import HrCrudPage from './HrCrudPage';
import { approveLeaveConfig } from './hrConfigs';

export default function ApproveLeaveRequest() {
    return <HrCrudPage config={approveLeaveConfig} />;
}
