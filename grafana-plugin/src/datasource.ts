import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
//import { getBackendSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions } from './types';
import { QueryType } from 'enums';
import { getTransactionsEvolutionMetrics } from 'api/getTransactionsEvolutionMetrics';
import { mapTransactionsEvolutionMetrics } from 'mappers/mapTransactionsEvolutionMetrics';
import { getTransactionsTotalMetrics } from 'api/getTransactionsTotalMetrics';
import { mapTransactionsTotalMetrics } from 'mappers/mapTransactionsTotalMetrics';

import { mapEventsMetrics } from 'mappers/mapEventsMetrics';
import { getEventsMetrics } from 'api/getEventsMetrics';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  _dappKey = '';
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this._dappKey = instanceSettings.jsonData.dappKey;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const fromDate = range!.from.valueOf().toString();
    const toDate = range!.to.valueOf().toString();

    const promises = options.targets.map((query) => {
      switch (query.queryType) {
        case QueryType.TimeSeries:
          if (query.timeSeriesInterval && query.aggregationField) {
            return getTransactionsEvolutionMetrics({
              dappKey: this._dappKey,
              fromDate,
              toDate,
              interval: query.timeSeriesInterval,
              aggregation: query.aggregationField,
            }).then((response) => mapTransactionsEvolutionMetrics({ response, query }));
          }

        case QueryType.TotalCount:
          if (query.transactionStatus) {
            return getTransactionsTotalMetrics({
              dappKey: this._dappKey,
              status: query.transactionStatus,
              fromDate,
              toDate,
            }).then((response) => mapTransactionsTotalMetrics({ response, query }));
          }
        case QueryType.Events:
          return getEventsMetrics({
            dappKey: this._dappKey,
            fromDate,
            toDate,
          }).then((response) => mapEventsMetrics({ response, query }));
        default:
          return;
      }
    });
    return Promise.all(promises).then((data) => ({ data }));
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
