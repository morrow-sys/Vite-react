import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const Clock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return (
    <Typography
      variant="body2"
      sx={{
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        color: '#ccc',
        ml: 2,
        minWidth: 70,
        textAlign: 'center',
      }}
    >
      {`${hours}:${minutes}:${seconds}`}
    </Typography>
  );
};

export default Clock;
