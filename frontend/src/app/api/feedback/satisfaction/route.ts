import { NextResponse } from 'next/server';
import { kpis, feedbacks, departments, keywords } from '@/lib/satisfaction-data';

export async function GET() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
        kpis,
        feedbacks,
        departments,
        keywords,
        trend: [
            { month: "Jan", value: 3.9 },
            { month: "Feb", value: 4.0 },
            { month: "Mar", value: 4.1 },
            { month: "Apr", value: 4.2 },
            { month: "May", value: 4.3 },
            { month: "Jun", value: 4.2 },
            { month: "Jul", value: 4.2 },
            { month: "Aug", value: 4.3 },
        ]
    });
}
