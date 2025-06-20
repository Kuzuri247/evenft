export const NFTSkeleton = () => (
  <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border animate-pulse">
    <div className="h-48 w-full bg-muted"></div>
    <div className="p-4">
      <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-full mb-1"></div>
      <div className="h-4 bg-muted rounded w-2/3 mb-3"></div>
      <div className="flex items-center justify-between">
        <div className="h-3 bg-muted rounded w-24"></div>
        <div className="h-3 bg-muted rounded w-20"></div>
      </div>
    </div>
  </div>
);

 export const ProfileSkeleton = () => (
  <div className="bg-card rounded-lg shadow-sm p-6 mb-8 border border-border mt-12 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 bg-muted rounded w-48 mb-2"></div>
        <div className="h-4 bg-muted rounded w-32 mb-1"></div>
        <div className="h-4 bg-muted rounded w-40"></div>
      </div>
      <div className="flex space-x-4">
        <div className="text-center">
          <div className="h-8 bg-muted rounded w-8 mx-auto mb-1"></div>
          <div className="h-3 bg-muted rounded w-12"></div>
        </div>
        <div className="text-center">
          <div className="h-8 bg-muted rounded w-8 mx-auto mb-1"></div>
          <div className="h-3 bg-muted rounded w-12"></div>
        </div>
      </div>
    </div>
    <div className="mt-4 flex space-x-3">
      <div className="h-8 bg-muted rounded w-20"></div>
      <div className="h-8 bg-muted rounded w-28"></div>
    </div>
  </div>
);
