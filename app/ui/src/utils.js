export const arrayToOptions = (array) => {
  return array.map(value=>({value:value, label:value}));
}

export const splitArray = (array, pattern) => {
	var matched = [];
  var notMatched = [];
  array.forEach(item => {
    if (item.match(pattern)) {
      matched.push(item);
    } else {
      notMatched.push(item);
    }
  });

  return [matched, notMatched];
}