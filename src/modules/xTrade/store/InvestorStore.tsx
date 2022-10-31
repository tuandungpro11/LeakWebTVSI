import { observable } from "mobx";
import { CustomerAccountInfo, listAPI, BankCategoryParam } from "../types";
import useApi from "@services/UseAppApi";
import { toast } from "react-toastify";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../views/extensions/toastify/ToastTypes";
import axios from "axios";
import { storeOrder } from "./OrdersStore";
import { storeSystemManagement } from "./SystemManagementStore";
class ServiceExtension {
  @observable dataListBankAcc: any[] = [];
  @observable dataListBankAccParam: any[] = [];
  @observable pageIndex: number = 1;
  @observable pageSize: number = 10;
  @observable totalRows: number = 0;
  @observable isShowPopup: boolean = false;
  @observable isShowPopupModalBranchList: boolean = false;
  @observable isShowPopupModalAddNewBranchList: boolean = false;
  @observable isShowPopupModalUpdateBranchList: boolean = false;
  @observable isShowPopupModalDetail: boolean = false;
  //Customer Account
  @observable listCustomerAccount: CustomerAccountInfo[] = [];
  @observable totalCustomerAccRows: number = 0;
  @observable pageIndexCustomerAccount: number = 1;
  @observable pageSizeCustomerAccount: number = 10;
  @observable listTVSIBrachList: any[] = [];
  @observable isShowPopupEdit: boolean = false;
  @observable loadingCustomerGroup: boolean = false;
  //End Customer Account
  @observable dataListBank: any[] = [];
  @observable resultCode: any = 0;
  @observable bankCategoryParam: BankCategoryParam = {};
  @observable isShowPopupModalUpdate: boolean = false;
  @observable pageIndexListBank: any = 1;
  @observable pageSizeListBank: any = 10;
  @observable totalRowsListBank: any = 0;
  @observable dataListBranchOrderSlip: any[] = [];
  @observable dataListBranchOrderSlipParam: any[] = [];
  @observable pageIndexOrderSlip: any = 1;
  @observable pageSizeOrderSlip: any = 10;
  @observable totalRowsOrderSlip: any = 0;
  @observable dataListOrderSlip: any[] = [];
  @observable listCustomerGroup: any[] = [];
  @observable bankAccountList: any[] = [];
  @observable accountEmailList: any[] = [];
  @observable accountPhoneList: any[] = [];
  @observable accountInfo: any = {};
  @observable loadCustomerAccountById: boolean = false;
  @observable loadDeleteAccountEmail: boolean = false;
  @observable loadDeleteAccountPhone: boolean = false;
  @observable loadingData: boolean = false;
  // Internal account
  @observable dataListInternalAccount: any[] = [];
  @observable dataListInternalAccountParam: any[] = [];
  @observable pageIndexInternalAccount: any = 1;
  @observable pageSizeInternalAccount: any = 10;
  @observable totalRowsInternalAccount: any = 0;
  @observable dataListInternalAccountStatus: any[] = [];
  @observable AccountNameByID: any = "";
  @observable dataListAccountByID: any[] = [];
  @observable dataListAccountNameByID: any[] = [];
  @observable InternalAccountName: any = "";
  @observable isLoadListAccount: boolean = false;
  //Bank branch
  @observable dataListBranchBank: any[] = [];
  @observable dataListBranchBankParam: any[] = [];
  @observable InternalCustName: any = "";
  @observable pageIndexBranchBank: any = 1;
  @observable pageSizeBranchBank: any = 10;
  @observable totalRowsBranchBank: any = 0;

