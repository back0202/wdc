import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { getBirthToString } from 'utils/dateToString';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

export const dbService = getFirestore();

function TimePicker({ children, userBirth, setUserBirth }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        label="For mobile"
        value={userBirth}
        onChange={newValue => {
          console.log(userBirth);
          setUserBirth(getBirthToString(newValue));
        }}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

export default function AlertDialog({ nameValue, birthValue, id }) {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState(nameValue);
  const [userBirth, setUserBirth] = useState(birthValue);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateMemberApi = async () => {
    await updateDoc(doc(dbService, 'Member', id), {
      name: userName,
      birth: userBirth,
    });

    setOpen(false);
  };

  const onChange = event => {
    if (event.target.name === '이름') {
      setUserName(event.target.value);
    } else if (event.target.name === '생년월일') {
      setUserBirth(event.target.value);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        수정
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">회원 정보 수정</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-required"
            type="text"
            name="이름"
            label="이름"
            defaultValue={nameValue}
            variant="standard"
            onChange={onChange}
          />
        </DialogContent>

        <DialogContent>
          <TimePicker userBirth={userBirth} setUserBirth={setUserBirth} />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleUpdateMemberApi} autoFocus>
            확인
          </Button>
          <Button onClick={handleClose} color="inherit">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
