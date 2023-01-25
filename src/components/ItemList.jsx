import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import React from 'react';

function ItemList({ children, name, birthday, id }) {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemText
          key={id}
          primary={name}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {birthday}
              </Typography>
            </React.Fragment>
          }
        />
        {children}
      </ListItem>
      <Divider variant="inset" component="li" sx={{ marginLeft: 0 }} />
    </>
  );
}

export default ItemList;
