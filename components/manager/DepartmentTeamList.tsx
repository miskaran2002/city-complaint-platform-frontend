import React from 'react';
import Link from 'next/link';

interface DepartmentTeamListProps {
  teamMembers: any[];
  departmentName?: string; // Optional prop to display department name if needed in future
}

export const DepartmentTeamList = ({ teamMembers, departmentName }: DepartmentTeamListProps) => {
  // Filter team members based on their roles
  // Note: Backend /admin/users endpoint with query params should already be filtering this
  // based on the Manager's departmentId. We double check here on the frontend just to be safe.
  const staffs = teamMembers.filter(m => m.role === 'DEPARTMENT_STAFF');
  const technicians = teamMembers.filter(m => m.role === 'TECHNICIAN');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
           <h2 className="text-lg font-bold text-gray-800">Department Personnel</h2>
           {departmentName && <p className="text-xs text-gray-500 mt-1">Personnel list for {departmentName}</p>}
        </div>
        
        <Link href="/manager/staff" className="text-xs font-bold text-[#7E22CE] hover:underline flex items-center gap-1">
          Manage Team <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Department Staff Section */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-between">
            Staff Members 
            <span className="bg-purple-100 text-[#7E22CE] px-2.5 py-0.5 rounded-full text-xs font-bold">
              {staffs.length}
            </span>
          </h3>
          <div className="space-y-3">
            {staffs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                 <span className="text-gray-300 text-3xl mb-2">📝</span>
                 <p className="text-sm text-gray-400 italic">No staff assigned to your department yet.</p>
              </div>
            ) : (
              staffs.slice(0, 4).map(staff => (
                <div key={staff.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-purple-100 text-[#7E22CE] flex items-center justify-center font-bold text-sm">
                        {staff.name.charAt(0).toUpperCase()}
                     </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-tight">{staff.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{staff.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-bold tracking-wider text-purple-700 bg-purple-50 border border-purple-100 rounded-md uppercase">
                     Staff
                  </span>
                </div>
              ))
            )}
          </div>
          {staffs.length > 4 && (
             <div className="mt-4 text-center">
                 <Link href="/manager/staff" className="text-xs text-[#7E22CE] hover:underline font-medium">
                    View all {staffs.length} staff members
                 </Link>
             </div>
          )}
        </div>

        {/* Technicians Section */}
        <div className="p-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-between">
            Field Technicians 
            <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {technicians.length}
            </span>
          </h3>
          <div className="space-y-3">
            {technicians.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                 <span className="text-gray-300 text-3xl mb-2">🔧</span>
                 <p className="text-sm text-gray-400 italic">No technicians available in your department.</p>
              </div>
            ) : (
              technicians.slice(0, 4).map(tech => (
                <div key={tech.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {tech.name.charAt(0).toUpperCase()}
                     </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 leading-tight">{tech.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{tech.email}</p>
                    </div>
                  </div>
                   <span className="px-2 py-1 text-[10px] font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded-md uppercase">
                     Technician
                  </span>
                </div>
              ))
            )}
          </div>
           {technicians.length > 4 && (
             <div className="mt-4 text-center">
                 <Link href="/manager/staff" className="text-xs text-blue-600 hover:underline font-medium">
                    View all {technicians.length} technicians
                 </Link>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};