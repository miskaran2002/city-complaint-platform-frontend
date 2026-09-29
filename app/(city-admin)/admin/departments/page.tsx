'use client';

import React, { useState, useEffect } from 'react';
import { Department } from '@/types/department';
import { getAllDepartments, createDepartment } from '@/services/department.service';
import { DepartmentForm } from '@/components/admin/departments/DepartmentForm';
import { DepartmentTable } from '@/components/admin/departments/DepartmentTable';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form States
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await getAllDepartments();
      if (res.success && res.data) {
        setDepartments(res.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch departments', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await createDepartment({ name, code, description });
      if (res.success) {
        setSuccess('Department created successfully!');
        setName('');
        setCode('');
        setDescription('');
        fetchDepartments(); 
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Departments</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage city departments and their service categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ⬅️ Left Column: Form Component */}
        <DepartmentForm
          name={name}
          setName={setName}
          code={code}
          setCode={setCode}
          description={description}
          setDescription={setDescription}
          isSubmitting={isSubmitting}
          error={error}
          success={success}
          onSubmit={handleSubmit}
        />

        {/* ➡️ Right Column: Table Component */}
        <DepartmentTable
          departments={departments}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}