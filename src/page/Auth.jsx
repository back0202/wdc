import { Button, TextField } from '@mui/material'
import React, { useState, useRef } from 'react'
import styled from 'styled-components'

const Contaier = styled.div`
   display: flex;
   flex-direction: column;
    align-items: center;
    height:100vh;
    justify-content: center;

`

function Auth() {
    const [auth, setAuth] = useState("회원가입")
    const idRef = useRef("")
    const passwordRef = useRef("")
    const onClickBtn = () => {
        console.log(idRef.current, passwordRef)
    }
    const onClickAuth = () => {
        setAuth((prev) => prev === "로그인" ? "회원가입" : "로그인")
    }
    return (
        <Contaier>
            <TextField
                ref={idRef}
                id="standard-required"
                label="아이디"
                variant="standard"


            />
            <TextField
                ref={passwordRef}
                id="standard-password-input"
                label="비밀번호"
                type="password"
                autoComplete="current-password"
                variant="standard"
            />
            <Button variant="text" onClick={onClickBtn}>{auth === "로그인" ? "회원가입" : "로그인"}</Button>
            <Button variant="text" color='secondary' onClick={onClickAuth}>{auth}</Button>
        </Contaier>
    )
}

export default Auth
