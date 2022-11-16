import { useState, useEffect } from 'react';
import { authState } from '../context/auth';
import { useRecoilState } from 'recoil';

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

	return {
		isLoading,
		isAuth,
		authenticate,
	};
}

export default useAuth;
