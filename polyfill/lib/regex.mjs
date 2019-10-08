export const yearmonth = /(\d{4}|[+-]\d{6})-(\d{2})/;
export const monthday = /(\d{2})-(\d{2})/;
export const date = new RegExp(`${yearmonth.source}${/-(\d{2})/.source}`);

const basetim = /(\d{2}):(\d{2})/;
const seconds = /(?:(\d{2})(?:\.(\d{3})(?: (\d{3})(?:(\d{3}))?)?)?)?/;
export const time = new RegExp(`${basetim}${seconds}`);

export const datetime = new RegExp(`${date.source}T${time.source}`);

export const offset = /([+-][01]?[0-9]):?([0-5][0-9])/;

export const timezone = /([+-][0-1]?[0-9]:?[0-5][0-9]|\[[^]+\])/;

export const duration = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/;
