declare module 'vue3-clipboard' {
  export function useClipboard(): {
    toClipboard: (text: string) => Promise<boolean>
  }
}
