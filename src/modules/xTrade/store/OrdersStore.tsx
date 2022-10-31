import { observable } from "mobx";
import { CustomerAccountInfo, listAPI, BankCategoryParam } from "../types";
import useApi from "@services/UseAppApi";
import { toast } from "react-toastify";
import { ErrorToast, SuccessProgressToast } from "../../../views/extensions/toastify/ToastTypes";

class ServiceExtension {
  @observable isShowPopup: boolean = false;
  @observable isShowPopupEdit: boolean = false;
  @observable loadingData: boolean = false;
  @observable isShowPopupModalUpdate: boolean = false;
  //TFOS

  @observable pageIndexTFOS: number = 1;
  @observable pageSizeTFOS: number = 10;
  @observable totalRowsTFOS: number = 0;
  @observable dataListTFOS: any[] = [];
  //OSHT
  @observable pageIndexOSHT: number = 1;
  @observable pageSizeOSHT: number = 10;
  @observable totalRowsOSHT: number = 0;
  @observable dataListOSHT: any[] = [];
  //Lenh truoc ngay
  @observable pageIndexBeforeDate: number = 1;
  @observable pageSizeBeforeDate: number = 10;
  @observable totalRowsBeforeDate: number = 0;
  @observable dataListBeforeDate: any[] = [];
  //Lenh dieu kien
  @observable pageIndexCondition: number = 1;
  @observable pageSizeCondition: number = 10;
  @observable totalRowsCondition: number = 0;
  @observable dataListCondition: any[] = [];
  @observable currentConditionOrderTab: string = "Time";
  //Get sys Config

  @observable dataSysStatus: any[] = [];
  @observable dataSysCooType: any[] = [];
  @observable dataSysSide: any[] = [];

  //Group Order
  @observable pageIndexGroupOrder: number = 1;
  @observable pageSizeGroupOrder: number = 10;
  @observable totalRowsGroupOrder: number = 0;
  @observable dataListGroupOrder: any[] = [];

  //Detail Group Order
  @observable pageIndexDetailGroupOrder: number = 1;
  @observable pageSizeDetailGroupOrder: number = 10;
  @observable totalRowsDetailGroupOrder: number = 0;
  @observable dataListDetailGroupOrder: any[] = [];


