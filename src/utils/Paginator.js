import Pagination from "./Pagination";

/**
 * Paginator Helper for Pagination
 * @author felipe
 * @since 1.1
 * @version 1.0
 */
export default class Paginator {


    /**
     * Constructor
     */
    constructor(limitRows, currentPage, maxRows) {
        this.pagination = new Pagination();
        this.limitRows = limitRows
        this.currentPage = currentPage        
        this.maxRows = maxRows
        this.totalPages = this.pagination.discoverTotalPages(limitRows, maxRows);        
    }


    /**
     * @return the limitRows
     */
    getLimitRows() {
        return this.limitRows;
    }


    /**
     * @return the currentPage
     */
    getCurrentPage() {
        return this.currentPage;
    }


    /**
     * @return the totalPages
     */
    getTotalPages() {
        return this.totalPages;
    }


    /**
     * @return the maxRows
     */
    getMaxRows() {
        return this.maxRows;
    }

    /**
     * @return the Start Range
     */
    getStart() {
        return this.pagination.discoverStartRange(this.limitRows, this.currentPage, this.totalPages);
    }

    /**
     * @return the End Range
     */
    getEnd() {
        return this.pagination.discoverEndRange(this.limitRows, this.currentPage, this.totalPages);
    }


}
