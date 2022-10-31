/* eslint-disable no-mixed-operators */
/* eslint-disable block-scoped-var */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable radix */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable no-cond-assign */
/* eslint-disable camelcase */
class NumberUtil {
  public formatCurrency(number: number) {
    try {
      return this.formatChangeValue(number);
    } catch (e) {
      return number;
    }
  }

  public number_format(number: any, decimals?: any, thousands_sep?: any) {
    let n = number;
    const c = isNaN((decimals = Math.abs(decimals))) ? 2 : decimals;
    const t = thousands_sep == undefined ? ',' : thousands_sep;
    const s = n < 0 ? '-' : '';
    const i = `${parseInt((n = Math.abs(+n || 0).toFixed(c)))}`;
    var j: number = (j = i.length) > 3 ? j % 3 : 0;

    return `${s
      + (j ? i.substr(0, j) + t : '')
      + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`)
    } iXu`;
  }

  public formatNumber(number: any, decimals?: any, thousands_sep?: any) {
    let n = number;
    const c = isNaN((decimals = Math.abs(decimals))) ? 2 : decimals;
    // const d = dec_point == undefined ? '.' : dec_point;
    const t = thousands_sep == undefined ? ',' : thousands_sep;
    const s = n < 0 ? '-' : '';
    const i = `${parseInt((n = Math.abs(+n || 0).toFixed(c)))}`;
    var j: number = (j = i.length) > 3 ? j % 3 : 0;
    if (
      s
      + (j ? i.substr(0, j) + t : '')
      + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`)
      !== '0'
    ) {
      return (
        s
        + (j ? i.substr(0, j) + t : '')
        + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`)
      );
    }
    return '-';
  }

  public formatNumber2(number: any, decimals?: any, thousands_sep?: any) {
    let n = number;
    const c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
    // const d = dec_point == undefined ? '.' : dec_point;
    const t = thousands_sep == undefined ? ',' : thousands_sep;
    const s = n < 0 ? '-' : '';
    const i = `${parseInt(n = Math.abs(+n || 0).toFixed(c))}`;
    var j: number = (j = i.length) > 3 ? j % 3 : 0;
    if (s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`) !== '0') {
      return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`);
    } return '';
  }

  public formatNumber3(number: any, decimals?: any, thousands_sep?: any) {
    let n = number;
    const c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
    // const d = dec_point == undefined ? '.' : dec_point;
    const t = thousands_sep == undefined ? ',' : thousands_sep;
    const s = n < 0 ? '-' : '';
    const i = `${parseInt(n = Math.abs(+n || 0).toFixed(c))}`;
    var j: number = (j = i.length) > 3 ? j % 3 : 0;
    if (s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`) !== '0') {
      return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`);
    } return '0';
  }

  public formatIndexNumber(
    number: any,
    unit?: number,
    decimals?: any,
    thousands_sep?: any,
  ) {
    if (unit) {
      number /= unit;
    }
    if (number) {
      number = number.toString();
    } else return '--';
    let n = number.split('.')[0];
    const c = isNaN((decimals = Math.abs(decimals))) ? 2 : decimals;
    const t = thousands_sep == undefined ? ',' : thousands_sep;
    const s = number < 0 ? '-' : '';
    const i = `${parseInt((n = Math.abs(+n || 0).toFixed(c)))}`;
    var j: number = (j = i.length) > 3 ? j % 3 : 0;
    if (number === '0') {
      return '-';
    }
    if (number.split('.')[1]) {
      return `${s
        + (j ? i.substr(0, j) + t : '')
        + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`)
      }.${number.split('.')[1].slice(0, 2)}`;
    }
    return (
      s
      + (j ? i.substr(0, j) + t : '')
      + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`)
    );
  }

  public formatIndexNumberWith3Decimals(
    number: any,
    unit?: number,
    decimals?: any,
    thousands_sep?: any,
  ) {
    if (unit) {
      number /= unit;
    }
    if (number) {
      number = number.toString();
    } else return '--';
    let n = number.split('.')[0];
    const c = isNaN((decimals = Math.abs(decimals))) ? 3 : decimals;
    const t = thousands_sep == undefined ? ',' : thousands_sep;
    const s = number < 0 ? '-' : '';
    const i = `${parseInt((n = Math.abs(+n || 0).toFixed(c)))}`;
    var j: number = (j = i.length) > 3 ? j % 3 : 0;
    if (number === '0') {
      return '-';
    }
    if (number.split('.')[1]) {
      return `${s
        + (j ? i.substr(0, j) + t : '')
        + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`)
      }.${number.split('.')[1].slice(0, 3)}`;
    }
    return (
      s
      + (j ? i.substr(0, j) + t : '')
      + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`)
    );
  }

  public formatChangeValue(
    number: any,
    isZero?: boolean,
    decimals?: any,
    thousands_sep?: any,
  ) {
    number = parseFloat(number).toFixed(2);
    if (number) {
      number = number.toString();
    } else if (isZero) {
      return '0';
    } else return '--';
    let value = '';
    if (number.split('.')[1]) {
      let decimals = number.split('.')[1].slice(0, 2);
      let prf = number.split('.')[0];
      var n = prf;
      var c = isNaN((decimals = Math.abs(decimals))) ? 2 : decimals;
      var t = thousands_sep == undefined ? ',' : thousands_sep;
      var s = number < 0 ? '-' : '';
      var i = `${parseInt((n = Math.abs(+n || 0).toFixed(c)))}`;
      var j: number = (j = i.length) > 3 ? j % 3 : 0;

      prf = s
        + (j ? i.substr(0, j) + t : '')
        + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`);
      value = `${prf}.${decimals}`;
    } else {
      let prf = number.split('.')[0];
      var n = prf;
      var c = isNaN((decimals = Math.abs(decimals))) ? 2 : decimals;
      var t = thousands_sep == undefined ? ',' : thousands_sep;
      var s = n < 0 ? '-' : '';
      var i = `${parseInt((n = Math.abs(+n || 0).toFixed(c)))}`;
      var j: number = (j = i.length) > 3 ? j % 3 : 0;

      prf = s
        + (j ? i.substr(0, j) + t : '')
        + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`);
      value = prf;
    }
    return value;
  }

  public formatDate(d: any) {
    if (d.length == 19) {
      return d.substr(0, 10);
    }

    return '';
  }

  public secondsToHms(d: any) {
    d = Number(d);
    let h: any = Math.floor(d / 3600);
    let m: any = Math.floor((d % 3600) / 60);
    let s: any = Math.floor((d % 3600) % 60);
    if (h < 10) {
      h = `0${h}`;
    }
    if (m < 10) {
      m = `0${m}`;
    }
    if (s < 10) {
      s = `0${s}`;
    }
    if (h >= 0 && m >= 0 && s >= 0) {
      return `${h}:${m}:${s}`;
    }

    return '00:00:00';
  }

  public secondsToMs(d: any) {
    d = Number(d);
    let h: any = Math.floor(d / 3600);
    let m: any = Math.floor((d % 3600) / 60);
    let s: any = Math.floor((d % 3600) % 60);
    if (h < 10) {
      h = `0${h}`;
    }
    if (m < 10) {
      m = `0${m}`;
    }
    if (s < 10) {
      s = `0${s}`;
    }
    if (m >= 0 && s >= 0) {
      return `${m}:${s}`;
    }

    return '00:00';
  }

  public htmsToSeconds(time: string) {
    const data = time.split(':');
    return (
      parseInt(data[2]) + parseInt(data[1]) * 60 + parseInt(data[0]) * 60 * 60
    );
  }
}

export const numberUtil = new NumberUtil();
