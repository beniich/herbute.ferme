import { redirect } from 'next/navigation';

export default function ComplaintsRoot() {
    redirect('/complaints/list');
}
