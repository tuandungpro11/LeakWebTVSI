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
  @observable pageIndexListSale: number = 1;
  @observable pageSizeListSale: number = 10;
  @observable totalRowsListSale: number = 10;
  @observable dataListSale: any[] = [];
  @observable dataListSaleDetail: any = {};
  @observable dataListSaleParam:any[]=[];

  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }
  
  handlePerRowsListSale = (newpage: any, page: any) => {
    this.pageSizeListSale = page;
  };
  handlePageChangeListSale = (page: any) => {
    var p = page;
    this.pageIndexListSale = p;
  };

  async getAllSaleInfos(value: any) {
    this.loadingData = true;
    this.dataListSaleParam = value;
    this.dataListSale=[];
    await useApi
      .postRequestAuthCenter(listAPI.GetListSale, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListSale = [...res.data.Data];
            this.totalRowsListSale = res.data.Data.TotalItem;
          } else {
            this.dataListSale = [];
            this.totalRowsListSale = 0;
          }
        } else {
          this.dataListSale = [];
          this.totalRowsListSale = 0;
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
  async AddNewSale(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.AddNewSale, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã thêm mới thành công Sale")
          );
          if(Object.keys(this.dataListSaleParam).length > 0){
            this.getAllSaleInfos(this.dataListSaleParam);
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
  async UpdateSale(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.UpdateSale, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã cập nhật thành công Sale")
          );
          if(Object.keys(this.dataListSaleParam).length > 0){
            this.getAllSaleInfos(this.dataListSaleParam);
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
  async getDetailSaleInfo(value: any) {
    this.loadingData = true;
    this.dataListSaleDetail=[];
    await useApi
      .postRequestAuthCenter(listAPI.DetailSale, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListSaleDetail = res.data.Data;
          } else {
            this.dataListSaleDetail = [];
          }
        } else {
          this.dataListSaleDetail = []
          this.totalRowsListSale = 0;
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
  async getAllUserInfosForMakePlan(value: any) {
    this.loadingData = true;
    this.dataListSaleParam = value;
    this.dataListSale=[];
    await useApi
      .postRequestAuthCenter(listAPI.GetAllUserByFunctions, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListSale = [...res.data.Data];
            this.totalRowsListSale = res.data.Data.TotalItem;
          } else {
            this.dataListSale = [];
            this.totalRowsListSale = 0;
          }
        } else {
          this.dataListSale = [];
          this.totalRowsListSale = 0;
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

export const saleStore = new ServiceExtension();
