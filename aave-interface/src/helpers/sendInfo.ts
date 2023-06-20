import mixpanel from 'mixpanel-browser';

export const sendInfo = async (name: string) => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = window.ethereum as any;
      const address = provider.selectedAddress;
      mixpanel.track(name, {
        name: name,
        fromAddress: address,
      });
    } catch (e) {
      console.warn(e);
    }
  }
};
