import CacheService from './CacheService';

class AdvancedCacheService {
  constructor() {
    this.priorityLevels = {
      HIGH: 300000,    // 5 min
      MEDIUM: 900000,  // 15 min
      LOW: 1800000     // 30 min
    };
    this.maxSize = 100;
    this.metrics = new Map();
  }

  setCacheStrategy(key, data, priority = 'MEDIUM') {
    const expirationTime = this.priorityLevels[priority];
    const metadata = {
      accessCount: 0,
      lastAccess: Date.now(),
      priority
    };

    this.metrics.set(key, metadata);
    CacheService.set(key, {
      data,
      metadata,
      expirationTime: Date.now() + expirationTime
    });

    this.manageCacheSize();
  }

  getCacheData(key) {
    const cached = CacheService.get(key);
    if (!cached) return null;

    const metadata = this.metrics.get(key);
    if (metadata) {
      metadata.accessCount++;
      metadata.lastAccess = Date.now();
      this.metrics.set(key, metadata);
    }

    return cached.data;
  }

  manageCacheSize() {
    if (this.metrics.size <= this.maxSize) return;

    const sortedEntries = [...this.metrics.entries()]
      .sort((a, b) => this.calculateScore(a[1]) - this.calculateScore(b[1]));

    while (this.metrics.size > this.maxSize) {
      const [keyToRemove] = sortedEntries.shift();
      this.metrics.delete(keyToRemove);
      CacheService.invalidate(keyToRemove);
    }
  }

  calculateScore(metadata) {
    const timeFactor = (Date.now() - metadata.lastAccess) / 3600000; // hours
    const accessFactor = Math.log(metadata.accessCount + 1);
    const priorityFactor = {
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1
    }[metadata.priority];

    return (timeFactor * 0.4) - (accessFactor * 0.4) - (priorityFactor * 0.2);
  }

  preloadData(dataList) {
    dataList.forEach(({ key, data, priority }) => {
      this.setCacheStrategy(key, data, priority);
    });
  }

  getMetrics() {
    const metrics = {};
    this.metrics.forEach((value, key) => {
      metrics[key] = {
        ...value,
        size: JSON.stringify(CacheService.get(key)?.data).length
      };
    });
    return metrics;
  }

  optimizeCache() {
    const metrics = this.getMetrics();
    const totalSize = Object.values(metrics)
      .reduce((sum, m) => sum + m.size, 0);

    if (totalSize > 5 * 1024 * 1024) { // 5MB
      this.maxSize = Math.floor(this.maxSize * 0.8);
      this.manageCacheSize();
    }
  }
}

export default new AdvancedCacheService();