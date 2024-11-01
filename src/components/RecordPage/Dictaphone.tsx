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
  onSubmit: (transcript: string) => void;
}

const Dictaphone = ({ onSubmit }: Props) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [shownTranscript, setShownTranscript] = useState("");

  useEffect(() => {
    if (listening) {
      setShownTranscript(fixTranscript(transcript));
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
      setShownTranscript("");
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const resetTextBox = () => {
    resetTranscript();
    setShownTranscript("");
  };

  const handleSubmit = () => {
    onSubmit(shownTranscript);
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
          value={shownTranscript}
          autoSize={{ maxRows: 8 }}
          onChange={(e) => setShownTranscript(e.target.value)}
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        />
      </Row>
      <Row justify="end">
        <Space>
          <Button onClick={resetTextBox}>Clear</Button>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Space>
      </Row>
    </Space>
    </>
  );
};

export default Dictaphone;
