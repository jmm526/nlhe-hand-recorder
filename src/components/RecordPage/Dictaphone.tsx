import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Input, Button, Row, Space } from "antd";
import { FaMicrophone } from "react-icons/fa";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import useWindowDimensions from "../general/useWindowDimensions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const { TextArea } = Input;

const fixTranscript = (transcript: string) => {
  return transcript
    .replace(/\blive\b/gi, "limp")
    .replace(/\bDylan\b/gi, "villain")
    .replace(/\racist\b/gi, "raises");
};

interface Props {
  text: string;
  handleSubmit: () => void;
  handleTextChange: (text: string) => void;
  isLoading: boolean;
}

const Dictaphone = ({ text, handleSubmit, handleTextChange, isLoading }: Props) => {
  const { width } = useWindowDimensions();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const recorderControls = useVoiceVisualizer();
  
  // TODO: Add realtime circular visualizer using audioData.
  const { stopRecording, isRecordingInProgress, startRecording, audioData } =
    recorderControls;

  const formatAudioData = (intArray: Uint8Array) => {
    const data = Array.from(intArray);
    const formattedData = [];
    const labels = [];
    if (!data.length) {
      for (let i = 0; i < 128; i++) {
        labels.push(i);
        formattedData.push(0);
      }
    } else {
      for (let i = 0; i < data.length; i += 8) {
        const avg =
          data.slice(i, i + 8).reduce((acc, curr) => acc + curr, 0) / 8;
        labels.push(i);
        formattedData.push(avg - 127);
      }
    }
    const myData = {
      labels,
      datasets: [
        {
          data: formattedData,
          backgroundColor: "#ffffff",
          borderColor: "#ffffff",
        },
      ],
    };
    return myData;
  };

  const chartOptions = {
    scales: {
      x: {
        display: false,
      },
      y: {
        min: -30,
        max: 30,
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    if (listening) {
      handleTextChange(fixTranscript(transcript));
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleStartStopListening = () => {
    if (listening) {
      if (isRecordingInProgress) {
        stopRecording();
      }
      SpeechRecognition.stopListening();
    } else {
      if (!isRecordingInProgress) {
        startRecording();
      }
      resetTranscript();
      handleTextChange("");
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const resetTextBox = () => {
    resetTranscript();
    handleTextChange("");
  };

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Row justify="center">
          <div style={{ position: "relative", height: "40vw", width: "100%" }}>
            <div
              style={{
                position: "absolute",
                left: "0",
                right: "0",
                marginInline: "auto",
                width: "fit-content",
                height: width ? width * 0.4 : "0",
              }}
            >
              {listening && (
                <Bar
                  data={formatAudioData(audioData)}
                  options={chartOptions}
                  style={{ height: "100%", width: width ? width : "0" }}
                />
              )}
            </div>
            <div
              style={{
                position: "absolute",
                left: "0",
                right: "0",
                marginInline: "auto",
                width: "fit-content",
              }}
            >
              <Button
                onClick={handleStartStopListening}
                shape="circle"
                variant="solid"
                style={{
                  border: "5px solid var(--foreground)",
                  backgroundColor: "#e74d4d",
                  width: "40vw",
                  height: "40vw",
                }}
                disabled={isLoading}
              >
                {listening ? (
                  <div
                    style={{
                      height: "35%",
                      width: "35%",
                      backgroundColor: "var(--foreground)",
                      borderRadius: "10%",
                    }}
                  ></div>
                ) : (
                  <FaMicrophone
                    style={{
                      height: "40%",
                      width: "40%",
                      color: "var(--foreground)",
                    }}
                  />
                )}
              </Button>
            </div>
          </div>
        </Row>
        <Row justify="center">
          <TextArea
            value={text}
            autoSize={{ minRows: 3, maxRows: 8 }}
            onChange={(e) => handleTextChange(e.target.value)}
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
            disabled={isLoading}
          />
        </Row>
        <Row></Row>
        <Row justify="end">
          <Space>
            <Button
              onClick={resetTextBox}
              style={{ fontWeight: "bold" }}
              disabled={isLoading}
            >
              Clear
            </Button>
            <Button
              onClick={handleSubmit}
              style={{
                backgroundColor: "var(--button-primary)",
                color: "var(--button-primary-foreground)",
                fontWeight: "bold",
              }}
              loading={isLoading}
            >
              Submit
            </Button>
          </Space>
        </Row>
      </Space>
    </>
  );
};

export default Dictaphone;
