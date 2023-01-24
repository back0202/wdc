import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useRef } from 'react';
import styled from 'styled-components';
const Input = styled.input`
  display: none;
`;
const actions = [{ icon: <AddPhotoAlternateIcon />, name: 'img' }];

export default function BasicSpeedDial({ onChange }) {
  const Ref = useRef();
  const onClick = () => {
    Ref.current?.click();
  };
  return (
    <>
      <Input type="file" ref={Ref} onChange={onChange} />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={onClick}
          />
        ))}
      </SpeedDial>
    </>
  );
}
