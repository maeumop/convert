import { HelperDateCalcType, HelperDateCalc, HelperDatePart } from './types';

class DatePickerHelper {
  public nowDate = new Date();
  public intlFormat = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  public today: number = 0;
  public todayDate: string = '';

  public constructor() {
    this.today = this.nowDate.getDate();
    this.todayDate = this.getDateFormat(this.intlFormat.format(this.nowDate));
  }

  /**
   * YYYY-MM-DD 형태의 포멧으로 반환
   * @param v
   * @returns
   */
  public getDateFormat(v: string | Date) {
    const date: string = v instanceof Date ? this.intlFormat.format(v) : v;

    return date.replace(/\./g, '').split(' ').join('-');
  }

  /**
   * 날짜를 year(YYYY), month, day, week 파트로 나누어 반환
   * @param v
   * @returns
   */
  public getDatePart(v: string | Date): HelperDatePart {
    const date = this.getDate(v);

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      week: date.getDay(),
    };
  }

  /**
   * interval값에 맞춰 날짜를 계산하여 반환
   * @param v
   * @param interval day 단위
   * @param returnType 반환할 형태를선택
   */
  public dateCalc(
    v: string | Date,
    interval: number,
    returnType: HelperDateCalcType = 'string',
  ): HelperDateCalc {
    const time = this.getDate(v).getTime();
    const calc = time + interval * 86400 * 1000;
    let date: HelperDateCalc = new Date(calc);

    if (returnType === 'string') {
      date = this.getDateFormat(date);
    } else if (returnType === 'part') {
      date = this.getDatePart(date);
    }

    return date;
  }

  private getDate(v: string | Date): Date {
    return v instanceof Date ? v : new Date(v);
  }
}

export const useDatePickerHelper = () => new DatePickerHelper();
