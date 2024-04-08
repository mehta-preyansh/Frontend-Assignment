import React from "react";
import styled from "styled-components";

export const Log = ({ timestamp, message, code }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getDateFromTimestamp = (timeStamp) => {
    const date = new Date(timeStamp);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    return `${month} ${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };
  return (
    <LogContainer>
      <div className={`border ${code==='success'? "success":code==='error'? "error": ""}`}></div>
      <div className="timestamp-wrapper">
        <span>{getDateFromTimestamp(timestamp)}</span>
      </div>
      {code ? (
        <div className={`code-wrapper ${code==='success'? "success":code==='error'? "error": ""}`}>
          <span>{`[${code}]`}</span>
        </div>
      ) : null}
      <div className={`message-wrapper ${code==='error'? "error": ""}`}>
        <span>{message}</span>
      </div>
    </LogContainer>
  );
};

const LogContainer = styled.div`
  display: flex;
  gap: 9px;
  font-size: 12px;
  font-family: "Fira Code", monospace;
  margin-bottom: 12px;
  .border {
    background-color: #60a5fa;
    &.success{
      background-color: #2DD4BF;
    }
    &.error{
      background-color: #F87171;
    }
    min-width: 2px;
    border-radius: 1px;
    height: 17px;
  }
  .code-wrapper {
    color: #5E7BAA;
    &.success{
      color: #2DD4BF;
    }
    &.error{
      color: #F87171;
    }
  }
  .timestamp-wrapper {
    color: #5e7baa;
    min-width: 130px;
  }
  .message-wrapper {
    color: #a8c3e8;
    &.error{
      color: #F87171;
    }
  }
`;
