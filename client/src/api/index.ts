import type { ApiClient } from './types';
import { liveClient, memoryContentUrl } from './client';

export const api: ApiClient = liveClient;
export { memoryContentUrl };
export type { ApiClient } from './types';