'use client';

// import ComplaintForm from '@/components/ComplaintForm'; // Old form
import { CreateComplaintWizard } from '@/components/complaints/CreateComplaintWizard';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewComplaintPage() {
    const { token } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/login');
        }
    }, [token, router]);

    if (!token) return null;

    return (
        <section className="py-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-center mb-2">Nouvelle Réclamation</h1>
                <p className="text-center text-slate-500 mb-8">Remplissez le formulaire ci-dessous pour signaler un incident.</p>
                <CreateComplaintWizard />
            </div>
        </section>
    );
}