  async getListOrdersTFOS(value: any) {
    this.loadingData = true;
    // this.dataListBankAccParam=value;
    await useApi.postRequest(listAPI.getListTF_OS, value)
    .then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null && res.data.Data.items && res.data.Data.items.length > 0) {
          this.dataListTFOS = [...res.data.Data.items];
          this.totalRowsTFOS = res.data.Data.totalItems;
        }
        else{
          this.dataListTFOS = [];
          this.totalRowsTFOS=0;
        }
      } else {
        this.dataListTFOS = [];
        this.totalRowsTFOS=0;
        toast.error(ErrorToast(res.data.Message));
      }
      this.loadingData = false;
    })
    .catch((error: any) => {
      this.loadingData = false;
      toast.error(ErrorToast("Lỗi hệ thống!"));
    });
  }

  handlePageChangeTFOS = (page: any) => {
    var p = page;
    this.pageIndexTFOS = p;
  };
  handlePerRowsChangeTFOS = (newpage: any, page: any) => {
    this.pageSizeTFOS = page;
  };
  handlePageChangeOSHT = (page: any) => {
    var p = page;
    this.pageIndexOSHT = p;
  };
  handlePerRowsChangeOSHT = (newpage: any, page: any) => {
    this.pageSizeOSHT = page;
  };
  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }

  async getListOrdersBeforeDate(value: any) {
    this.loadingData = true;
    // this.dataListBankAccParam=value;
    await useApi.postRequest(listAPI.getListBeforeDate, value).then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null && res.data.Data.items && res.data.Data.items.length > 0) {
          this.dataListBeforeDate = [...res.data.Data.items];
          this.totalRowsBeforeDate = res.data.Data.totalItems;
        }else{
          this.dataListBeforeDate = [];
          this.totalRowsBeforeDate=0;
        }
      } else {
        this.dataListBeforeDate = [];
        this.totalRowsBeforeDate=0;
        toast.error(ErrorToast(res.data.Message));
      }
      this.loadingData = false;
    });
  }
  handlePageChangeBeforeDate = (page: any) => {
    var p = page;
    this.pageIndexBeforeDate = p;
  };
  handlePerRowsChangeBeforeDate = (newpage: any, page: any) => {
    this.pageSizeBeforeDate = page;
  };

  async getListConditionByTime(value: any) {
    this.loadingData = true;
    // this.dataListBankAccParam=value;
    await useApi.postRequest(listAPI.getListConditionByTime, value)
    .then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null&& res.data.Data.length>0) {
          this.dataListCondition = [...res.data.Data];
          this.totalRowsCondition = this.dataListCondition[0].RowCount;
        }else {
          this.dataListCondition = [];
          this.totalRowsCondition=0;
        }
      } else {
        this.dataListCondition = [];
        this.totalRowsCondition=0;
        toast.error(ErrorToast(res.data.Message));
      }
      this.loadingData = false;
    })
    .catch((error: any) => {
      this.loadingData = false;
      toast.error(ErrorToast('Lỗi hệ thống!'));
    });
  }
  async getListConditionByPrice(value: any) {
    this.loadingData = true;
    // this.dataListBankAccParam=value;
    await useApi.postRequest(listAPI.getListConditionByPrice, value).then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null&& res.data.Data.length>0) {
          this.dataListCondition = [...res.data.Data];
          this.totalRowsCondition = this.dataListCondition[0].RowCount;
        }else {
          this.dataListCondition = [];
          this.totalRowsCondition=0;
        }
      } else {
        this.dataListCondition = [];
        this.totalRowsCondition=0;
        toast.error(ErrorToast(res.data.Message));
      }
      this.loadingData = false;
    });
  }
  handlePageChangeCondition = (page: any) => {
    var p = page;
    this.pageIndexCondition = p;
  };
  handlePerRowsCondition = (newpage: any, page: any) => {
    this.pageSizeCondition = page;
  };

  async getSysConfig(value: any) {
    this.loadingData = true;
    // this.dataListBankAccParam=value;
    await useApi.postRequest(listAPI.SystemStatus_Internal_Account, value).then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null&& res.data.Data.length>0) {
          if(value.Group == "COOTYPE"){
            this.dataSysCooType=[];
            this.dataSysCooType = [{Name: "Tất cả", Value:  -1}, ...res.data.Data];
          }
          if(value.Group == "STATUS"){
            this.dataSysStatus=[];
            this.dataSysStatus = [{Name: "Tất cả", Value:  -1}, ...res.data.Data];
          }
          if(value.Group == "SIDE"){
            this.dataSysSide=[];
            this.dataSysSide = [{Name: "Tất cả", Value: ""}, ...res.data.Data];
          }
        }
      } else {
        this.dataListTFOS = [];
        this.dataSysCooType=[];
        this.dataSysStatus=[];
        this.dataSysSide=[];
        this.totalRowsTFOS=0;
        toast.error(ErrorToast(res.data.Message));
      }
      this.loadingData = false;
    });
  }

  async getListGroupOrder(value: any) {
    this.loadingData = true;
    // this.dataListBankAccParam=value;
    await useApi.postRequest(listAPI.getListGroupOrder, value).then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null&& res.data.Data.length>0) {
          this.dataListGroupOrder = [...res.data.Data];
          this.totalRowsGroupOrder = this.dataListGroupOrder[0].RowCount;
        }else{
          this.dataListGroupOrder = [];
          this.totalRowsGroupOrder=0;
        }
      } else {
        toast(ErrorToast(res.data.Message));
        this.dataListGroupOrder = [];
        this.totalRowsGroupOrder=0;
      }
      this.loadingData = false;
    });
  }
  handlePageChangeGroupOrder = (page: any) => {
    var p = page;
    this.pageIndexGroupOrder = p;
  };
  handlePerRowsGroupOrder = (newpage: any, page: any) => {
    this.pageSizeGroupOrder = page;
  };
  
  async getListDetailGroupOrder(value: any) {
    this.loadingData = true;
    // this.dataListBankAccParam=value;
    await useApi.postRequest(listAPI.getListDetailGroupOrder, value).then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null&& res.data.Data.length>0) {
          this.dataListDetailGroupOrder = [...res.data.Data];
          this.totalRowsDetailGroupOrder = this.dataListDetailGroupOrder[0].RowCount;
        }else{
          this.dataListDetailGroupOrder = [];
          this.totalRowsDetailGroupOrder=0;
        }
      } else {
        this.dataListDetailGroupOrder = [];
        this.totalRowsDetailGroupOrder=0;
        toast(ErrorToast(res.data.Message))
      }
      this.loadingData = false;
    });
  }
  handlePageChangeDetailGroupOrder = (page: any) => {
    var p = page;
    this.pageIndexDetailGroupOrder = p;
  };
  handlePerRowsDetailGroupOrder = (newpage: any, page: any) => {
    this.pageSizeDetailGroupOrder = page;
  };

  
  async getListOSHT(value: any) {
    this.loadingData = true;
    // this.dataListBankAccParam=value;
    await useApi.postRequest(listAPI.getListOSHT, value).then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null&& res.data.Data.length>0) {
          this.dataListOSHT = [...res.data.Data];
          this.totalRowsOSHT = this.dataListOSHT[0].RowCount;
        }else {
          this.dataListOSHT = [];
          this.totalRowsOSHT=0;
        }
      } else {
        this.dataListOSHT = [];
        this.totalRowsOSHT=0;
        toast.error(ErrorToast(res.data.Message));
      }
      this.loadingData = false;
    });
  }

  @observable orderInOutStatus: any[] = [];
  async GetrderInOutStatus(param: any) {
    await useApi
      .postRequest(listAPI.GetSysConfigList, param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.orderInOutStatus = [{Name: 'Tất cả', Value: ""},...res.data.Data];
          }else{
            this.orderInOutStatus = [];
          }
        } else {
          this.orderInOutStatus = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
}

export const storeOrder = new ServiceExtension();
