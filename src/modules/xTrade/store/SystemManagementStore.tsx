import { observable } from "mobx";
import { CustomerAccountInfo, listAPI, BankCategoryParam } from "../types";
import useApi from "@services/UseAppApi";
import { toast } from "react-toastify";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../views/extensions/toastify/ToastTypes";
import axios from "axios";

class ServiceExtension {
  @observable resultCode: any = 0;
  @observable isShowPopup: boolean = false;
  @observable isShowPopupModalUpdate: boolean = false;
  @observable isShowPopupModalCalculate: boolean = false;
  @observable loadingData: boolean = false;
  // list sec Place Order
  @observable pageIndexListSecPlaceOrder: number = 1;
  @observable pageSizeListSecPlaceOrder: number = 10;
  @observable totalRowsListSecPlaceOrder: number = 0;
  @observable dataListSecPlaceOrder: any[] = [];
  @observable dataListSecPlaceOrderParam: any[] = [];
  @observable dataListMarket: any[] = [];
  @observable dataListStockInfo: any[] = [];
  @observable companyName: string = "";
  @observable market: string = "";
  // list price Place Order
  @observable pageIndexListPricePlaceOrder: number = 1;
  @observable pageSizeListPricePlaceOrder: number = 10;
  @observable totalRowsListPricePlaceOrder: number = 0;
  @observable dataListPricePlaceOrder: any;
  @observable dataListPricePlaceOrderParam: any;
  //config system
  @observable dataListConfigSystem: any[] = [];
  @observable dataListConfigSystemParam: any[] = [];
  @observable dataListChannel: any[] = [];
  @observable getDone: boolean = false;
  @observable isShowAddTrialAccount: boolean = false;
  @observable listTrialAccount: any[] = [];
  @observable listTrialAccountParam: any = "";
  //list status login
  @observable listStatusLogin: any[] = [];
  @observable sysConfigList: any[] = [];


