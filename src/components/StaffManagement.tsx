import React, { useState } from 'react';
import { Staff, StaffRole, roleLabels } from '../types';
import { UserPlus, Edit2, Trash2, X, Check } from 'lucide-react';

interface StaffManagementProps {
  staff: Staff[];
  onAddStaff: (staff: Omit<Staff, 'id'>) => void;
  onUpdateStaff: (staff: Staff) => void;
  onDeleteStaff: (id: string) => void;
}

interface EditingStaff extends Staff {
  isNew?: boolean;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
  staff,
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
}) => {
  const [editingStaff, setEditingStaff] = useState<EditingStaff | null>(null);

  const handleAddNew = () => {
    setEditingStaff({
      id: '',
      name: '',
      role: 'designer',
      isNew: true,
    });
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
  };

  const handleSave = async () => {
    if (!editingStaff) return;

    try {
      if (editingStaff.isNew) {
        const { name, role } = editingStaff;
        await onAddStaff({ name, role });
      } else {
        await onUpdateStaff(editingStaff);
      }
      setEditingStaff(null);
    } catch (error) {
      console.error('Failed to save staff:', error);
      alert('スタッフの保存に失敗しました。');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('このスタッフを削除してもよろしいですか？')) {
      try {
        await onDeleteStaff(id);
      } catch (error) {
        console.error('Failed to delete staff:', error);
        alert('スタッフの削除に失敗しました。');
      }
    }
  };

  const handleCancel = () => {
    setEditingStaff(null);
  };

  const validateForm = (staff: EditingStaff) => {
    return staff.name.trim() !== '' && staff.role !== '';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">スタッフ管理</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            スタッフの追加、編集、削除ができます
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          新規スタッフ追加
        </button>
      </div>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名前
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                役割
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((member) => (
              <tr key={member.id}>
                {editingStaff?.id === member.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editingStaff.name}
                        onChange={(e) =>
                          setEditingStaff({ ...editingStaff, name: e.target.value })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={editingStaff.role}
                        onChange={(e) =>
                          setEditingStaff({
                            ...editingStaff,
                            role: e.target.value as StaffRole,
                          })
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={!validateForm(editingStaff)}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {roleLabels[member.role]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {editingStaff?.isNew && (
              <tr>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={editingStaff.name}
                    onChange={(e) =>
                      setEditingStaff({ ...editingStaff, name: e.target.value })
                    }
                    placeholder="スタッフ名"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={editingStaff.role}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        role: e.target.value as StaffRole,
                      })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={!validateForm(editingStaff)}
                    className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};