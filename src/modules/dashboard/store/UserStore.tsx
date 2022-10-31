import { observable } from "mobx";
import useApi from "@services/UseAppApi";
import { toast } from "react-toastify";
import { ErrorToast, SuccessProgressToast } from "../../../views/extensions/toastify/ToastTypes";
import { listAPI } from "../types";
import { appStore } from "../../../stores/appStore";
class UserServiceExtension {
  @observable loadingData: boolean = false;
  @observable listUsers: any[] = [];
  @observable listSystemLevel: any[] = [];
  @observable listSaleInfo: any[] = [];
  @observable isShowPopup: boolean = false;
  @observable userListParam: any = {}
  @observable userInfoParam: any = {}
  @observable changeActiveAccount: boolean = false;
  @observable isShowPopupEdit: boolean = false;
  @observable isShowPopupChangePassword: boolean = false;
  @observable isShowPopupResetPassword: boolean = false;
  @observable userInfo: any = {};
  @observable verifingUser: boolean = true;
  @observable verifiedUser: boolean = false;
  @observable listPosition: any[]=[];

  async GetListUser(data: any) {
    this.loadingData = true;
    this.userListParam = data;
    await useApi
      .postRequestSSO(listAPI.GetAllUser, data)
      .then((res: any) => {
        if (res.data.Code === "0" && res.data.Data.length > 0) {
          if (res.data.Data != null) {
            this.listUsers = [...res.data.Data];
            // this.totalRows = this.dataListBankAcc[0].RowCount;
          }
        } else {
          this.listUsers = [];
          // this.totalRows = 0;
        }
        this.loadingData = false;
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async GetUserInfo(param: any) {
    await useApi
      .getRequestSSO(listAPI.UserInfo + "/" + param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.userInfo = res.data.Data;
          }
        } else {
          this.userInfo = {};
        }
        this.loadingData = false;
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async CreateUser(value: any) {
    await useApi.postRequestSSO(listAPI.CreateUser, value).then((res: any) => {
      if (res.data.Code === "0") {
        toast.success(SuccessProgressToast("Bạn đã thêm thành công tài khoản"));
        this.GetListUser(this.userListParam);
        this.isShowPopup = false;
      } else {
        toast.error(ErrorToast(res.data.Message));
      }
    }).catch((error: any) => {
      const { config, response } = error;
      toast.error(ErrorToast(response.statusText));
    });
  }

  async GetSystemLevelInfo() {
    await useApi
      .postRequestSSO(listAPI.GetSystemLevelInfo, null)
      .then((res: any) => {
        if (res.data.Code === "0" && res.data.Data.length > 0) {
          if (res.data.Data != null) {
            this.listSystemLevel = [...res.data.Data];
          }
        } else {
          this.listSystemLevel = [];
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async GetSaleInfo() {
    await useApi
      .postRequestAuthCenter(listAPI.GetListSale, {
        UserName: appStore.account.LoginName,
        BranchCode: "",
        SaleID:""
      })
      .then((res: any) => {
        if (res.data.Code === "0" && res.data.Data.length > 0) {
          if (res.data.Data != null) {
            this.listSaleInfo = [...res.data.Data];
          }
        } else {
          this.listSaleInfo = [];
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });;
  }

  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }

  onShowModalEdit(data: boolean) {
    this.isShowPopupEdit = data;
  }

  onShowModalChangePassword(data: boolean) {
    this.isShowPopupChangePassword = data;
  }

  onShowModalResetPassword(data: boolean) {
    this.isShowPopupResetPassword = data;
  }

  async ChangeAccountStatus(value: any) {
    this.changeActiveAccount = false;
    await useApi
      .postRequestSSO(listAPI.ChangeActiveAccount, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          const title = value.Status === 1 ? "Active" : "Inactive";
          toast.success(SuccessProgressToast(title + " tài khoản thành công!"));
          this.GetListUser(this.userListParam);
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
        this.changeActiveAccount = true;
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async LockAccount(value: any, isLock: number) {
    this.changeActiveAccount = false;
    const apiLink = isLock == 1 ? listAPI.UnLockLogin : listAPI.LockLogin;
    await useApi
      .postRequestSSO(apiLink+ "/" + value, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          const title = isLock === 1 ? "Unlock" : "Lock";
          toast.success(SuccessProgressToast(title + " tài khoản thành công!"));
          this.GetListUser(this.userListParam);
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
        this.changeActiveAccount = true;
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async ChangePassword(value: any) {
    await useApi
      .postRequestSSO(listAPI.ChangePassword, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Đổi mật khẩu tài khoản thành công!"));
          this.onShowModalChangePassword(false);
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async ResetPassword(value: any) {
    await useApi
      .postRequestSSO(listAPI.ResetPassword, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Reset mật khẩu tài khoản thành công!"));
          this.onShowModalResetPassword(false);
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async VerifyAccount(param: any) {
    this.verifingUser = true;
    this.verifiedUser = false;
    await useApi
      .getRequestSSO(listAPI.VerifyAccount + "/" + param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.verifiedUser = true;
          }
        } else {
          this.verifiedUser = false;
        }
        this.verifingUser = false;
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async UpdateUser(value: any) {
    await useApi.postRequestSSO(listAPI.UpdateUser, value).then((res: any) => {
      if (res.data.Code === "0") {
        toast.success(SuccessProgressToast("Sửa thông tin tài khoản thành công!"));
        this.GetListUser(this.userListParam);
        this.isShowPopupEdit = false;
      } else {
        toast.error(ErrorToast(res.data.Message));
      }
    }).catch((error: any) => {
      const { config, response } = error;
      toast.error(ErrorToast(response.statusText));
    });
  }
  async getListPosition() {
    this.loadingData = true;
    this.listPosition=[];
    await useApi
      .postRequestAuthCenter(listAPI.GetListPosition, {UserName: appStore.account.LoginName,})
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.listPosition = [...res.data.Data];
          } else {
            this.listPosition = [];
          }
        } else {
          this.listPosition = [];
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

export const userStore = new UserServiceExtension();