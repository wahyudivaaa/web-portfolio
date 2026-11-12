export {};

declare global {
  interface Window {
    /** Set by RealGlass; called by the nav lens tracker in NavigationEffects. */
    __glassTrackHole?: () => void;
  }
}
