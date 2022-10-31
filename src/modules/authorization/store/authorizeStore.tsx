import { observable } from "mobx";
import { AuthorizeGroupByUserUpdate, listAPI } from "../type";
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
  @observable loadingData: boolean = false;

  //list app
  @observable pageIndexListAuthorize: number = 1;
  @observable pageSizeListAuthorize: number = 10;
  @observable totalRowsListAuthorize: number = 10;
  @observable dataListAuthorize: any[] = [];
  @observable dataListAuthorizeParam: any[] = [];
  @observable dataListAuthorizeDetail: any[] = [];
  @observable dataListAuthorizeTree: AuthorizeGroupByUserUpdate[] = [];
  @observable selectedGroupInfo: AuthorizeGroupByUserUpdate = {} as AuthorizeGroupByUserUpdate


  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }
  
  handlePerRowsListAuthorize = (newpage: any, page: any) => {
    this.pageSizeListAuthorize = page;
  };
  handlePageChangeListAuthorize = (page: any) => {
    var p = page;
    this.pageIndexListAuthorize = p;
  };

  async getAllUserInfos(value: any) {
    this.loadingData = true;
    this.dataListAuthorizeParam = value;
    this.dataListAuthorize=[];
    await useApi
      .postRequestAuthCenter(listAPI.GetListAuthorize, value)
      .then((res: any) => {
        if (res.data.Code === "0") {
          if (res.data.Data != null) {
            this.dataListAuthorize = [...res.data.Data];
            this.totalRowsListAuthorize = res.data.Data.TotalItem;
          } else {
            this.dataListAuthorize = [];
            this.totalRowsListAuthorize = 0;
          }
        } else {
          this.dataListAuthorize = [];
          this.totalRowsListAuthorize = 0;
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
  async getJsonGroupByUser(value:any) {
    this.loadingData = true
    
    await useApi
      .postRequestAuthCenter(listAPI.GetJsonGroupByUser, value)
      .then((res: any) => {
        if(res.data.Code === "0") {
          if (res.data.Data != null && res.data.Data.length > 0) {
            let newData = [...JSON.parse(res.data.Data)]
            this.dataListAuthorizeTree = [...newData]
            this.loadingData = false
          }
        }
      })
      .catch((error: any) => {
        this.loadingData = true
        toast.error(ErrorToast(error.statusText))
      })
  }
  async OnUpdateGroupByUser(selectedRowKeys: string[],UserId:string) {
    let GroupIds = selectedRowKeys.map((x) => x.split("||")[0]).join(", ")
    await useApi
      .postRequestAuthCenter(listAPI.UpdateGroupByUser, {UserId: UserId, UserName: appStore.account.LoginName, GroupIds})
      .then((res: {data: HTTPResponse}) => {
        if(res.data.Code === "0") {
          this.isShowPopup = false;
          toast.success(SuccessProgressToast(res.data.Message))
        } else {
          toast.success(SuccessProgressToast(res.data.Message))
        }
      })
      .catch((error: any) => {
        toast.error(ErrorToast(error.statusText))
      })
  }
}

export const authorizeStore = new ServiceExtension();
