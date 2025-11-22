/**
 * Simple Dependency Injection Container
 * Provides singleton instances of services for better testability
 */
class Container {
  private services: Map<string, any> = new Map();

  /**
   * Register a service in the container
   */
  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  /**
   * Get a service from the container
   */
  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found in container`);
    }
    return service;
  }

  /**
   * Check if service exists
   */
  has(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Clear all services (useful for testing)
   */
  clear(): void {
    this.services.clear();
  }

  /**
   * Get all registered service names
   */
  list(): string[] {
    return Array.from(this.services.keys());
  }
}

// Export singleton instance
export const container = new Container();

// Service identifiers (for type safety)
export const SERVICE_IDENTIFIERS = {
  VOTE_SERVICE: 'VoteService',
  COUNTRY_SERVICE: 'CountryService'
} as const;
