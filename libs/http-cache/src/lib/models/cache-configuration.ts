export interface CacheConfiguration {
  /**
   * Miliseconds
   */
  expiresIn?: number;

  /**
   * Force refresh cached request
   */
  refresh?: boolean;
}
