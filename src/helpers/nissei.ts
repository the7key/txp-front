export const createCheckSum = async (arr: number[]) => {
  let sum = 0;
  for (let i = 0; i < 19; i++) {
    sum = sum + arr[i];
  }
  let check_sum = sum + 0xa5;
  check_sum = ~check_sum + 1;
  return new Uint8Array([check_sum])[0];
};

export const createCnkeyCheckCommand = async (arr: number[]) => {
  if (arr.length !== 4) {
    return [];
  }

  const commandArr = [0xe7, 0xfd];
  for (let i = 0; i < 20; i++) {
    if (i < 4) {
      commandArr.push(arr[i]);
    } else {
      if (commandArr.length < 19) {
        commandArr.push(0xff);
      }
    }
  }

  const checkSum = await createCheckSum(commandArr);
  commandArr.push(checkSum);
  return commandArr;
};
