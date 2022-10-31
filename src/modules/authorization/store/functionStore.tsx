import { observable } from "mobx";
import { AppInfo, FunctionAuth, FunctionInfo, FunctionInfoEditing, GroupInfoByRight, listAPI, RightFunctionInfo } from "../type";
import useApi from "@services/UseAppApi";
import { toast } from "react-toastify";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../views/extensions/toastify/ToastTypes";
import { appStore } from "../../../stores/appStore";
import { HTTPResponse } from "../../../utility/general/types";

class FunctionStore {
  @observable functionAuthList: FunctionAuth[] = []
  @observable appList: AppInfo[] = []
  @observable editingFunctionInfo: FunctionInfoEditing = {} as FunctionInfoEditing
  @observable rightFunctionList: RightFunctionInfo[] = []
  @observable groupsByRightList: GroupInfoByRight[] = []
  
  @observable isShowPopupModalEdit: boolean = false;
  @observable isEditing: boolean = false;
  @observable isShowPopupModalAuthorize: boolean = false;
  @observable isShowPopupGroupByRights: boolean = false;
  
  @observable loadingData: boolean = false;
  @observable loadingAppList: boolean = false
  @observable loadingGroupByRightList: boolean = false
  @observable loadingRightFunctionList: boolean = false

  //list app
  @observable pageIndexListFunction: number = 1;
  @observable pageSizeListFunction: number = 10;
  @observable totalRowsListFunction: number = 10;
  @observable dataListFunction: any[] = [];
  //data selected from item tree
  @observable selectedData:any[]=[];

  async GetFunctionAuthList() {
    this.loadingData = true
    await useApi.postRequestAuthCenter("Function/GetJsonFunctionTrees", { username: appStore.account.LoginName })
      .then((res: {data: HTTPResponse}) => {
        if(res.data.Code === "0") {
          this.functionAuthList = [...JSON.parse(res.data.Data)]
        } else {
          toast.error(ErrorToast(res.data.Message))
        }
      }).catch((error: any) => {
        toast.error(ErrorToast(error.Message))
      })
    this.loadingData = false
  }

  async GetAppList() {
    this.loadingAppList = true
    await useApi.postRequestAuthCenter("App/GetAppList", {username: appStore.account.LoginName})
      .then((res: {data: HTTPResponse}) => {
        if(res.data.Code === "0") {
          this.appList = res.data.Data
        } else {
          toast.error(ErrorToast(res.data.Message))
        }
      })
      .catch((error: any) => {
        toast.error(ErrorToast(error.Message))
      })
    this.loadingAppList = false
  }

  async GetRightFunctionList(functionID: number) {
    this.loadingRightFunctionList = true
    await useApi.postRequestAuthCenter("Function/GetRightFunctionList", { functionID, username: appStore.account.LoginName })
      .then((res: { data: HTTPResponse }) => {
        if (res.data.Code === "0") {
          this.rightFunctionList = [...res.data.Data]
        } 
      }).catch((error: any) => {
        toast.error(ErrorToast(error.Message))
      })
    this.loadingRightFunctionList = false
  }

  async GetGroupByRight(rightID: number) {
    this.loadingGroupByRightList = true
    await useApi.postRequestAuthCenter("Function/GetGroupsByRightList", {username: appStore.account.LoginName, rightID })
      .then((res: { data: HTTPResponse }) => {
        if(res.data.Code === "0") {
          this.groupsByRightList = [...res.data.Data]
          this.loadingGroupByRightList = false
        } else {
          toast.error(ErrorToast(res.data.Message))
        }
      }).catch((err: any) => {
        toast.error(ErrorToast(err.Message))
      })
    this.loadingGroupByRightList = false
  }

