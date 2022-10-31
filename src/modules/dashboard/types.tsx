export const listAPI = {
  GetAllUser: "Auth/GetAll",
  CreateUser: "Auth/CreateUser",
  UpdateUser: "Auth/UpdateUser",
  GetSystemLevelInfo: "Auth/GetSystemLevelInfo",
  GetSaleInfo: "Auth/GetSaleInfo",
  ChangeActiveAccount: "Auth/ChangeActiveUser",
  UnLockLogin: "Auth/UnLockLogin",
  LockLogin: "Auth/LockLogin",
  ChangePassword: "Auth/ChangePassword",
  UserInfo: "Auth/UserInfo",
  VerifyAccount: "Auth/VerifyAccount",
  ResetPassword: "Auth/ResetPassword",
  GetListSale:"Sale/GetAllSaleInfos",
  GetListPosition:"Position/GetPositionInfos",
}

export const userType = [
  { value: "NORMAL", label: "NORMAL" },
  { value: "LDAP", label: "LDAP" }
]

export const userTypeSearch = [
  { value: "", label: "Tất cả" },
  { value: "NORMAL", label: "NORMAL" },
  { value: "LDAP", label: "LDAP" }
]

export const Sex = [
  { value: 1, label: "Nam" },
  { value: 0, label: "Nũ" }
]