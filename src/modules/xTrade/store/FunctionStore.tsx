import { observable } from "mobx";
import { CustomerAccountInfo, listAPI, BankCategoryParam } from "../types";
import useApi from "@services/UseAppApi";
import { toast } from "react-toastify";
import { ErrorToast, SuccessProgressToast } from "../../../views/extensions/toastify/ToastTypes";
import { getTextOfJSDocComment } from "typescript";

class ServiceExtension {
  @observable resultCode: any = 0;
  @observable isShowPopup: boolean = false;
  @observable isShowPopupModalUpdate: boolean = false;
  @observable loadingData: boolean = false;
  // list sec
  @observable pageIndexListSecToPurchase: number = 1;
  @observable pageSizeListSecToPurchase: number = 10;
  @observable totalRowsListSecToPurchase: number = 0;
  @observable dataListSecToPurchase: any[] = [];
  @observable dataListSecToPurchaseParam: any[] = [];
  @observable dataListStatusSecToPurchase: any[] = [];
  // his list sec
  @observable pageIndexHisListSecToPurchase: number = 1;
  @observable pageSizeHisListSecToPurchasee: number = 10;
  @observable totalRowsHisListSecToPurchase: number = 0;
  @observable dataHisListSecToPurchase: any[] = [];
  @observable dataHisListSecToPurchaseParam: any[] = [];
  //right buy
  @observable pageIndexRightBuy: number = 1;
  @observable pageSizeRightBuy: number = 10;
  @observable totalRowsRightBuy: number = 0;
  @observable dataRightBuy: any[] = [];
  @observable dataRightBuyParam: any[] = [];

  //His Right Buy
  @observable pageIndexHisRightBuy: number = 1;
  @observable pageSizeHisRightBuy: number = 10;
  @observable totalRowsHisRightBuy: number = 0;
  @observable dataHisRightBuy: any[] = [];

  // Securities Right
  @observable pageIndexSecRight: number = 1;
  @observable pageSizeSecRight: number = 10;
  @observable totalRowsSecRight: number = 0;
  @observable dataSecRight: any[] = [];
  //Config 
  @observable pageIndexConfig: number = 1;
  @observable pageSizeConfig: number = 10;
  @observable totalRowsConfig: number = 0;
  @observable dataConfig: any[] = [];
  //Service
  @observable pageIndexService: number = 1;
  @observable pageSizeService: number = 10;
  @observable totalRowsService: number = 0;
  @observable dataService: any[] = [];
  @observable dataServiceParam: any[] = [];
  //Account
  @observable pageIndexAccount: number = 1;
  @observable pageSizeAccount: number = 10;
  @observable totalRowsAccount: number = 0;
  @observable dataAccount: any[] = [];
  @observable dataAccountParam: any[] = [];
  
  @observable dataListInternalAccountStatus: any[] = [];


  @observable custIDValid: boolean = true;

  async getListSecToPurChase(value: any) {
    this.loadingData = true;
    this.dataListSecToPurchaseParam = value;
    this.dataListSecToPurchase=[];
    await useApi
      .postRequest(listAPI.ListOverdraftSecToPurchase, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length>0) {
            this.dataListSecToPurchase = [...res.data.Data];
            this.totalRowsListSecToPurchase =
              this.dataListSecToPurchase[0].RowCount;
          }else{
            this.dataListSecToPurchase = [];
            this.totalRowsListSecToPurchase = 0;
          }
        } else {
          this.dataListSecToPurchase = [];
          this.totalRowsListSecToPurchase = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  handlePageChangeListSecToPurchase = (page: any) => {
    var p = page;
    this.pageIndexListSecToPurchase = p;
  };

  handlePerRowsChangeListSecToPurchase = (newpage: any, page: any) => {
    this.pageSizeListSecToPurchase = page;
  };

  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }

