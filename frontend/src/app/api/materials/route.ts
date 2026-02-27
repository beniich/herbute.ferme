import { NextRequest, NextResponse } from 'next/server';
import { mockMaterials, searchMaterials } from '@/lib/inventory/mockData';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const id = searchParams.get('id');

    // Get material by ID
    if (id) {
        const material = mockMaterials.find(m => m.id === id);
        if (material) {
            return NextResponse.json(material);
        }
        return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    // Search materials
    if (query) {
        const results = searchMaterials(query);
        return NextResponse.json(results);
    }

    // Get all materials
    return NextResponse.json(mockMaterials);
}
