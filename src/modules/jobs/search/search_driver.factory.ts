import { JobSearchDriver } from './types';
import { ElasticsearchSearchDriver } from './elasticsearch_search.driver';
import { PostgresSearchDriver } from './postgres_search.driver';
import { AdaptiveSearchDriver } from './adaptive_search.driver';

export class SearchDriverFactory {
  private static instance: JobSearchDriver | null = null;

  static getDriver(): JobSearchDriver {
    if (this.instance) {
      return this.instance;
    }

    const driverType = process.env.SEARCH_DRIVER || process.env.SEARCH_ENGINE || 'adaptive';

    if (driverType === 'elasticsearch' || driverType === 'opensearch') {
      this.instance = new ElasticsearchSearchDriver();
    } else if (driverType === 'postgres' && process.env.NODE_ENV === 'production') {
      this.instance = new PostgresSearchDriver();
    } else {
      this.instance = new AdaptiveSearchDriver();
    }

    return this.instance;
  }

  static setDriver(driver: JobSearchDriver | null) {
    this.instance = driver;
  }
}
