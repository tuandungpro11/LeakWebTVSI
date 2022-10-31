//table bank account
export const listAPI = {    
  customerGroupList: "CustomerGroup/GetCustomerGroupList",
  bankAccountList: "BankAccount/GetBankAccountList",
  accountEmailList: "AccountManage/GetCustomerEmailList",
  accountPhoneList: "AccountManage/GetCustomerPhoneList",
  getCustomerAccountById: "AccountManage/GetCustomerInfoById",
  registerEmailService: "AccountManage/RegisterEmailService",
  registerPhoneService: "AccountManage/RegisterPhoneService",
  deleteEmailService: "AccountManage/DeleteCustomerEmail",
  deletePhoneService: "AccountManage/DeleteCustomerPhone",
  regisEmailService: "AccountManage/RegisterEmailService",
  regisPhoneService: "AccountManage/RegisterPhoneService",
  changeActiveCustomerAccount: "AccountManage/ChangeActiveCustomerAccount",
  listBankAccount: 'BankAccount/GetBankAccountList',
  getListBank: "Bank/GetBankList",
  deleteBankById: "Bank/DeleteBank",
  addNewBank: "Bank/CreateBank",
  UpdateBank: "Bank/UpdateBank",
  getListInternalAccount: "InternalAccount/GetInternalAccountList",
  getListBranch: "AccountManage/GetTvsiBranchList",
  getListNotGenOrderSlip: "ExTrader/GetExTraderList",
  AddNewtNotGenOrderSlip: "ExTrader/CreateExTrader",
  listCustomerAccount: 'AccountManage/GetCustomerAccountList',
  tvsiBranchList: "AccountManage/GetTvsiBranchList",
  UpdateNotGenOrderSlip: "ExTrader/UpdateExTrader",
  ListOverdraftSecToPurchase: "OverdraftIncludeStock/GetOverdraftIncludeStockList",
  ListHisOverdraftSecToPurchase: "OverdraftIncludeStock/GetOverdraftIncludeStockHistoryList",
  AddOverdraftSecToPurchase: "OverdraftIncludeStock/CreateOverdraftIncludeStock",
  UpdOverdraftSecToPurchase: "OverdraftIncludeStock/UpdateOverdraftIncludeStock",
  DelOverdraftSecToPurchase: "OverdraftIncludeStock/DeleteOverdraftIncludeStock",
  SystemStatus_Internal_Account: "SysConfig/GetSysConfigList",
  ChangeStatusInternalAccount: "InternalAccount/ChangeStatusInternalAccount",
  getAccountById: "AccountManage/GetCustomerInfoById",
  updateInternalAccount: "InternalAccount/UpdateInternalAccount",
  deleteBankAccount: "BankAccount/ChangeStatusBankAccount",
  getListBranchBank: "BankBranch/GetBankBranchList",
  AddBankAccount: "BankAccount/CreateBankAccount",
  UpdBankAccount: "BankAccount/UpdateBankAccount",
  getInternalCusInfo:"InternalAccount/GetInternalAccount",
  AddInternalAccount:"InternalAccount/CreateInternalAccount",
  getListSecPlaceOrder:"ExceptionStock/GetExceptionStockList",
  deleteListSecPlaceOrderByStockCode:"ExceptionStock/DeleteExceptionStock",
  AddListSecPlaceOrder:"ExceptionStock/CreateExceptionStock",
  UpdListSecPlaceOrder:"ExceptionStock/UpdateExceptionStock",
  getStockInfo:"ExceptionStock/GetStockInfoBySymbol",
  hisLogin:"Logging/GetLogLoginITradeHomeList",
  getListOrder:"ManageOrder/GetOrderList",
  getListRightBuy:"RightRegistration/GetRightRegistrationList",
  getListHisRightBuy:"RightRegistration/GetRightRegistrationHist",
  getListSecRight:"RightRegistration/GetRightStockList",
  hisLoginPasiot:"Logging/GetLogLoginList",
  getListTF_OS:"ManageOrder/GetInsideOrderList",
  getListBeforeDate:"ManageOrder/GetOutsideOrderList",
  getListPricePlaceOrder:"NextPrice/GetNextPriceList",
  deleteSymbolPriceToPurchase:"NextPrice/DeleteNextPrice",
  updateSymbolPriceToPurchase:"NextPrice/UpdateNextPrice",
  addSymbolPriceToPurchase:"NextPrice/CreateNextPrice",
  calculatelPriceToPurchase:"NextPrice/CalculateAgainNextPrice",
  deleteBranchBank:"BankBranch/DeleteBankBranch",
  addNewBranchBank:"BankBranch/CreateBankBranch",
  updateBranchBank:"BankBranch/UpdateBankBranch",
  getListConditionByTime:"ManageOrder/GetOrderConditionGTDList",
  getListConditionByPrice:"ManageOrder/GetOrderConditionSTList",
  getListSuperAccount:"SupperAccount/GetSupperAccountList",
  changeStatusSuperAccount:"SupperAccount/ChangeActiveSupperAccount",
  deleteStatusSuperAccount:"SupperAccount/DeleteSupperAccount",
  addNewStatusSuperAccount:"SupperAccount/CreateSupperAccount",
  UpdateNewStatusSuperAccount:"SupperAccount/UpdateSupperAccount",
  getListWhiteList:"WhiteList/GetWhiteList",
  getListOverdraftService:"OverdraftService/GetOverdraftServiceList",
  AddNewListOverdraftService:"OverdraftService/CreateOverdraftService",
  deleteListOverdraftService:"OverdraftService/DeleteOverdraftService",
  updateListOverdraftService:"OverdraftService/UpdateOverdraftService",
  getListOverdraftAccount:"OverdraftAccount/GetOverdraftAccountList",
  deleteOverdraftAccount:"OverdraftAccount/DeleteOverdraftAccount",
  addOverdraftAccount:"OverdraftAccount/CreateOverdraftAccount",
  updOverdraftAccount:"OverdraftAccount/UpdateOverdraftAccount",
  getListGroupOrder:"ManageOrder/GetOrderBasketList",
  getListDetailGroupOrder:"ManageOrder/GetOrderBasketInfo",
  getListAccountByID:"AccountManage/GetAccountList",
  getListOSHT:"ManageOrder/GetOrderHist",
  getListConfigSystem:"SysConfig/GetConfigurationList",
  getListChannel:"SysConfig/GetAllChannel",
  updateListConfigSystem:"SysConfig/UpdateConfigurationList",
  updateListChannel:"SysConfig/UpdateFeeTaxChannel",
  updateCustomerAccount: "AccountManage/UpdateCustomerAccount",
  getListWarning: "SysConfig/GetNotifierList",
  GetAssetDetail: "Asset/GetAssetDetail",
  GetLastestAssetHistory: "Asset/GetLastestAssetHistory",
  GetSysConfigList: "SysConfig/GetSysConfigList",
  changeStatusRightBuy:"RightRegistration/ChangeStatusRightRegistration",
  GetTrialAccountList: "TrialAccount/GetTrialAccountList",
  ExportTrialAccount: "TrialAccount/ExportTrialAccountList",
  ChangeActiveTrialAccount: "TrialAccount/ChangeActiveTrialAccount",
  AddTrialAccount: "TrialAccount/AddTrialAccount",
  AddNewWhiteList:"WhiteList/CreateWhiteList",
  UpdateWhiteList:"WhiteList/UpdateWhiteList",
  DeleteExTrader:"ExTrader/DeleteExTrader",
  ReactiveCustomer: "AccountManage/ReactiveCustomer",
  ChangeStatusBankAccount: "BankAccount/ChangeStatusBankAccount",
  GetCustomerInfoByAccountNo: "AccountManage/GetCustomerInfoByAccountNo",
  ExportListBank:"Bank/ExportBankList",
  ExportHisLogin:"Logging/ExportLogLoginList",
  ExportListInternalAccount:"InternalAccount/ExportInternalAccountList",
  ExportListRightBuy:"RightRegistration/ExportRightRegistrationList",
  ExportListHisRightBuy:"RightRegistration/ExportRightRegistrationHist",
  ExportListNotGenOrderSlip:"ExTrader/ExportExTraderList",
  ExportPricePlaceOrder:"NextPrice/ExportNextPriceList",
  ExportExceptionStock:"ExceptionStock/ExportExceptionStockList",
  ExportInsideOder:"ManageOrder/ExportInsideOrderList",
  ExportHistoryOder:"ManageOrder/ExportOrderHist",
  ExportConditionGTD:"ManageOrder/ExportOrderConditionGTDList",
  ExportConditionST:"ManageOrder/ExportOrderConditionSTList",
  ExportOrderBeforeDate:"ManageOrder/ExportOutsideOrderList",
  DownloadTemplateImportExceptionStock: "ExceptionStock/DownloadTemplateImportExceptionStock",
  ImportExceptionStock: "ExceptionStock/ImportExceptionStock",
  DownloadTemplateImportNextPrice: "NextPrice/DownloadTemplateImportNextPrice",
  ImportNextPriceList: "NextPrice/ImportNextPriceList",
  ResetPinPassword: "AccountManage/ResetPinPassword"
}
export const pageSizeTable = [10, 25, 50, 100]
export const pageSizeTableBranch = [9999]
export const investorAccountType = [
  { value: -1, label: "Tất cả" },
  { value: 0, label: "Đại lý chính thức" },
  { value: 1, label: "Đại lý tự doanh" },
  { value: 2, label: "Đại lý tự do" },
  { value: 3, label: "Nhà đầu tư" }
]
export const investorStatusOption = [
  { value: -1, label: "Tất cả" },
  { value: 0, label: "Chưa kích hoạt" },
  { value: 2, label: "Khóa bởi nhân viên" },
  { value: 1, label: "Kích hoạt" }
]
export const trialAccountStatus = [
  { value: -1, label: "Tất cả" },
  { value: 0, label: "Inactive" },
  { value: 1, label: "Active" },
]
export const bankAccountStatusOption = [{ value: -1, label: "Chờ duyệt" }]

