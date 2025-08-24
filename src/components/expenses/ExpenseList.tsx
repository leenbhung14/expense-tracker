import React from 'react';

export const ExpenseList: React.FC = () => {
  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Expense List</h2>
      </div>
      <div className="px-6 py-4">
        <p className="text-gray-500">No expenses found.</p>
      </div>
    </div>
  );
};