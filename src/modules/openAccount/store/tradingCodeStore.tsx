import { observable } from "mobx";
import { listAPI } from "../types";
import useApi from "@services/UseAppApi";
import { toast } from "react-toastify";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../views/extensions/toastify/ToastTypes";

class ServiceExtension {
    @observable isShowPopup: boolean = false;
    @observable isShowPopupEdit: boolean = false;
    @observable loadingData: boolean = false;
    @observable isShowPopupModalUpdate: boolean = false;
    @observable resultCode: any = 0;

    //trading code
  @observable pageIndexListTradingCode: number = 1;
  @observable pageSizeListTradingCode: number = 10;
  @observable totalRowListTradingCode: number = 0;
  @observable dataListTradingCode: any[] = [];
  @observable dataListTradingCodeParam: any[] = [];
  @observable dataDetailTradingCode: any = {};

  //Trading code Detail
  @observable dataListTradingCodeDetail: any = {};
  

  
  handlePerRowsChangeListTradingCode = (newpage: any, page: any) => {
    this.pageSizeListTradingCode = page;
  };
  handlePageChangeListTradingCode = (page: any) => {
    var p = page;
    this.pageIndexListTradingCode = p;
  };
  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }

  async addNewTradingCode(value: any) {
    await useApi
      .postRequestCallApp(listAPI.AddNewTradingcode, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Đăng ký Tradingcode thành công"
            )
          );
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getListTradingCode(value: any) {
    this.loadingData = true;
    this.dataListTradingCodeParam = value;
    await useApi
      .postRequestCallApp(listAPI.GetListTradingCode, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListTradingCode = [...res.data.Data];
            this.totalRowListTradingCode = res.data.Data.TotalItems;
          } else {
            this.dataListTradingCode = [];
            this.totalRowListTradingCode = 0;
          }
        } else {
          this.dataListTradingCode = [];
          this.totalRowListTradingCode = 0;
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
  async convertTradingCode(value: any) {
    await useApi
      .postRequestCallApp(listAPI.ConvertTradingCode, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Convert Tradingcode thành công"
            )
          );
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async changeStatusTradingCode(value: any) {
    await useApi
      .postRequestCallApp(listAPI.ChangeStatusTraingCode, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Đổi trạng thái Tradingcode thành công"
            )
          );
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  
  async getTradingCodeDetail(value: any) {
    this.loadingData = true;
    await useApi
      .postRequestCallApp(listAPI.GetTradingCodeDetail, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data.Items != null) {
            this.dataListTradingCodeDetail = res.data.Data.Items;
          } else {
            this.dataListTradingCodeDetail = [];
          }
        } else {
          this.dataListTradingCodeDetail = [];
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
  async UpdateTradingCode(value: any) {
    await useApi
      .postRequestCallApp(listAPI.UpdateTradingCode, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Cập nhật Tradingcode thành công"
            )
          );
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getDetailTradingCode(value: any) {
    this.dataDetailTradingCode = [];
    await useApi
      .postRequestCallApp(listAPI.GetTradingCodeDetail, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataDetailTradingCode = res.data.Data;
          } else {
            this.dataDetailTradingCode = [];
          }
        } else {
          this.dataDetailTradingCode = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
}

export const tradingCodeStore = new ServiceExtension();