export const pageSizeTable = [10, 25, 50, 100];
export const timeNoti = [
  { value: "5", label: "5 phút" },
  { value: "10", label: "10 phút" },
  { value: "15", label: "15 phút" },
  { value: "30", label: "30 phút" }
]
export const listAPI = {
  listCustomerPotential: "Lead/GetLeadListInfo",
  listSrcLead: "Lead/GetSrcLead",
  GetDetailLead: "Lead/GetDetailLead",
  GetLeadActivity: "Lead/GetLeadActivity",
  GetListComment: "Comment/GetListComment",
  GetTotalReply: "Comment/GetTotalReply",
  CreateComment: "Comment/CreateComent",
  CreateReply: "Comment/CreateReply",
  GetExtendInfoList: "Common/GetExtendInfoList",
  CreateLead: "Lead/CreateLead",
  UpdateLead: "Lead/UpdateLead",
  DeleteLead: "Lead/DeleteLead",
  GetCustomerList: "Customer/GetCustomerList",
  GetCustomerDetailInfo: "Customer/GetCustomerDetailInfo",
  GetCustomerReviews: "Customer/GetCustomerReviews",
  GetKycCustomerDetailInfo: "Customer/GetKycCustomerDetailInfo",
  GetCustomerActivity: "Customer/GetCustomerActivity",
  GetBalanceWidthrawal: "CashBalance/GetBalanceWidthrawal",
  GetOrderStatus: "Common/GetOrderStatus",
  GetTradingDailyDetail: "Trading/GetTradingDailyDetail"
};

export const customSMSelectStyles = {
  control: (base: any) => ({
    ...base,
    height: 30,
    minHeight: 30,
  }),
  singleValue: (base: any) => ({
    ...base,
    top: "45%",
    fontSize: "0.857rem",
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: 30,
  }),
  option: (base: any) => ({
    ...base,
    fontSize: "0.857rem",
  }),
};
export const customerStatus = [
  { value: 0, label: "Tất cả" },
  { value: 1, label: "Đã được assign" },
  { value: 2, label: "Đã chuyển thành Account" },
  { value: 99, label: "Đã từ chối" }
]

export const customerProfile = [
  { value: 0, label: "Tất cả" },
  { value: 1, label: "Cá nhân trong nước" },
  { value: 2, label: "Tổ chức trong nước" },
]

export const customerProfileParam = [
  { value: 1, label: "Cá nhân trong nước" },
  { value: 2, label: "Tổ chức trong nước" },
]

export const orderSide = [
  { value: "", label: "Tất cả" },
  { value: "B", label: "Lệnh mua" },
  { value: "S", label: "Lệnh bán" }
]

export const tradingStatus = [
  { Value: "0", Name: "Tất cả" },
]

export interface PotentialCustomer {
  AssignUser?: string
  CancelStatus?: boolean
  CovertStatus?: boolean
  CreatedDate?: string
  Email?: string
  LeadID?: number
  LeadName?: string
  LeadSourceId?: number
  Mobile?: string
  ProfileName?: string
  ProfileType?: number
  Status?: number
  StatusColor?: string
  StatusName?: string
}

export interface Customer {
  FullName?: string
  Custcode?: string
  Phone01?: string
  Phone02?: string
  Email?: string
  CustomerTypeName?: string
  Gender?: string
  Birthday?: string
  CustomerType?: number
  StatusColor?: string
  StatusName?: string
  SaleID?: string
}

export interface PotentialCustomerActivity {
  ActivityId?: number,
  LeadId?: number,
  LeadName?: null,
  CustCode?: string,
  CustName?: null,
  Title?: string,
  Type?: 1,
  TypeName?: string,
  EventType?: 1,
  EventName?: string,
  StartDate?: string,
  EndDate?: string,
  Location?: string,
  Priority?: number,
  PriorityName?: string,
  Status?: number,
  StatusName?: string,
  StatusColor?: string,
  Approved?: string,
  Assigned?: string,
  Detail?: string,
  ConfirmStatus?: number,
  ConfirmBy?: string,
  ConfirmDate?: string,
  ConfirmCode?: string,
  RejectCode?: string,
  RejectReason?: string,
  ReasonType?: number,
  CreatedBy?: string,
  CreatedDate?: string,
  statusDeadLine?: string,
  statusDeadLineColor?: string,
  Birthday?: string,
  Gender?: string,
  SaleID?: number
}