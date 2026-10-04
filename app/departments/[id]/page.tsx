// app/departments/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/axios';
import { useParams } from 'next/navigation';
import GlobalLoading from '@/app/loading';
import { Navbar } from '@/components/shared/Navbar';

export default function SingleDepartmentPage() {
  const params = useParams();
  const id = params.id;
  const [dept, setDept] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeptDetails = async () => {
      try {
        const res = await apiClient.get(`/departments/${id}`);
        if (res.data?.success) setDept(res.data.data);
      } catch (error) {
        console.error('Error fetching department details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDeptDetails();
  }, [id]);

  if (loading) return <GlobalLoading />;
  if (!dept) return <div className="pt-32 text-center text-xl">Department not found</div>;

  // Calculate Stats
  const totalComplaints = dept.complaints?.length || 0;
  const resolvedComplaints = dept.complaints?.filter((c: any) => c.status === 'RESOLVED').length || 0;

  // Filter Users
  const managers = dept.users?.filter((u: any) => u.role === 'DEPARTMENT_MANAGER') || [];
  const technicians = dept.users?.filter((u: any) => u.role === 'TECHNICIAN') || [];
  const staffs = dept.users?.filter((u: any) => u.role === 'DEPARTMENT_STAFF') || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      {/* Top Hero with Image */}
      <div className="relative h-80 w-full mt-20 bg-purple-900">
        {dept.imageUrl ? (
          <img src={dept.imageUrl} alt={dept.name} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#4C1D95] to-[#C026D3] opacity-80" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">{dept.name}</h1>
          <p className="text-lg max-w-2xl drop-shadow-md">{dept.description}</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Total Complaints Received</p>
              <p className="text-4xl font-black text-[#1E1B4B] mt-2">{totalComplaints}</p>
            </div>
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl">📥</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">Complaints Resolved</p>
              <p className="text-4xl font-black text-emerald-600 mt-2">{resolvedComplaints}</p>
            </div>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl">✅</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Staff & Personnel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Department Personnel</h2>
              
              <div className="space-y-6">
                {/* Managers */}
                <div>
                  <h3 className="text-sm font-bold text-purple-600 uppercase mb-3">Managers</h3>
                  {managers.length > 0 ? managers.map((m: any) => (
                    <div key={m.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl mb-2">
                      <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center font-bold text-purple-700">{m.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.email}</p>
                      </div>
                    </div>
                  )) : <p className="text-sm text-gray-400">No managers assigned.</p>}
                </div>

                {/* Technicians */}
                <div>
                  <h3 className="text-sm font-bold text-amber-600 uppercase mb-3">Technicians</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {technicians.length > 0 ? technicians.map((t: any) => (
                      <div key={t.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                         <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center font-bold text-amber-700 text-sm">{t.name.charAt(0)}</div>
                         <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                      </div>
                    )) : <p className="text-sm text-gray-400">No technicians assigned.</p>}
                  </div>
                </div>

                {/* General Staff */}
                <div>
                  <h3 className="text-sm font-bold text-blue-600 uppercase mb-3">General Staff</h3>
                  <div className="flex flex-wrap gap-2">
                    {staffs.length > 0 ? staffs.map((s: any) => (
                      <span key={s.id} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-100">
                        {s.name}
                      </span>
                    )) : <p className="text-sm text-gray-400">No staff assigned.</p>}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Categories */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Handled Categories</h2>
              <ul className="space-y-3">
                {dept.categories && dept.categories.length > 0 ? (
                  dept.categories.map((cat: any) => (
                    <li key={cat.id} className="flex items-center gap-3 text-gray-700 font-medium bg-gray-50 p-3 rounded-xl">
                      <span className="text-[#C026D3]">❖</span> {cat.name}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No specific categories found.</p>
                )}
              </ul>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}