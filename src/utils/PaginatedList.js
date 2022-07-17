export default class PaginatedList {    

    constructor(name, rows, start, end, totalPages, currentPage, limitRows, maxRows) {
        this[name] = rows;
        this.start = start;
        this.end = end;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.limitRows = limitRows;
        this.maxRows = maxRows;
    }
}
