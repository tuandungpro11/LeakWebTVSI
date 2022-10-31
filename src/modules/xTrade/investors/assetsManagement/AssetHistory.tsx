import styled from "@emotion/styled";
import { useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { Moment } from "../../../../utility/general/Moment";
import { numberUtil } from "../../../../utility/general/NumberUtil";
import { store } from "../../store/InvestorStore";

const AssetHistory = (data: any) =>
  useObserver(() => {
    const assetInfo = data.assetItem;
    useEffect(() => {
      const param = {
        "AccountNo": assetInfo.accountNo,
        "CustomerId": ""
      }
      store.GetLastestAssetHistory(param);
    }, [])

    return (
      <>
        <table className="table-bordered w-full value-right">
          <tbody>
            <tr>
              <th><Label>Số TK</Label></th>
              <td><Value>{store.assetItem.accountNo}</Value></td>
              <th><Label>Mã KH</Label></th>
              <td><Value>{store.assetItem.customerId}</Value></td>
            </tr>
            <tr>
              <th><Label>Số dư tiền</Label></th>
              <td><Value>{numberUtil.formatNumber(store.assetItem.cashBalance)}</Value></td>
              <th><Label>Tài sản cổ phiếu</Label></th>
              <td><Value>{numberUtil.formatNumber(store.assetItem.stockBalance)}</Value></td>
            </tr>
            <tr>
              <th><Label>Tài sản trái phiếu</Label></th>
              <td><Value>{numberUtil.formatNumber(store.assetItem.bondBalance)}</Value></td>
              <th><Label>Tài sản Quỹ</Label></th>
              <td><Value>{numberUtil.formatNumber(store.assetItem.fundBalance)}</Value></td>
            </tr>
            <tr>
              <th><Label>Tài sản MM</Label></th>
              <td><Value>{numberUtil.formatNumber(store.assetItem.mmBalance)}</Value></td>
              <th><Label>Ngày GD</Label></th>
              <td><Value>{Moment.formatDateNew(store.assetItem.tradingDate, "DD-MM-yyyy")}</Value></td>
            </tr>
            <tr>
              <th><Label>Tổng NAV</Label></th>
              <td><Value>{numberUtil.formatNumber(store.assetItem.nav)}</Value></td>
              <th><Label>Thay đổi NAV</Label></th>
              <td><Value>{numberUtil.formatNumber(store.assetItem.navChange)}</Value></td>
            </tr>
            <tr>
              <th><Label>Tổng tài sản</Label></th>
              <td><Value>{numberUtil.formatNumber(store.assetItem.equity)}</Value></td>
              <th><Label>Nợ trên TK 6</Label></th>
              <td><Value>{numberUtil.formatNumber(store.assetItem.loan01)}</Value></td>
            </tr>
            <tr>
              <th><Label>Nợ ứng trước HĐ TP</Label></th>
              <td><Value>{numberUtil.formatNumber(store.assetItem.loan02)}</Value></td>
              <th><Label>Tổng nợ</Label></th>
              <td><Value>{numberUtil.formatNumber(store.assetItem.totalLoan)}</Value></td>
            </tr>
          </tbody>
        </table>
      </>
    )
  })

export default AssetHistory;

const Label = styled.div`
  padding: 1rem;
`
const Value = styled.div`
  padding: 1rem;
`