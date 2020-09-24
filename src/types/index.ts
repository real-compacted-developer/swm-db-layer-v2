export const GenderArray = ['M', 'F'] as const;
export type Gender = typeof GenderArray[number];
