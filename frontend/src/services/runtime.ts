export const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';

export function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), ms);
  });
}
