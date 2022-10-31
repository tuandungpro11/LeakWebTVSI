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
  @observable currentHisTab: string = "Call";
  @observable currentHisTabDetail: string = "Call";
  @observable resultCode: any = 0;
  @observable callAppHisId: string = "";
  @observable dataCallInfo: any[] = [];
  @observable dataPlanInfo: any[] = [];
  @observable scrollToTop: boolean = false;
  @observable isShowPopupHistoryCall: boolean = false;
  @observable isShowPopupBookingCall: boolean = false;

  //Customer
  @observable pageIndexListCustomer: number = 1;
  @observable pageSizeListCustomer: number = 10;
  @observable totalRowListCustomer: number = 0;
  @observable dataListCustormer: any[] = [];
  @observable dataListCustormerParam: any[] = [];
  //History Call
  @observable pageIndexHistoryCall: number = 1;
  @observable pageSizeHistoryCall: number = 10;
  @observable totalRowHistoryCall: number = 0;
  @observable dataHistoryCall: any[] = [];
  @observable dataHistoryCallParam: any[] = [];
  //History Plan
  @observable pageIndexHistoryPlan: number = 1;
  @observable pageSizeHistoryPlan: number = 10;
  @observable totalRowHistoryPlan: number = 0;
  @observable dataHistoryPlan: any[] = [];
  @observable dataHistoryPlanParam: any[] = [];
  //get Access Token
  @observable accessToken: string = "";
  //History Call Detail
  @observable pageIndexHistoryCallDetail: number = 1;
  @observable pageSizeHistoryCallDetail: number = 10;
  @observable totalRowHistoryCallDetail: number = 0;
  @observable dataHistoryCallDetail: any[] = [];
  @observable dataHistoryCallParamDetail: any[] = [];
  //History Plan Detail
  @observable pageIndexHistoryPlanDetail: number = 1;
  @observable pageSizeHistoryPlanDetail: number = 10;
  @observable totalRowHistoryPlanDetail: number = 0;
  @observable dataHistoryPlanDetail: any[] = [];
  @observable dataHistoryPlanParamDetail: any[] = [];
  //check incall
  @observable isInCall: boolean = false;
  //get Status
  @observable dataListStatusBookingCall: any[] = [];
  // check call api add/upd isSucess
  @observable isCallApiSuccess: boolean = false;
  //get comment Account
  @observable dataCommentByAccount: any[]=[]

  handlePageChangeListCustomer = (page: any) => {
    var p = page;
    this.pageIndexListCustomer = p;
  };
  handlePerRowsChangeListCustomer = (newpage: any, page: any) => {
    this.pageSizeListCustomer = page;
  };

  handlePageChangeHistoryCall = (page: any) => {
    var p = page;
    this.pageIndexHistoryCall = p;
  };
  handlePerRowsChangeHistoryCall = (newpage: any, page: any) => {
    this.pageSizeHistoryCall = page;
  };

  handlePageChangeHistoryPlan = (page: any) => {
    var p = page;
    this.pageIndexHistoryPlan = p;
  };
  handlePerRowsChangeHistoryPlan = (newpage: any, page: any) => {
    this.pageSizeHistoryPlan = page;
  };
  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }
  onShowModalHistoryCall(data: boolean) {
    this.isShowPopupHistoryCall = data;
  }
  onShowModalBookingCall(data: boolean) {
    this.isShowPopupBookingCall = data;
  }

  handlePageChangeHistoryCallDetail = (page: any) => {
    var p = page;
    this.pageIndexHistoryCallDetail = p;
  };
  handlePerRowsChangeHistoryCallDetail = (newpage: any, page: any) => {
    this.pageSizeHistoryCallDetail = page;
  };

  handlePageChangeHistoryPlanDetail = (page: any) => {
    var p = page;
    this.pageIndexHistoryPlanDetail = p;
  };
  handlePerRowsChangeHistoryPlanDetail = (newpage: any, page: any) => {
    this.pageSizeHistoryPlanDetail = page;
  };

  async getAccessToken(value: any) {
    this.accessToken = "";
    await useApi
      .postRequestStringee(listAPI.getAccessToken, value)
      .then((res: any) => {
        if (res.data.RetCode === "000") {
          this.accessToken = res.data.RetData.AccessToken;
        } else {
          toast.error(ErrorToast(res.data.RetMsg));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getListCustomer(value: any) {
    this.loadingData = true;
    this.dataListCustormerParam = value;
    await useApi
      .postRequestCallApp(listAPI.GetListCustomer, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data.Items != null) {
            this.dataListCustormer = [...res.data.Data.Items];
            this.totalRowListCustomer = res.data.Data.TotalItem;
          } else {
            this.dataListCustormer = [];
            this.totalRowListCustomer = 0;
          }
        } else {
          this.dataListCustormer = [];
          this.totalRowListCustomer = 0;
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
  async getHistoryCall(value: any) {
    this.loadingData = true;
    this.dataHistoryCallParam = value;
    await useApi
      .postRequestCallApp(listAPI.GetListHistoryCall, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data.Items != null) {
            this.dataHistoryCall = [...res.data.Data.Items];
            this.totalRowHistoryCall = res.data.Data.TotalItem;
          } else {
            this.dataHistoryCall = [];
            this.totalRowHistoryCall = 0;
          }
        } else {
          this.dataHistoryCall = [];
          this.totalRowHistoryCall = 0;
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
  async addCallInfo(value: any) {
    await useApi
      .postRequestCallApp(listAPI.AddCallInfo, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Bạn đã thêm mới thành công thông tin cuộc gọi"
            )
          );
          if(this.currentHisTab=="Call" && Object.keys(this.dataHistoryCallParam).length > 0){
            this.getHistoryCall(this.dataHistoryCallParam);
          }
          this.callAppHisId = res.data.Data.callAppHisId;
          this.isCallApiSuccess = true;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async updateCallInfo(value: any) {
    await useApi
      .postRequestCallApp(listAPI.UpdateCallInfo, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Lưu ghi chú và đánh giá cuộc gọi thành công")
          );
          this.isCallApiSuccess = true;
          if(this.currentHisTab=="Call" && Object.keys(this.dataHistoryCallParam).length > 0){
            this.getHistoryCall(this.dataHistoryCallParam);
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
  async addPlan(value: any) {
    await useApi
      .postRequestCallApp(listAPI.AddPlan, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Đặt lịch cuộc gọi thành công"));
          this.isCallApiSuccess = true;
          console.log(this.currentHisTab);
          console.log(this.dataHistoryPlanParam.length);
          if(this.currentHisTab=="Plan" && Object.keys(this.dataHistoryPlanParam).length > 0){
            this.getHistoryPlan(this.dataHistoryPlanParam);
          }
          // this.callAppHisId = res.data.Data.callAppHisId;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async UpdPlan(value: any) {
    await useApi
      .postRequestCallApp(listAPI.UpdPlan, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã sửa thành công thông tin cuộc hẹn")
          );
          this.isCallApiSuccess = true;
          
          if(this.currentHisTab=="Plan" && Object.keys(this.dataHistoryPlanParam).length > 0){
            this.getHistoryPlan(this.dataHistoryPlanParam);
          }
          // this.callAppHisId = res.data.Data.callAppHisId;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getHistoryPlan(value: any) {
    this.loadingData = true;
    this.dataHistoryPlanParam = value;
    await useApi
      .postRequestCallApp(listAPI.GetListHistoryPlan, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data.Items != null) {
            this.dataHistoryPlan = [...res.data.Data.Items];
            this.totalRowHistoryPlan = res.data.Data.TotalItem;
          } else {
            this.dataHistoryPlan = [];
            this.totalRowHistoryPlan = 0;
          }
        } else {
          this.dataHistoryPlan = [];
          this.totalRowHistoryPlan = 0;
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
  async getHistoryCallDetail(value: any) {
    this.loadingData = true;
    this.dataHistoryCallDetail=[];
    this.totalRowHistoryCallDetail = 0;
    this.dataHistoryCallParamDetail = value;
    await useApi
      .postRequestCallApp(listAPI.GetListHistoryCall, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data.Items != null) {
            this.dataHistoryCallDetail = [...res.data.Data.Items];
            this.totalRowHistoryCallDetail = res.data.Data.TotalItem;
          } else {
            this.dataHistoryCallDetail = [];
            this.totalRowHistoryCallDetail = 0;
          }
        } else {
          this.dataHistoryCallDetail = [];
          this.totalRowHistoryCallDetail = 0;
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
  async getHistoryPlanDetail(value: any) {
    this.loadingData = true;
    this.dataHistoryPlanParamDetail = value;
    await useApi
      .postRequestCallApp(listAPI.GetListHistoryPlan, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data.Items != null) {
            this.dataHistoryPlanDetail = [...res.data.Data.Items];
            this.totalRowHistoryPlanDetail = res.data.Data.TotalItem;
          } else {
            this.dataHistoryPlanDetail = [];
            this.totalRowHistoryPlanDetail = 0;
          }
        } else {
          this.dataHistoryPlanDetail = [];
          this.totalRowHistoryPlanDetail = 0;
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
  async getListStatusBookingCall(value: any) {
    this.dataListStatusBookingCall = [];
    await useApi
      .postRequestCallApp(listAPI.GetListStatusBooingCall, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListStatusBookingCall = [...res.data.Data];
          } else {
            this.dataListStatusBookingCall = [];
          }
        } else {
          this.dataListStatusBookingCall = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async DeletePlan(value: any) {
    await useApi
      .postRequestCallApp(listAPI.DeletePlan, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Hủy lịch đặt cuộc gọi thành công")
          );
          this.isCallApiSuccess = true;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getCommentByAccount(value:any){
    this.dataCommentByAccount = [];
    await useApi
      .postRequestCallApp(listAPI.GetCommentByAccount, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataCommentByAccount = [...res.data.Data];
          } else {
            this.dataCommentByAccount = [];
          }
        } else {
          this.dataCommentByAccount = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  
  async addCommentByAccount(value: any) {
    await useApi
      .postRequestCallApp(listAPI.addCommentByAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Thêm ghi chú thành công")
          );
          this.isCallApiSuccess = true;
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

export const storeTwork = new ServiceExtension();
