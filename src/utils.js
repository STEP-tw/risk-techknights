const generateRandomNum = function(size) {
  const startingNum = Math.pow(10, size - 1);
  const maxRandomNum = Math.pow(10, size) - startingNum - 1;
  const fourDigitFloat = Math.random() * maxRandomNum + startingNum;
  return Math.floor(fourDigitFloat);
};

const getUniqueNum = function(size, list) {
  let uniqueNum;
  do {
    uniqueNum = generateRandomNum(size);
  } while (list.includes(uniqueNum));
  return uniqueNum;
};

module.exports = { getUniqueNum };
