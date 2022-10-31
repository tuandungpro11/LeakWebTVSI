import { observable } from "mobx";

class ServiceExtension {

  @observable accounts: any[] = [];
  @observable account: any;

  GetAccounts() {
    this.accounts = JSON.parse(
      localStorage.getItem("userData"),
    );
    if (this.accounts) {
      this.account = this.accounts;
    }
  }
}

export const appStore = new ServiceExtension();