import { webcrypto } from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
if (!(globalThis as any).crypto) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  (globalThis as any).crypto = webcrypto as any;
}
