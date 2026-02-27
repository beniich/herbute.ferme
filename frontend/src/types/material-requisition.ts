// Types for Material Requisition System ported from standalone app

export interface Complaint {
    id: string;
    title: string;
    type: 'repair' | 'installation' | 'preventive_maintenance';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    address: string;
    assignedTechnician?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface Material {
    id: string;
    sku: string;
    name: string;
    category: string;
    unit: string;
    currentStock: number;
    unitPrice: number;
    preferredSupplier: string;
    imageUrl?: string;
    description?: string;
    minStockLevel: number;
    reorderTime: number; // days
}

export interface RequestedItem {
    materialId: string;
    material?: Material;
    quantity: number;
    justification: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    department: string;
    role: 'technician' | 'manager' | 'admin';
}

export interface MaterialRequisition {
    id: string;
    requestDate: Date;
    requesterName: string;
    requesterId: string;
    department: string;
    site: string;
    complaintId?: string;
    complaint?: Complaint;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    neededBy: Date;
    estimatedBudget: number;
    approver?: string;
    approverId?: string;
    items: RequestedItem[];
    deliveryMode: 'warehouse_pickup' | 'site_delivery';
    deliveryAddress?: string;
    deliveryInstructions?: string;
    notes?: string;
    attachments?: File[];
    status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'completed';
    submittedAt?: Date;
    approvedAt?: Date;
    totalAmount: number;
}

export interface Department {
    id: string;
    name: string;
    code: string;
}

export interface Site {
    id: string;
    name: string;
    address: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface ApprovalWorkflow {
    level: number;
    approverId: string;
    approverName: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedAt?: Date;
    comments?: string;
}

export interface StockAlert {
    type: 'low_stock' | 'out_of_stock' | 'overbudget' | 'long_lead_time';
    message: string;
    severity: 'info' | 'warning' | 'error';
    materialId?: string;
}

export interface Alternative {
    materialId: string;
    material: Material;
    reason: string;
    priceDifference: number;
}
