export const pageSizeTable = [10, 25, 50, 100];
export const months = [
    { value: 1, label: "Tháng 1", color:"017acb" },
    { value: 2, label: "Tháng 2", color:"017acb" },
    { value: 3, label: "Tháng 3", color:"017acb" },
    { value: 4, label: "Tháng 4", color:"017acb" },
    { value: 5, label: "Tháng 5", color:"017acb" },
    { value: 6, label: "Tháng 6", color:"017acb" },
    { value: 7, label: "Tháng 7", color:"017acb" },
    { value: 8, label: "Tháng 8", color:"017acb" },
    { value: 9, label: "Tháng 9", color:"017acb" },
    { value: 10, label: "Tháng 10", color:"017acb" },
    { value: 11, label: "Tháng 11", color:"017acb" },
    { value: 12, label: "Tháng 12", color:"017acb" }
]
export const joinProducts =[
  { value: "", label: "Tất cả" },
  { value: 1, label: "Giao dịch cơ sở" },
  { value: 2, label: "Giao dịch trái phiếu" }
]
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
  export const listAPI = {
    apiExport:"Report/ExportExcelReport"
  };

  export interface DobColumnsType {
    branch: string
    saleId: string
    FullName: string
    CustId:string
    CustName:string
    CustType:string
    Dob:string
  } 
  export interface ReactiveColumnsType {
    branch: string
    saleId: string
    FullName: string
    CustId:string
    CustName:string
    CustType:string
    Dob:string
  } 
  export interface InactiveColumnsType {
    branch: string
    saleId: string
    FullName: string
    CustId:string
    CustName:string
    CustType:string
    Dob:string
  } 
  export interface ProductColumnsType {
    branch: string
    saleId: string
    FullName: string
    CustId:string
    CustName:string
    CustType:string
    Dob:string
  } 
  export interface DepositColumnsType {
    branch: string
    saleId: string
    FullName: string
    CustId:string
    CustName:string
    CustType:string
    Dob:string
  } 
  export interface SecColumnsType {
    branch: string
    saleId: string
    FullName: string
    CustId:string
    CustName:string
    CustType:string
    Dob:string
  } 
  export interface ActiveColumnsType {
    branch: string
    saleId: string
    FullName: string
    CustId:string
    CustName:string
    CustType:string
    Dob:string
  } 
