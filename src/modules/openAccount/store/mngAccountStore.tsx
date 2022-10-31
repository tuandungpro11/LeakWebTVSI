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
  @observable isExistTradingCode: boolean = false;
  @observable isExistPassport: boolean = true;

  //List Account
  @observable pageIndexListAccount: number = 1;
  @observable pageSizeListAccount: number = 10;
  @observable totalRowListAccount: number = 0;
  @observable dataListAccount: any[] = [];
  @observable dataListAccountParam: any[] = [];
  @observable dataDetailAccount: any = {};
  //TVSI Info
  @observable dataTvsiList: any[] = [];
  @observable dataTvsiDetail: any = {};
  //Sale Info
  @observable dataSaleInfo: any = {};
  // Nation
  @observable dataNationList: any[] = [];

  handlePerRowsChangeListAccount = (newpage: any, page: any) => {
    this.pageSizeListAccount = page;
  };
  handlePageChangeListAccount = (page: any) => {
    var p = page;
    this.pageIndexListAccount = p;
  };
  onShowModalUpdate(data: boolean) {
    this.isShowPopup = data;
  }

  async CheckPassportCode(value: any) {
    await useApi
      .postRequestCallApp(listAPI.CheckPassportTradingCode, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          if (res.data.Data === true) {
            toast.success(
              SuccessProgressToast(
                "Số hộ chiếu chưa được đăng ký tài khoản cá nhân nước ngoài tại TVSI. Hãy nhập Trading code để mở tài khoản!"
              )
            );
            this.isExistPassport = false
          } else {
            toast.success(
              SuccessProgressToast(
                "Số hộ chiếu đã được đăng ký tài khoản cá nhân nước ngoài tại TVSI"
              )
            );
            this.isExistPassport = true
          }
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getTvsiList(value: any) {
    this.dataTvsiList = [];
    await useApi
      .postRequestCallApp(listAPI.TvsiList, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataTvsiList = [...res.data.Data];
          } else {
            this.dataTvsiList = [];
          }
        } else {
          this.dataTvsiList = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getTvsiDetail(value: any) {
    this.dataTvsiDetail = [];
    await useApi
      .postRequestCallApp(listAPI.TvsiDetail, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataTvsiDetail = res.data.Data;
          } else {
            this.dataTvsiDetail = [];
          }
        } else {
          this.dataTvsiDetail = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getSaleInfo(value: any) {
    this.dataSaleInfo = [];
    await useApi
      .postRequestAuthCenter(listAPI.SaleInfo, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataSaleInfo = res.data.Data;
          } else {
            this.dataSaleInfo = [];
          }
        } else {
          this.dataSaleInfo = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async CheckExistTradingCode(value: any) {
    await useApi
      .postRequestCallApp(listAPI.CheckTradingCode, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          if (res.data.Data === true) {toast.success(
            SuccessProgressToast(
              "Số Trading code chưa được đăng ký tài khoản cá nhân nước ngoài tại TVSI"
            )
          );
            this.isExistTradingCode = false;
          } else {
            toast.success(
              SuccessProgressToast(
                "Số Trading code đã được đăng ký tài khoản cá nhân nước ngoài tại TVSI"
              )
            );
            this.isExistTradingCode = true;
          }
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getNational(value: any) {
    this.dataNationList = [];
    await useApi
      .postRequestCallApp(listAPI.NationList, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataNationList = [...res.data.Data];
          } else {
            this.dataNationList = [];
          }
        } else {
          this.dataNationList = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async addNewAccount(value: any) {
    await useApi
      .postRequestCallApp(listAPI.AddNewAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Đăng ký tài khoản thành công"
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
  async getListAccount(value: any) {
    this.loadingData = true;
    this.dataListAccountParam = value;
    await useApi
      .postRequestCallApp(listAPI.GetListAccount, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListAccount = [...res.data.Data];
            this.totalRowListAccount = res.data.Data.TotalItems;
          } else {
            this.dataListAccount = [];
            this.totalRowListAccount = 0;
          }
        } else {
          this.dataListAccount = [];
          this.totalRowListAccount = 0;
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
  async getDetailAccount(value: any) {
    this.dataDetailAccount = [];
    await useApi
      .postRequestCallApp(listAPI.getDetailAccount, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataDetailAccount = res.data.Data;
          } else {
            this.dataDetailAccount = [];
          }
        } else {
          this.dataDetailAccount = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async UpdateAccount(value: any) {
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
}

export const mngAccountStore = new ServiceExtension();
