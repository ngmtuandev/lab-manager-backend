import * as moment from 'moment-timezone';

function getCurrentDate(): string {
  const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');

  return vietnamTime;
}

export default getCurrentDate;
