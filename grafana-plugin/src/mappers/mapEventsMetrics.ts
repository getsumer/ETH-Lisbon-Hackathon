import { FieldType, MutableDataFrame } from '@grafana/data';
import { MyQuery } from '../types';
import { EventsMetric } from 'api/getEventsMetrics';

export function mapEventsMetrics({ response, query }: { response: EventsMetric[]; query: MyQuery }): MutableDataFrame {
  const frame = new MutableDataFrame({
    refId: query.refId,
    fields: [
      { name: 'Name', type: FieldType.string },
      { name: 'Users', type: FieldType.number },
      { name: 'Drop Off', type: FieldType.number },
    ],
  });
  response.forEach((event) => {
    frame.appendRow([event.name, event.count, event.prevStep]);
  });

  return frame;
}
