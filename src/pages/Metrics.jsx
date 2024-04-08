import styled from "styled-components";
import 'chartjs-plugin-annotation';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useContext, useState } from "react";
import { Charts } from "../components/Charts";
import { TimeContext } from "../App";

Chart.register(
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export const Metrics = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [seletedInterval] = useContext(TimeContext);
  const intervalMap = [5, 15, 30, 60, 3*60, 6*60]
  return (
    <MetricsContainer>
      <div className="top-section">
        <div className="heading-wrapper">
          <span>Metrics</span>
        </div>
        <div className="interval-wrapper">
          <span>{`${new Date(
            currentTime.getTime() - intervalMap[seletedInterval] * 60 * 1000
          ).toLocaleDateString()} ${new Date(
            currentTime.getTime() - intervalMap[seletedInterval] * 60 * 1000
          )
            .toLocaleTimeString()
            .slice(0, -6)} to ${new Date().toLocaleDateString()} ${new Date()
            .toLocaleTimeString()
            .slice(0, -6)}`}</span>
        </div>
      </div>
      <Charts/>
    </MetricsContainer>
  );
};

const MetricsContainer = styled.div`
  border-radius: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  outline: 2px solid #cee0f8;
  margin: 12px 20px;
  background-color: rgba(240, 247, 255, 0.5);
  overflow: hidden;
  .top-section {
    background-color: #fff;
    min-height: 5vh;
    display: flex;
    align-items: center;
    gap: 8px ;
    padding: 16px 20px;
    border-bottom: 2px solid #cee0f8;
    .heading-wrapper {
      font-family: "Lab Grotesque Web Bold";
      font-size: 24px;
    }
    .interval-wrapper {
      display: flex;
      padding-top: 2px;
      font-size: 12px;
      font-family: "Work Sans", sans-serif;
      font-weight: 500;
      color: #1c2a42;
    }
  }
  
`;
