import React from 'react';

export default function UserForm({ user, onChange, onSubmit, onCancel, isEditing }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div>
          <label className="block text-gray-700">Tên:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Mật khẩu:</label>
          <input
            type="password"
            name="password"
            onChange={onChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={!isEditing}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className={`${isEditing ? 'bg-blue-400' : 'bg-green-400'} text-white px-4 py-2 rounded-md hover:bg-${isEditing ? 'green-600' : 'blue-600'}`}
          >
            {isEditing ? 'Lưu' : 'Thêm'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
