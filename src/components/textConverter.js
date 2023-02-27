import React from "react";
import { Input, Row, Button } from "antd";
const { TextArea } = Input;
const TextConverter = ({
  resultText,
  setResultText,
  handleSubmission,
  handleClear,
  userChoice,
}) => {
  return (
    <div className="resultContainer">
      <Row justify={"space-between"} align="middle">
        <h4>Result</h4>
        <div>
          {userChoice === "record" && (
            <Button className="btnMain3" onClick={handleClear}>
              Clear
            </Button>
          )}
          <Button className="btnMain" onClick={handleSubmission}>
            Convert
          </Button>
        </div>
      </Row>
      <TextArea
        autoSize={{ minRows: 7, maxRows: 10 }}
        value={resultText}
        onChange={(e) => setResultText(e.target.value)}
      />
    </div>
  );
};

export default TextConverter;
