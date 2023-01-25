import { Button, TextField, Typography } from '@mui/material';
import React, { useState, useRef } from 'react';
import { authService } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import styled from 'styled-components';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 100vh;

  justify-content: center;
`;

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useState('로그인');
  const [error, setError] = useState('');
  const onChange = event => {
    const {
      target: { type, value },
    } = event;
    if (type === 'email') {
      setEmail(value);
    } else if (type === 'password') {
      setPassword(value);
    }
  };
  const handleAuthEvent = async event => {
    event.preventDefault();
    try {
      if (auth === '로그인') {
        await signInWithEmailAndPassword(authService, email, password);
      } else if (auth === '회원가입') {
        await createUserWithEmailAndPassword(authService, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAuth = () => {
    setAuth(prev => (prev === '로그인' ? '회원가입' : '로그인'));
    setError('');
  };

  return (
    <Container>
      <TextField
        id="standard-required"
        type="email"
        name="email"
        label="이메일"
        variant="standard"
        onChange={onChange}
      />
      <TextField
        id="standard-password-input"
        label="비밀번호"
        type="password"
        name="password"
        autoComplete="current-password"
        variant="standard"
        onChange={onChange}
      />
      {error && <Typography>이메일과 비밀번호를 다시 확인해주세요</Typography>}
      <Button variant="contained" onClick={handleAuthEvent}>
        {auth === '로그인' ? '로그인' : '회원가입'}
      </Button>

      <Button variant="text" color="secondary" onClick={toggleAuth}>
        {auth === '로그인' ? '회원가입' : '로그인'}
      </Button>
    </Container>
  );
}

export default Auth;
