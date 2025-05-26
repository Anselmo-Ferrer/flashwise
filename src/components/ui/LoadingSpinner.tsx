import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[100px]">
      <div className="animate-spin rounded-full h-16 w-16 border-2 border-[#FFA500] border-t-transparent"></div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
};
