import timediff from "timediff";

export const timeConvertoKor = (time: string) => {
  const timeArr = time.split(" ");
  const year = timeArr[0].split("-")[0];
  const month = timeArr[0].split("-")[1];
  const day = timeArr[0].split("-")[2];
  const hour = timeArr[1].split(":")[0];
  const min = timeArr[1].split(":")[1];

  return `${year}년 ${month}월 ${day}일 ${hour}시 ${min}분`;
};
export const timeConvertoCompare = (time: string): number => {
  const timeArr = time.split(" ");
  const year = timeArr[0].split("-")[0];
  const month = timeArr[0].split("-")[1];
  const day = timeArr[0].split("-")[2];
  const hour = timeArr[1].split(":")[0];
  const min = timeArr[1].split(":")[1];

  return parseInt(`${year}${month}${day}${hour}${min}`);
};

export const timeConvertoReqFormat = (time: string) => {
  const timeArr = time.split(", ");
  const year = timeArr[0].split("/")[2];
  const month = timeArr[0].split("/")[1];
  const day = timeArr[0].split("/")[0];
  const hour = timeArr[1].split(":")[0];
  const min = timeArr[1].split(":")[1];

  return `${year}-${month}-${day} ${hour}:${min}:00`;
};

export const convertToTimeDiff = (startTime: string, endTime: string) => {
  // case1: 24년 1월 1일 10시 10분 ~ 24년 1월 1일 20시 30분
  // case2: 24년 1월 3일 10시 10분 ~ 25년 1월 4일 20시 30분
  // case3: 24년 1월 3일 10시 10분 ~ 24년 1월 4일 9시 30분
  const daydiff = timediff(startTime, endTime, "D").days;
  const hourdiff = timediff(startTime, endTime).hours;
  const mindiff = timediff(startTime, endTime).minutes;
  return daydiff > 0
    ? `${daydiff}일 ${hourdiff}시간 ${mindiff}분`
    : hourdiff > 0
    ? `${hourdiff}시간 ${mindiff}분`
    : `${mindiff}분`;
};
