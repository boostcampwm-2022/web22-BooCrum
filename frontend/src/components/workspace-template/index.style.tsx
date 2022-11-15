import styled from 'styled-components';

export const Template = styled.div<{ isEmpty: boolean }>`
	& + & {
		margin-left: 24px;
	}

	.template-card {
		width: 150px;
		height: 100px;

		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 10px;

		background: ${({ theme }) => theme.blue_3};
	}

	.preview {
		width: 150px;
		height: 100px;

		border-radius: 10px;
	}

	.new-icon {
		width: 30px;
		height: 30px;
	}

	.template-title {
		font-size: 15px;
		font-weight: 600;
		line-height: 20px;

		width: 150px;
		word-break: keep-all;

		margin-top: 12px;
	}
`;
