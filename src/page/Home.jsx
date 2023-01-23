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
  const Ref = useRef()
  const handleUpload = (e) => {
    let file = e.target.files[0]
    getText(file)
  }

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
              console.log(element);
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
      <input type="file" ref={Ref} onChange={handleUpload} />
      <button onClick={() => { Ref.current?.click() }}>버튼</button>
    </Box>
  );
}
