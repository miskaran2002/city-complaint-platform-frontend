import React from 'react';
import Link from 'next/link';

interface DepartmentTeamListProps {
  teamMembers: any[];
}

export const DepartmentTeamList = ({ teamMembers }: DepartmentTeamListProps) => {
  const staffs = teamMembers.filter(m => m.role === 'DEPARTMENT_STAFF');
  const technicians = teamMembers.filter(m => m.role === 'TECHNICIAN');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-800">Department Personnel</h2>
        <Link href="/manager/staff" className="text-xs font-bold text-[#7E22CE] hover:underline">
          Manage Team →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Department Staff Section */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-between">
            Staff Members <span className="bg-purple-100 text-[#7E22CE] px-2 py-0.5 rounded-full text-xs">{staffs.length}</span>
          </h3>
          <div className="space-y-3">
            {staffs.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No staff assigned.</p>
            ) : (
              staffs.slice(0, 4).map(staff => (
                <div key={staff.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{staff.name}</p>
                    <p className="text-xs text-gray-500">{staff.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Technicians Section */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-between">
            Field Technicians <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{technicians.length}</span>
          </h3>
          <div className="space-y-3">
            {technicians.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No technicians available.</p>
            ) : (
              technicians.slice(0, 4).map(tech => (
                <div key={tech.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{tech.name}</p>
                    <p className="text-xs text-gray-500">{tech.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};