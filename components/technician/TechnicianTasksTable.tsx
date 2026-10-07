'use client';

import apiClient from '@/lib/axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';


interface TechnicianTasksTableProps {
  tasks: any[];
  onTaskUpdated?: () => void;
}

export const TechnicianTasksTable = ({ tasks, onTaskUpdated }: TechnicianTasksTableProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  
  // Modal States for View & Update Status
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('IN_PROGRESS');
  const [note, setNote] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (selectedStatus === 'ALL') return true;
    return t.status === selectedStatus;
  });

  const handleViewTask = (task: any) => {
    setSelectedTask(task);
    setNewStatus(task.status === 'PENDING' ? 'IN_PROGRESS' : task.status);
    setNote('');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedTask) return;

    try {
      setIsUpdating(true);
      const res = await apiClient.patch(`/complaints/${selectedTask.id}/status`, {
        status: newStatus,
        note: note || `Status updated to ${newStatus} by technician`
      });

      if (res.data?.success) {
        toast.success(`Task status updated to ${newStatus} successfully!`);
        setIsModalOpen(false);
        if (onTaskUpdated) onTaskUpdated();
      }
    } catch (err: any) {
      console.error('Failed to update status', err);
      toast.error(err.response?.data?.message || 'Failed to update task status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Filters Bar */}
      <div className="border-b border-gray-100 p-4 sm:px-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-background/50">
        <h3 className="text-lg font-bold text-foreground">Assigned Field Tasks ({tasks.length})</h3>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full sm:w-48 bg-card border border-gray-200 text-gray-700 text-sm rounded-xl px-3 py-2 outline-none font-medium focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-card border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4 sm:px-6 py-4">Task ID & Title</th>
              <th className="p-4 sm:px-6 py-4">Priority</th>
              <th className="p-4 sm:px-6 py-4">Status</th>
              <th className="p-4 sm:px-6 py-4">Date Logged</th>
              <th className="p-4 sm:px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 text-sm">
                  No tasks found matching your filter.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-background/50 transition-colors">
                  <td className="p-4 sm:px-6 py-4">
                    <p className="text-sm font-bold text-foreground truncate max-w-[280px]">{task.title}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">#{task.id.slice(0, 8)}</p>
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md uppercase border ${
                      task.priority === 'URGENT' || task.priority === 'HIGH' ? 'bg-red-50 text-red-700 border-red-100' :
                      task.priority === 'MEDIUM' ? 'bg-cardmber-50 text-amber-700 border-amber-100' :
                      'bg-background text-gray-700 border-gray-200'
                    }`}>
                      {task.priority || 'NORMAL'}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md uppercase border ${
                      task.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-cardmber-50 text-amber-700 border-amber-100'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <span className="text-sm text-gray-600 font-medium">
                      {new Date(task.createdAt).toLocaleDateString('en-GB')}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 py-4 text-right">
                    <button 
                      onClick={() => handleViewTask(task)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-bold transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                    >
                      Update / View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-foreground pr-4">{selectedTask.title}</h3>
                <p className="text-xs font-mono text-gray-500 mt-1">ID: {selectedTask.id}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg font-bold">✕</button>
            </div>

            <div className="space-y-4">
              <div className="bg-background p-4 rounded-xl border border-gray-100 text-sm text-gray-700 space-y-2">
                <p><strong className="text-foreground">Description:</strong> {selectedTask.description || 'No description provided.'}</p>
                <p><strong className="text-foreground">Address:</strong> {selectedTask.address || 'N/A'}</p>
                <p><strong className="text-foreground">Citizen:</strong> {selectedTask.citizen?.name || 'Unknown'} ({selectedTask.citizen?.email || 'N/A'})</p>
              </div>

              {/* Status Update Controls */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-4">
                <h4 className="text-sm font-bold text-foreground">Update Task Status</h4>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Select New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-card border border-gray-200 text-gray-800 text-sm rounded-xl px-3 py-2.5 outline-none font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Field Note / Remark</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write progress details or resolution notes..."
                    rows={3}
                    className="w-full bg-card border border-gray-200 text-gray-800 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleUpdateStatus}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};