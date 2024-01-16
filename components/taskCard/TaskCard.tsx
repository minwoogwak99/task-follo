"use client";

import classNames from "classnames/bind";
import style from "./taskCard.module.scss";
const cx = classNames.bind(style);
//
import React, { useEffect, useState } from "react";
import {
  convertToTimeDiff,
  timeConvertoCompare,
  timeConvertoKor,
  timeConvertoReqFormat,
} from "@/utils/timeFunc";
import timediff from "timediff";
import { updateData } from "@/api/api";

interface Card {
  id: number;
  name: string;
  desc: string;
  startTime: string | null;
  endTime: string | null;
  requestedTime: string;
}
enum Status {
  PRE = "pre",
  ON = "working",
  DONE = "done",
}
interface Props {
  data: Card;
}
const TaskCard = ({ data }: Props) => {
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const [isAlreadyPassed, setIsAlreadyPassed] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [status, setStatus] = useState<Status>(Status.PRE);
  const [statusTextToDisplay, setStatusTextToDisplay] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("00:00");

  const today = new Date();
  const currentTime = timeConvertoReqFormat(
    today.toLocaleString("en-GB", { hour12: false })
  );
  const requestedTime = timeConvertoKor(data.requestedTime);

  const getDuration = (): string => {
    const currTime = timeConvertoReqFormat(
      new Date().toLocaleString("en-GB", { hour12: false })
    );
    console.log("starttime::", startTime || data.startTime);
    console.log("currtime:::", currTime);

    return parseInt(convertToTimeDiff(startTime || data.startTime!, currTime)) >
      0
      ? `${timediff(startTime || data.startTime, currTime, "H").hours}:${
          timediff(startTime || data.startTime, currTime).minutes
        }`
      : "0:00";
  };

  useEffect(() => {
    data.endTime
      ? setStatus(Status.DONE)
      : data.startTime
      ? setStatus(Status.ON)
      : setStatus(Status.PRE);

    data.startTime && setDuration(getDuration());
  }, []);

  useEffect(() => {
    if (status === Status.ON) {
      const interval = setInterval(() => {
        setDuration(getDuration());
      }, 60000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [startTime, status]);

  useEffect(() => {
    status === Status.DONE
      ? setStatusTextToDisplay("작업완료")
      : status === Status.ON
      ? setStatusTextToDisplay("작업중")
      : setStatusTextToDisplay("작업예정");

    if (status === Status.DONE) {
      setIsDone(true);
    }
  }, [status]);

  useEffect(() => {
    if (
      status === Status.ON ||
      isAlreadyPassed ||
      (Status.PRE &&
        timeConvertoCompare(data.requestedTime) -
          timeConvertoCompare(currentTime) >
          15)
    ) {
      setIsButtonActive(true);
    }
  }, [isAlreadyPassed]);

  useEffect(() => {
    if (
      timeConvertoCompare(currentTime) > timeConvertoCompare(data.requestedTime)
    ) {
      setIsAlreadyPassed(true);
    }
  }, [currentTime]);

  const handleButtonClick = () => {
    if (status === Status.PRE) {
      const reqTime = timeConvertoReqFormat(
        new Date().toLocaleString("en-GB", { hour12: false })
      );

      setStartTime(reqTime);
      setStatus(Status.ON);

      updateData(
        {
          id: data.id,
          name: data.name || "test",
          desc: data.desc,
          startTime: reqTime,
          endTime: null,
          requestedTime: data.requestedTime,
        },
        data.id
      );
    }
    if (status === Status.ON) {
      const reqTime = timeConvertoReqFormat(
        new Date().toLocaleString("en-GB", { hour12: false })
      );

      setEndTime(reqTime);
      setStatus(Status.DONE);

      updateData(
        {
          id: data.id,
          name: data.name || "test",
          desc: data.desc,
          startTime: data.startTime || startTime,
          endTime: reqTime,
          requestedTime: data.requestedTime,
        },
        data.id
      );
    }
  };

  return (
    <div className={cx("card-wrap")}>
      <div className={cx("card-left-wrap")}>
        <div className={cx("title-wrap")}>
          <span className={cx("status-badge", status)}>
            {statusTextToDisplay}
          </span>
          <span className={cx("title")}>{data.name}</span>
        </div>
        <div className={cx("requested-time")}>
          <span>요청일시:</span>{" "}
          <span className={cx({ "time-passed": isAlreadyPassed })}>
            {requestedTime}
          </span>
        </div>
      </div>
      <div className={cx("card-right-wrap")}>
        {!isDone && (
          <>
            {status === Status.PRE && !isAlreadyPassed && (
              <div className={cx("time-left-wrap")}>
                <span>업무 시작까지 </span>
                <span className={cx("time-diff")}>
                  {convertToTimeDiff(currentTime, data.requestedTime)}
                </span>
                <span> 남았습니다.</span>
              </div>
            )}
            <div style={{ alignSelf: "flex-end" }}>
              <span style={{ marginRight: "10px" }}>
                {status === Status.ON && <span>{duration}</span>}
              </span>
              <button
                onClick={handleButtonClick}
                disabled={!isButtonActive}
                className={cx("status-button", { active: isButtonActive })}
              >
                {status === Status.ON ? "업무종료" : "업무시작"}
              </button>
            </div>
          </>
        )}
        {isDone && (
          <div className={cx("done-wrap")}>
            <div className={cx("duration")}>
              <span>{timeConvertoKor(data.startTime || startTime)} ~ </span>
              <span>{timeConvertoKor(data.endTime || endTime)}</span>
            </div>
            <div className={cx("time-diff")}>
              {convertToTimeDiff(
                data.startTime || startTime,
                data.endTime || endTime
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
