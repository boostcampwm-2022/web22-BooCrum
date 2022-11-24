import styled from 'styled-components';

export const Container = styled.div`
	height: 56px;

	border-bottom: 1px solid ${({ theme }) => theme.gray_1};

	display: flex;
	align-items: center;

	.title {
		font-size: 20px;
		font-weight: 400;
		line-height: 27px;

		text-align: center;

		flex: 1;
	}
`;
