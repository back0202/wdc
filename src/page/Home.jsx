import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ItemList from 'components/ItemList';
import { useRef } from 'react';
import { getText } from 'apis/naverOcr';
import List from '@mui/material/List';
import MemberAdd from '../components/MemberAdd';
import MemberUpdate from '../components/MemberUpdate';
import MemberDelete from '../components/MemberDelete';
import { collection, onSnapshot, getFirestore, getDocs } from 'firebase/firestore';
import { async } from '@firebase/util';
import axios from 'axios';
import BasicSpeedDial from '../components/SpeedDial';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Home({ userObject }) {
  const [open, setOpen] = useState(false);
  const [dbData, setDbData] = useState([]);
  const [inputAttend, setInputAttend] = useState([])
  const [attendDate, setAttendDate] = useState()

  const Ref = useRef()
  const onClickAttend = async () => {

    const includeDb = dbData.filter((x) => {
      return inputAttend.includes(x.name)
    })

    includeDb.map(async (x) => {
      await axios.patch(`http://localhost:3000/members/${x.id}`, { attend: [...x.attend, attendDate] })

    })
    setDbData([])
    setInputAttend([])
    setAttendDate("")
    const a = await axios.get("http://localhost:3000/members")
    setMember(a.data)
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()

    const getUser = async () => {
      const userList = await axios.get("http://localhost:3000/members")

      const attendList = userList.data.filter((x) => {

        const isAttend = x.attend.filter((y) => {
          const first = new Date(`${year}-${month + 1}-${day}`)
          const last = new Date(`${year}-${month + 1}-${day - 21}`)
          const attendDay = new Date(y)

          return last <= attendDay && attendDay <= first

        })

        return isAttend.length === 0

      })

      setNotAttend(attendList)
    }
    getUser()

  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [value, setValue] = useState(0);
  const [member, setMember] = useState([]);
  const [notAttend, setNotAttend] = useState([])
  const [naverOcrData, setNaverOcrData] = useState([]);



  useEffect(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()

    const getUser = async () => {
      const userList = await axios.get("http://localhost:3000/members")
      const attendList = userList.data.filter((x) => {
        const isAttend = x.attend.filter((y) => {
          const first = new Date(`${year}-${month + 1}-${day}`)
          const last = new Date(`${year}-${month + 1}-${day - 21}`)
          const attendDay = new Date(y)

          return last <= attendDay && attendDay <= first

        })
        return isAttend.length === 0

      })

      setNotAttend(attendList)
    }
    getUser()
  }, [])



  const handleApiImage = async e => {
    const a = await axios.get("http://localhost:3000/members")
    setDbData(a.data)

    handleClickOpen()
  };



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const getDbData = async () => {
      const a = await axios.get("http://localhost:3000/members")

      setMember(a.data)
    }
    getDbData()

  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"출석체크"}
        </DialogTitle>
        <DialogContent>
          <div><input type="date" onChange={(e) => {
            setAttendDate(e.target.value)
          }} /></div>

          <input type="text" ref={Ref} />
          <button onClick={() => setInputAttend((prev => [...prev, Ref.current.value]))}>출석</button>
          {inputAttend.map((x) => {
            return <div key={x}>{x}</div>
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={() => { handleClose(); onClickAttend() }} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
        >
          <Tab label="회원목록" {...a11yProps(0)} />
          <Tab label="3주간 미참석" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <MemberAdd />
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {member.length > 0 &&
            member.map(element => {
              return (
                <ItemList
                  id={element.id}
                  name={element.name}
                  birthday={element.birth}
                >
                  <Box>
                    <MemberUpdate
                      id={element.id}
                      nameValue={element.name}
                      birthValue={element.birth}
                    />
                    <MemberDelete
                      id={element.id}
                      nameValue={element.name}
                      birthValue={element.birth}
                    />
                  </Box>
                </ItemList>
              );
            })}
        </List>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {notAttend && notAttend.map((x) => {
            return <ItemList name={x.name} birthday={x.birth}>
              <button>수정</button>
              <button>삭제</button>
            </ItemList>
          })}

        </List>
      </TabPanel>

      {naverOcrData.length > 0 || <BasicSpeedDial onClick={handleApiImage} />}


    </Box >
  );
}
