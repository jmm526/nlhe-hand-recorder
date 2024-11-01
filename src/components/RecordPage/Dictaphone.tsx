import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Input, Button, Row, Space } from "antd";

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
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

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
      SpeechRecognition.stopListening();
    } else {
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
            {listening && (
              <div
                style={{
                  height: "35%",
                  width: "35%",
                  backgroundColor: "var(--foreground)",
                  borderRadius: "10%",
                }}
              ></div>
            )}
          </Button>
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
