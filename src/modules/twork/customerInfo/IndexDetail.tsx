import React, {
  Fragment,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "antd/dist/antd.css";
import "react-contexify/dist/ReactContexify.min.css";
import "@styles/react/libs/context-menu/context-menu.scss";
import { Button, Col, Row } from "reactstrap";
import Info_ForceCall from "./Info_ForceCall";
import InfoCall from "./Info";
import { useObserver } from "mobx-react";
import AddPlan from "./AddPlan";
import ListHistory from "./IndexTableHis";
import { Form } from "antd";
import { storeTwork } from "../store/storeTwork";
import PerfectScrollbar from "react-perfect-scrollbar";
import { toast } from "react-toastify";
import { ErrorToast } from "../../../views/extensions/toastify/ToastTypes";

const IndexDetail = (valueUpdate: any) =>
  useObserver(() => {
    const valueBind = valueUpdate.valueUpdate;
    const valueForceCall = valueUpdate.forceCall;
    const closeModal = () => {
      if (storeTwork.isInCall == false) {
        storeTwork.onShowModalAddNew(false);
        storeTwork.onShowModalBookingCall(false);
        storeTwork.onShowModalHistoryCall(false);
      } else {
        toast.error(ErrorToast("Không thể đóng popup khi đang trong cuộc gọi"));
        return;
      }
    };

    useEffect(()=>{
      storeTwork.dataHistoryPlanDetail = [];
      storeTwork.pageIndexHistoryPlanDetail =1;
      storeTwork.pageSizeHistoryPlanDetail = 10;
      storeTwork.totalRowHistoryPlanDetail = 0;
      
      storeTwork.dataCallInfo=[];
      storeTwork.dataHistoryCallDetail = [];
      storeTwork.pageIndexHistoryCallDetail = 1;
      storeTwork.pageSizeHistoryCallDetail = 10;
      storeTwork.totalRowHistoryCallDetail = 0;
    },[])

    return (
      <Fragment>
        <PerfectScrollbar
          style={{ maxHeight: "80vh", overflow: "hidden !important ", maxWidth: "100vw" }}
        >
          <Row>
            <Col sm="12" md="12" lg="12">
              <Info_ForceCall valueBind={valueUpdate} />
            </Col>
            <Col sm="12" md="12" lg="12">
              <AddPlan valueBind={valueBind} />
            </Col>
          </Row>
          <Row>
            <Col sm="24" md="24" lg="24">
              <ListHistory valueBind={valueBind} />
            </Col>
          </Row>
        </PerfectScrollbar>
        {/* <Col sm="24" lg="24" style={{marginTop:"0"}}>
          <Form.Item className="text-center mt-2">
            <Button
              className="btn btn-gradient-primary"
              color="gradient-primary"
              htmlType="button"
              onClick={() => closeModal()}
            >
              Hủy
            </Button>
          </Form.Item>
        </Col> */}
      </Fragment>
    );
  });

export default IndexDetail;
