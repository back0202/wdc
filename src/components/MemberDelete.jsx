import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getFirestore, deleteDoc, doc } from 'firebase/firestore';

export const dbService = getFirestore();

export default function AlertDialog({ children, nameValue, birthValue, id }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteMemberApi = async () => {
    try {
      await deleteDoc(doc(dbService, 'Member', id));
      setOpen(false);
    } catch (error) {
      console.log(error);
      alert('에러입니다');
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} color="error">
        삭제
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">회원 정보 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <span style={{ color: '#d32f2f' }}>{nameValue}</span>
            <span style={{ color: '#1976d2' }}>({birthValue})</span>님의
            회원정보를 삭제하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteMemberApi} variant="contained" autoFocus>
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
