import { useState } from 'react';
import { TextField } from '@/views/components/Form/TextField';
import type { ValidationRule } from '@/views/components/types';
import '@/assets/login.scss';

export const Login = () => {
  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const rules: ValidationRule[] = [v => !!v || '필수 입력사항입니다.'];

  return (
    <div className="login">
      <h1>환영합니다!</h1>
      <span>
        이메일과 비밀번호를 입력해서 로그이 해주세요!<br />
        오늘도 성공적인 주문이 되길 ^^
      </span>
      <div className="logo" />
      <ul className="login-form">
        <li>
          <TextField
            placeholder="아이디 입력"
            onChange={setUserId}
            value={userId}
            validate={rules}
          />
        </li>
        <li>
          <TextField
            type="password"
            placeholder="비밀번호 입력"
            onChange={setPassword}
            value={password}
            validate={rules}
          />
        </li>
        <li><a href="#">로 그 인</a></li>
        <li><a href="#">회원가입</a></li>
      </ul>
    </div>
  );
}


