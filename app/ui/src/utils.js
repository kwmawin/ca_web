export const arrayToOptions = (array) => {
  return array.map(value=>({value:value, label:value}));
}