  async InitializeEditingFunctionInfo(functionID?: number) {
    if  (this.isEditing && functionID) {
      await useApi.postRequestAuthCenter("Function/GetFunctionInfo", { username: appStore.account.LoginName, functionID })
        .then((res : { data: HTTPResponse }) => {
          if(res.data.Code === "0" && res.data.Data) {
            this.editingFunctionInfo = {
              FunctionID: res.data.Data.FunctionID,
              FunctionName: res.data.Data.FunctionName,
              FunctionCode: res.data.Data.FunctionCode,
              Status: res.data.Data.Status,
              ParentID: res.data.Data.ParentID,
              AppName: res.data.Data.AppName,
              OrderNum: res.data.Data.OrderNum,
              Url: res.data.Data.Url,
              IConCls: res.data.Data.IConCls,
              IsShow: res.data.Data.IsShow,
            }
          }
        })
    } else {
      this.editingFunctionInfo = {
        FunctionName: "",
        FunctionCode: "",
        Status: 0,
        ParentID: 0,
        AppName: "",
        OrderNum: 0,
        Url: "",
        IConCls: "",
        IsShow: false,
      }
    }
  }

  onShowModalEdit(data: boolean) {
    this.isShowPopupModalEdit = data;
  }
  onShowModalAuthorize(data: boolean) {
    this.isShowPopupModalAuthorize = data;
  }
  onShowModalGroupByRights(value: boolean) {
    this.isShowPopupGroupByRights = value
  }
  ToggleEditing(value: boolean) {
    this.isEditing = value
  }

  async OnEditFunctionInfo(payload: FunctionInfoEditing) {
    await useApi.postRequestAuthCenter("Function/UpdateFunctionInfo", { 
      ...payload, 
      username: appStore.account.LoginName,
      FunctionID: this.editingFunctionInfo.FunctionID
    }).then((res: { data: HTTPResponse }) => {
      if(res.data.Code === "0") {
        toast.success(SuccessProgressToast(res.data.Message))
        this.onShowModalEdit(false)
        this.GetFunctionAuthList()
      } else {
        toast.error(ErrorToast(res.data.Message))
      }
    }).catch((err: any) => {
      toast.error(ErrorToast(err.Message))
    })
  }
  async OnAddFunctionInfo(payload: FunctionInfoEditing) {
    await useApi.postRequestAuthCenter("Function/AddFunctionInfo", { ...payload, username: appStore.account.LoginName })
      .then((res: { data: HTTPResponse }) => {
        if(res.data.Code === "0") {
          toast.success(SuccessProgressToast(res.data.Message))
          this.GetFunctionAuthList()
          this.onShowModalEdit(false)
        } else {
          toast.error(ErrorToast(res.data.Message))
        }
      }).catch((error: any) => {
        toast.error(ErrorToast(error.Message))
      })
  }

  async OnDeleteFunctionInfo(functionID: number) {
    await useApi
      .postRequestAuthCenter("Function/DeleteFunctionInfo", { username: appStore.account.LoginName, functionID })
      .then((res: { data: HTTPResponse }) => {
        if (res.data.Code === "0") {
          toast.success(SuccessProgressToast(res.data.Message))
          this.GetFunctionAuthList()
        }
      }).catch((err: any) => {  
        toast.error(ErrorToast(err.Message))
      })
  }


  async OnDeleteRightFunction(rightCode: string, functionID: number) {
    await useApi.postRequestAuthCenter("Function/DeleteRightFunctionInfo", {
      rightCode, functionID, username: appStore.account.LoginName
    }).then((res: {data: HTTPResponse}) => {
      if(res.data.Code === "0") {
        toast.success(SuccessProgressToast(res.data.Message))
        this.GetRightFunctionList(functionID)
      } else {
        toast.error(ErrorToast(res.data.Message))
      }
    }).catch((err: any) => {
      toast.error(ErrorToast(err.Message))
    })
  }

  async AddRightFunctionInfo(rightCode: string, functionID: number) {
    await useApi.postRequestAuthCenter("Function/AddRightFunctionInfo", {
      rightCode, functionID, username: appStore.account.LoginName
    }).then((res: {data: HTTPResponse}) => {
        if(res.data.Code === "0") {
          toast.success(SuccessProgressToast(res.data.Message))
          this.GetRightFunctionList(functionID)
        } else {
          toast.error(ErrorToast(res.data.Message))
        }
    }).catch((err: any) => {
      toast.error(ErrorToast(err.Message))
    })
  }
  
  handlePerRowsListFunction = (newpage: any, page: any) => {
    this.pageSizeListFunction = page;
  };
  handlePageChangeListFunction = (page: any) => {
    this.pageIndexListFunction = page;
  };
}

export const functionStore = new FunctionStore();