  // DS trader khong phat sinh phieu lenh
  @observable listType: any[] = [];
  @observable dataListOrderSlipParam: any[] = [];
  @observable dataListTypeOrderSlip: any[] = [];
  @observable dataListActiveOrderSlip: any[] = [];
  //his login
  @observable pageIndexListHisLogin: any = 1;
  @observable pageSizeListHisLogin: any = 10;
  @observable totalRowsListHisLogin: any = 0;
  @observable dataListHisLogin: any[] = [];
  @observable pageIndexListHisLoginPasiot: any = 1;
  @observable pageSizeListHisLoginPasiot: any = 10;
  @observable totalRowsListHisLoginPasiot: any = 0;
  @observable dataListHisLoginPasiot: any[] = [];
  @observable currentHisLoginTab: string = "pasiot";
  //super Account
  @observable pageIndexListSuperAccount: any = 1;
  @observable pageSizeListSuperAccount: any = 10;
  @observable totalRowsListSuperAccount: any = 0;
  @observable dataListSuperAccount: any[] = [];
  @observable dataListSuperAccountParam: any[] = [];
  //White List
  @observable pageIndexListWhiteList: any = 1;
  @observable pageSizeListWhiteList: any = 10;
  @observable totalRowsListWhiteList: any = 0;
  @observable dataListWhiteList: any[] = [];
  @observable dataListWhiteListParam: any;
  //List Status Bank
  @observable dataListStatusBank: any[] = [];
  //List Agent White List
  @observable dataListAgenType: any[] = [];

  @observable accounts: any[] = [];

  @observable account: any;

  @observable custIDValid: boolean = true;
  @observable subCustIDValid: boolean = true;
  @observable custInternalIDValid: boolean = true;

  @observable listAssets: any[] = [];
  @observable loadingAsset: boolean = false;
  @observable isShowAssetLastest: boolean = false;
  @observable assetItem: any = {};
  @observable sysConfigList: any[] = [];
  @observable listCustomerType: any[] = [];
  @observable customerAccountListParam: any = {};

  GetAccounts() {
    this.accounts = JSON.parse(localStorage.getItem("userData"));
    if (this.accounts) {
      this.account = this.accounts;
    }
  }

