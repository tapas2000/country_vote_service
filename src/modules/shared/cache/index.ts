/**
 * Cache Manager for storing frequently accessed data
 * Simple in-memory cache with TTL support
 */
class CacheManager {
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  /**
   * Set a value in cache with optional TTL (in seconds)
   */
  set(key: string, value: any, ttl: number = 300): void {
    const expiry = Date.now() + (ttl * 1000);
    this.cache.set(key, { value, expiry });
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get or set pattern - fetch from cache or execute function and cache result
   */
  async getOrSet<T>(
    key: string, 
    fn: () => Promise<T>, 
    ttl: number = 300
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fn();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    // Clean expired items first
    for (const [key, item] of this.cache.entries()) {
      if (Date.now() > item.expiry) {
        this.cache.delete(key);
      }
    }

    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const cache = new CacheManager();
