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
  @observable pageIndexListAuthorization: number = 1;
  @observable pageSizeListAuthorization: number = 10;
  @observable totalRowsListAuthorization: number = 10;
  @observable dataListAuthorization: any[] = [];
  @observable dataListAuthorizationParam: any[] = [];
  @observable dataListAuthorizationDetail: any = {};

  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }

  handlePerRowsListAuthorization = (newpage: any, page: any) => {
    this.pageSizeListAuthorization = page;
  };
  handlePageChangeListAuthorization = (page: any) => {
    var p = page;
    this.pageIndexListAuthorization = p;
  };
  async getListRightInfo(value: any) {
    this.loadingData = true;
    this.dataListAuthorizationParam = value;
    this.dataListAuthorization = [];
    await useApi
      .postRequestAuthCenter(listAPI.GetListRight, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListAuthorization = [...res.data.Data];
            this.totalRowsListAuthorization = res.data.Data.TotalItem;
          } else {
            this.dataListAuthorization = [];
            this.totalRowsListAuthorization = 0;
          }
        } else {
          this.dataListAuthorization = [];
          this.totalRowsListAuthorization = 0;
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
  async DeleteRight(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.DeletetRight, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Bạn đã xóa thành công quyền"));
          if (Object.keys(this.dataListAuthorizationParam).length > 0) {
            this.getListRightInfo(this.dataListAuthorizationParam);
          }
          this.isShowPopup = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async AddNewRight(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.AddNewRight, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Bạn đã thêm mới thành công quyền"));
          if (Object.keys(this.dataListAuthorizationParam).length > 0) {
            this.getListRightInfo(this.dataListAuthorizationParam);
          }
          this.isShowPopup = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async UpdateRight(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.UpdateRight, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Bạn đã sửa thành công quyền"));
          if (Object.keys(this.dataListAuthorizationParam).length > 0) {
            this.getListRightInfo(this.dataListAuthorizationParam);
          }
          this.isShowPopupModalUpdate = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getDetailRight(value: any) {
    this.dataListAuthorizationDetail = [];
    await useApi
      .postRequestAuthCenter(listAPI.DetailRight, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListAuthorizationDetail = res.data.Data;
          } else {
            this.dataListAuthorizationDetail = [];
          }
        } else {
          this.dataListAuthorizationDetail = [];
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
}

export const authorizationStore = new ServiceExtension();
