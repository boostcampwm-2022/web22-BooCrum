import { useState, useEffect } from 'react';
import { authState } from '../context/auth';
import { useRecoilState } from 'recoil';
import axios from 'axios';

function fakeAuth(): Promise<boolean> {
	return new Promise((resolve, reject) => {
		setInterval(() => {
			resolve(false);
		}, 1000);
	});
}

function useAuth() {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuth, setIsAuth] = useRecoilState(authState);

	async function authenticate() {
		try {
			const result = await fakeAuth();
			setIsAuth(result);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	}

	async function login() {
		try {
			const result = await axios.get('/auth/oauth/github', {
				withCredentials: true,
			});

			if (result.status !== 200) {
				//로그인 실패 모달
				return alert('로그인 실패');
			}
			// github auth 페이지로 리다이렉트
			window.location.href = result.data.url;
		} catch (error) {
			console.log(error);
		}
	}

	return {
		isLoading,
		isAuth,
		authenticate,
		login,
	};
}

export default useAuth;
