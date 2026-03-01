import DashboardLayout from '@/Components/DashboardLayout';
import { Card, CardBody } from '@/Components/ui';

export default function Placeholder({ title }) {
    return (
        <DashboardLayout title={title}>
            <Card>
                <CardBody className="text-center py-16">
                    <p className="text-slate-500 text-lg">Coming Soon</p>
                    <p className="text-slate-400 mt-2">This feature is not yet implemented.</p>
                </CardBody>
            </Card>
        </DashboardLayout>
    );
}
