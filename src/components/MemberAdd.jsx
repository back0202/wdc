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
import { memberApi } from 'apis/member/member-api';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { async } from '@firebase/util';

const dbService = getFirestore();

function TimePicker({ children, userBirth, setUserBirth }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileDatePicker
        label="For mobile"
        value={userBirth}
        onChange={newValue => {
          setUserBirth(getBirthToString(newValue));
          console.log(userBirth, 'userBirth');
        }}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

export default function AlertDialog() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userBirth, setUserBirth] = useState('1994.01.01.');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateMemberApi = async () => {
    try {
      // await memberApi.createMember({
      //   name: userName,
      //   birth: userBirth,
      // });
      await addDoc(collection(dbService, 'Member'), {
        name: userName,
        birth: userBirth,
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
      alert('에러입니다');
    }
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
      <Button variant="contained" onClick={handleClickOpen}>
        회원 등록
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">회원 등록</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-required"
            type="text"
            name="이름"
            label="이름"
            variant="standard"
            onChange={onChange}
          />
        </DialogContent>

        <DialogContent>
          <TimePicker userBirth={userBirth} setUserBirth={setUserBirth} />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCreateMemberApi} autoFocus>
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
