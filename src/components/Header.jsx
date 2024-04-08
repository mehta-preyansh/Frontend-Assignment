import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/Sidepane/TF logo.svg";
import cheveron from "../assets/Sidepane/chevron.svg";
import tick from "../assets/Sidepane/tick.svg";
import metricsLogo from "../assets/Sidepane/metrics-gray.png";
import metricsLogoActive from "../assets/Sidepane/metrics.png";
import logsLogo from "../assets/Sidepane/list.png";
import logsLogoActive from "../assets/Sidepane/list-active.png";
import styled from "styled-components";
import { useContext, useState } from "react";
import { TimeContext } from "../App";

export const Header = () => {
  const [seletedInterval, setSelectedInterval] = useContext(TimeContext);
  const [isOpen, setOpen] = useState(false);
  const intervals = [
    "Last 5 minutes",
    "Last 15 minutes",
    "Last 30 minutes",
    "Last 1 hour",
    "Last 3 hours",
    "Last 6 hours",
  ];
  const location = useLocation();

  return (
    <HeaderContainer className="header-wrapper">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div className="navigation">
        <NavLink to={"metrics"}>
          <img
            src={
              location.pathname === "/metrics" ? metricsLogoActive : metricsLogo
            }
          />
          <span>Metrics</span>
          <div className="border"></div>
        </NavLink>
        <NavLink to={"logs"}>
          <img
            src={location.pathname === "/logs" ? logsLogoActive : logsLogo}
          />
          <span>Logs</span>
          <div className="border"></div>
        </NavLink>
      </div>
      <div
        className="dropdown"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div>
          <span>{intervals[seletedInterval]}</span>
          <img src={cheveron}></img>
        </div>

        {isOpen ? (
          <ul>
            {intervals.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedInterval(index);
                  setOpen(false);
                }}
              >
                <div>
                  <span>{item}</span>
                  {intervals.indexOf(item) === seletedInterval ? <img src={tick} alt="" /> : null}
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  height: 72px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 40px;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.05);
  .navigation {
    display: flex;
    gap: 20px;
    > * {
      text-decoration: none;
      color: black;
    }
    margin-right: auto;
    > a {
      position: relative;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0px 4px 10px 0px;
      img {
        width: 14px;
      }
      &.active .border{
        transform: scale(1);
      }
      .border{
        position: absolute;
        width: 100%;
        transform: scale(0);
        transition: transform 0.3s ease-in-out;
        transform-origin: center;
        bottom: 0;
        height: 2px;
        background-color: #5501e1;
      }
    }
  }
  .dropdown {
    position: relative;
    min-width: 140px;
    font-weight: 600;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    ul {
      position: absolute;
      z-index: 10;
      background-color: #fff;
      left: 0;
      right: 0;
      top: calc(100% + 1px);
      margin: 0;
      padding: 0px 0px;
      list-style: none;
      border: 0.3px solid #bbd2f1;
      border-radius: 6px;
      box-shadow: 0px 2px 6px 0px rgba(0, 52, 102, 0.06),
        0px 8px 20px 0px rgba(0, 52, 102, 0.1);
      li {
        display: flex;
        align-items: center;
        font-size: 12px;
        padding-inline: 6px;
        div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-block: 10px;
          padding-inline: 6px;
          width: 100%;
        }
        &:hover {
          background-color: #e0ecfd;
        }
        &:not(:last-child) {
          div {
            border-bottom: 1px solid #e0ecfd;
          }
        }
        cursor: pointer;
        user-select: none;
      }
    }
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 8px;
      font-size: 12px;
      color: #3e5680;
      border: 1px solid #bbd2f1;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
    }
  }
`;
