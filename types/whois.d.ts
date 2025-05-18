declare module 'whois' {
  export interface WhoisOptions {
    server?: string
    follow?: number
    timeout?: number
    verbose?: boolean
  }
  export function lookup(domain: string, options?: WhoisOptions, callback?: (err: Error | null, data: string) => void): void
  export default {
    lookup
  }
} 