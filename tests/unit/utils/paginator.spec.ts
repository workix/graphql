import Pagination from '../../../src/utils/Pagination';
import Paginator from '../../../src/utils/Paginator';
import PaginatedList from '../../../src/utils/PaginatedList';

describe('Utils - Pagination, Paginator & PaginatedList', () => {
  describe('Pagination Class', () => {
    let pagination: Pagination;

    beforeEach(() => {
      pagination = new Pagination();
    });

    it('should calculate total pages correctly', () => {
      expect(pagination.discoverTotalPages(10, 25)).toBe(3);
      expect(pagination.discoverTotalPages(10, 20)).toBe(2);
    });

    it('should calculate max rows correctly', () => {
      expect(pagination.discoverMaxRows(10, 5)).toBe(50);
    });

    it('should calculate start range correctly', () => {
      expect(pagination.discoverStartRange(10, 1, 3)).toBe(1);
      expect(pagination.discoverStartRange(10, 2, 3)).toBe(11);
    });

    it('should throw error if currentPage < 1 in discoverStartRange', () => {
      expect(() => pagination.discoverStartRange(10, 0, 3)).toThrow('Current Page Less than 1');
    });

    it('should calculate end range correctly', () => {
      expect(pagination.discoverEndRange(10, 1, 3)).toBe(10);
      expect(pagination.discoverEndRange(10, 2, 3)).toBe(20);
    });
  });

  describe('Paginator Class', () => {
    it('should initialize and provide correct getters', () => {
      const paginator = new Paginator(10, 2, 25);

      expect(paginator.getLimitRows()).toBe(10);
      expect(paginator.getCurrentPage()).toBe(2);
      expect(paginator.getMaxRows()).toBe(25);
      expect(paginator.getTotalPages()).toBe(3);
      expect(paginator.getStart()).toBe(11);
      expect(paginator.getEnd()).toBe(20);
    });
  });

  describe('PaginatedList Class', () => {
    it('should construct paginated list with dynamic resource name', () => {
      const rows = [{ id: 1 }, { id: 2 }];
      const paginatedList = new PaginatedList('users', rows, 1, 10, 1, 1, 10, 2);

      expect(paginatedList['users']).toEqual(rows);
      expect(paginatedList.start).toBe(1);
      expect(paginatedList.end).toBe(10);
      expect(paginatedList.totalPages).toBe(1);
      expect(paginatedList.currentPage).toBe(1);
      expect(paginatedList.limitRows).toBe(10);
      expect(paginatedList.maxRows).toBe(2);
    });
  });
});
