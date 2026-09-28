import type { ApiClient } from './types';
import { liveClient, memoryContentUrl, rabbitPhotoUrl } from './client';

export const api: ApiClient = liveClient;
export { memoryContentUrl };
export { rabbitPhotoUrl };
export type { ApiClient } from './types';