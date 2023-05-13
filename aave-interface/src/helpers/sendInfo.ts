export const sendInfo = async (name: string) => {
  const url = 'http://54.171.6.132:3001/events';

  if (typeof window.ethereum !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider = window.ethereum as any;
      const address = provider.selectedAddress;

      const data = {
        name: name,
        fromAddress: address,
      };
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: '8c1b18a8-17df-4d6b-871d-ce1f7bac9da7',
        },

        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn(e);
    }
  }
};
