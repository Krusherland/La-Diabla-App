interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loading = ({ message = 'Cargando...', size = 'md' }: LoadingProps) => {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <span className={`loading loading-spinner text-diabla-red ${sizeClasses[size]}`}></span>
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
};

export default Loading;
