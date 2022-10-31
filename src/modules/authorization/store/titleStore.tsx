import { observable } from "mobx";
import { listAPI } from "../type";
import useApi from "@services/UseAppApi";
import { toast } from "react-toastify";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../views/extensions/toastify/ToastTypes";

class ServiceExtension {
  @observable isShowPopup: boolean = false;
  @observable isShowPopupEdit: boolean = false;
  @observable isShowPopupModalUpdate: boolean = false;
  @observable loadingData: boolean = false;

  //list app
  @observable pageIndexListTitle: number = 1;
  @observable pageSizeListTitle: number = 10;
  @observable totalRowsListTitle: number = 10;
  @observable dataListTitle: any[] = [];

  onShowModalAddNew(data: boolean) {
    this.isShowPopup = data;
  }
  onShowModalUpdate(data: boolean) {
    this.isShowPopupModalUpdate = data;
  }
  
  handlePerRowsListTitle = (newpage: any, page: any) => {
    this.pageSizeListTitle = page;
  };
  handlePageChangeListTitle = (page: any) => {
    var p = page;
    this.pageIndexListTitle = p;
  };
}

export const titleStore = new ServiceExtension();
