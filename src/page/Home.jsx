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
import { collection, onSnapshot, getFirestore } from 'firebase/firestore';
import { async } from '@firebase/util';
import axios from 'axios';
import BasicSpeedDial from '../components/SpeedDial';

const dbService = getFirestore();

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
  const [value, setValue] = useState(0);
  const [member, setMember] = useState([]);
  const [attachment, setAttachment] = useState();
  const [naverOcrData, setNaverOcrData] = useState([]);
  const Ref = useRef();
  const handleUpload = e => {
    let file = e.target.files[0];
    console.log(file, 'file');
    getText(file);
  };

  const uploadImage = async () => {
    let axiosConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const response = await axios.get(
      'http://localhost:8080/api/naver',
      axiosConfig,
    );
    console.log(response);

    return response;
  };

  const handleApiImage = async e => {
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result.split(',')[1], "reader.result.split(',')[1]");
      setAttachment(reader.result.split(',')[1]);
    };

    const response = await uploadImage();

    console.log(response.data.data);
    setNaverOcrData(response.data.data);
  };

  const handleApi = async () => {
    const userList = await axios
      .get('http://localhost:8080/api/test')
      .then(response => {
        console.log(response, 'response');
        return response;
      })
      .catch(error => {
        console.log(error);
      });
    console.log(userList);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    onSnapshot(collection(dbService, 'Member'), snapShot => {
      const memberList = snapShot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMember(memberList);
    });
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
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
          {member &&
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
          <ItemList name="뉴진스" birthday="2022.01.02">
            <button>수정</button>
            <button>삭제</button>
          </ItemList>
        </List>
      </TabPanel>
      {naverOcrData.length > 0 || <BasicSpeedDial onChange={handleApiImage} />}
      {naverOcrData.length > 0 && (
        <div
          style={{
            position: 'fixed',
            background: '#Fdfdfd',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          출석등록
        </div>
      )}
    </Box>
  );
}
