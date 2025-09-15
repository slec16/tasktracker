
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    //@ts-ignore
    <div className={`inline-block ${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        {/* Левый полукруг */}
        <div className="absolute inset-0 border-2 border-l-sky-600 dark:border-l-orange-600 border-b-sky-600 dark:border-b-orange-600 border-r-transparent border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;