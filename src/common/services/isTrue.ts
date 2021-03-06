type IValueTrue = boolean | string | number;

export const isTrue = (value: IValueTrue) => {
  const varsTrue: IValueTrue[] = [
    true,
    'True',
    'true',
    'T',
    't',
    1,
    '1',
    'y',
    'yes',
  ];

  return varsTrue.includes(value);
};
