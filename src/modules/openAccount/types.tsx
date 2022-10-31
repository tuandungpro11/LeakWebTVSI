export const pageSizeTable = [10, 25, 50, 100];
export const othersContractOpenAccount = [
  { value: 1 , label:"Bản tổng hợp kiểm tra và xác nhận hồ sơ KH"},
  { value: 2 , label:"PYC mở tài khoản và đăng ký sử dụng dịch vụ"},
  { value: 3 , label:"Phiếu đăng ký trao đổi thông tin đặt lệnh (Mẫu 05)(Nếu đặt lệnh qua MG)"}
]
export const listAPI = {
 CheckPassportTradingCode:"Account/CheckPhoneCardIdAccount",
 TvsiList:"ManTvsi/GetManTvsiInfoList",
 TvsiDetail:"ManTvsi/GetManTvsiInfoDetail",
 SaleInfo:"Sale/GetSaleNameBySaleID",
 CheckTradingCode:"Account/CheckTradingCode",
 NationList:"Common/GetNationalityList",
 AddNewAccount:"Account/OpenIndividualForeignAccount",
 AddNewTradingcode:"Account/RegisterTradingCode",
 GetListTradingCode:"Account/GetRegisterTradingCodeList",
 GetListAccount:"Account/GetIndividualForeignAccountList",
 ConvertTradingCode:"Account/OpenIndividualForeignAccountFromTradingCode",
 ChangeStatusTraingCode:"Account/UpdateTradingCodeStatus",
 GetTradingCodeDetail:"Account/GetRegisterTradingDetail",
 UpdateTradingCode:"Account/UpdateRegisterTradingCode",
 getDetailAccount:"Account/GetForeignOpenAccountDetail",
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
