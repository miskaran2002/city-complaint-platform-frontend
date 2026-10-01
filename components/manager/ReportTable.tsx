'use client';

import React from 'react';

interface ReportTableProps {
  complaints: any[];
}

export const ReportTable = ({ complaints }: ReportTableProps) => {

  // CSV Download Logic
  const handleDownloadCSV = () => {
    if (complaints.length === 0) {
      alert("No data available to download.");
      return;
    }

    // 1. CSV Headers
    const headers = ['Complaint ID', 'Title', 'Citizen Name', 'Status', 'Date Logged'];
    
    // 2. CSV Rows
    const csvRows = complaints.map(c => {
      return [
        c.id,
        `"${c.title.replace(/"/g, '""')}"`, // Title e comma thakle jate venge na jay tai quotes e wrap kora
        `"${c.citizen?.name || 'Unknown'}"`,
        c.status,
        new Date(c.createdAt).toLocaleDateString()
      ].join(',');
    });

    // 3. Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // 4. Create Blob and Auto-download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `department_reports_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 p-6 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">Detailed Complaints Log</h3>
        
        {/* 🔴 onClick event add kora holo 🔴 */}
        <button 
          onClick={handleDownloadCSV}
          className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          Download CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4 sm:px-6 py-4">Title & ID</th>
              <th className="p-4 sm:px-6 py-4">Citizen</th>
              <th className="p-4 sm:px-6 py-4">Date Logged</th>
              <th className="p-4 sm:px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400 text-sm">
                  No complaints found for your department.
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 sm:px-6 py-4">
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{complaint.title}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">#{complaint.id.slice(0, 8)}</p>
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <p className="text-sm text-gray-700 font-medium">{complaint.citizen?.name || 'Unknown'}</p>
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md uppercase border ${
                      complaint.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      complaint.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      complaint.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                      'bg-amber-50 text-amber-700 border-amber-100' // PENDING
                    }`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};