export const bankAccountManageAtOption = [
  { value: 0, label: "Quản lý tài khoản tổng tại TVSI" },
  { value: 1, label: "Kết nối trực tiếp BIDV" },
]

export const defaultValueCalulatePriceOrder =[ 10,7,10]

export interface BankCategoryParam {
  UserId?: number;
  BankNo?: string;
  BankName?: string;
  BankNameEn?: string;
  ShortName?: number;
  Bankcheqcode?: string;
  SecCode?: string;
  SecCodeBranch?: string;
  Status?: number;
  PageIndex?: number;
  PageSize?: number;
}

export interface CustomerAccountInfo {
  ROWCOUNT?: number;
  CUSTOMERID?: string;
  CUSTOMERNO?: string;
  CUSTOMERNAME?: string;
  PASSWORD?: string;
  PIN?: string;
  AUTHTYPE?: number;
  IDENTITYCARD?: string;
  ADDRESS?: string;
  EMAIL?: string;
  PHONE?: string;
  CELLPHONE?: string;
  ACTIVEDATE?: string;
  STATUS?: number;
  CUSTOMERGROUPID?: number;
  TOTALPOINT?: number;
  USERID?: string;
  BRANCHID?: string;
  REPEATPASS?: boolean;
  CONTACTEMAIL?: string;
  CONTACTPHONE?: string;
  ISDEFAULT?: boolean;
  CONFIRMCODE?: string;
  DEFAULTACCOUNT?: string;
  PINCONFIRMCODE?: string;
  CUSTOMERTYPE?: number;
  PCFLAG?: string;
  CUSTODIAN?: string;
  MKTID?: string;
  PICKACCOUNT?: string;
  ValidatePass?: number;
  ValidatePin?: number;
  OTP?: string;
  BIRTHDAY?: string;
  SEX?: string;
  CARDISSUE?: string;
  PLACEISSUE?: string;
  OCCUPATION?: string;
  NATIONALITY?: string;
  PAYMENTTYPE?: number;
  REMARK?: string;
  AGENTTYPE?: string;
  BRANCHNAME?: string;
  CustomerGroup?: string;
  UserName?: string;
  TaxCode?: string;
}

export interface BankCategoryParam {
  UserId?: number;
  BankNo?: string;
  BankName?: string;
  BankNameEn?: string;
  ShortName?: number;
  Bankcheqcode?: string;
  SecCode?: string;
  SecCodeBranch?: string;
  Status?: number;
  PageIndex?: number;
  PageSize?: number;
}

export const customSMSelectStyles = {
  control: (base: any) => ({
    ...base,
    height: 30,
    minHeight: 30
  }),
  singleValue: (base: any) => ({
    ...base,
    top: '45%',
    fontSize: '0.857rem'
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: 30,
  }),
  option: (base: any) => ({
    ...base,
    fontSize: '0.857rem'
  }),
};

export const assetDetailType = [
  { value: 0, label: "Tất cả thông tin tài sản" },
  { value: 1, label: "Thông tin tài sản mới nhất" }
]