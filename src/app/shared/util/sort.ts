export function sortByDesc(a: any, b: any, prop: any): any {
  if (a[prop] < b[prop]) return 1;
  if (a[prop] > b[prop]) return -1;
  return 0;
}

export function sortByAsc(a: any, b: any, prop: any): any {
  if (a[prop] > b[prop]) return 1;
  if (a[prop] < b[prop]) return -1;
  return 0;
}
