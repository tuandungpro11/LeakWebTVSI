import { Toast, ToastBody, ToastHeader, Row, Col } from "reactstrap";
import transparentBg from "@src/assets/images/svg/transparent.svg";
import React from "react";

const close = (
  <button type="button" className="ml-1 close">
    <span>×</span>
  </button>
);

const ToastTranslucent = () => (
  <Row>
    <Col md="6" sm="12">
      <div className="p-3 bg-primary my-2 rounded">
        <Toast>
          <ToastHeader close={close}>TVSI</ToastHeader>
          <ToastBody>
            This is a toast on a primary background — check it out!
          </ToastBody>
        </Toast>
      </div>
    </Col>
    <Col md="6" sm="12">
      <div className="p-3 bg-secondary my-2 rounded">
        <Toast>
          <ToastHeader close={close}>TVSI</ToastHeader>
          <ToastBody>
            This is a toast on a secondary background — check it out!
          </ToastBody>
        </Toast>
      </div>
    </Col>
    <Col md="6" sm="12">
      <div className="p-3 bg-success my-2 rounded">
        <Toast>
          <ToastHeader close={close}>TVSI</ToastHeader>
          <ToastBody>
            This is a toast on a success background — check it out!
          </ToastBody>
        </Toast>
      </div>
    </Col>
    <Col md="6" sm="12">
      <div className="p-3 bg-danger my-2 rounded">
        <Toast>
          <ToastHeader close={close}>TVSI</ToastHeader>
          <ToastBody>
            This is a toast on a danger background — check it out!
          </ToastBody>
        </Toast>
      </div>
    </Col>
    <Col md="6" sm="12">
      <div className="p-3 bg-warning my-2 rounded">
        <Toast>
          <ToastHeader close={close}>TVSI</ToastHeader>
          <ToastBody>
            This is a toast on a warning background — check it out!
          </ToastBody>
        </Toast>
      </div>
    </Col>
    <Col md="6" sm="12">
      <div className="p-3 bg-info my-2 rounded">
        <Toast>
          <ToastHeader close={close}>TVSI</ToastHeader>
          <ToastBody>
            This is a toast on an info background — check it out!
          </ToastBody>
        </Toast>
      </div>
    </Col>

    <Col md="6" sm="12">
      <div className="p-3 bg-dark my-2 rounded">
        <Toast>
          <ToastHeader close={close}>TVSI</ToastHeader>
          <ToastBody>
            This is a toast on an dark background — check it out!
          </ToastBody>
        </Toast>
      </div>
    </Col>

    <Col md="6" sm="12">
      <div
        className="p-3 my-2 rounded"
        style={{
          background: `url(${transparentBg})`,
        }}
      >
        <Toast>
          <ToastHeader close={close}>TVSI</ToastHeader>
          <ToastBody>
            This is a toast on a transparent background — check it out!
          </ToastBody>
        </Toast>
      </div>
    </Col>
  </Row>
);
export default ToastTranslucent;
