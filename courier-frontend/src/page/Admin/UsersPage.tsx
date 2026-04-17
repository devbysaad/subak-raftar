import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  fetchUsersRequest,
  createUserRequest,
  deactivateUserRequest,
  clearUsersError,
} from '@/redux/slice/usersSlice';
import Button from '@/components/ui/Button';
import type { User } from '@/redux/slice/authSlice';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'employee' };

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector((s) => s.users);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  // Close modal and reset when creation succeeds (loading → false, no error)
  const prevLoading = React.useRef(loading);
  useEffect(() => {
    if (prevLoading.current && !loading && !error && showModal) {
      setShowModal(false);
      setForm(EMPTY_FORM);
      setLocalError('');
    }
    prevLoading.current = loading;
  }, [loading, error]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setLocalError('All fields are required.');
      return;
    }
    setLocalError('');
    dispatch(clearUsersError());
    dispatch(createUserRequest(form));
  };

  const handleDeactivate = (id: string) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    dispatch(deactivateUserRequest(id));
  };

  const fieldCls = 'border border-gray-300 rounded px-3 py-2 text-sm bg-[#fafaf5] w-full focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none';
  const labelCls = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1';

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-sm text-gray-700">All Employees</h2>
        <Button onClick={() => { setShowModal(true); setLocalError(''); dispatch(clearUsersError()); }}>
          + Add Employee
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && list.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10">
                  <span className="spinner spinner-green inline-block" style={{ width: 22, height: 22 }} />
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 font-medium">
                  No employees found.
                </td>
              </tr>
            ) : (
              list.map((u: User & { createdAt?: string }) => (
                <tr key={u._id}>
                  <td className="font-medium text-gray-800">{u.name}</td>
                  <td className="text-gray-500 text-xs">{u.email}</td>
                  <td>
                    <span className={`rounded-full text-xs px-2 py-0.5 font-semibold ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`rounded-full text-xs px-2 py-0.5 font-semibold ${
                      u.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-xs text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    {u.isActive ? (
                      <button
                        onClick={() => handleDeactivate(u._id)}
                        className="text-xs text-red-500 hover:text-red-700 hover:underline font-medium"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-[440px] shadow-xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Add Employee</h3>
              <button
                onClick={() => { setShowModal(false); dispatch(clearUsersError()); }}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              {(localError || error) && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded">
                  {localError || error}
                </div>
              )}

              <div>
                <label className={labelCls}>Full Name *</label>
                <input
                  className={fieldCls}
                  placeholder="e.g. Ali Hassan"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <label className={labelCls}>Email Address *</label>
                <input
                  type="email"
                  className={fieldCls}
                  placeholder="ali@subakraftar.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>

              <div>
                <label className={labelCls}>Password *</label>
                <input
                  type="password"
                  minLength={8}
                  className={fieldCls}
                  placeholder="min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
              </div>

              <div>
                <label className={labelCls}>Role</label>
                <select
                  className={fieldCls}
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Modal footer */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => { setShowModal(false); dispatch(clearUsersError()); }}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Create Employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
