import styled from "styled-components";
import { Line } from "react-chartjs-2";
import { MimicMetrics } from "../api-mimic.js";
import { useContext, useEffect, useState } from "react";
import { TimeContext } from "../App.jsx";
import spinner from '../assets/Sidepane/Spinner.svg'

export const Charts = () => {
  //State variable to store the fetched metrics data from the API
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seletedInterval] = useContext(TimeContext);
  const intervalMap = [5, 15, 30, 60, 3 * 60, 6 * 60];

  useEffect(() => {
    const fetchMetricsFromApi = async () => {
      setLoading(true);
      const result = await MimicMetrics.fetchMetrics({
        startTs:
          new Date().getTime() - intervalMap[seletedInterval] * 60 * 1000,
        endTs: new Date().getTime(),
      });
      setData(result);
      setLoading(false);
    };
    fetchMetricsFromApi();
  }, [seletedInterval]);
  
  function millisecondsToTime(ms) {
    // Convert milliseconds to minutes
    var minutes = Math.floor((ms / (1000 * 60)) % 60);
    // Convert milliseconds to hours
    var hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    // Format the time string
    var timeString = "";
    timeString += (hours < 10 ? "0" : "") + hours + ":";
    timeString += (minutes < 10 ? "0" : "") + minutes;

    return timeString;
  }

  const colorCode = {
    Used: "#DC2626",
    Write: "#DC2626",
    Requested: "#2563EB",
    Read: "#2563EB",
    Limits: "#059669",
  };

  const lineChartOptions = data.map((element, index) => {
    return {
      plugins: {
        title: {
          display: true,
          text: element.name,
          font: {
            size: 14,
            family: "Work Sans, sans-serif",
          },
          color: "#3E5680",
          align: "start",
        },
        legend: {
          display: false, //Using legend in jsx instead of here  as background colour is not changing
          reverse: index === 3 ? false : true,
          position: "bottom",
          align: "start",
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            color: "#010202",
            font: {
              size: 14,
              family: "Lab Grotesque Web Bold",
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            maxTicksLimit: 10,
            padding: 10,
          },
          grid: {
            color: "#E0ECFD",
          },
          border: {
            display: true,
            color: "#E0ECFD",
          },
        },
        y: {
          position: "right",
          ticks: {
            maxTicksLimit: 5,
            align: "center",
            padding: 5,
          },
          grid: {
            color: "#E0ECFD",
            offset: true,
          },
          border: {
            display: false,
          },
        },
      },
      elements: {
        line: {
          borderJoinStyle: "round",
          tension: 0.1,
        },
      },
    };
  });

  const lineChartData = data.map((element) => {
    return {
      labels: element.graphLines[0].values.map((ele, ind) =>
        millisecondsToTime(ele.timestamp)
      ),
      datasets: element.graphLines.map((element) => {
        return {
          data: element.values.map((ele) => ele.value),
          label: element.name,
          fill: false,
          backgroundColor: "red",
          borderColor: colorCode[element.name],
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHitRadius: 5,
          pointHoverBorderWidth: 2,
          pointHoverBackgroundColor: "#F97316",
          pointHoverBorderColor: "#fff",
        };
      }),
    };
  });

  return (
    <ChartsContainer className="charts-wrapper">
      {loading ? (
        <div className="loader">
          <img src={spinner} alt="" />
        </div>
      ) : (
        lineChartData.map((ele, index) => (
          <div className="chart-container" key={index}>
            <Line data={ele} options={lineChartOptions[index]}></Line>
            <div className="chart-legend">
              {index !== 3 ? (
                <div className="labels-container">
                  <div className="label">
                    <div className="red box"></div>
                    <div className="label-heading">Used</div>
                  </div>
                  <div className="label">
                    <div className="blue box"></div>
                    <div className="label-heading">Requested</div>
                  </div>
                  <div className="label">
                    <div className="green box"></div>
                    <div className="label-heading">Limits</div>
                  </div>
                </div>
              ) : (
                <div className="labels-container">
                  <div className="label">
                    <div className="blue box"></div>
                    <div className="label-heading">Read</div>
                  </div>
                  <div className="label">
                    <div className="red box"></div>
                    <div className="label-heading">Write</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </ChartsContainer>
  );
};

const ChartsContainer = styled.div`
  display: grid;
  position: relative;
  flex: 1;
  gap: 16px;
  grid-template-columns: repeat(2, calc(50% - 8px));
  background-color: #f0f7ff;
  padding: 16px 19px;
  overflow-x: hidden;
  overflow-y: scroll;
  .loader{
    width: 16px;
    height: 16px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img{
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
  }

  .chart-container {
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    justify-content: center;
    border-radius: 8px;
    border: 1px solid var(--Gray-4, #cee0f8);
    background-color: #fff;
    padding: 12px 16px;
    .chart-name {
      font-size: 14px;
      font-family: "Work Sans, sans-serif";
      font-weight: 500;
      color: #3e5680;
    }
    .chart-legend .labels-container {
      display: flex;
      font-size: 14px;
      font-family: "Lab Grotesque Web Bold";
      gap: 18px;
      .label {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .box {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        &.green {
          background-color: green;
        }
        &.red {
          background-color: red;
        }
        &.blue {
          background-color: blue;
        }
      }
    }
  }
`;
