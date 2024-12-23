  // Utility function to format ISO date to yyyy-MM-dd
  function formatDate(isoDate){
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0]; // Extract yyyy-MM-dd part
  };