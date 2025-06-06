export const ProductSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
    <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="flex gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-3 h-3 bg-gray-200 rounded"></div>
      ))}
    </div>
    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
  </div>
);
