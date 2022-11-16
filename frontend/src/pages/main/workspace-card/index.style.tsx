import styled from 'styled-components';

export const CardLayout = styled.div`
	width: 200px;
	border: none;
	border-radius: 10px;
	box-shadow: 3px 4px 4px rgba(0, 0, 0, 0.25);
	overflow: hidden;
	transition: all 0.2s;
	.card-thumbnail {
		display: block;
		height: 200px;
		background-color: #d8d8d8;
	}
	.card-info {
		padding: 0.5rem;
	}
	.card-title {
		font-size: 16px;
		font-weight: 600;
	}
	.card-timestamp {
		font-size: 12px;
		color: #808080;
	}
	:hover {
		box-shadow: 7px 7px 4px rgba(0, 0, 0, 0.25);
	}
`;
