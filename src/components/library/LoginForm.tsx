import React, {useEffect, useState} from "react";
import {Button, TextField} from "@material-ui/core";
import {Redirect} from 'react-router-dom'
import LoginCodes from "../../util/LoginCodes";

type Props = {
    passwordErrorMessage?: (password: string)=>string,
    onSubmit: (loginData: { username:string, password: string })=>Promise<LoginCodes>
    backPath?: string
}
const LoginForm: React.FC<Props> = (props: Props) => {
    const {passwordErrorMessage, onSubmit} = props;

    const [loginData, setLoginData] =
        useState<{ username:string, password: string }>({username:'',
            password:''})
    const [isValid, setIsValid] = useState<boolean>(false);
    const [backFl, setBackFl] = useState<boolean>(false);
    const handlerInput = (event: any) => {
        if (event.target.name === 'username') {
            loginData.username = event.target.value;
        } else {
            loginData.password = event.target.value;
        }
        setLoginData({...loginData})
    }
    const onSubmitHandler = async (event: any) => {
        event.preventDefault();


        const res: LoginCodes = await onSubmit(loginData);
        if (res === LoginCodes.OK) {
            setBackFl(true);
        } else {
            const alertMessage = res === LoginCodes.WRONG_CREDENTIALS ?
                "Wrong either username or password" : "Authentication server is not " +
                "available, please repeat later"
            alert(alertMessage)
        }


    }
    useEffect(() => {
        function validate(): boolean {
            return !!loginData.username && ((passwordErrorMessage &&
                !passwordErrorMessage(loginData.password)) || !passwordErrorMessage)
        }
        setIsValid(validate())
    }, [loginData, passwordErrorMessage])
    return <React.Fragment>
        <form onSubmit={onSubmitHandler} style={{"display": "flex",
            "flexDirection": "column"}}>
            <TextField name={'username'} label="Username" onChange={handlerInput}/>
            <TextField name={'password'} label="Password" onChange={handlerInput}
                       type={'password'} helperText={passwordErrorMessage &&
            passwordErrorMessage(loginData.password)}/>
            <div>
                <Button color={'primary'} id="s1"  disabled={!isValid} type={'submit'}>Submit</Button>

                <Button color={'primary'} type={'reset'}>Reset</Button>
            </div>

        </form>
        {backFl && <Redirect to={props.backPath || '/'}/>}
    </React.Fragment>
}
export default LoginForm;
