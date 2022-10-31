export const pageSizeTable = [10, 25, 50, 100];
export const timeNoti = [
  {value:"5", label:"5 phút"},
  {value:"10", label:"10 phút"},
  {value:"15", label:"15 phút"},
  {value:"30", label:"30 phút"}
]
export const listAPI = {
  getAccessToken: "Auth/SA_TK_StringeeAccessToken",
  GetListCustomer:"CallApp/GetListCustomerContact",
  GetListHistoryCall:"CallApp/GetListHistoryCall?src=M&lang=VI&v=1.0",
  GetListHistoryPlan:"CallApp/GetListBookingCall?src=M&lang=VI&v=1.0",
  AddCallInfo:"CallApp/CreateCallApp",
  UpdateCallInfo:"CallApp/UpdateCallApp",
  AddPlan:"CallApp/CreateBookingCall",
  UpdPlan:"CallApp/UpdateBookingCall",
  GetListStatusBooingCall:"CallApp/GetListStatus",
  DeletePlan:"CallApp/DeleteBookingCall",
  GetCommentByAccount:"Comment/GetListComment",
  addCommentByAccount:"Comment/CreateComent",
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
