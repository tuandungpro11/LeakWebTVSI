/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import { addDays, format, subDays } from 'date-fns';
import moment from 'moment';

export class Moment {
  static LocalDatetime(value: number | string | Date): number {
    if (typeof value === 'string') {
      if (!/Z$/i.test(value)) value += 'Z';
      const date: Date = new Date(value);
      return date.getTime() / 1000;
    } if (typeof value === 'number') return value / 1000;
    return new Date(-1).getTime() / 1000;
  }

  static getDate(
    _date: number | string,
    format:
      | 'dd/mm/yyyy'
      | 'dd-mm-yyyy'
      | 'yyyy-mm-dd'
      | 'dd thg mm, yyyy'
      | 'dd/mm/yyyy, hh:m_m'
      | string,
    use_utc_0 = true,
  ): string {
    const date = use_utc_0
      ? new Date(this.LocalDatetime(_date) * 1000)
      : new Date(_date);
    const D = date.getDate();
    const M = date.getMonth() + 1;
    const hh = date.getHours();
    const m_m = date.getMinutes();
    const dd = D < 10 ? `0${D}` : D;
    const mm = M < 10 ? `0${M}` : M;
    const yyyy = date.getFullYear();

    // replace
    let result: string = format;
    result = result.replace('D', D.toString());
    result = result.replace('M', D.toString());
    result = result.replace('dd', dd.toString());
    result = result.replace('mm', mm.toString());
    result = result.replace('yyyy', yyyy.toString());
    result = result.replace('hh', hh.toString());
    result = result.replace('m_m', m_m.toString());

    return result;
  }

  static getTime(
    _date: number | string,
    format: 'hh:mm' | 'hh:mm:ss' | string,
    use_utc_0 = true,
  ): string {
    const date = use_utc_0
      ? new Date(this.LocalDatetime(_date) * 1000)
      : new Date(_date);
    /* Time */
    const H = date.getHours();
    const M = date.getMinutes();
    const S = date.getSeconds();
    const hh = H < 10 ? `0${H}` : H;
    const mm = M < 10 ? `0${M}` : M;
    const ss = S < 10 ? `0${S}` : S;

    // replace
    let result: string = format;
    result = result.replace('H', H.toString());
    result = result.replace('M', M.toString());
    result = result.replace('S', S.toString());
    result = result.replace('hh', hh.toString());
    result = result.replace('mm', mm.toString());
    result = result.replace('ss', ss.toString());

    return result;
  }

  static getTimeRemaining(
    _date: number | string,
    use_utc_0 = true,
  ): string {
    const date = use_utc_0
      ? new Date(this.LocalDatetime(_date) * 1000)
      : new Date(_date);
    const timeEnd = date.getTime();
    const now = new Date().getTime();
    const distance = timeEnd - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    return `${days ? `${days} ngày,` : ''} ${hours}h ${minutes}p`;
  }

  static countJoinDate(
    _date: number | string,
    use_utc_0 = true,
  ): string {
    let date: Date = null as any;
    if (!use_utc_0) {
      if (typeof _date === 'string') {
        const date_tmp = new Date(_date);
        date = new Date(
          date_tmp.getFullYear(),
          date_tmp.getMonth(),
          date_tmp.getDate(),
          date_tmp.getHours(),
          date_tmp.getMinutes(),
          date_tmp.getSeconds(),
          date_tmp.getMilliseconds(),
        );
      } else date = new Date(_date);
    } else date = new Date(this.LocalDatetime(_date) * 1000);
    const createdAt = date.getTime();
    const now = Math.floor(Date.now());
    const distance: number = now - createdAt;
    const days: number = Math.floor(distance / (1000 * 60 * 60 * 24));
    if (days < 1) {
      return 'Hôm nay';
    }
    if (days >= 1 && days < 30) {
      return `${days} ngày trước`;
    }
    if (days > 30 && days < 365) {
      return `${Math.floor(days / 30)} tháng trước`;
    }
    if (days >= 365) {
      return `${Math.floor(days / 365)} năm trước`;
    }
    return '';
  }