  async getListBankAccount(value: any) {
    this.loadingData = true;
    this.dataListBankAccParam = value;
    await useApi
      .postRequest(listAPI.listBankAccount, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListBankAcc = [...res.data.Data];
            this.totalRows = this.dataListBankAcc[0].RowCount;
          }else{
            this.dataListBankAcc = [];
            this.totalRows = 0;
          }
        } else {
          this.dataListBankAcc = [];
          this.totalRows = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      });
  }
  async onSubmitListBank(value: any) {
    this.loadingData = true;
    this.bankCategoryParam = value;
    await useApi.postRequest(listAPI.getListBank, value).then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null && res.data.Data.length > 0) {
          this.dataListBank = [...res.data.Data];
          this.totalRowsListBank = this.dataListBank[0].RowCount;
        }else{
          this.dataListBank = [];
          this.totalRowsListBank = 0;
        }
      } else {
        this.dataListBank = [];
        this.totalRowsListBank = 0;
        toast.error(ErrorToast(res.data.Message));
      }
      this.loadingData = false;
    });
  }
  async onDeleteBankById(value: any, bankName: string) {
    await useApi
      .postRequest(listAPI.deleteBankById, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.onSubmitListBank(this.bankCategoryParam);
          toast.success(
            SuccessProgressToast("Bạn đã xóa thành công ngân hàng " + bankName)
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
  async onAddNewBank(value: any) {
    await useApi
      .postRequest(listAPI.addNewBank, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã thêm thành công ngân hàng")
          );
          if (this.bankCategoryParam != null) {
            this.onSubmitListBank(this.bankCategoryParam);
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
  async UpdateBank(value: any) {
    await useApi
      .postRequest(listAPI.UpdateBank, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã sửa thành công ngân hàng")
          );
          this.onSubmitListBank(this.bankCategoryParam);
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
  async getListInternalAccount(value: any) {
    this.loadingData = true;
    this.dataListInternalAccountParam = value;
    await useApi
      .postRequest(listAPI.getListInternalAccount, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListInternalAccount = [...res.data.Data];
            this.totalRowsInternalAccount =
              this.dataListInternalAccount[0].RowCount;
          }else{
            this.dataListInternalAccount = [];
            this.totalRowsInternalAccount = 0;
          }
        } else {
          this.dataListInternalAccount = [];
          this.totalRowsInternalAccount = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      });
  }
  async getListBranch(value: any) {
    this.dataListBranchOrderSlip = [];
    await useApi.postRequest(listAPI.getListBranch, value).then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null && res.data.Data.length > 0) {
          this.dataListBranchOrderSlip = [
            { BRANCHNAME: "Tất cả", BRANCHID: -1 },
            ...res.data.Data,
          ];
          this.totalRows = [...res.data.Data][0].RowCount;
        }else{
          this.dataListBranchOrderSlip = [];
          this.totalRows = 0;
        }
      } else {
        this.dataListBranchOrderSlip = [];
        this.totalRows = 0;
        toast.error(ErrorToast(res.data.Message));
      }
    });
  }
  async getListNotGenOrderSlip(value: any) {
    this.loadingData = true;
    this.dataListOrderSlipParam = value;
    await useApi
      .postRequest(listAPI.getListNotGenOrderSlip, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListOrderSlip = [...res.data.Data];
            this.totalRowsOrderSlip = this.dataListOrderSlip[0].TotalRows;
          }else{
            this.dataListOrderSlip = [];
            this.totalRowsOrderSlip = 0;
          }
        } else {
          this.dataListOrderSlip = [];
          this.totalRowsOrderSlip = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      });
  }
  async AddNewOrderSlip(value: any) {
    await useApi
      .postRequest(listAPI.AddNewtNotGenOrderSlip, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã thêm mới thành công Trader")
          );
          if (this.dataListOrderSlipParam.length>0) {
            this.getListNotGenOrderSlip(this.dataListOrderSlipParam);
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

  handlePageChange = (page: any) => {
    this.pageIndex = page;
  };
  handlePerRowsChange = (newpage: any, page: any) => {
    this.pageSize = page;
  };

  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }
  onShowModalDetail(data: boolean) {
    this.isShowPopupModalDetail = data;
  }
  onShowModalBranchList(data: boolean) {
    this.isShowPopupModalBranchList = data;
  }
  onShowModalAddNewBranchList(data: boolean) {
    this.isShowPopupModalAddNewBranchList = data;
  }
  onShowModalUpdateBranchList(data: boolean) {
    this.isShowPopupModalUpdateBranchList = data;
  }

  async getListCustomerAccount(value: any) {
    this.loadingData = true;
    this.listCustomerAccount = [];
    this.customerAccountListParam = value;
    await useApi
      .postRequest(listAPI.listCustomerAccount, value)
      .then((res: any) => {
        if (
          res.data.Code === "0"
        ) {
          if (res.data.Data != null &&
            res.data.Data.length > 0) {
            this.listCustomerAccount = [...res.data.Data];
            this.totalCustomerAccRows =
              this.listCustomerAccount.length > 0
                ? this.listCustomerAccount[0].ROWCOUNT
                : 0;
          }else{
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
        toast.error(ErrorToast(response.statusText));
      });
  }

  async getTVSIBrachList(value: any) {
    this.listTVSIBrachList = [];
    await useApi
      .postRequest(listAPI.tvsiBranchList, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.listTVSIBrachList = [
              { BRANCHNAME: "Tất cả", BRANCHID: "" },
              ...res.data.Data,
            ];
          }else{
            this.listTVSIBrachList = [];
          }
        } else {
          this.listTVSIBrachList = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  handlePageChangeCustomerAccount = (page: any) => {
    this.pageIndexCustomerAccount = page;
  };
  handlePerRowsChangeCustomerAccount = (newpage: any, page: any) => {
    this.pageSizeCustomerAccount = page;
  };

  showModalEditAccount = (isShow: boolean) => {
    this.isShowPopupEdit = isShow;
  };

  async UpdateOrderSlip(value: any) {
    await useApi
      .postRequest(listAPI.UpdateNotGenOrderSlip, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Bạn đã sửa thành công Trader"));
          this.getListNotGenOrderSlip(this.dataListOrderSlipParam);
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
  handlePageChangeInternalAccount = (page: any) => {
    var p = page;
    this.pageIndexInternalAccount = p;
  };
  handlePerRowsChangeInternalAccount = (newpage: any, page: any) => {
    this.pageSizeInternalAccount = page;
  };

  handlePageChangeListBank = (page: any) => {
    this.pageIndexListBank = page;
  };
  handlePerRowsChangeListBank = (newpage: any, page: any) => {
    this.pageSizeListBank = page;
  };
  async getListStatusInternalAccount(value: any) {
    this.loadingData = true;
    this.dataListInternalAccountStatus = [];
    await useApi
      .postRequest(listAPI.SystemStatus_Internal_Account, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListInternalAccountStatus = [
              { Name: "Tất cả", Value: -2 },
              ...res.data.Data,
            ];
          }else{
            this.dataListInternalAccountStatus = [];
          }
        } else {
          this.dataListInternalAccountStatus = [];
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getListStatusBankAccount(value: any) {
    this.loadingData = true;
    this.dataListInternalAccountStatus = [];
    await useApi
      .postRequest(listAPI.SystemStatus_Internal_Account, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListInternalAccountStatus = [
              { Name: "Tất cả", Value: -2 },
              ...res.data.Data,
            ];
          }else{
            this.dataListInternalAccountStatus = [];
          }
        } else {
          this.dataListInternalAccountStatus = [];
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async deleteInternalAccount(value: any, InternalCustomerName: string) {
    await useApi
      .postRequest(listAPI.deleteBankById, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.getListInternalAccount(this.dataListInternalAccountParam);
          toast.success(
            SuccessProgressToast(
              "Bạn đã xóa thành công tài khoản " + InternalCustomerName
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
  async getAccountNameByID(value: any) {
    await useApi
      .postRequest(listAPI.getAccountById + "/" + value, {})
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.AccountNameByID = res.data.Data.CUSTOMERNAME;
            this.custIDValid = true;
          } else {
            this.AccountNameByID = "";
            this.custIDValid = false;
          }
        } else {
          if (res.data.Message != "") {
            toast.error(ErrorToast(res.data.Message));
          } else {
            alert("Không lấy được thông tin");
          }
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async UpdateInternalAccount(value: any, InternalName: any) {
    await useApi
      .postRequest(listAPI.updateInternalAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Bạn đã sửa thành công tài khoản " + InternalName
            )
          );
          this.getListInternalAccount(this.dataListInternalAccountParam);
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
  async deleteBankAccount(value: any, InternalCustomerName: string) {
    await useApi
      .postRequest(listAPI.deleteBankAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.getListBankAccount(this.dataListBankAccParam);
          toast.success(
            SuccessProgressToast(
              "Bạn đã xóa thành công tài khoản " + InternalCustomerName
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
  async getListBranchBank(value: any) {
    this.dataListBranchBankParam = value;
    await useApi
      .postRequest(listAPI.getListBranchBank, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListBranchBank = [...res.data.Data];
            this.totalRowsBranchBank = this.dataListBranchBank[0].RowCount;
          }else{
            this.dataListBranchBank = [];
            this.totalRowsBranchBank = 0;
          }
        } else {
          this.dataListBranchBank = [];
          this.totalRowsBranchBank = 0;
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async AddNewBankAccount(value: any, CustName: any) {
    await useApi
      .postRequest(listAPI.AddBankAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Bạn đã thêm mới thành công tài khoản " + CustName
            )
          );
          if (this.dataListBankAccParam.length>0) {
            this.getListBankAccount(this.dataListBankAccParam);
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
  async UpdateBankAccount(value: any, CustName: any) {
    await useApi
      .postRequest(listAPI.UpdBankAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã sửa thành công tài khoản " + CustName)
          );
          this.getListBankAccount(this.dataListBankAccParam);
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

  async getInternalCusName(value: any) {
    await useApi
      .postRequest(listAPI.getInternalCusInfo, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.InternalCustName = res.data.Data.CUSTOMERNAME;
            this.custInternalIDValid = true;
          } else {
            this.InternalCustName = "";
            this.custInternalIDValid = false;
          }
        } else {
          if (res.data.Message != "") {
            toast.error(ErrorToast(res.data.Message));
          } else {
            alert("Không lấy được thông tin");
          }
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async AddNewInternalAccount(value: any) {
    await useApi
      .postRequest(listAPI.AddInternalAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã thêm mới thành công tài khoản")
          );
          if (this.dataListInternalAccountParam.length>0) {
            this.getListInternalAccount(this.dataListInternalAccountParam);
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

  async GetCustomerGroupList(value: any) {
    this.loadingCustomerGroup = true;
    await useApi
      .postRequest(listAPI.customerGroupList, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.listCustomerGroup = [...res.data.Data];
            this.loadingCustomerGroup = false;
          }else{
            this.listCustomerGroup = [];
          }
        } else {
          this.listCustomerGroup = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async GetBankAccountList(value: any) {
    await useApi
      .postRequest(listAPI.bankAccountList, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.bankAccountList = [...res.data.Data];
          }else{
            this.bankAccountList = [];
          }
        } else {
          this.bankAccountList = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async GetCustomerEmailList(value: any) {
    await useApi
      .postRequest(listAPI.accountEmailList, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.accountEmailList = [...res.data.Data];
          } else {
            this.accountEmailList = [];
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

  async GetCustomerPhoneList(value: any) {
    await useApi
      .postRequest(listAPI.accountPhoneList, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.accountPhoneList = [...res.data.Data];
          } else {
            this.accountPhoneList = [];
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

  async GetCustomerAccountById(value: any) {
    this.loadCustomerAccountById = false;
    await useApi
      .postRequest(listAPI.getCustomerAccountById + "/" + value, null)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.accountInfo = res.data.Data;
          }else{
            this.accountInfo = [];
          }
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadCustomerAccountById = true;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async DeleteAccountEmail(value: any) {
    this.loadDeleteAccountEmail = false;
    await useApi
      .postRequest(listAPI.deleteEmailService + "/" + value, null)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Xóa email thành công!"));
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadDeleteAccountEmail = true;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async DeleteAccountPhone(value: any) {
    this.loadDeleteAccountPhone = false;
    await useApi
      .postRequest(listAPI.deletePhoneService + "/" + value, null)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Xóa phone thành công!"));
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadDeleteAccountPhone = true;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async RegisAccountEmail(value: any) {
    this.loadDeleteAccountEmail = false;
    await useApi
      .postRequest(listAPI.regisEmailService, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Thành công!"));
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadDeleteAccountEmail = true;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async RegisAccountPhone(value: any) {
    this.loadDeleteAccountPhone = false;
    await useApi
      .postRequest(listAPI.regisPhoneService, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Thêm phone thành công!"));
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadDeleteAccountPhone = true;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async ChangeAccountStatus(value: any) {
    this.loadDeleteAccountPhone = false;
    await useApi
      .postRequest(listAPI.changeActiveCustomerAccount, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          const title = value.Status === 1 ? "Active" : "Inactive";
          toast.success(SuccessProgressToast(title + " tài khoản thành công!"));
          this.getListCustomerAccount(this.customerAccountListParam);
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadDeleteAccountPhone = true;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getListTypeOrderSlip(value: any) {
    this.dataListTypeOrderSlip = [];
    await useApi
      .postRequest(listAPI.SystemStatus_Internal_Account, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListTypeOrderSlip = [
              { Name: "Tất cả", Value: -1 },
              ...res.data.Data,
            ];
          }else{
            this.dataListTypeOrderSlip=[];
          }
        } else {
          this.dataListTypeOrderSlip=[];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getListActiveOrderSlip(value: any) {
    this.dataListActiveOrderSlip = [];
    await useApi
      .postRequest(listAPI.SystemStatus_Internal_Account, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListActiveOrderSlip = [
              { Name: "Tất cả", Value: -1 },
              ...res.data.Data,
            ];
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
  async getListHisLogin(value: any) {
    this.loadingData = true;
    await useApi
      .postRequest(listAPI.hisLogin, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListHisLogin = [...res.data.Data];
            this.totalRowsListHisLogin = this.dataListHisLogin[0].ROWCOUNT;
          }else{
            this.dataListHisLogin = [];
            this.totalRowsListHisLogin = 0;
          }
        } else {
          this.dataListHisLogin = [];
          this.totalRowsListHisLogin = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  handlePageChangeListHisLogin = (page: any) => {
    var p = page;
    this.pageIndexListHisLogin = p;
  };
  handlePerRowsChangeListHisLogin = (newpage: any, page: any) => {
    this.pageSizeListHisLogin = page;
  };

  handlePageChangeOrderSlip = (page: any) => {
    this.pageIndexOrderSlip = page;
  };
  handlePerRowsChangeOrderSlip = (newpage: any, page: any) => {
    this.pageSizeOrderSlip = page;
  };

  async getListHisLoginPasiot(value: any) {
    this.loadingData = true;
    await useApi.postRequest(listAPI.hisLoginPasiot, value).then((res: any) => {
      if (res.data.Code === "0") {
        if (res.data.Data != null && res.data.Data.items.length > 0) {
          this.dataListHisLoginPasiot = [...res.data.Data.items];
          this.totalRowsListHisLoginPasiot = res.data.Data.totalItems;
        }else{
          this.dataListHisLoginPasiot = [];
          this.totalRowsListHisLoginPasiot = 0;
        }
      } else {
        this.dataListHisLoginPasiot = [];
        this.totalRowsListHisLoginPasiot = 0;
        toast.error(ErrorToast(res.data.Message));
      }
      this.loadingData = false;
    });
  }

  handlePageChangeHisLoginPasiot = (page: any) => {
    this.pageIndexListHisLoginPasiot = page;
  };
  handlePerRowsChangeHisLoginPasiot = (newpage: any, page: any) => {
    this.pageSizeListHisLoginPasiot = page;
  };

  handlePageChangeBranchBank = (page: any) => {
    this.pageIndexBranchBank = page;
  };
  handlePerRowsChangeBranchBank = (newpage: any, page: any) => {
    this.pageSizeBranchBank = page;
  };

  async onDeleteBranchkById(value: any) {
    await useApi
      .postRequest(listAPI.deleteBranchBank, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.getListBranchBank(this.dataListBranchBankParam);
          toast.success(
            SuccessProgressToast(
              "Bạn đã xóa thành công chi nhánh"
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
  async onAddNewBranchBank(value: any) {
    await useApi
      .postRequest(listAPI.addNewBranchBank, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã thêm thành công chi nhánh ngân hàng")
          );
          if (this.dataListBranchBankParam.length>0) {
            this.getListBranchBank(this.dataListBranchBankParam);
          }
          this.isShowPopupModalAddNewBranchList = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async onUpdateBranchBank(value: any) {
    await useApi
      .postRequest(listAPI.updateBranchBank, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã sửa thành công chi nhánh ngân hàng")
          );
          this.getListBranchBank(this.dataListBranchBankParam);
          this.isShowPopupModalUpdateBranchList = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async getListSuperAccount(value: any) {
    this.loadingData = true;
    this.dataListSuperAccountParam = value;
    await useApi
      .postRequest(listAPI.getListSuperAccount, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListSuperAccount = [...res.data.Data];
            this.totalRowsListSuperAccount =
              this.dataListSuperAccount[0].RowCount;
          }else{
            this.dataListSuperAccount = [];
            this.totalRowsListSuperAccount = 0;
          }
        } else {
          this.dataListSuperAccount = [];
          this.totalRowsListSuperAccount = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      });
  }

  handlePageChangeSuperAccountt = (page: any) => {
    this.pageIndexListSuperAccount = page;
  };
  handlePerRowsChangeSuperAccount = (newpage: any, page: any) => {
    this.pageSizeListSuperAccount = page;
  };
  async onChangeStatusSuperAccount(value: any) {
    await useApi
      .postRequest(listAPI.changeStatusSuperAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.getListSuperAccount(this.dataListSuperAccountParam);
          toast.success(
            SuccessProgressToast(
              "Bạn đã đổi trạng thái thành công tài khoản " + value.CustomerId
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
  async onDelteSuperAccount(value: any) {
    await useApi
      .postRequest(listAPI.deleteStatusSuperAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.getListSuperAccount(this.dataListSuperAccountParam);
          toast.success(
            SuccessProgressToast(
              "Bạn đã xóa thành công tài khoản " + value.CustomerId
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
  async onAddNewSuperAccount(value: any) {
    await useApi
      .postRequest(listAPI.addNewStatusSuperAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã thêm thành công tài khoản")
          );
          if (this.dataListSuperAccountParam!=null) {
            this.getListSuperAccount(this.dataListSuperAccountParam);
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
  async onUpdateSuperAccount(value: any) {
    await useApi
      .postRequest(listAPI.UpdateNewStatusSuperAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã sửa thành công tài khoản")
          );
          this.getListSuperAccount(this.dataListSuperAccountParam);
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

  async getListWhiteList(value: any) {
    this.loadingData = true;
    this.dataListWhiteListParam = value;
    await useApi
      .postRequest(listAPI.getListWhiteList, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.dataListWhiteList = [...res.data.Data];
            this.totalRowsListWhiteList = this.dataListWhiteList[0].RowCount;
          }else{
            this.dataListWhiteList = [];
            this.totalRowsListSuperAccount = 0;
          }
        } else {
          this.dataListWhiteList = [];
          this.totalRowsListSuperAccount = 0;
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      });
  }

  handlePageChangeWhiteList = (page: any) => {
    this.pageIndexListWhiteList = page;
  };
  handlePerRowsChangeWhiteList = (newpage: any, page: any) => {
    this.pageSizeListWhiteList = page;
  };

  async getListAccountByID(value: any) {
    await useApi
      .postRequest(listAPI.getListAccountByID, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListAccountByID = [];
            this.dataListAccountByID = [...res.data.Data];
            this.isLoadListAccount = true;
          }else{
            this.dataListAccountByID = [];
            this.isLoadListAccount = true;
          }
        } else {
          if (res.data.Message != "") {
            this.dataListAccountByID = [];
            this.isLoadListAccount = true;
            toast.error(ErrorToast(res.data.Message));
          } else {
            alert("Không lấy được thông tin");
          }
        }
      });
  }
  async getInternalCusNamebyID(value: any) {
    await useApi
      .postRequest(listAPI.getAccountById + "/" + value, {})
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListAccountNameByID = { ...res.data.Data };
            this.InternalAccountName = res.data.Data.CUSTOMERNAME;
            this.custInternalIDValid = true;
          } else {
            this.InternalAccountName = "";
            this.custInternalIDValid = false;
          }
        } else {
          if (res.data.Message != "") {
            toast.error(ErrorToast(res.data.Message));
          } else {
            alert("Không lấy được thông tin");
          }
        }
      });
  }
  async UpdateCustomerAccount(value: any) {
    await useApi
      .postRequest(listAPI.updateCustomerAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã sửa thành công người dùng")
          );
          this.isShowPopupEdit = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async GetAssetDetail(value: any) {
    this.loadingAsset = true;
    await useApi
      .postRequest(listAPI.GetAssetDetail, value)
      .then((res: any) => {
        this.loadingAsset = false;
        if (res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.listAssets = [...res.data.Data];
          } else {
            this.listAssets = [];
          }
        } else {
          this.listAssets = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async GetLastestAssetHistory(value: any) {
    await useApi
      .postRequest(listAPI.GetLastestAssetHistory, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.assetItem = res.data.Data;
          }else{
            this.assetItem = {};
          }
        } else {
          this.assetItem = {};
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  showModalAssetLastest = (isShow: boolean) => {
    this.isShowAssetLastest = isShow;
  };

  async GetSysConfigList(param: any) {
    await useApi
      .postRequest(listAPI.GetSysConfigList, param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.sysConfigList = [
              { Name: "Tất cả", Value: -1 },
              ...res.data.Data.filter((item) => item.Group === "STATUS"),
            ];
            this.listCustomerType = [
              { Name: "Tất cả", Value: -1 },
              ...res.data.Data.filter((item) => item.Group === "CUSTOMER_TYPE"),
            ];
          }else{
            this.sysConfigList = [];
            this.listCustomerType = [];
          }
        } else {
          this.sysConfigList = [];
          this.listCustomerType = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getListStatusBank(value: any) {
    this.loadingData = true;
    this.dataListStatusBank = [];
    await useApi
      .postRequest(listAPI.SystemStatus_Internal_Account, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListStatusBank = [
              { Name: "Tất cả", Value: -1 },
              ...res.data.Data,
            ];
          }else{
            this.dataListStatusBank = [];
          }
        } else {
          this.dataListStatusBank = [];
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getListAgentType(value: any) {
    this.loadingData = true;
    this.dataListAgenType = [];
    await useApi
      .postRequest(listAPI.SystemStatus_Internal_Account, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListAgenType = [...res.data.Data];
          }
        } else {
          this.dataListAgenType = [];
          toast.error(ErrorToast(res.data.Message));
        }
        this.loadingData = false;
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async AddNewWhiteList(value: any) {
    await useApi
      .postRequest(listAPI.AddNewWhiteList, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Bạn đã thêm mới thành công"));
          console.log(
            "this.dataListWhiteListParam",
            this.dataListWhiteListParam
          );
          if (
            this.dataListWhiteListParam !== null &&
            this.dataListWhiteListParam !== undefined
          ) {
            this.getListWhiteList(this.dataListWhiteListParam);
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
  async UpdateWhiteList(value: any) {
    await useApi
      .postRequest(listAPI.UpdateWhiteList, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Bạn đã cập nhật thành công"));
          this.getListWhiteList(this.dataListWhiteListParam);
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

  async DeleteOrderSlip(value: any) {
    await useApi
      .postRequest(listAPI.DeleteExTrader + "/" + value, [])
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast("Bạn đã xóa thành công Trader"));
          this.getListNotGenOrderSlip(this.dataListOrderSlipParam);
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  async reactiveCustomer(param: any) {
    await useApi
      .postRequest(listAPI.ReactiveCustomer, param)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast(
              "Bạn đã reset thành công tài khoản " + param.CustomerId
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

  async UpdateStatusInternalAccount(value: any) {
    await useApi
      .postRequest(listAPI.ChangeStatusInternalAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã đổi thành công trạng thái tài khoản")
          );
          this.getListInternalAccount(this.dataListInternalAccountParam);
          this.isShowPopupModalDetail = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async UpdateStatusBankAccount(value: any) {
    await useApi
      .postRequest(listAPI.ChangeStatusBankAccount, value)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã đổi thành công trạng thái tài khoản")
          );
          this.getListBankAccount(this.dataListBankAccParam);
          this.isShowPopupModalDetail = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async getSubAccountNameByID(value: any) {
    await useApi
      .postRequest(listAPI.GetCustomerInfoByAccountNo + "/" + value, {})
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.AccountNameByID = res.data.Data.CUSTOMERNAME;
            this.subCustIDValid = true;
          } else {
            this.AccountNameByID = "";
            this.subCustIDValid = false;
          }
        } else {
          if (res.data.Message != "") {
            toast.error(ErrorToast(res.data.Message));
          } else {
            alert("Không lấy được thông tin");
          }
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async ExportListUI(api:any, value: any, fileName: string) {
    this.loadingData = true;
    storeOrder.loadingData=true;
    storeSystemManagement.loadingData=true;
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
        storeOrder.loadingData=false;
        storeSystemManagement.loadingData=false;
      })
      .catch((error: any) => {
        this.loadingData = false;
        storeOrder.loadingData=true;
        storeSystemManagement.loadingData=true;
        const { config, response } = error;
        toast.error(ErrorToast(error));
      });
  }

  async ImportData(api:any, formData: any) {
    console.log('formData, ', formData);
      await useApi.postRequest(api, formData)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Import thành công!")
          );
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(error));
      });
  }

  @observable customerTypeList: any[] = [];
  async GetCustomerTypeList(param: any) {
    await useApi
      .postRequest(listAPI.GetSysConfigList, param)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.customerTypeList = [
              ...res.data.Data.filter((item) => item.Group === "CUSTOMER_TYPE"),
            ];
          }else{
            this.customerTypeList = [];
          }
        } else {
          this.customerTypeList = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }

  @observable isShowPopupReset: boolean = false;
  showModalResetAccount = (isShow: boolean) => {
    this.isShowPopupReset = isShow;
  };

  @observable isShowDetailPassPin: boolean = false;
  @observable DetailPassPin: any;
  async resetCustomer(param: any) {
    this.isShowDetailPassPin = false;
    await useApi
      .postRequest(listAPI.ResetPinPassword, param)
      .then((res: any) => {
        this.resultCode = res.data.Code;
        if (res.data.Code === "0") {
          this.isShowDetailPassPin = true;
          this.DetailPassPin = res.data.Data;
          toast.success(
            SuccessProgressToast(
              "Bạn đã reset thành công tài khoản " + param.CustomerId
            )
          );
        } else {
          this.isShowDetailPassPin = false;
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.Message));
      });
  }
}

export const store = new ServiceExtension();
