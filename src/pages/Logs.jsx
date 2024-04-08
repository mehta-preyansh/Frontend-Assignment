import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { TimeContext } from "../App";
import { MimicLogs } from "../api-mimic";
import { Log } from "../components/Log";
//------ASSETS-------
import spinner from "../assets/Sidepane/Spinner.svg";
import arrow from "../assets/Sidepane/arrow-up-long.png";

//------COMPONENT--------
export const Logs = ({ maxNumberOfLogs }) => {
  //States for loading, scroll to bottom, logs array, count of unseen logs, and a history array of logs
  const [historyLogs, sethistoryLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(true);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [logs, setLogs] = useState([]);
  const [pendingLogs, setPendingLogs] = useState(0);

  //Display selected interval
  const currentTime = new Date();
  const intervalMap = [5, 15, 30, 60, 3 * 60, 6 * 60];
  const [seletedInterval] = useContext(TimeContext);

  //Function to be passed as callback to API
  const pushLogToArray = (log) => {
    setLogs((prevLogs) => [...prevLogs, log]);
  };

  //Handling scrolling in the logs container
  const logListRef = useRef(null);
  const handleScroll = () => {
    //-----Whether scrolled till bottom or not
    const isAtBottom =
      Math.abs(
        logListRef.current.scrollTop -
          (logListRef.current.scrollHeight - logListRef.current.clientHeight)
      ) < 4;
    // if scroll-thumb is less than 4px closer to the bottom of container
    //You have no pending logs to watch
    if (isAtBottom) setPendingLogs(0);
    //-----Stick to bottom or not
    setScrollToBottom(isAtBottom);

    //-----Whether scrolled till top or not
    const isAtTop = logListRef.current.scrollTop < 4;
    if (isAtTop) {
      setScrollToTop(true);
      // fetchPreviousLogs();
    }
  };

  //Fetch previous logs from the historyLogs array
  const fetchPreviousLogs = () => {
    console.log(historyLogs);
    if (historyLogs.length >= maxNumberOfLogs) {
      setLogs((prev) => [
        ...historyLogs.slice(historyLogs.length - maxNumberOfLogs),
        ...prev,
      ]);
      sethistoryLogs(
        historyLogs.slice(0, historyLogs.length - maxNumberOfLogs - 1)
        );
      } else {
        setLogs((prev) => [...historyLogs, ...prev]);
        sethistoryLogs([]);
      }
      setLoading(false);
    setScrollToTop(false);
  };

  //Scroll to the bottom when the state changes and keep only certain logs in the screen
  useEffect(() => {
    if (logListRef.current && scrollToBottom) {
      logListRef.current.scrollTop =
        logListRef.current.scrollHeight - logListRef.current.clientHeight;
    }
    if (logs.length > maxNumberOfLogs && scrollToBottom) {
      sethistoryLogs((prev) => [
        ...prev,
        ...logs.slice(0, logs.length - maxNumberOfLogs),
      ]);
      setLogs((prevLogs) => prevLogs.slice(logs.length - maxNumberOfLogs));
    }
    if (!scrollToBottom && pendingLogs == 0) {
      setPendingLogs(logs.length);
    }
    if (scrollToTop) {
      setLoading(true)
      setTimeout(()=>{
        fetchPreviousLogs();
      },1000)
    }
  }, [logs, scrollToBottom, scrollToTop]);

  //Subscribing to live logs and scroll event listener
  useEffect(() => {
    const flush = MimicLogs.subscribeToLiveLogs(pushLogToArray);
    logListRef.current.addEventListener("scroll", handleScroll);
    return () => {
      logListRef.current?.removeEventListener("scroll", handleScroll);
      flush();
    };
  }, []);

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
            {historyLogs.length ? <img src={spinner} alt="" /> : null}
            <span>
              {historyLogs.length
                ? `Loading previous ${maxNumberOfLogs} logs`
                : "No previous logs"}
            </span>
          </div>
        ) : null}
        <div className="log-list" ref={logListRef}>
          {logs.map((log, index) => {
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
              setPendingLogs(0);
              setScrollToBottom(true);
            }}
          >
            <span>{`${
              logs.length - pendingLogs < 100
                ? logs.length - pendingLogs
                : "100+"
            } new logs`}</span>
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
      max-width: 90px;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 4px;
      border-radius: 4px;
      margin: 18px;
      padding: 6px 8px;
      background-color: #4338ca;
      color: #e0ecfd;
      font-size: 10px;
      font-weight: 500;
      font-family: "Work Sans";
      img {
        height: 14px;
      }
      cursor: pointer;
    }
  }
`;
