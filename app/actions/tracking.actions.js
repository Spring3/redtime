export const TRACKING_START = 'TRACKING_START';
export const TRACKING_STOP = 'TRACKING_STOP';
export const TRACKING_PAUSE = 'TRACKING_PAUSE';
export const TRACKING_CONTINUE = 'TRACKING_CONTINUE';
export const TRACKING_RESET = 'TRACKING_RESET';

const trackingStart = issue => ({ type: TRACKING_START, data: { issue } });
const trackingStop = duration => ({ type: TRACKING_STOP, data: { duration } });
const trackingPause = duration => ({ type: TRACKING_PAUSE, data: { duration } });
const trackingContinue = () => ({ type: TRACKING_CONTINUE });
const trackingReset = () => ({ type: TRACKING_RESET });

export default {
  trackingStart,
  trackingStop,
  trackingPause,
  trackingContinue,
  trackingReset
};
