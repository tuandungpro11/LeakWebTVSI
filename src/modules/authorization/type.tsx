import { DataNode } from "antd/lib/tree";

export const pageSizeTable = [10, 25, 50, 100];
export const bankAccountStatusOption = [{ value: 1, label: "Đã kích hoạt" },{ value: 0, label: "Chưa kích hoạt" }]
export const levelTypeOption = [
  { value: 1, label: "BOD" },
  { value: 0, label: "Chi nhánh" },
  { value: 2, label: "Nhóm Sale" },
  { value: 3, label: "Chi nhánh ảo" }
]
export const SaleTypeOption = [
  { value: 1, label: "Sale" },
  { value: 2, label: "SaleType" },
  { value: 3, label: "CTV mục tiêu" },
  { value: 4, label: "TV lâu năm" }
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
  GetListApp:"App/GetAppList",
  AddNewApp:"App/InsertAppInfo",
  UpdateApp:"App/UpdateAppInfo",
  DeleteApp:"App/DeleteAppInfo",
  GetListRight:"Right/GetRightInfos",
  DeletetRight:"Right/DeleteRightInfo",
  AddNewRight:"Right/AddRightInfo",
  UpdateRight:"Right/UpdateRightInfo",
  DetailRight:"Right/GetRightInfo",
  GetListBranch:"Branch/GetBranchInfos",
  DeleteBranch:"Branch/DeleteBranchInfo",
  AddNewBranch:"Branch/AddBranchInfo",
  DetailBranch:"Branch/GetBranchInfo",
  UpdateBranch:"Branch/UpdateBranchInfo",
  GetListPosition:"Position/GetPositionInfos",
  DeletePosition:"Position/DeletePositionInfo",
  AddNewPosition:"Position/AddPositionInfo",
  UpdatePosition:"Position/UpdatePositionInfo",
  DetailPosition:"Position/GetPositionInfo",
  GetSystemLevel:"SystemLevel/GetJsonSystemTreeList",
  DeleteSystemLevel:"SystemLevel/DeleteSystemLevelInfo",
  GetUserBySystemLevel:"SystemLevel/GetUsersBySysLevelID",
  AddNewSystemLevel:"SystemLevel/AddSystemLevelInfo",
  DetailSystemLevel:"SystemLevel/GetSystemLevelInfo",
  UpdateSystemLevel:"SystemLevel/UpdateSystemLevelInfo",
  GetListSale:"Sale/GetAllSaleInfos",
  AddNewSale:"Sale/AddSaleInfo",
  UpdateSale:"Sale/UpdateSaleInfo",
  DetailSale:"Sale/GetSaleInfo",
  GetListAuthorize:"User/GetAllUsers",
  GetJsonGroupByUser:"User/GetJsonGroupByUserTrees",
  UpdateGroupByUser:"User/UpdateGroupByUser",
  GetAllUserByFunctions:"Function/GetAllUserByFunctions",
};

export interface TreeTableColumn {
  title: string
  dataIndex: string
  key: string
}

export interface TreeProps {
  key: number
  title: string | JSX.Element
  children?: TreeProps[]
}

export interface AntdTreeDataProp {
  title: string
  key: number
  value: number
} 

export interface GroupAuthorizationInfo extends AntdTreeDataProp {
  GroupID: number
  GroupCode: string
  GroupName: string
  Description?: string
  Status?: number
  CreatedDate?: string
  CreatedBy?: string
  UpdatedDate?: string
  UpdatedBy?: string
  children?: GroupAuthorizationInfo[]
  ParentName?: string
  ParentID?: number
}

export interface SearchTreeResult {
  groupInfos: GroupAuthorizationInfo[]
  expandedRows: number[]
}

export interface SearchFunctionTreeResult {
  functionAuths: FunctionAuth[]
  expandedRows: number[]
}

export interface GroupAuthorizationInfoEditing {
  GroupID?: number
  GroupCode: string
  GroupName: string
  Description?: string
  Status?: number
  ParentName?: string
  ParentID?: number
}

export interface GroupAuthorizationPayload {
  GroupCode: string
  GroupName: string
  Description?: string
  Status?: number
  ParentGroupId?: number
}

export interface GroupAuthUser {
  UserID: number
  LoginName: string
  DisplayName: string
  PositionName: string
  SystemLevelName: string
}

export interface FunctionAuth extends DataNode {
  FunctionID: number
  ParentID?: number
  FunctionName: string
  FunctionCode: string
  FunctionType: string
  AppName: string
  HaveRight?: number
  children?: FunctionAuth[]
}

export interface FunctionInfo extends Omit<FunctionAuth, "HaveRight" | "children"> {
  OrderNum: number
  Url: string
  IConCls: string
  IsShow: boolean
  Status: number
  CreatedBy: string
  CreatedDate: string
}

export interface FunctionInfoEditing extends Partial<FunctionInfo> {}

export interface AppInfo {
  AppID: number
  AppName: string
  Description: string
}

export interface SystemLeveInfo extends AntdTreeDataProp {
  SysLevelID: number
  Code: string
  Name: string
  BranchCode: string
  LevelType?: number
  Status?: number
  ParentID?:number
  ParentName?:string
  children?: SystemLeveInfo[]
}
export interface SearchTreeResult_TreeLevel {
  groupInfosTree: SystemLeveInfo[]
  expandedRows: number[]
}
export interface AuthorizeGroupByUser{
  GroupID: number,
  GroupCode: string,
  GroupName: string,
  IsRight:number,
  children?:AuthorizeGroupByUser[]
}

export interface AuthorizeGroupByUserUpdate extends AntdTreeDataProp {
  GroupID: number
  GroupCode: string
  GroupName: string
  IsRight:number,
  children?: AuthorizeGroupByUser[]
}

export interface RightFunctionInfo {
  FunctionID: number
  RightID: number
  RightCode: string
  IsRight: boolean
  RightName: string
}

export interface GroupInfoByRight {
  GroupID: number
  GroupName: string
  GroupCode: string
  ParentName: string | null
}