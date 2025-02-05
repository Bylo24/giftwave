export const GiftNotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Gift Not Found</h1>
        <p className="text-muted-foreground">
          This gift doesn't exist or has already been collected.
        </p>
      </div>
    </div>
  );
};