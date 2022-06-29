export default class PaginatedList {    

    constructor(rows, start, end, totalPages, currentPage, limitRows, maxRows) {
        this.rows = rows;
        this.start = start;
        this.end = end;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.limitRows = limitRows;
        this.maxRows = maxRows;
    }
}
