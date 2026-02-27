'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { AlertTriangle, CheckCircle, FileText, Search, ShieldCheck, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Complaint {
  _id: string;
  number: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

export default function ComplaintControlPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      // Fetch only NEW complaints
      const res = await api.get('/api/complaints', { params: { status: 'nouvelle' } });
      setComplaints(res.data.data || []);
    } catch (error) {
      console.error('Failed to load complaints:', error);
      toast.error('Failed to load pending complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/api/complaints/${id}/approve`);
      toast.success('Complaint approved & assigned');
      loadComplaints(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to approve complaint');
    }
  };

  const handleRejectInit = (id: string) => {
    setRejectingId(id);
    setRejectionReason('');
  };

  const handleRejectConfirm = async () => {
    if (!rejectingId || !rejectionReason.trim()) return;

    try {
      await api.post(`/api/complaints/${rejectingId}/reject`, { rejectionReason });
      toast.success('Complaint rejected');
      setRejectingId(null);
      loadComplaints(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to reject complaint');
    }
  };

  const filteredComplaints = complaints.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.number.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center">Loading pending complaints...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            Complaint Control Center
          </h1>
          <p className="text-gray-600 mt-1">Review, approve, or reject incoming complaints.</p>
        </div>
        <div className="relative w-64">
           <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
           <Input
             placeholder="Search by ID or Title..."
             className="pl-8"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      {filteredComplaints.length === 0 ? (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">All Clear!</h3>
            <p className="text-gray-500">No new complaints pending review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint._id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-mono px-2 py-1 rounded">
                        {complaint.number}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full uppercase font-medium ${
                        complaint.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        complaint.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {complaint.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(complaint.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold">{complaint.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{complaint.description}</p>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <FileText className="h-4 w-4" />
                      Category: <span className="font-medium text-gray-700">{complaint.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="danger"
                      onClick={() => handleRejectInit(complaint._id)}
                      className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 border"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(complaint._id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve & Assign
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rejection Dialog */}
      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Reject Complaint
            </DialogTitle>
            <CardDescription>
              Please provide a reason for rejecting this complaint. This reason will be visible to the submitter and stored in the audit log.
            </CardDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Rejection Reason (Required)</label>
            <Textarea
              placeholder="e.g. Complaint is out of scope, Duplicate, Insufficient information..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingId(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
