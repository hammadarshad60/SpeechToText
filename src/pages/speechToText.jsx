import React, { useState } from "react";
import { Upload, message, Row, Button, Spin, Modal } from "antd";
import {
  UploadOutlined,
  PlayCircleFilled,
  CopyOutlined,
  AudioOutlined,
  PauseCircleFilled,
} from "@ant-design/icons";
import TextConverter from "../components/textConverter";
import axios from "axios";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";

export default function SpeechToText() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [recordState, setRecordState] = useState(null);
  const [resultText, setResultText] = useState("");
  const [userChoice, setUserChoice] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [visible, setVisible] = useState(true);

  const props = {
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log("Uploaded");
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // const showModal = () => { if want to add a button or something, or a timer
  //   setVisible(true);
  // };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleUserChoice = (choice) => {
    setUserChoice(choice);
    //clear everything too
    setFormData({});
    setRecordState(null);

  };

  const startRecording = () => {
    setRecordState(RecordState.START);
    setIsRecording(true);
  };

  const stopRecording = () => {
    setRecordState(RecordState.STOP);
    setIsRecording(false);
  };

  const onStop = (audioData) => {
    console.log(audioData); // log audioData object to console
    const fileName = Math.random().toString(36).substring(7) + ".wav";
    const formData = new FormData();
    formData.append("wav", audioData.blob, fileName);
    setFormData(formData);
  };

  const handleSubmission = async () => {
    if (formData) {
      setLoading(true);
      console.log("loading");
      console.log(formData.get("wav"));
      axios
        .post("http://172.20.50.205:5000/upload", formData)
        .then((res) => {
          console.log(res);
          setResultText(res.data.transcript);
          setLoading(false);
          console.log("done");
          setFormData({});
          setRecordState(null);
        })
        .catch((err) => {
          console.log(err);
          message.error("Something went wrong!");
          setLoading(false);
        });
    }
  };

  const handleUpload = ({ file, onSuccess }) => {
    const formData = new FormData();
    formData.append("wav", file);
    setFormData(formData);
    onSuccess((file) => {
      file.status = "done";
    });
  };

  const handleClear = () => {
    setResultText("");
    setFormData({});
    setRecordState(null);
    setUserChoice("");
    //empty uploaded files too
  };

  const uploadButton = (
    <div>
      <Button
        className={userChoice === "upload" ? "btnMain2" : "btnMain"}
        icon={<UploadOutlined />}
      >
        Upload
      </Button>
    </div>
  );
  return (
    <Modal
      title="Voice To Text Converter"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Row justify={"center"} className="mainBg">
        <div>
          <Row justify={"center"}>
            <CopyOutlined className="mainIcon" />
          </Row>
          <Row justify={"center"}>
            <p>Click the button below to upload or Record your file</p>
          </Row>
          <Row justify={"space-around"}>
            <div>
              <Upload
                {...props}
                maxCount={1}
                customRequest={handleUpload}
                onClick={() => handleUserChoice("upload")}
              >
                {uploadButton}
              </Upload>
            </div>
            <div>
              <Button
                className={userChoice === "record" ? "btnMain2" : "btnMain"}
                onClick={() => handleUserChoice("record")}
              >
                <AudioOutlined /> Voice Record
              </Button>
            </div>
          </Row>
          {userChoice === "record" && (
            <>
              <Row justify={"center"}>
                {!isRecording && (
                  <Button className="controls" onClick={startRecording}>
                    <PlayCircleFilled />
                  </Button>
                )}
                {isRecording && (
                  <Button className="controls" onClick={stopRecording}>
                    <PauseCircleFilled />
                  </Button>
                )}
              </Row>
          <Row justify={"center"}>
            <AudioReactRecorder
              state={recordState}
              onStop={onStop}
              format="wav"
            />
          </Row>
            </>
          )}
          {loading && (
            <Row justify={"center"}>
              <Spin size="large" />
            </Row>
          )}
          <TextConverter
            resultText={resultText}
            setResultText={setResultText}
            handleSubmission={handleSubmission}
            handleClear={handleClear}
            userChoice={userChoice}
          />
        </div>
      </Row>
    </Modal>
  );
}
