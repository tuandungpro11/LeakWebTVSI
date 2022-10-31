import { observable } from "mobx";
import { functionAuthList, groupAuthorizationInfoMockData, groupAuthUserList } from "../constant";
import { FunctionAuth, GroupAuthorizationInfo, GroupAuthorizationInfoEditing, GroupAuthorizationPayload, GroupAuthUser } from "../type";
import useApi from "@services/UseAppApi";
import { appStore } from "../../../stores/appStore";
import { HTTPResponse } from "../../../utility/general/types";
import { toast } from "react-toastify";
import { ErrorToast, SuccessProgressToast } from "../../../views/extensions/toastify/ToastTypes";

class GroupStore {
  @observable groupAuthList: GroupAuthorizationInfo[] = []
  @observable groupAuthUserList: GroupAuthUser[] = []
  @observable functionAuthList: FunctionAuth[] = []
  @observable checkedFunctionAuth: FunctionAuth[] = []
  @observable editingGroupInfo: GroupAuthorizationInfoEditing = {} as GroupAuthorizationInfo;
  @observable isShowingEditPopup: boolean = false;
  @observable isViewingUsersPopup: boolean = false;
  @observable isAuthorizingPopup: boolean  = false;
  @observable selectedGroupInfo: GroupAuthorizationInfo = {} as GroupAuthorizationInfo
  @observable isEditing: boolean = false;
  @observable isLoadingData: boolean = true
  @observable isLoadingFunctionAuthList: boolean = true
  @observable pageIndexListTitle: number = 1;
  @observable pageSizeListTitle: number = 10;
  @observable totalRowsListTitle: number = 10;

  OnShowModalEdit(value: boolean) {
    this.isShowingEditPopup = value;
  }

  ToggleIsEditing(value: boolean) {
    this.isEditing = value;
  }

  OnShowModalViewUsers(value: boolean) {
    this.isViewingUsersPopup = value;
  }

  async OnShowModalAuthorize(value: boolean) {
    this.isAuthorizingPopup = value
  }

  async InitializeEditingGroupInfo(GroupID?: number) {
    if(this.isEditing && GroupID) {
      await useApi
        .postRequestAuthCenter("Group/GetGroupInfo", {username: appStore.account.LoginName, GroupID})
        .then((res: any) => {
          if(res.data.Code === "0" && res.data.Data) {
            this.editingGroupInfo = {
              GroupID: res.data.Data.GroupID,
              GroupName: res.data.Data.GroupName,
              GroupCode: res.data.Data.GroupCode,
              Status: res.data.Data.Status,
              ParentID: res.data.Data.ParentID,
              ParentName: res.data.Data.ParentName,
              Description: res.data.Data.Description,
            }
          }
        })
    } else {
      this.editingGroupInfo = {
        GroupName: "",
        GroupCode: "",
        Description: "",
      }
    }
  }

  async GetGroupAuthList() {
    this.isLoadingData = true
    await useApi
      .postRequestAuthCenter("Group/GetJsonGroupTrees", { username: appStore.account.LoginName })
      .then((res: any) => {
        if(res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            let newData = [...JSON.parse(res.data.Data)]
            this.groupAuthList = [...newData]
            this.isLoadingData = false
          }
        }
      })
      .catch((error: any) => {
        this.isLoadingData = true
        toast.error(ErrorToast(error.statusText))
      })
  }

  async GetFunctionAuth(groupInfo: GroupAuthorizationInfo) {
    this.isLoadingFunctionAuthList = true
    this.selectedGroupInfo = groupInfo
    await useApi
      .postRequestAuthCenter("Group/GetJsonFunctionByGroupTrees", { username: appStore.account.LoginName, GroupID: groupInfo.GroupID })
      .then((res: {data: HTTPResponse}) => {
        if(res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            this.functionAuthList = [...JSON.parse(res.data.Data)]
            this.isLoadingFunctionAuthList = false
          }
        }
      })
      .catch((err: any) => {
        toast.error(ErrorToast(err.statusText))
      })
  }

  async GetUsersByGroup(groupInfo: GroupAuthorizationInfo) {
    this.selectedGroupInfo = groupInfo
    await useApi.postRequestAuthCenter("Group/GetUsersByGroup", { username: appStore.account.LoginName, GroupID: groupInfo.GroupID})
      .then(async (res: {data: HTTPResponse}) => {
        if(res.data.Code === "0")
        {
          this.groupAuthUserList = [...res.data.Data]
        } else {
          toast.error(ErrorToast(res.data.Message))
        }
      }).catch((error: any) => {
        toast.error(ErrorToast(error.statusText))
      })
  }

  async OnUpdateGroupAuthorization(selectedRowKeys: number[]) {
    let FunctionIDs = selectedRowKeys.join(", ")
    await useApi
      .postRequestAuthCenter("Group/UpdateFunctionGroups", {FunctionIDs, username: appStore.account.LoginName, GroupID: this.selectedGroupInfo.GroupID.toString()})
      .then((res: {data: HTTPResponse}) => {
        if(res.data.Code === "0") {
          this.isAuthorizingPopup = false;
          toast.success(SuccessProgressToast(res.data.Message))
        } else {
          toast.error(ErrorToast(res.data.Message))
        }
      })
      .catch((error: any) => {
        toast.error(ErrorToast(error.statusText))
      })
  }

  async OnAddGroupInfo(payload: GroupAuthorizationPayload) {
    await useApi.postRequestAuthCenter("Group/AddGroupInfo", {
      ...payload, 
      username: appStore.account.LoginName,
      CreatedBy: appStore.account.LoginName
    }).then(async (res: { data: HTTPResponse }) => {
      if (res.data.Code === "000") {
        await this.GetGroupAuthList()
        this.isShowingEditPopup = false;
        toast.success(SuccessProgressToast(res.data.Message));
      } else {
        toast.error(ErrorToast(res.data.Message))
      }
    }).catch((error: any) => {
      toast.error(ErrorToast(error.statusText))
    })
  }

  async OnEditGroupInfo(payload: GroupAuthorizationPayload) {
    await useApi.postRequestAuthCenter("Group/UpdateGroupInfo", {
      ...payload, 
      username: appStore.account.LoginName,
      CreatedBy: appStore.account.LoginName
    }).then(async (res: { data: HTTPResponse }) => {
      if (res.data.Code === "0") {
        await this.GetGroupAuthList()
        this.isShowingEditPopup = false;
        toast.success(SuccessProgressToast(res.data.Message));
      } else {
        toast.error(ErrorToast(res.data.Message))
      }
    }).catch((error: any) => {
      toast.error(ErrorToast(error.statusText))
    })
  }

  async OnDeleteGroupInfo(GroupID: number) {
    await useApi
      .postRequestAuthCenter("Group/DeleteGroupInfo", { GroupID, username: appStore.account.LoginName })
      .then(async (res: {data: HTTPResponse}) => {
        if(res.data.Code === "0")
        {
          await this.GetGroupAuthList()
          toast.success(SuccessProgressToast(res.data.Message))
        } else {
          toast.error(ErrorToast(res.data.Message))
        }
      }).catch((error: any) => {
        toast.error(ErrorToast(error.statusText))
      })
  }
}

export const groupStore = new GroupStore();
