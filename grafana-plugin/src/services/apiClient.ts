import { getBackendSrv } from '@grafana/runtime';
import { API_SERVER } from 'config';

export async function makeGetRequest({
  url,
  params = {},
  dappKey,
}: {
  url: string;
  params: object;
  dappKey: string;
}): Promise<any> {
  return getBackendSrv().get(`${API_SERVER}/${url}`, params, undefined, {
    headers: {
      Authorization: dappKey,
    },
  });
}
