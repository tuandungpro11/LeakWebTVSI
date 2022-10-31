import { observable } from "mobx";
import { listAPI } from "../type";
import useApi from "@services/UseAppApi";
import {
  ErrorToast,
  SuccessProgressToast,
} from "../../../views/extensions/toastify/ToastTypes";
import { toast } from "react-toastify";
class ServiceExtension {
  @observable loadingData: boolean = false;
  //birthday report
  @observable pageIndexDob: number = 1;
  @observable pageSizeDob: number = 10;
  @observable totalRowsDob: number = 0;
  @observable dataListDob: any[] = [];
  //Reactive
  @observable pageIndexReactive: number = 1;
  @observable pageSizexReactive: number = 10;
  @observable totalRowsxReactive: number = 0;
  @observable dataListxReactive: any[] = [];
  //Inactive
  @observable pageIndexInactive: number = 1;
  @observable pageSizexInactive: number = 10;
  @observable totalRowsxInactive: number = 0;
  @observable dataListxInactive: any[] = [];
  //Product
  @observable pageIndexProduct: number = 1;
  @observable pageSizexProduct: number = 10;
  @observable totalRowsxProduct: number = 0;
  @observable dataListxProduct: any[] = [];
  //Deposit
  @observable pageIndexDeposit: number = 1;
  @observable pageSizexDeposit: number = 10;
  @observable totalRowsxDeposit: number = 0;
  @observable dataListxDeposit: any[] = [];
  //Sec
  @observable pageIndexSec: number = 1;
  @observable pageSizexSec: number = 10;
  @observable totalRowsxSec: number = 0;
  @observable dataListxSec: any[] = [];
  //Active
  @observable pageIndexActive: number = 1;
  @observable pageSizexActive: number = 10;
  @observable totalRowsxActive: number = 0;
  @observable dataListxActive: any[] = [];
  

  handlePageChangeCustormer = (page: any) => {
    this.pageIndexDob = page;
  };
  handlePerRowsChangeCustormer = (newpage: any, page: any) => {
    this.pageSizeDob = page;
  };
  handlePerRowsChangeCustormerReactive = (newpage: any, page: any) => {
    this.pageSizexReactive = page;
  };
  handlePageChangeCustormerReactive = (page: any) => {
    this.pageIndexReactive = page;
  };
  handlePerRowsChangeCustormerInactive = (newpage: any, page: any) => {
    this.pageSizexInactive = page;
  };
  handlePageChangeCustormerInactive = (page: any) => {
    this.pageIndexInactive = page;
  };
  handlePerRowsChangeCustormerProduct = (newpage: any, page: any) => {
    this.pageSizexProduct = page;
  };
  handlePageChangeCustormerProduct = (page: any) => {
    this.pageIndexProduct = page;
  };
  handlePerRowsChangeCustormerDeposit = (newpage: any, page: any) => {
    this.pageSizexDeposit = page;
  };
  handlePageChangeCustormerDeposit = (page: any) => {
    this.pageIndexDeposit = page;
  };
  handlePerRowsChangeCustormerSec = (newpage: any, page: any) => {
    this.pageSizexSec = page;
  };
  handlePageChangeCustormerSec = (page: any) => {
    this.pageIndexSec = page;
  };
  handlePerRowsChangeCustormerActive = (newpage: any, page: any) => {
    this.pageSizexActive = page;
  };
  handlePageChangeCustormerActive = (page: any) => {
    this.pageIndexActive = page;
  };

  async ExportListUI(api: any, value: any, fileName: string) {
    this.loadingData = true;
    // this.listbank = url;
    // await axios.post(process.env.REACT_APP_API + listAPI.ExportListBank + "?" + value, null, { responseType: 'arraybuffer' })
    await useApi
      .postRequestExportReportDVDT(api, value)
      .then((res: any) => {
        var headers = res.headers;
        var blob = new Blob([res.data], { type: headers["content-type"] });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${fileName}.xlsx`;
        link.click();
        this.loadingData = false;
      })
      .catch((error: any) => {
        this.loadingData = false;
        const { config, response } = error;
        toast.error(ErrorToast(error));
      });
  }
}
export const reportStore = new ServiceExtension();
