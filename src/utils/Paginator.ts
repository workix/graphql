import Pagination from "./Pagination";

/**
 * Paginator Helper for Pagination
 * @author felipe
 * @since 1.1
 * @version 1.0
 */
export default class Paginator {
  pagination: Pagination;
  limitRows: number;
  currentPage: number;
  maxRows: number;
  totalPages: number;

  /**
   * Constructor
   */
  constructor(limitRows: number, currentPage: number, maxRows: number) {
    this.pagination = new Pagination();
    this.limitRows = limitRows;
    this.currentPage = currentPage;
    this.maxRows = maxRows;
    this.totalPages = this.pagination.discoverTotalPages(limitRows, maxRows);
  }

  /**
   * @return the limitRows
   */
  getLimitRows(): number {
    return this.limitRows;
  }

  /**
   * @return the currentPage
   */
  getCurrentPage(): number {
    return this.currentPage;
  }

  /**
   * @return the totalPages
   */
  getTotalPages(): number {
    return this.totalPages;
  }

  /**
   * @return the maxRows
   */
  getMaxRows(): number {
    return this.maxRows;
  }

  /**
   * @return the Start Range
   */
  getStart(): number {
    return this.pagination.discoverStartRange(
      this.limitRows,
      this.currentPage,
      this.totalPages
    );
  }

  /**
   * @return the End Range
   */
  getEnd(): number {
    return this.pagination.discoverEndRange(
      this.limitRows,
      this.currentPage,
      this.totalPages
    );
  }
}
