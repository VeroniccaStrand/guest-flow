
 export  const formatDate = (dateString) => {
    const options = {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('sv-SV', options);
  };