  async AddNewOverDraft(value: any) {
    await useApi
      .postRequest(listAPI.AddOverdraftSecToPurchase, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã thêm mới thành công mã chứng khoán")
          );
          if(this.dataListSecToPurchaseParam.length>0){
            this.getListSecToPurChase(this.dataListSecToPurchaseParam);
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
  async UpdateSecCode(value: any) {
    await useApi
      .postRequest(listAPI.UpdOverdraftSecToPurchase, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã sửa thành công mã chứng khoán")
          );
          this.getListSecToPurChase(this.dataListSecToPurchaseParam);
          this.isShowPopupModalUpdate = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async DeleteSecToPurchase(value: any, Symbol: string) {
    await useApi
      .postRequest(listAPI.DelOverdraftSecToPurchase+"/"+value, [])
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.getListSecToPurChase(this.dataListSecToPurchaseParam);
          toast.success(
            SuccessProgressToast(
              "Bạn đã xóa thành công mã chứng khoán " + Symbol
            )
          );
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  };
  
  async getListStatusSecToPurchase(value: any){
    this.dataListStatusSecToPurchase=[];
    await useApi.postRequest(listAPI.SystemStatus_Internal_Account, value).then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null && res.data.Data.length> 0) {
          this.dataListStatusSecToPurchase = [{Name: "Tất cả", Value: -1}, ...res.data.Data];
        }
        else{
          this.dataListStatusSecToPurchase=[];
        }
      } else {
        this.dataListStatusSecToPurchase=[];
        toast.error(ErrorToast(res.data.Message));
      }
    });
  };
  async getListHisSecToPurChase(value: any) {
    this.loadingData = true;
    this.dataHisListSecToPurchaseParam = value;
    this.dataHisListSecToPurchase=[];
    await useApi
      .postRequest(listAPI.ListHisOverdraftSecToPurchase, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length>0) {
            this.dataHisListSecToPurchase = [...res.data.Data];
            this.totalRowsHisListSecToPurchase =
              this.dataHisListSecToPurchase[0].RowCount;
          }else{
            this.dataHisListSecToPurchase = [];
            this.totalRowsHisListSecToPurchase =0;
          }
        } else {
          this.dataHisListSecToPurchase = [];
          this.totalRowsHisListSecToPurchase =0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      });
  }
  handlePageChangeLisHistSecToPurchase = (page: any) => {
    var p = page;
    this.pageIndexHisListSecToPurchase = p;
  };

  handlePerRowsChangeHisListSecToPurchase = (newpage: any, page: any) => {
    this.pageSizeHisListSecToPurchasee = page;
  };

  
  async getListRightBuy(value: any) {
    this.loadingData = true;
    this.dataRightBuyParam = value;
    this.dataRightBuy=[];
    await useApi
      .postRequest(listAPI.getListRightBuy, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length>0) {
            this.dataRightBuy = [...res.data.Data];
            this.totalRowsRightBuy =
              this.dataRightBuy[0].ROWCOUNT;
          }else{
            this.dataRightBuy = [];
            this.totalRowsRightBuy=0;
          }
        } else {
          this.dataRightBuy = [];
          this.totalRowsRightBuy=0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  handlePageChangeListRightBuy = (page: any) => {
    var p = page;
    this.pageIndexRightBuy = p;
  };

  handlePerRowsChangeListRightBuy = (newpage: any, page: any) => {
    this.pageSizeRightBuy = page;
  };

  async getListHisRightBuy(value: any) {
    this.dataHisRightBuy=[];
    this.loadingData = true;
    await useApi
      .postRequest(listAPI.getListHisRightBuy, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length>0) {
            this.dataHisRightBuy = [...res.data.Data];
            this.totalRowsHisRightBuy =
              this.dataHisRightBuy[0].RowCount;
          }else{
            this.dataHisRightBuy = [];
            this.totalRowsHisRightBuy=0;
          }
        } else {
          this.dataHisRightBuy = [];
          this.totalRowsHisRightBuy=0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  handlePageChangeListHisRightBuy = (page: any) => {
    var p = page;
    this.pageIndexHisRightBuy = p;
  };

  handlePerRowsChangeHisListRightBuy = (newpage: any, page: any) => {
    this.pageSizeHisRightBuy = page;
  };

  async getListSecRight(value: any) {
    this.loadingData = true;
    this.dataSecRight=[];
    await useApi
      .postRequest(listAPI.getListSecRight, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length>0) {
            this.dataSecRight = [...res.data.Data];
            this.totalRowsSecRight =
              this.dataSecRight[0].ROWCOUNT;
          }else {
            this.dataSecRight = [];
            this.totalRowsSecRight=0;
          }
        } else {
          this.dataSecRight = [];
          this.totalRowsSecRight=0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  handlePageChangeListSecRight = (page: any) => {
    var p = page;
    this.pageIndexSecRight = p;
  };

  handlePerRowsChangeSecListRight = (newpage: any, page: any) => {
    this.pageSizeSecRight = page;
  };

  async getListService(value: any) {
    this.loadingData = true;
    this.dataService=[];
    this.dataServiceParam= value;
    await useApi
      .postRequest(listAPI.getListOverdraftService, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length>0) {
            this.dataService = [...res.data.Data];
            this.totalRowsService =
              this.dataService[0].RowCount;
          }else{
            this.dataService = [];
            this.totalRowsService=0;
          }
        } else {
          this.dataService = [];
          this.totalRowsService=0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async addNewOverDraftService(value: any) {
    await useApi
      .postRequest(listAPI.AddNewListOverdraftService, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã thêm mới thành công dịch vụ thấu chi")
          );
          if(this.dataServiceParam.length>0){
            this.getListService(this.dataServiceParam);
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
  async deleteOverDraftService(value: any,serviceName:any) {
    await useApi
      .postRequest(listAPI.deleteListOverdraftService+"/"+value.Id, [])
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.getListService(this.dataServiceParam);
          toast.success(
            SuccessProgressToast("Bạn đã xóa thành công dịch vụ thấu chi " + serviceName)
          );
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async updateOverDraftService(value: any) {
    await useApi
      .postRequest(listAPI.updateListOverdraftService, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã sửa thành công dịch vụ thấu chi")
          );
          this.getListService(this.dataServiceParam);
          this.isShowPopupModalUpdate = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  
  handlePageChangeListService = (page: any) => {
    var p = page;
    this.pageIndexService = p;
  };

  handlePerRowsChangeListService = (newpage: any, page: any) => {
    this.pageSizeService = page;
  };

  async getListAccount(value: any) {
    this.loadingData = true;
    this.dataAccountParam= value;
    await useApi
      .postRequest(listAPI.getListOverdraftAccount, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length>0) {
            this.dataAccount = [...res.data.Data];
            this.totalRowsAccount =
              this.dataAccount[0].RowCount;
          }else{
            this.dataAccount = [];
            this.totalRowsAccount=0;
          }
        } else {
          this.dataAccount = [];
          this.totalRowsAccount=0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      });
  }
  handlePageChangeListAccount = (page: any) => {
    var p = page;
    this.pageIndexAccount = p;
  };

  handlePerRowsChangeSecListAccount = (newpage: any, page: any) => {
    this.pageSizeAccount = page;
  };
  async deleteOverDraftAccount(value: any,AccountID:any) {
    await useApi
      .postRequest(listAPI.deleteOverdraftAccount+"/"+value.Id, [])
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.getListAccount(this.dataAccountParam);
          toast.success(
            SuccessProgressToast("Bạn đã xóa thành công tài khoản thấu chi " + AccountID)
          );
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async addNewOverDraftAccount(value: any) {
    await useApi
      .postRequest(listAPI.addOverdraftAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          console.log("param", this.dataAccountParam);
          
          if(this.dataAccountParam.length > 0){
            this.getListAccount(this.dataAccountParam);
          }
          this.isShowPopup = false;
          toast.success(
            SuccessProgressToast("Bạn đã thêm mới thành công tài khoản thấu chi " + value.AccountId)
          );
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async updOverDraftAccount(value: any) {
    await useApi
      .postRequest(listAPI.updOverdraftAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.getListAccount(this.dataAccountParam);
          this.isShowPopupModalUpdate = false;
          toast.success(
            SuccessProgressToast("Bạn đã sửa thành công tài khoản thấu chi " + value.AccountId)
          );
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getListWarning(value: any) {
    this.loadingData = true;
    this.dataConfig=[];
    await useApi
      .postRequest(listAPI.getListWarning, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length>0) {
            this.dataConfig = [...res.data.Data];
            this.totalRowsConfig =
              this.dataConfig[0].RowCount;
          }else {
            this.totalRowsConfig=0
            this.dataConfig = [];
          }
        } else {
          this.totalRowsConfig=0
          this.dataConfig = [];
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      });
  }

  handlePageChangeListWarning = (page: any) => {
    var p = page;
    this.pageIndexConfig = p;
  };

  handlePerRowsChangeListWarning = (newpage: any, page: any) => {
    this.pageSizeConfig = page;
  };
  async getListStatusInternalAccount(value: any) {
    this.loadingData = true;
    this.dataListInternalAccountStatus=[];
    await useApi
      .postRequest(listAPI.SystemStatus_Internal_Account, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListInternalAccountStatus = [{Name: "Tất cả", Value: -1}, ...res.data.Data];
          }else{
            this.dataListInternalAccountStatus = []
          }
        } else {
          this.dataListInternalAccountStatus = []
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      });
  }
  async updateChangeStatusRightBuy(value: any) {
    await useApi
      .postRequest(listAPI.changeStatusRightBuy, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã chuyển thành công trạng thái quyền mua")
          );
          this.isShowPopupModalUpdate = false;
          this.getListRightBuy(this.dataRightBuyParam);
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async ExportListUI(api:any, value: any, fileName: string) {
    this.loadingData = true;
    // this.listbank = url;
    // await axios.post(process.env.REACT_APP_API + listAPI.ExportListBank + "?" + value, null, { responseType: 'arraybuffer' })
      await useApi.postRequestExport(api, value)
      .then((res: any) => {
        var headers = res.headers;
        var blob = new Blob([res.data], { type: headers['content-type'] });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${fileName}.xlsx`;
        link.click();
        this.loadingData = false;
      })
      .catch((error: any) => {
        this.loadingData = false;
        const { config, response } = error;
        toast.error(ErrorToast(error));
      });
  }
}

export const store = new ServiceExtension();