  async getListSecPlaceOrder(value: any) {
    this.loadingData = true;
    this.dataListSecPlaceOrderParam = value;
    await useApi
      .postRequest(listAPI.getListSecPlaceOrder, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListSecPlaceOrder = [...res.data.Data];
            this.totalRowsListSecPlaceOrder =
              this.dataListSecPlaceOrder.length > 0 ? this.dataListSecPlaceOrder[0].RowCount : 0;
          } else {
            this.dataListSecPlaceOrder = [];
            this.totalRowsListSecPlaceOrder = 0;
          }
        } else {
          this.dataListSecPlaceOrder = [];
          this.totalRowsListSecPlaceOrder = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      });
  }
  handlePageChangeListSecToPurchase = (page: any) => {
    var p = page;
    this.pageIndexListSecPlaceOrder = p;
  };

  handlePerRowsChangeListSecToPurchase = (newpage: any, page: any) => {
    this.pageSizeListSecPlaceOrder = page;
  };

  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }
  onShowModalCalculate(data: boolean) {
    this.isShowPopupModalCalculate = data;
  }

  async onDeleteSymbolByStockCode(value: any) {
    await useApi
      .postRequest(listAPI.deleteListSecPlaceOrderByStockCode, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.getListSecPlaceOrder(this.dataListSecPlaceOrderParam);
          toast.success(
            SuccessProgressToast(
              "Bạn đã xóa thành công mã chứng khoán " + value.Symbol
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
  async getListMartket(value: any) {
    this.dataListMarket = [];
    await useApi
      .postRequest(listAPI.SystemStatus_Internal_Account, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListMarket = [{ Name: "Tất cả", Value: "" }, ...res.data.Data];
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
  async AddSymbol(value: any) {
    await useApi
      .postRequest(listAPI.AddListSecPlaceOrder, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã thêm mới thành công mã chứng khoán")
          );
          if (this.dataListSecPlaceOrderParam !== undefined && this.dataListSecPlaceOrderParam !== null) {
            this.getListSecPlaceOrder(this.dataListSecPlaceOrderParam);
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
  async UpdateSymbol(value: any) {
    await useApi
      .postRequest(listAPI.UpdListSecPlaceOrder, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Bạn đã sửa thành công mã chứng khoán " + value.Symbol
            )
          );
          this.getListSecPlaceOrder(this.dataListSecPlaceOrderParam);
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
  async getStockInfo(value: any) {
    this.dataListStockInfo = [];
    await useApi
      .postRequest(listAPI.getStockInfo, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListStockInfo.push(...res.data.Data);
            this.companyName = this.dataListStockInfo[0].companyName;
            this.market = this.dataListStockInfo[0].marketCode;
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

  async getListPricePlaceOrder(value: any) {
    this.loadingData = true;
    this.dataListPricePlaceOrderParam = value;
    await useApi
      .postRequest(listAPI.getListPricePlaceOrder, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null&& res.data.Data.length>0) {
            this.dataListPricePlaceOrder = [...res.data.Data];
            console.log(this.dataListPricePlaceOrder[0].RowCount);
            
            this.totalRowsListPricePlaceOrder = this.dataListPricePlaceOrder[0].RowCount;
          } else {
            this.dataListPricePlaceOrder = [];
            this.totalRowsListPricePlaceOrder = 0;
          }
        } else {
          this.dataListPricePlaceOrder = [];
          this.totalRowsListPricePlaceOrder = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
              
        console.log(this.totalRowsListPricePlaceOrder);
      });
  }
  handlePageChangeListPriceToPurchase = (page: any) => {
    var p = page;
    this.pageIndexListPricePlaceOrder = p;
  };

  handlePerRowsChangeListPriceToPurchase = (newpage: any, page: any) => {
    this.pageSizeListPricePlaceOrder = page;
  };
  async deleteSymboPriceToPurchase(symbol: any) {
    await useApi
      .postRequest(`${listAPI.deleteSymbolPriceToPurchase}/${symbol}`, [])
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Bạn đã xóa thành công mã chứng khoán " + symbol
            )
          );
          this.getListPricePlaceOrder(this.dataListPricePlaceOrderParam);
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async UpdateSymbolPriceToPurchase(value: any) {
    await useApi
      .postRequest(listAPI.updateSymbolPriceToPurchase, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Bạn đã sửa thành công mã chứng khoán " + value.Symbol
            )
          );
          this.getListPricePlaceOrder(this.dataListPricePlaceOrderParam);
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
  async AddymbolPriceToPurchase(value: any) {
    await useApi
      .postRequest(listAPI.addSymbolPriceToPurchase, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Bạn đã thêm thành công mã chứng khoán " + value.Symbol
            )
          );
          if (this.dataListPricePlaceOrderParam !== undefined && this.dataListPricePlaceOrderParam !== null) {
            this.getListPricePlaceOrder(this.dataListPricePlaceOrderParam);
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
  async CalculatePriceToPurchase(value: any) {
    await useApi
      .postRequest(listAPI.calculatelPriceToPurchase, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã tính lại thành công giá trước ngày")
          );
          this.pageIndexListPricePlaceOrder = 1;
          this.isShowPopupModalCalculate = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getListConfigSystem(value: any) {
    this.loadingData = true;
    this.dataListConfigSystemParam = value;
    await useApi
      .postRequest(listAPI.getListConfigSystem, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListConfigSystem = [...res.data.Data];
            this.getDone = true;
            // this.totalRowsListPricePlaceOrder =
            //   this.dataListPricePlaceOrder[0].RowCount;
          }
        } else {
          this.dataListConfigSystem = [];
          toast.error(ErrorToast(res.data.Message));
          // this.totalRowsListPricePlaceOrder = 0;
        }
        this.loadingData = false;
      });
  }
  async getListChannel() {
    this.dataListChannel = [];
    await useApi
      .postRequest(listAPI.getListChannel, {})
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListChannel = [{ Name: "Tất cả", Source: "" }, ...res.data.Data];
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
  async UpdateConfigSystem(value: any) {
    await useApi
      .postRequest(listAPI.updateListConfigSystem, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Bạn đã sửa thành công cấu hình hệ thống"
            )
          );
          this.getListConfigSystem(this.dataListConfigSystemParam);
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
  async UpdateChannel(value: any) {
    await useApi
      .postRequest(listAPI.updateListChannel, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Bạn đã sửa thành công cấu hình hệ thống"
            )
          );
          this.getListChannel();
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

  async GetListTrialAccount(url: any) {
    this.loadingData = true;
    this.listTrialAccountParam = url;
    await useApi
      .postRequest(listAPI.GetTrialAccountList + "?" + url, null)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        this.loadingData = false;
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.listTrialAccount = [...res.data.Data];
          } else {
            this.listTrialAccount = [];
          }
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        this.loadingData = false;
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  onShowAddTrialAccount(data: boolean) {
    this.isShowAddTrialAccount = data;
  }

  async ChangeTrialAccountStatus(url: any) {
    await useApi
      .postRequest(listAPI.ChangeActiveTrialAccount + url, null)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Thay đổi trạng thái thành công!"));
          this.GetListTrialAccount(this.listTrialAccountParam);
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        this.loadingData = false;
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async AddTrialUser(url: any) {
    await useApi
      .postRequest(listAPI.AddTrialAccount + url, null)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Thêm mới tài khoản thành công!"));
          if (this.listTrialAccountParam.length > 0) {
            this.GetListTrialAccount(this.listTrialAccountParam);
          }
          this.onShowAddTrialAccount(false);
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        this.loadingData = false;
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async getListStatus(value: any) {
    this.listStatusLogin = [];
    await useApi
      .postRequest(listAPI.SystemStatus_Internal_Account, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.listStatusLogin = [{ Name: "Tất cả", Value: -1 }, ...res.data.Data];
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

  async GetSysConfigList(param: any) {
    await useApi
      .postRequest(listAPI.GetSysConfigList, param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.sysConfigList = [...res.data.Data];
          }
        } else {
          this.sysConfigList = [];
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async ExportTrialAccount(url: any, fileName: string) {
    this.loadingData = true;
    this.listTrialAccountParam = url;
    await axios.post(process.env.REACT_APP_API + listAPI.ExportTrialAccount + "?" + url, null, { responseType: 'arraybuffer' })
      // .postRequest(listAPI.ExportTrialAccount + "?" + url, null)
      .then((res: any) => {
        var headers = res.headers;
        var blob = new Blob([res.data], { type: headers['content-type'] });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${fileName}.xlsx`;
        link.click();
      })
      .catch((error: any) => {
        this.loadingData = false;
        const { config, response } = error;
        toast.error(ErrorToast(error));
      });
  }
}

export const storeSystemManagement = new ServiceExtension();
