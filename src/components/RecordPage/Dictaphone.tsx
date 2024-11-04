import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Input, Button, Row, Space } from "antd";
import { FaMicrophone } from "react-icons/fa";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import useWindowDimensions from "../general/useWindowDimensions";

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
}

const Dictaphone = ({ text, handleSubmit, handleTextChange }: Props) => {
  const { width } = useWindowDimensions();
  console.log("WIDTH>>>", width);
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

  console.log(
    "AUDIO DATA>>>",
    Math.min(...audioData),
    Math.max(...audioData),
    audioData.reduce((acc, curr) => acc + curr, 0) / audioData.length
  );

  useEffect(() => {
    if (listening) {
      handleTextChange(fixTranscript(transcript));
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleStartStopListening = () => {
    console.log("IS RECORDING>>>", isRecordingInProgress);
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
              }}
            >
              <VoiceVisualizer
                controls={recorderControls}
                isControlPanelShown={false}
                height={width ? width * 0.4 : "0"}
                width={width ? width * 0.8 : "0"}
                onlyRecording={true}
              />
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
          />
        </Row>
        <Row></Row>
        <Row justify="end">
          <Space>
            <Button onClick={resetTextBox} style={{ fontWeight: "bold" }}>
              Clear
            </Button>
            <Button
              onClick={handleSubmit}
              style={{
                backgroundColor: "var(--button-primary)",
                color: "var(--button-primary-foreground)",
                fontWeight: "bold",
              }}
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
