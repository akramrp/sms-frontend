import HrCrudPage from './HrCrudPage';
import { applyLeaveConfig } from './hrConfigs';

export default function ApplyLeave() {
    return <HrCrudPage config={applyLeaveConfig} />;
}
