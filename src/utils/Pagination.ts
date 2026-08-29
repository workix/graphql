/**
 * Pagination
 * 
 * @author felipe
 * @version 1.0
 * @since 1.0
 */
export default class Pagination {

    /**
     * Discover Total Pages
     * 
     * @param limitRows
     *            Limit of Rows
     * @param maxRows
     *            Max Rows in Table
     * @return number of Pages between Limit and Max Rows
     */
    discoverTotalPages(limitRows, maxRows) {
        const result = ( maxRows / limitRows);
	    return Math.ceil(result);
    }

    /**
     * Discover Max Rows between Limit and Total Pages
     * 
     * @param limitRows
     *            Limit of Rows
     * @param totalPages
     *            Number of Total Pages
     * @return number of Rows between Limit and Total Pages
     */
    discoverMaxRows(limitRows, totalPages) {

	return (totalPages * limitRows);
    }

    /**
     * Discover Start Range between Total Pages and Limit
     * 
     * @param limitRows
     *            Limit of Rows
     * @param currentPage
     *            Current Page
     * @param totalPages
     *            Number of Total Pages
     * @return start Point for Pagination
     * @throws Error
     *             if CurrentPage Minor Than One
     */
    discoverStartRange(limitRows, currentPage, totalPages){

	if (currentPage < 1) throw new Error("Current Page Less than 1");

	return (limitRows * currentPage) - limitRows + 1;

    }

    /**
     * Discover End Range between Total Pages and Limit
     * 
     * @param limitRows
     *            Limit of Rows
     * @param currentPage
     *            Current Page
     * @param totalPages
     *            Number of Total Pages
     * @return end Point for Pagination
     */
    discoverEndRange(limitRows, currentPage, totalPages) {
        const startRange = this.discoverStartRange(limitRows, currentPage, totalPages);

	return startRange + limitRows - (1);

    }

}
