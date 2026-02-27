'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { Activity, Edit, MoreVertical, Plus, Search, Server, Shield, Trash2, Wifi } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface NetworkDevice {
  _id: string;
  name: string;
  type: 'router' | 'switch' | 'firewall' | 'access_point' | 'printer' | 'server' | 'other';
  ipAddress: string;
  macAddress?: string;
  location?: string;
  manufacturer?: string;
  model?: string;
  snmpEnabled: boolean;
  snmpCommunity?: string;
  currentMetrics?: {
    cpuUsage: number;
    memoryUsage: number;
    isOnline: boolean;
    lastChecked: Date;
    latency: number;
  };
}

export default function NetworkPage() {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<NetworkDevice | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<NetworkDevice>>({
    type: 'switch',
    snmpEnabled: false,
  });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/network/devices');
      setDevices(res.data.data || []);
    } catch (error) {
      console.error('Failed to load network devices:', error);
      toast.error('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDevice(null);
    setFormData({ type: 'switch', snmpEnabled: false });
    setIsDialogOpen(true);
  };

  const handleEdit = (device: NetworkDevice) => {
    setEditingDevice(device);
    setFormData({ ...device });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;

    try {
      await api.delete(`/api/network/devices/${id}`);
      toast.success('Device deleted successfully');
      loadDevices();
    } catch (error) {
      console.error('Failed to delete device:', error);
      toast.error('Failed to delete device');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDevice) {
        await api.put(`/api/network/devices/${editingDevice._id}`, formData);
        toast.success('Device updated successfully');
      } else {
        await api.post('/api/network/devices', formData);
        toast.success('Device created successfully');
      }
      setIsDialogOpen(false);
      loadDevices();
    } catch (error) {
      console.error('Failed to save device:', error);
      toast.error('Failed to save device');
    }
  };

  const getDeviceIcon = (type: string) => {
      switch(type) {
          case 'router': return <Activity className="h-5 w-5 text-blue-600" />;
          case 'switch': return <Server className="h-5 w-5 text-green-600" />;
          case 'firewall': return <Shield className="h-5 w-5 text-red-600" />;
          case 'access_point': return <Wifi className="h-5 w-5 text-purple-600" />;
          default: return <Server className="h-5 w-5 text-gray-600" />;
      }
  }

  const getDeviceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      router: 'bg-blue-100 text-blue-800 border-blue-200',
      switch: 'bg-green-100 text-green-800 border-green-200',
      firewall: 'bg-red-100 text-red-800 border-red-200',
      access_point: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading && devices.length === 0) {
    return <div className="flex items-center justify-center h-screen">Loading Network Devices...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Network Monitoring</h1>
          <p className="text-gray-500 mt-1">Monitor availability and performance of network infrastructure.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/it-admin/network/scan">
            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
              <Search className="mr-2 h-4 w-4" />
              Scan Network
            </Button>
          </Link>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {devices.map((device) => (
          <Card key={device._id} className="hover:shadow-md transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                     <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                        {getDeviceIcon(device.type)}
                     </div>
                    <div>
                        <CardTitle className="text-base font-semibold">{device.name}</CardTitle>
                        <p className="text-xs text-gray-500 font-mono">{device.ipAddress}</p>
                    </div>
                </div>

                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(device)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Configuration
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(device._id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getDeviceTypeColor(device.type)}`}>
                        {device.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                         {device.currentMetrics?.isOnline ? (
                            <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                            <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Online
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-red-600 text-xs font-medium bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                            <span className="h-1.5 w-1.5 bg-red-500 rounded-full"></span>
                            Offline
                            </span>
                        )}
                    </div>
                </div>

                {/* Metrics */}
                 {device.currentMetrics && device.currentMetrics.isOnline ? (
                  <div className="space-y-3 pt-2">
                    {/* CPU Usage */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">CPU Load</span>
                        <span className="font-medium">{device.currentMetrics.cpuUsage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            device.currentMetrics.cpuUsage > 80
                              ? 'bg-red-500'
                              : device.currentMetrics.cpuUsage > 60
                              ? 'bg-amber-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${device.currentMetrics.cpuUsage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Memory Usage */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Memory</span>
                        <span className="font-medium">{device.currentMetrics.memoryUsage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            device.currentMetrics.memoryUsage > 80
                              ? 'bg-red-500'
                              : device.currentMetrics.memoryUsage > 60
                              ? 'bg-amber-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${device.currentMetrics.memoryUsage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Latency */}
                     <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                         <span className="text-xs text-gray-400">Response Time</span>
                         <span className="text-xs font-mono font-medium text-slate-700">{device.currentMetrics.latency || '<1'} ms</span>
                     </div>
                  </div>
                ) : (
                    <div className="py-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg italic">
                        No metrics available. Device is unreachable.
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!loading && devices.length === 0 && (
        <Card className="py-16 border-dashed">
           <CardContent className="text-center">
            <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Activity className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No network devices</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Start monitoring your infrastructure by adding routers, switches, or servers.
            </p>
             <div className="flex gap-4 justify-center">
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                     <Search className="mr-2 h-4 w-4" /> Scan Network
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Device
                </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Device Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingDevice ? 'Edit Device Configuration' : 'Add Network Device'}</DialogTitle>
            <DialogDescription>
              {editingDevice ? 'Update connection details and monitoring settings.' : 'Enter the details of the device to monitor.'}
            </DialogDescription>
          </DialogHeader>
           <form onSubmit={handleSubmit} className="space-y-4 py-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Device Name *</Label>
                    <Input
                        id="name"
                        required
                        value={formData.name || ''}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Core Switch 01"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ipAddress">IP Address *</Label>
                    <Input
                        id="ipAddress"
                        required
                        value={formData.ipAddress || ''}
                        onChange={e => setFormData({...formData, ipAddress: e.target.value})}
                        placeholder="192.168.1.1"
                    />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Device Type *</Label>
                    <Select value={formData.type} onValueChange={(val: any) => setFormData({...formData, type: val})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="router">Router</SelectItem>
                            <SelectItem value="switch">Switch</SelectItem>
                            <SelectItem value="firewall">Firewall</SelectItem>
                            <SelectItem value="access_point">Access Point</SelectItem>
                            <SelectItem value="server">Server</SelectItem>
                            <SelectItem value="printer">Printer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                        id="model"
                        value={formData.model || ''}
                        onChange={e => setFormData({...formData, model: e.target.value})}
                        placeholder="Cisco 2960"
                    />
                </div>
             </div>

             <div className="space-y-4 pt-4 border-t">
                 <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="snmpEnabled"
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                        checked={formData.snmpEnabled || false}
                        onChange={e => setFormData({...formData, snmpEnabled: e.target.checked})}
                    />
                    <Label htmlFor="snmpEnabled" className="font-medium">Enable SNMP Monitoring</Label>
                 </div>

                 {formData.snmpEnabled && (
                      <div className="space-y-2 pl-6">
                        <Label htmlFor="snmpCommunity">SNMP Community String</Label>
                        <Input
                            id="snmpCommunity"
                            type="password"
                            value={formData.snmpCommunity || ''}
                            onChange={e => setFormData({...formData, snmpCommunity: e.target.value})}
                            placeholder="public"
                        />
                         <p className="text-xs text-gray-500">Required for gathering detailed metrics (CPU, Memory, Traffic).</p>
                    </div>
                 )}
             </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Device</Button>
            </DialogFooter>
           </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
