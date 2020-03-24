import { ES } from './ecmascript.mjs';

export const Absolute = ES.GetIntrinsic('%Temporal.Absolute%');
export const TimeZone = ES.GetIntrinsic('%Temporal.TimeZone%');
export const DateTime = ES.GetIntrinsic('%Temporal.DateTime%');
export const Date = ES.GetIntrinsic('%Temporal.Date%');
export const YearMonth = ES.GetIntrinsic('%Temporal.YearMonth%');
export const MonthDay = ES.GetIntrinsic('%Temporal.MonthDay%');
export const Time = ES.GetIntrinsic('%Temporal.Time%');
export const Duration = ES.GetIntrinsic('%Temporal.Duration%');

export { now } from './now.mjs';
