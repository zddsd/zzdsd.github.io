export interface WhoisServer {
  tld: string;
  server: string;
  lastUpdated: number;
}

export interface CrawlerConfig {
  baseUrl: string;
  outputPath: string;
  batchSize: number;
  retryCount: number;
  retryDelay: number;
  requestTimeout: number;
  testMode?: boolean;
} 