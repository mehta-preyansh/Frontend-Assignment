import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TimeContext } from "../App";
import spinner from "../assets/Sidepane/Spinner.svg";
import arrow from '../assets/Sidepane/arrow-up-long.png'
import { MimicLogs } from "../api-mimic";
import { Log } from "../components/Log";

export const Logs = () => {
  //States for loading, scrolle to bottom, logs array, count of unseen logs
  const [loading, setLoading] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(true);
  const [logs, setLogs] = useState([]);
  const [pendingLogs, setPendingLogs] = useState(0)

  const currentTime = new Date();
  const intervalMap = [5, 15, 30, 60, 3 * 60, 6 * 60];

  //Global state to keep trak of the selected option in dropdown
  const [seletedInterval] = useContext(TimeContext);

  const logListRef = useRef(null);

  //Function to be passed as callback to API
  const pushLogToArray = (log) => {
    setLogs((prevLogs) => [...prevLogs, log]);
  };

  //Handling scrolling in the logs container
  const handleScroll = () => {
    //-----Whether scrolled till bottom or not
    const isAtBottom =
      Math.abs(
        logListRef.current.scrollTop -
          (logListRef.current.scrollHeight - logListRef.current.clientHeight)
      ) < 4;
    //-----Stick to bottom or not
    setScrollToBottom(isAtBottom);
    if(isAtBottom){
      setInitialLength(0)
    }
    if(!isAtBottom && pendingLogs==0){
      setPendingLogs(1)
    }
  };

  //Subscribing to live logs and scroll event listener
  useEffect(() => {
    const flush = MimicLogs.subscribeToLiveLogs(pushLogToArray);
    logListRef.current.addEventListener("scroll", handleScroll);
    return () => {
      logListRef.current?.removeEventListener("scroll", handleScroll);
      flush();
    };
  }, []);

  //Scroll to the bottom when the state changes and keep only certain logs in the screen
  useEffect(() => {
    if (logListRef.current && scrollToBottom) {
      logListRef.current.scrollTop =
        logListRef.current.scrollHeight - logListRef.current.clientHeight;
    }
    if (logs.length > 15 && pendingLogs==0) {
      setLogs((prevLogs) => prevLogs.slice(logs.length-15));
    }
  }, [logs, scrollToBottom]);

  return (
    <LogsContainer>
      <div className="top-section">
        <span>{`Showing logs from ${new Date(
          currentTime.getTime() - intervalMap[seletedInterval] * 60 * 1000
        ).toLocaleDateString()} ${new Date(
          currentTime.getTime() - intervalMap[seletedInterval] * 60 * 1000
        )
          .toLocaleTimeString()
          .slice(0, -6)} to ${new Date().toLocaleDateString()} ${new Date()
          .toLocaleTimeString()
          .slice(0, -6)}`}</span>
      </div>
      <div className="log-wrapper">
        {loading ? (
          <div className="loader">
            <img src={spinner} alt="" />
            <span>Loading previous 100 logs</span>
          </div>
        ) : null}
        <div className="log-list" ref={logListRef}>
          {loading
            ? chunkLogs[chunkLogs.length - 1].map((log, index) => (
                <Log
                  timestamp={log.timestamp}
                  message={log.message}
                  code={log.code}
                  key={log.timestamp}
                ></Log>
              ))
            : logs.map((log, index) => {
                return (
                  <Log
                    timestamp={log.timestamp}
                    message={log.message}
                    code={log.code}
                    key={log.timestamp}
                  ></Log>
                );
              })}
        </div>
        {scrollToBottom ? null : (
          <div
            className="scroll-btn"
            onClick={() => {
              setScrollToBottom(true)
              setInitialLength(0)
            }}
          >
            <span>
            {pendingLogs} new logs 
            </span>
            <img src={arrow} alt="" />
          </div>
        )}
      </div>
    </LogsContainer>
  );
};

const LogsContainer = styled.div`
  padding: 8px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 8px;
  .top-section {
    display: flex;
    flex-direction: row-reverse;
    span {
      font-family: "Work Sans";
      font-size: 12px;
      font-weight: 500;
      color: #1c2a42;
    }
  }
  .log-wrapper {
    flex: 1;
    position: relative;
    overflow: hidden;
    background-color: #090f17;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    .loader {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background-color: #0e1623;
      padding: 8px 0px;
      border-radius: 8px 8px 0px 0px;
      img {
        animation: spin 2s linear infinite;
        @keyframes spin {
          from {
            rotate: 0deg;
          }
          to {
            rotate: 360deg;
          }
        }
      }
      span {
        font-family: "Fira Code", monospace;
        font-optical-sizing: auto;
        font-size: 12px;
        color: #82a0ce;
      }
    }
    .log-list {
      overflow-y: auto;
      overflow-x: hidden;
      flex: 1;
      padding: 12px;
    }
    .scroll-btn {
      position: absolute;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      gap: 4px;
      border-radius: 4px;
      margin: 18px;
      padding: 6px 8px;
      background-color: #4338CA;
      color: #E0ECFD;
      font-size: 10px;
      font-weight: 500;
      font-family: "Work Sans";
      img{
        height: 14px;
      }
      cursor: pointer;
    }
  }
`;
