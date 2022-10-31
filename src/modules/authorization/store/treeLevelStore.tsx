import { observable } from "mobx";
import { GroupAuthorizationInfo, listAPI } from "../type";
import useApi from "@services/UseAppApi";
import { toast } from "react-toastify";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../views/extensions/toastify/ToastTypes";
import { appStore } from "../../../stores/appStore";
import { HTTPResponse } from "../../../utility/general/types";

class ServiceExtension {
  @observable isShowPopup: boolean = false;
  @observable isShowPopupEdit: boolean = false;
  @observable isShowPopupModalUpdate: boolean = false;
  @observable isShowPopupModalDetail: boolean = false;
  @observable loadingData: boolean = false;
  @observable selectedGroupInfo: GroupAuthorizationInfo = {} as GroupAuthorizationInfo

  //list app
  @observable pageIndexListTreeLevel: number = 1;
  @observable pageSizeListTreeLevel: number = 10;
  @observable totalRowsListTreeLevel: number = 10;
  @observable dataListTreeLevel: any[] = [];
  @observable dataListTreeLevelParam: any[]=[]
  @observable dataListUserBySysLevel: any[]=[];
  @observable dataListSystemLevelInfo:any={};
  //data selected from item tree
  @observable selectedData:any[]=[];

  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }
  onShowModalDetail(data: boolean) {
    this.isShowPopupModalDetail = data;
  }
  
  handlePerRowsListTreeLevel = (newpage: any, page: any) => {
    this.pageSizeListTreeLevel = page;
  };
  handlePageChangeListTreeLevel = (page: any) => {
    var p = page;
    this.pageIndexListTreeLevel = p;
  };

  async GetSystemLevelList() {
    this.loadingData = true
    
    await useApi
      .postRequestAuthCenter(listAPI.GetSystemLevel, { username: appStore.account.LoginName })
      .then((res: any) => {
        if(res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            let newData = [...JSON.parse(res.data.Data)]
            this.dataListTreeLevel = [...newData]
            this.loadingData = false
          }
        }
      })
      .catch((error: any) => {
        this.loadingData = true
        toast.error(ErrorToast(error.statusText))
      })
  }
  async DeleteSystemLevelInfo(value:any) {
    await useApi
      .postRequestAuthCenter(listAPI.DeleteSystemLevel, value)
      .then(async (res: {data: HTTPResponse}) => {
        if(res.data.Code === "0")
        {
          await this.GetSystemLevelList()
          toast.success(SuccessProgressToast(res.data.Message))
        } else {
          toast.error(ErrorToast(res.data.Message))
        }
      }).catch((error: any) => {
        toast.error(ErrorToast(error.statusText))
      })
  }
  async getUserBySystemLevel(value:any) {
    await useApi.postRequestAuthCenter(listAPI.GetUserBySystemLevel, value)
      .then(async (res: {data: HTTPResponse}) => {
        if(res.data.Code === "0")
        {
          this.dataListUserBySysLevel = [...res.data.Data]
        } else {
          toast.error(ErrorToast(res.data.Message))
        }
      }).catch((error: any) => {
        toast.error(ErrorToast(error.statusText))
      })
  }
  async AddNewSystemLevel(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.AddNewSystemLevel, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã thêm mới thành công cấp độ")
          );
          this.GetSystemLevelList();
          this.isShowPopup = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async GetSystemLevelInfo(value: any) {
    this.dataListSystemLevelInfo=[];
    await useApi
      .postRequestAuthCenter(listAPI.DetailSystemLevel, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListSystemLevelInfo = res.data.Data;
          } else {
            this.dataListSystemLevelInfo = [];
          }
        } else {
          this.dataListSystemLevelInfo = [];
          toast.error(ErrorToast(res.data.Message));
        }
      })
      .catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
  async UpdateSystemLevel(value: any) {
    await useApi
      .postRequestAuthCenter(listAPI.UpdateSystemLevel, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          toast.success(
            SuccessProgressToast("Bạn đã cập nhật thành công cấy cấp độ")
          );
          this.GetSystemLevelList();
          this.isShowPopupModalUpdate = false;
        } else {
          toast.error(ErrorToast(res.data.Message));
        }
      }).catch((error: any) => {
        const { config, response } = error;
        toast.error(ErrorToast(response.statusText));
      });
  }
}

export const treeLevelStore = new ServiceExtension();
