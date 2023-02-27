import { useState } from "react";
import { Upload, message, Button, Input } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";

const { TextArea } = Input;

export default function SpeechToText() {
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [recordState, setRecordState] = useState(null);
  const [resultText, setResultText] = useState("");

  console.log(formData);

  const props = {
    beforeUpload: (file) => {
      const isWav = file.type === "audio/wav";
      if (!isWav) {
        message.error(`${file.name} is not a audio wav file`);
      }
      return isWav || Upload.LIST_IGNORE;
    },
  };
  const startRecording = () => {
    setRecordState(RecordState.START);
  };

  const stopRecording = () => {
    setRecordState(RecordState.STOP);
  };
  const onStop = (audioData) => {
    //send file as form data
    //give filename a random name to avoid overwriting
    const fileName = Math.random().toString(36).substring(7) + ".wav";
    const formData = new FormData();
    formData.append("wav", audioData.blob, fileName);
    setFormData(formData);
  };

  const handleSubmission = async () => {
    setLoading(true);
    if (formData) {
      console.log("Submitting", formData);
      axios.post("http://172.20.50.205:5000/upload", formData).then((res) => {
        console.log(res);
        setResultText(res.data.transcript);
        setLoading(false);
      });
    } else if (recordState) {
      console.log("Submitting", formData);
      axios.post("http://172.20.50.205:5000/upload", formData).then((res) => {
        console.log(res);
        setLoading(false);
      });
    }
  };
  const handleUpload = ({ file, onSuccess }) => {
    //send file as form data
    const formData = new FormData();
    formData.append("wav", file);
    setFormData(formData);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : null}
      <Button icon={<UploadOutlined />}>Upload</Button>
    </div>
  );

  return (
    <>
      <div className="container">
        <div className="audioContainer">
          <>
            {!audioFile && (
              <div className="recordContainer">
                <h1>A voice recorder to wav</h1>
                <AudioReactRecorder
                  state={recordState}
                  onStop={onStop}
                  format="wav"
                />
                <div className="recordButton">
                  <Button onClick={startRecording}>Start</Button>
                  <Button onClick={stopRecording}>Stop</Button>
                </div>
              </div>
            )}
          </>
          {!recordState && (
            <div className="uploadContainer">
              <Upload
                customRequest={handleUpload}
                onChange={({ file, fileList }) => {
                  if (file.status === "done") {
                    message.success(`${file.name} file uploaded successfully`);
                  } else if (file.status === "error") {
                    message.error(`${file.name} file upload failed.`);
                  }
                }}
                {...props}
              >
                {uploadButton}
              </Upload>
              {audioFile && <audio src={audioFile} controls />}
            </div>
          )}
          <Button onClick={handleSubmission}>Submit</Button>
        </div>
        {resultText && (
          <div className="resultContainer">
            <h1>Result</h1>
            {/* display result in a text area */}
            <TextArea rows={4} value={resultText} />
          </div>
        )}
      </div>
    </>
  );
}