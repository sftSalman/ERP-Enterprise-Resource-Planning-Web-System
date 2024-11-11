import React from 'react';
import { Handle } from 'react-flow-renderer';

const EmployeeNode = ({ data }) => {
  return (
    <div>
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 border border-gray-300">
        <img src={`http://127.0.0.1:8000/storage/employees/avatars/` + data.image} alt={data.label} className="w-5 h-5 rounded-full object-cover" />
        <Handle type="source" position="right" />
        <Handle type="target" position="left" />
      </div>
      <p className="text-center mt-2 text-xs">{data.label}</p>
    </div>

  );
};

export default EmployeeNode;
