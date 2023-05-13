//import { makeGetRequest } from 'services/apiClient';

import { makeGetRequest } from 'services/apiClient';

type EventsMetricApi = {
  name: string;
  count: number;
};

export type EventsMetric = {
  name: string;
  count: number;
  prevStep: number;
};

function getPrevData(events: EventsMetricApi[], currentIndex: number) {
  if (currentIndex === 0) {
    return 0;
  }
  return events[currentIndex - 1].count - events[currentIndex].count;
}
export async function getEventsMetrics({
  dappKey,
  fromDate,
  toDate,
}: {
  dappKey: string;
  fromDate: string;
  toDate: string;
}): Promise<EventsMetric[]> {
  const apiEvents = (await makeGetRequest({
    url: 'events',
    params: { startDate: fromDate, endDate: toDate },
    dappKey,
  })) as EventsMetricApi[];

  return apiEvents.map((ev, index) => ({
    ...ev,
    prevStep: getPrevData(apiEvents, index),
  }));
}
