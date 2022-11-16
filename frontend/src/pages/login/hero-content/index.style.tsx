import styled from 'styled-components';

export const Container = styled.div`
	width: 30%;
	height: 100%;
	padding: 100px 94px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
`;

export const Heading = styled.div`
	font-weight: 700;
	font-size: 40px;
	line-height: 56px;
	margin-bottom: 75px;

	.point_typo {
		color: ${({ theme }) => theme.blue_1};
	}
`;
