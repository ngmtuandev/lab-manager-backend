import * as moment from 'moment-timezone';

function getCurrentTime() {
  const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm');
  return vietnamTime;
}

export default getCurrentTime;
