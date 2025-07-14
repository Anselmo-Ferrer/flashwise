import React from 'react';

type LoadingSpinnerProps = {
  width?: number
  height?: number
}

export default function LoadingSpinner({ width, height }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full h-[${height}px] w-[${width}px] border-2 border-[#FFA500] border-t-transparent`}></div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
};
