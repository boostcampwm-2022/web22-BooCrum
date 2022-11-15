import { sidebarItems } from '@data/workspace-sidebar';
import { orderTypes } from '@data/workspace-order';
import { atom } from 'recoil';

export const workspaceTypeState = atom({
	key: 'workspaceType',
	default: Object.keys(sidebarItems)[0],
});

export const workspaceOrderState = atom({
	key: 'workspaceOrder',
	default: orderTypes[0].id,
});
