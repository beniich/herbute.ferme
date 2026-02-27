import { NextRequest, NextResponse } from 'next/server';
import { MaterialRequisition } from '@/types/material-requisition';

// In-memory storage (in production, this would be a database)
// Note: This will reset on server restart in dev mode.
const requisitions: MaterialRequisition[] = [];

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
        const requisition = requisitions.find(r => r.id === id);
        if (requisition) {
            return NextResponse.json(requisition);
        }
        return NextResponse.json({ error: 'Requisition not found' }, { status: 404 });
    }

    return NextResponse.json(requisitions);
}

export async function POST(request: NextRequest) {
    try {
        const data: MaterialRequisition = await request.json();

        // Validate required fields
        if (!data.requesterName || !data.items || data.items.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Store the requisition
        requisitions.push(data);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({
            success: true,
            requisition: data,
            message: 'Requisition submitted successfully'
        }, { status: 201 });

    } catch (_error) {
        return NextResponse.json(
            { error: 'Invalid request data' },
            { status: 400 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const data: MaterialRequisition = await request.json();

        const index = requisitions.findIndex(r => r.id === data.id);
        if (index === -1) {
            return NextResponse.json(
                { error: 'Requisition not found' },
                { status: 404 }
            );
        }

        requisitions[index] = data;

        return NextResponse.json({
            success: true,
            requisition: data,
            message: 'Requisition updated successfully'
        });

    } catch (_error) {
        return NextResponse.json(
            { error: 'Invalid request data' },
            { status: 400 }
        );
    }
}
