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
    @observable pageIndexListPosition: number = 1;
    @observable pageSizeListPosition: number = 10;
    @observable totalRowsListPosition: number = 10;
    @observable dataListPosition: any[] = [];
    @observable dataListPositionParam: any[] = [];
    @observable dataListPositionDetail: any = {};

    onShowModalAddNew(data: boolean) {
      this.isShowPopup = data;
    }
    onShowModalUpdate(data: boolean) {
      this.isShowPopupModalUpdate = data;
    }
  
    handlePerRowsListPosition = (newpage: any, page: any) => {
      this.pageSizeListPosition = page;
    };
    handlePageChangeListPosition = (page: any) => {
      var p = page;
      this.pageIndexListPosition = p;
    };
  
    async getListPosition(value: any) {
      this.loadingData = true;
      this.dataListPositionParam = value;
      this.dataListPosition=[];
      await useApi
        .postRequestAuthCenter(listAPI.GetListPosition, value)
        .then((res: any) => {
          if (res.data.Code === "0") {
            if (res.data.Data != null) {
              this.dataListPosition = [...res.data.Data];
              this.totalRowsListPosition = res.data.Data.TotalItem;
            } else {
              this.dataListPosition = [];
              this.totalRowsListPosition = 0;
            }
          } else {
            this.dataListPosition = [];
            this.totalRowsListPosition = 0;
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
    async DeletePosition(value: any) {
      await useApi
        .postRequestAuthCenter(listAPI.DeletePosition, value)
        .then((res: any) => {
          if (res.data.Code === "0") {
            toast.success(
              SuccessProgressToast("Bạn đã xóa thành công vị trí")
            );
            if(Object.keys(this.dataListPositionParam).length > 0){
              this.getListPosition(this.dataListPositionParam);
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
    async AddNewPosition(value: any) {
      await useApi
        .postRequestAuthCenter(listAPI.AddNewPosition, value)
        .then((res: any) => {
          if (res.data.Code === "0") {
            toast.success(
              SuccessProgressToast("Bạn đã thêm mới thành công vị trí")
            );
            if(Object.keys(this.dataListPositionParam).length > 0){
              this.getListPosition(this.dataListPositionParam);
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
    async UpdatePosition(value: any) {
      await useApi
        .postRequestAuthCenter(listAPI.UpdatePosition, value)
        .then((res: any) => {
          if (res.data.Code === "0") {
            toast.success(
              SuccessProgressToast("Bạn đã cập nhật thành công vị trí")
            );
            if(Object.keys(this.dataListPositionParam).length > 0){
              this.getListPosition(this.dataListPositionParam);
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
    async getDetailPosition(value: any) {
      this.dataListPositionDetail=[];
      await useApi
        .postRequestAuthCenter(listAPI.DetailPosition, value)
        .then((res: any) => {
          if (res.data.Code === "0") {
            if (res.data.Data != null) {
              this.dataListPositionDetail = res.data.Data;
            } else {
              this.dataListPositionDetail = null;
            }
          } else {
            this.dataListPositionDetail = null;
            toast.error(ErrorToast(res.data.Message));
          }
        })
        .catch((error: any) => {
          const { config, response } = error;
          toast.error(ErrorToast(response.statusText));
        });
    }
}
export const positionStore =  new ServiceExtension();