  /**
   * return format yyyy-MM-dd
   * @param date
   */
  static getDateString(date?: Date): string {
    return date ? format(date, 'yyyy-MM-dd') : '';
  }

  /**
   * return format yyyy-MM-dd
   * @param date
   */
  static getToDay(): Date {
    return new Date();
  }

  /**
   * eturn format yyyy-MM-dd
   * @param date
   * @param day
   */
  static plusDays(date: Date, day: number): Date {
    return addDays(date, day);
  }

  static minusDays(date: Date, day: number): Date {
    return subDays(date, day);
  }

  static parserDateFromSecond(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }

  static parserDateFromMiliSecond(timestamp: number): Date {
    return new Date(timestamp);
  }

  static convert_datetime(timestamp: number) {
    const months_arr = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ];
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = months_arr[date.getMonth()];
    const day = date.getDate();
    // const hours = date.getHours();
    // const minutes = `0${date.getMinutes()}`;
    // const seconds = `0${date.getSeconds()}`;
    const convdataTime = `${year}-${month}-${day}`;
    return convdataTime;
  }

  static formatDate(utcTime: Date | number) {
    const timestamp = new Date(utcTime).getTime();
    const months_arr = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ];
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = months_arr[date.getMonth()];
    const day = date.getDate();
    // const hours = date.getHours();
    // const minutes = `0${date.getMinutes()}`;
    // const seconds = `0${date.getSeconds()}`;
    const convdataTime = `${day}/${month}/${year}`;
    return convdataTime;
  }

  static formatDateNew(date: Date, format?: string) {
    if(date) {
      return moment(date).format(format ?? 'DD/MM/yyyy');
    }
  }

  static formatMonth(utcTime: Date | number) {
    const timestamp = new Date(utcTime).getTime();
    const months_arr = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ];
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = months_arr[date.getMonth()];
    const convdataTime = `${month}/${year}`;
    return convdataTime;
  }

  static formatYearOnly(utcTime: Date | number) {
    const timestamp = new Date(utcTime).getTime();
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const convdataTime = year;
    return convdataTime;
  }

  static formatStringToDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    const m = Number(month) - 1;
    const date = new Date(+year, m - 1, +day);
    return date;
  }

  // static formatStringToDateCustom = (dateString: string) => {
  //   console.log(new Date(dateString));
  //   const [day, month, year] = dateString.split('/');
  //   const m = Number(month);
  //   const date = new Date(+year, m - 1, +day);
  //   return date;
  // }

  static formatDatFullMonth(utcTime: Date | number) {
    const timestamp = new Date(utcTime).getTime();
    const months_arr = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = months_arr[date.getMonth()];
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    // const hours = date.getHours();
    // const minutes = `0${date.getMinutes()}`;
    // const seconds = `0${date.getSeconds()}`;
    const convdataTime = `${day}/${month}/${year}`;
    return convdataTime;
  }

  static getTimeIn24HFormat(dateTime: string) {
    const timeRaw = dateTime.substring(10);
    const timeSplit = timeRaw.split(' ');
    let hour = timeSplit[0].split(':')[0];
    const minute = timeSplit[0].split(':')[1];
    const second = timeSplit[0].split(':')[2];
    let hourInt = parseInt(hour, 10);
    if (timeSplit[1] === 'PM') {
      hourInt += 12;
    }
    hour = hourInt < 10 ? `0${hourInt.toString()}` : hourInt.toString();
    return `${hour}:${minute}:${second}`;
  }
  static dateToTime(date) {
    return moment(date).format("hh:mm:ss a");
  }
  static setTimeHHmmss(time:string){
    const t = time.split(":");
    const hour = t[0];
    const min = t[1];
    const sec = t[2] ? t[2] : "00";

    const date = new Date();
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(min));
    date.setSeconds(parseInt(sec));
    return date;
  }
}
