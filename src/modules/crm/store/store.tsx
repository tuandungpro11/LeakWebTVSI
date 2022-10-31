import { observable } from "mobx";
import { Customer, listAPI, PotentialCustomer, PotentialCustomerActivity, tradingStatus } from "../types";
import useApi from "@services/UseAppApi";
import { toast } from "react-toastify";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../views/extensions/toastify/ToastTypes";
import { appStore } from "../../../stores/appStore";

class ServiceExtension {
  @observable pageIndexCustomerPotential: number = 1;
  @observable pageSizeCustomerPotential: number = 10;
  @observable loadingData: boolean = false;
  @observable listCustomerAccount: PotentialCustomer[] = [];
  @observable customerPotentialListParam: any;
  @observable totalCustomerAccRows: number = 0;
  @observable listLeadSource: PotentialCustomer[] = []

  async getListCustomerPotential(value: any) {
    this.loadingData = true;
    this.listCustomerAccount = [];
    this.customerPotentialListParam = value;
    await useApi
      .postRequestCRM(listAPI.listCustomerPotential, value)
      .then((res: any) => {
        if (
          res.data.Code === "0"
        ) {
          if (res.data.Data !== null && res.data.Data.Items !== null) {
            this.listCustomerAccount = [...res.data.Data.Items];
            this.totalCustomerAccRows = res.data.Data.TotalItem;
          } else {
            this.listCustomerAccount = [];
            this.totalCustomerAccRows = 0;
          }
        } else {
          this.listCustomerAccount = [];
          this.totalCustomerAccRows = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  async getListLeadSource(userName: string, isAll?: boolean = true) {
    this.loadingData = true;
    this.listLeadSource = [];
    const param = {
      UserName: userName
    }
    await useApi
      .postRequestCRM(listAPI.listSrcLead, param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null &&
            res.data.Data.length > 0) {
            if(isAll) {
              this.listLeadSource = [{LeadSourceID: 0, SourceName: "Tất cả"}, ...res.data.Data];
            } else {
              this.listLeadSource = [...res.data.Data];
            }
          } else {
            this.listLeadSource = [];
          }
        } else {
          this.listLeadSource = [];
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable listLeadSourceParam: PotentialCustomer[] = []
  async getListLeadSourceParam(userName: string) {
    this.loadingData = true;
    this.listLeadSourceParam = [];
    const param = {
      UserName: userName
    }
    await useApi
      .postRequestCRM(listAPI.listSrcLead, param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null &&
            res.data.Data.length > 0) {
              this.listLeadSourceParam = [...res.data.Data];
          } else {
            this.listLeadSourceParam = [];
          }
        } else {
          this.listLeadSourceParam = [];
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  handlePageChangeCustomerPotential = (page: any) => {
    this.pageIndexCustomerPotential = page;
  };
  handlePerRowsChangeCustomerPotential = (newpage: any, page: any) => {
    this.pageSizeCustomerPotential = page;
  };

  @observable detailLead: any;
  async getLeadInfo(id: string) {
    this.loadingData = true;
    this.listLeadSource = [];
    const param = {
      UserName: appStore.account.LoginName,
      LeadID: id
    }
    await useApi
      .postRequestCRM(listAPI.GetDetailLead, param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.detailLead = res.data.Data;
          } else {
            this.detailLead = {};
          }
        } else {
          this.detailLead = {};
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable pageIndexCustomerPotentialActivity: number = 1;
  @observable pageSizeCustomerPotentialActivity: number = 10;
  @observable listCustomerActivity: PotentialCustomerActivity[] = [];
  @observable customerPotentialActivityListParam: any;
  @observable totalCustomerActivityRows: number = 0;
  handlePageChangeCustomerPotentialActivity = (page: any) => {
    this.pageIndexCustomerPotentialActivity = page;
  };
  handlePerRowsChangeCustomerPotentialActivity = (newpage: any, page: any) => {
    this.pageSizeCustomerPotentialActivity = page;
  };

  async getListCustomerPotentialActivity (value: any) {
    this.loadingData = true;
    this.listCustomerActivity = [];
    this.customerPotentialActivityListParam = value;
    await useApi
      .postRequestCRM(listAPI.GetLeadActivity, value)
      .then((res: any) => {
        if (
          res.data.Code === "0"
        ) {
          if (res.data.Data !== null && res.data.Data.Items !== null) {
            this.listCustomerActivity = [...res.data.Data.Items];
            this.totalCustomerActivityRows = res.data.Data.TotalItem;
          } else {
            this.listCustomerActivity = [];
            this.totalCustomerActivityRows = 0;
          }
        } else {
          this.listCustomerActivity = [];
          this.totalCustomerActivityRows = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable loadingComment: boolean = false;
  @observable listComment: any[] = [];

  async getListComment (value: any) {
    this.loadingComment = true;
    this.listComment = [];
    await useApi
      .postRequestCRM(listAPI.GetListComment, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data !== null) {
            this.listComment = [...res.data.Data];
          } else {
            this.listComment = [];
          }
        } else {
          this.listComment = [];
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingComment = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable activeTabPotential: number = 1;
  @observable totalRating: any;

  async getTotalRating (value: any) {
    this.loadingComment = true;
    this.totalRating = {};
    await useApi
      .postRequestCRM(listAPI.GetTotalReply, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data !== null) {
            this.totalRating = res.data.Data;
          } else {
            this.totalRating = {};
          }
        } else {
          this.totalRating = {};
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingComment = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable creatingComment: boolean = true;

  async CreateComment (value: any) {
    this.creatingComment = true;
    await useApi
      .postRequestCRM(listAPI.CreateComment, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          this.creatingComment = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  async CreateReply (value: any) {
    this.creatingComment = true;
    await useApi
      .postRequestCRM(listAPI.CreateReply, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          this.creatingComment = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable loadingAttribute: boolean = false;
  @observable listAttribute: any[] = [];

  async getListAttribute (value: any) {
    this.loadingAttribute = true;
    this.listAttribute = [];
    await useApi
      .postRequestCRM(listAPI.GetExtendInfoList, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data !== null) {
            this.listAttribute = [...res.data.Data];
          } else {
            this.listAttribute = [];
          }
        } else {
          this.listAttribute = [];
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingAttribute = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable loadingCreate: boolean = false;
  @observable successCreate: boolean = false;

  async createPotentialCustomer (value: any) {
    this.loadingCreate = true;
    this.successCreate = false;
    this.listAttribute = [];
    await useApi
      .postRequestCRM(listAPI.CreateLead, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          this.successCreate = true;
          toast.success(
            SuccessProgressToast("Thêm mới thành công!")
          );
          if(this.customerPotentialListParam) {
            this.getListCustomerPotential(this.customerPotentialListParam);
          }
        } else {
          this.successCreate = false;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingCreate = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  async editPotentialCustomer (value: any) {
    this.loadingCreate = true;
    this.successCreate = false;
    this.listAttribute = [];
    await useApi
      .postRequestCRM(listAPI.UpdateLead, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          this.successCreate = true;
          toast.success(
            SuccessProgressToast("Cập nhật thông tin thành công thành công!")
          );
          if(this.customerPotentialListParam) {
            this.getListCustomerPotential(this.customerPotentialListParam);
          }
        } else {
          this.successCreate = false;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingCreate = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable loadDeleteAccount = false;
  @observable doneDeleteAccount = false;
  async DeletePotentialAccount(value: any) {
    this.loadDeleteAccount = false;
    this.doneDeleteAccount = false;
    await useApi
      .postRequestCRM(listAPI.DeleteLead, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          this.doneDeleteAccount = true;
          toast.success(SuccessProgressToast("Xóa tài khoản thành công!"));
          this.getListCustomerPotential(this.customerPotentialListParam);
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadDeleteAccount = true;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  //Customer
  @observable pageIndexCustomer: number = 1;
  @observable pageSizeCustomer: number = 10;
  @observable listCustomer: Customer[] = [];
  @observable customerListParam: any;
  @observable totalCustomerRows: number = 0;

  async getListCustomer(value: any) {
    this.loadingData = true;
    this.listCustomer = [];
    this.customerListParam = value;
    await useApi
      .postRequestCRM(listAPI.GetCustomerList, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data !== null && res.data.Data.Items !== null) {
            this.listCustomer = [...res.data.Data];
            this.totalCustomerRows = res.data.Data.length;
          } else {
            this.listCustomer = [];
            this.totalCustomerRows = 0;
          }
        } else {
          this.listCustomer = [];
          this.totalCustomerRows = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  handlePageChangeCustomer = (page: any) => {
    this.pageIndexCustomer = page;
  };
  handlePerRowsChangeCustomer = (newpage: any, page: any) => {
    this.pageSizeCustomer = page;
  };

  @observable detailCustomer: any;
  async getCustomerInfo(id: string) {
    this.loadingData = true;
    const param = {
      UserName: appStore.account.LoginName,
      Custcode: id
    }
    await useApi
      .postRequestCRM(listAPI.GetCustomerDetailInfo, param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.detailCustomer = res.data.Data;
          } else {
            this.detailCustomer = {};
          }
        } else {
          this.detailCustomer = {};
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable pageIndexCustomerActivity: number = 1;
  @observable pageSizeCustomerActivity: number = 10;
  // @observable listCustomerActivity: PotentialCustomerActivity[] = [];
  @observable customerActivityListParam: any;

  async getListCustomerActivity (value: any) {
    this.loadingData = true;
    this.listCustomerActivity = [];
    this.customerActivityListParam = value;
    await useApi
      .postRequestCRM(listAPI.GetCustomerActivity, value)
      .then((res: any) => {
        if (
          res.data.Code === "0"
        ) {
          if (res.data.Data !== null && res.data.Data.Items !== null) {
            this.listCustomerActivity = [...res.data.Data.Items];
            this.totalCustomerActivityRows = res.data.Data.TotalItem;
          } else {
            this.listCustomerActivity = [];
            this.totalCustomerActivityRows = 0;
          }
        } else {
          this.listCustomerActivity = [];
          this.totalCustomerActivityRows = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  handlePageChangeCustomerActivity = (page: any) => {
    this.pageIndexCustomerActivity = page;
  };
  handlePerRowsChangeCustomerActivity = (newpage: any, page: any) => {
    this.pageSizeCustomerActivity = page;
  };

  @observable loadingCustomerComment: boolean = false;
  @observable listCustomerComment: any[] = [];
  @observable totalCustomerRating: any;
  @observable sumCustomerRating: any;

  async getListCustomerComment (value: any) {
    this.loadingComment = true;
    this.listCustomerComment = [];
    this.totalCustomerRating = {};
    await useApi
      .postRequestCRM(listAPI.GetCustomerReviews, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data !== null) {
            this.listCustomerComment = [...res.data.Data.CustomerReviews];
            this.totalCustomerRating = res.data.Data.RateStar;
            this.sumCustomerRating = this.totalCustomerRating.StarFive + this.totalCustomerRating.StarFour
             + this.totalCustomerRating.StarThree + this.totalCustomerRating.StarTwo + this.totalCustomerRating.StarOne
          } else {
            this.listCustomerComment = [];
          }
        } else {
          this.listCustomerComment = [];
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingCustomerComment = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable activeCustomerTab: number = 1;

  @observable detailKYCCustomer: any;
  async getKYCCustomerInfo(id: string) {
    this.loadingData = true;
    const param = {
      UserName: appStore.account.LoginName,
      Custcode: id
    }
    await useApi
      .postRequestCRM(listAPI.GetKycCustomerDetailInfo, param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.detailKYCCustomer = res.data.Data;
          } else {
            this.detailKYCCustomer = {};
          }
        } else {
          this.detailKYCCustomer = {};
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable detailCustomerBalance: any;
  async getCustomerBalance(id: string) {
    this.loadingData = true;
    const param = {
      UserName: appStore.account.LoginName,
      Custcode: id
    }
    await useApi
      .postRequestTrading(listAPI.GetBalanceWidthrawal, param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.detailCustomerBalance = res.data.Data;
          } else {
            this.detailCustomerBalance = {};
          }
        } else {
          this.detailCustomerBalance = {};
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable listTradingStatus: any[] = [{ Value: "0", Name: "Tất cả" },];
  async getOrderStatus () {
    this.loadingComment = true;
    await useApi
      .postRequestTrading(listAPI.GetOrderStatus, {UserName: appStore.account.LoginName})
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data !== null) {
            this.listTradingStatus = [this.listTradingStatus[0], ...res.data.Data];
          } else {
            this.listTradingStatus = [];
          }
        } else {
          this.listTradingStatus = [];
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingCustomerComment = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }

  @observable listTradingDailyDetail : any;
  async getTradingDailyDetail (value: any) {
    await useApi
      .postRequestTrading(listAPI.GetTradingDailyDetail, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data !== null) {
            this.listTradingDailyDetail = res.data.Data;
            debugger;
          } else {
            this.listTradingDailyDetail = [];
          }
        } else {
          this.listTradingDailyDetail = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast("Có lỗi!"));
      });
  }
}

export const crmStore = new ServiceExtension();
