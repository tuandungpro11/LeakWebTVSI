import { Checkbox, Table, Tree } from "antd";
import { Key } from "antd/lib/table/interface";
import { useObserver } from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { groupStore } from "../store/groupAuthStore";
import { FunctionAuth } from "../type";

const GroupAuthorizeTree = () =>
  useObserver(() => {
    const { t } = useTranslation();
    const [selectedList, setSelectedList] = useState<number[]>([]);

    const rowSelection = {
      selectedRowKeys: selectedList,
      onChange: (selectedRowKeys: Key[], selectedRows: FunctionAuth[]) => {
        setSelectedList(selectedRowKeys as number[]);
      },
      getCheckboxProps: (record: any) => ({
        name: record.FunctionID,
      }),
    };

    const OnUpdate = () => {
      groupStore.OnUpdateGroupAuthorization(selectedList)
    }

    const ClosePopup = () => {
      groupStore.OnShowModalAuthorize(false)
    }

    useEffect(() => {
      let newSelectedList = getSelectedList(groupStore.functionAuthList)
      setSelectedList([...newSelectedList])
    }, [groupStore.functionAuthList])

    const getSelectedList = (data: FunctionAuth[]): number[] => {
      let result: number[] = []
      for(let item of data) {
        if (item.HaveRight === 1) {
          result = [...result, item.FunctionID]
          if (item.children && item.children.length > 0) {
            result = [...result, ...getSelectedList(item.children)]
          }
        }
      }
      return result
    }

    const columns = [
      { title: "", dataIndex: "", key: "expand", width: 1 },
      {
        title: "Chức năng",
        dataIndex: "FunctionName",
        key: "FunctionName",
        width: "60%",
      },
      {
        title: "Mã chức năng",
        dataIndex: "FunctionCode",
        key: "FunctionCode",
      },
      {
        title: "Hệ thống",
        dataIndex: "AppName",
        key: "AppName",
      },
      {
        title: "Loại quyền",
        dataIndex: "FunctionType",
        key: "FunctionType",
      },
      Table.SELECTION_COLUMN,
    ]
    
    return (
      <Fragment>
        <Card>
          <CardHeader>
            <Col>
              <span>Nhóm quyền: <b style={{textTransform: "uppercase", fontSize: "20px"}}>{groupStore.selectedGroupInfo.GroupName}</b></span>
            </Col>
            <Col>
              <span>Mã nhóm quyền: <b style={{textTransform: "uppercase", fontSize: "20px"}}>{groupStore.selectedGroupInfo.GroupCode}</b></span>
            </Col>
          </CardHeader>
          <CardBody>
            {groupStore.functionAuthList.length > 0 &&<Table
                columns={columns}
                dataSource={groupStore.functionAuthList}
                rowKey="FunctionID"
                loading={groupStore.isLoadingFunctionAuthList}
                expandable={{defaultExpandAllRows: true}}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection,
                }}
                scroll={{ y: 400 }}
                pagination={false}
            />}
            <Row className="mt-2">
                <Col md="24" sm="24" style={{ textAlign: "center" }}>
                  <Button
                    className="btn btn-gradient-secondary"
                    color="gradient-secondary"
                    type="submit"
                    onClick={OnUpdate}
                  >
                    {t("X_Trade_Button_Add")}
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    className="btn btn-gradient-primary"
                    color="gradient-primary"
                    type="button"
                    onClick={() => ClosePopup()}
                  >
                    {t("X_Trade_Button_Close")}
                  </Button>
                </Col>
              </Row>
          </CardBody>
        </Card>
      </Fragment>
    );
  });

export default GroupAuthorizeTree;
