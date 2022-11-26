import { useState } from 'react';
import { authState } from '@context/user';
import { useRecoilState } from 'recoil';
import axios from 'axios';

function useAuth() {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuth, setIsAuth] = useRecoilState(authState);

	const authorizate = () => {
		setIsAuth(true);
		localStorage.setItem('auth', JSON.stringify(true));
	};

	const deprivate = () => {
		setIsAuth(false);
		localStorage.setItem('auth', JSON.stringify(false));
	};

	async function authenticate() {
		try {
			await axios.get('/api/auth/status');
			authorizate();
			setIsLoading(false);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401) {
					deprivate();
				}
			}
			setIsLoading(false);
		}
	}

	async function login() {
		try {
			const result = await axios.get('/api/auth/oauth/github', {
				withCredentials: true,
			});
			// github auth 페이지로 리다이렉트
			window.location.href = result.data.url;
			return true;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 400) {
					authorizate();
					return true;
				}
			}
			return false;
		}
	}

	async function logout() {
		try {
			await axios.put('/api/auth/logout');
			deprivate();
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401) {
					deprivate();
				}
			}
		}
	}

	return {
		isLoading,
		isAuth,
		authenticate,
		login,
		logout,
	};
}

export default useAuth;
