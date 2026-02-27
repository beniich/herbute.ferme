'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useOrgStore } from '@/store/orgStore';
import { organizationApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'react-hot-toast';
import { Loader2, Plus, UserX, Shield, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Member {
    id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    roles: string[];
    status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
    joinedAt: string;
}

export default function MembersPage() {
    const { activeOrganization } = useOrgStore();
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('MEMBER');
    const [isInviting, setIsInviting] = useState(false);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    useEffect(() => {
        if (activeOrganization) {
            fetchMembers();
        }
    }, [activeOrganization]);

    const fetchMembers = async () => {
        if (!activeOrganization) return;
        setIsLoading(true);
        try {
            const response = await organizationApi.getMembers(activeOrganization._id);
            setMembers(response.data.data);
        } catch (error) {
            toast.error('Failed to load members');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvite = async () => {
        if (!activeOrganization || !inviteEmail) return;
        setIsInviting(true);
        try {
            await organizationApi.inviteMember(activeOrganization._id, inviteEmail, [inviteRole]);
            toast.success('Invitation sent successfully');
            setInviteEmail('');
            setIsInviteOpen(false);
            fetchMembers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to invite user');
        } finally {
            setIsInviting(false);
        }
    };

    const handleRoleUpdate = async (memberId: string, newRole: string) => {
        if (!activeOrganization) return;
        try {
            await organizationApi.updateMemberRole(activeOrganization._id, memberId, [newRole]);
            toast.success('Role updated');
            fetchMembers();
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!activeOrganization || !confirm('Are you sure you want to remove this member?')) return;
        try {
            await organizationApi.removeMember(activeOrganization._id, memberId);
            toast.success('Member removed');
            fetchMembers();
        } catch (error) {
            toast.error('Failed to remove member');
        }
    };

    if (!activeOrganization) {
        return <div className="p-8 text-center text-slate-500">Please select an organization first.</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
                    <p className="text-slate-500">Manage access and roles for your organization.</p>
                </div>

                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite New Member</DialogTitle>
                            <DialogDescription>
                                They will receive an email to join <strong>{activeOrganization.name}</strong>.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                                <Input
                                    id="email"
                                    placeholder="colleague@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="role" className="text-sm font-medium">Role</label>
                                <Select value={inviteRole} onValueChange={setInviteRole}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MEMBER">Member</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="TECHNICIAN">Technician</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                            <Button onClick={handleInvite} disabled={isInviting}>
                                {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Invitation
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                    Loading members...
                                </TableCell>
                            </TableRow>
                        ) : members.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                    No members found. Invite someone to get started!
                                </TableCell>
                            </TableRow>
                        ) : (
                            members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={member.user.avatar} alt={member.user.name} />
                                                <AvatarFallback>{member.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{member.user.name}</span>
                                                <span className="text-xs text-slate-500">{member.user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={member.roles[0]}
                                            onValueChange={(val) => handleRoleUpdate(member.id, val)}
                                            disabled={member.roles.includes('OWNER')}
                                        >
                                            <SelectTrigger className="w-[130px] h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="OWNER" disabled>Owner</SelectItem>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                <SelectItem value="MEMBER">Member</SelectItem>
                                                <SelectItem value="TECHNICIAN">Technician</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {member.status === 'ACTIVE' ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                Invited
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500">
                                        {new Date(member.joinedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                            onClick={() => handleRemoveMember(member.id)}
                                            disabled={member.roles.includes('OWNER')}
                                        >
                                            <UserX className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
