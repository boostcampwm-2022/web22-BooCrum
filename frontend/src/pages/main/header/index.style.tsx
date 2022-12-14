import styled from 'styled-components';

export const Container = styled.div`
	height: 60px;
	border-bottom: 1px solid ${({ theme }) => theme.gray_1};

	display: flex;
	align-items: center;
	justify-content: flex-end;

	padding-right: 24px;

	.alarm-icon {
		width: 24px;
		height: 24px;

		cursor: pointer;

		margin-right: 20px;
	}
`;
