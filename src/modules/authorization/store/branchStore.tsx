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
  @observable pageIndexListBranch: number = 1;
  @observable pageSizeListBranch: number = 10;
  @observable totalRowsListBranch: number = 10;
  @observable dataListBranch: any[] = [];
  @observable dataListBranchParam: any[] = [];
  @observable dataListBranchDetail: any[] = [];

  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }
  
  handlePerRowsListBranch = (newpage: any, page: any) => {
    this.pageSizeListBranch = page;
  };
  handlePageChangeListBranch = (page: any) => {
    var p = page;
    this.pageIndexListBranch = p;
  };
  
  async getListBranch(value: any) {
    this.loadingData = true;
    this.dataListBranchParam = value;
    this.dataListBranch = [];
    await useApi
      .postRequestAuthCenter(listAPI.GetListBranch, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListBranch = [...res.data.Data];
            this.totalRowsListBranch = res.data.Data.TotalItem;
          } else {
            this.dataListBranch = [];
            this.totalRowsListBranch = 0;
          }
        } else {
          this.dataListBranch = [];
          this.totalRowsListBranch = 0;
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
      .postRequestAuthCenter(listAPI.DeleteBranch, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Bạn đã xóa thành công chi nhánh"));
          if (Object.keys(this.dataListBranchParam).length > 0) {
            this.getListBranch(this.dataListBranchParam);
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
  async AddNewBranch(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.AddNewBranch, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Bạn đã thêm mới thành công quyền"));
          if (Object.keys(this.dataListBranchParam).length > 0) {
            this.getListBranch(this.dataListBranchParam);
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
  async getDetailBranch(value: any) {
    this.dataListBranchDetail = [];
    await useApi
      .postRequestAuthCenter(listAPI.DetailBranch, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListBranchDetail = [...res.data.Data];
          } else {
            this.dataListBranchDetail = [];
          }
        } else {
          this.dataListBranchDetail = [];
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
  async UpdateBranch(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.UpdateBranch, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Bạn đã sửa thành công chi nhánh"));
          if (Object.keys(this.dataListBranchParam).length > 0) {
            this.getListBranch(this.dataListBranchParam);
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
}

export const branchStore = new ServiceExtension();
