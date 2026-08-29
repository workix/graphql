export default class PaginatedList {
  [key: string]: any;
  start: number;
  end: number;
  totalPages: number;
  currentPage: number;
  limitRows: number;
  maxRows?: number;

  constructor(
    name: string,
    rows: any[],
    start: number,
    end: number,
    totalPages: number,
    currentPage: number,
    limitRows: number,
    maxRows?: number
  ) {
    this[name] = rows;
    this.start = start;
    this.end = end;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.limitRows = limitRows;
    this.maxRows = maxRows;
  }
}
