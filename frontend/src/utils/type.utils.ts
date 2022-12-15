export const isUndefined = <T>(target: T | undefined): target is undefined => {
	return target === undefined;
};

export const isNull = <T>(target: T | null): target is null => {
	return target === null;
};

export const isNullOrUndefined = <T>(target: T | null | undefined): target is null | undefined => {
	return isNull(target) || isUndefined(target);
};
