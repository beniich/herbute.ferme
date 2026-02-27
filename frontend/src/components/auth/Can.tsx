
'use client';

import { usePermissions } from '@/hooks/usePermissions';
import { ReactNode } from 'react';
import { Permission, Role } from '@/lib/rbac/permissions';

interface CanProps {
    permission?: Permission;
    permissions?: Permission[];
    role?: Role;
    requireAll?: boolean;
    children: ReactNode;
    fallback?: ReactNode;
}

export function Can({
    permission,
    permissions,
    role,
    requireAll = false,
    children,
    fallback = null,
}: CanProps) {
    const { can, canAny, canAll, isRoleOrHigher } = usePermissions();

    // Vérification du rôle
    if (role && !isRoleOrHigher(role)) {
        return <>{fallback}</>;
    }

    // Vérification d'une permission unique
    if (permission && !can(permission)) {
        return <>{fallback}</>;
    }

    // Vérification de plusieurs permissions
    if (permissions && permissions.length > 0) {
        const hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
        if (!hasAccess) {
            return <>{fallback}</>;
        }
    }

    return <>{children}</>;
}
