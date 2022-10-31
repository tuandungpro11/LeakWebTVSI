import { observable } from "mobx";
import { listAPI } from "../type";
import useApi from "@services/UseAppApi";
import { toast } from "react-toastify";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../views/extensions/toastify/ToastTypes";

class ServiceExtension {
  @observable isShowPopup: boolean = false;
  @observable isShowPopupEdit: boolean = false;
  @observable isShowPopupModalUpdate: boolean = false;
  @observable loadingData: boolean = false;

  //list app
  @observable pageIndexListApp: number = 1;
  @observable pageSizeListApp: number = 10;
  @observable totalRowsListApp: number = 10;
  @observable dataListApp: any[] = [];
  @observable dataListAppParam: any = {};

  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }
  
  handlePerRowsListApp = (newpage: any, page: any) => {
    this.pageSizeListApp = page;
  };
  handlePageChangeListApp = (page: any) => {
    var p = page;
    this.pageIndexListApp = p;
  };

  
  async getListApp(value: any) {
    this.loadingData = true;
    this.dataListAppParam = value;
    this.dataListApp=[];
    await useApi
      .postRequestAuthCenter(listAPI.GetListApp, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListApp = [...res.data.Data];
            this.totalRowsListApp = res.data.Data.TotalItem;
          } else {
            this.dataListApp = [];
            this.totalRowsListApp = 0;
          }
        } else {
          this.dataListApp = [];
          this.totalRowsListApp = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
        this.loadingData = false;
      });
  }
  async AddNewApp(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.AddNewApp, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã thêm mới thành công ứng dụng")
          );
          if(Object.keys(this.dataListAppParam).length > 0){
            this.getListApp(this.dataListAppParam);
          }
          this.isShowPopup = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async UpdateApp(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.UpdateApp, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã cập nhật thành công ứng dụng")
          );
          if(Object.keys(this.dataListAppParam).length > 0){
            this.getListApp(this.dataListAppParam);
          }
          this.isShowPopupModalUpdate = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async DeleteApp(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.DeleteApp, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã xóa thành công ứng dụng")
          );
          if(Object.keys(this.dataListAppParam).length > 0){
            this.getListApp(this.dataListAppParam);
          }
          this.isShowPopup = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
}

export const appAuStore = new ServiceExtension();
