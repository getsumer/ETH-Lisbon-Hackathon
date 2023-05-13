import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
//import { getBackendSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions } from './types';
import { QueryType } from 'enums';
import { getTransactionsEvolutionMetrics } from 'api/getTransactionsEvolutionMetrics';
import { mapTransactionsEvolutionMetrics } from 'mappers/mapTransactionsEvolutionMetrics';
import { getTransactionsTotalMetrics } from 'api/getTransactionsTotalMetrics';
import { mapTransactionsTotalMetrics } from 'mappers/mapTransactionsTotalMetrics';
import { fToApiDate } from 'utils/formatTime';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  _dappKey = '';
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this._dappKey = instanceSettings.jsonData.dappKey;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const fromDateMs = range!.from.valueOf();
    const toDateMs = range!.to.valueOf();
    const fromDate = fToApiDate(fromDateMs);
    const toDate = fToApiDate(toDateMs);

    const promises = options.targets.map((query) => {
      switch (query.queryType) {
        case QueryType.TimeSeries:
          return getTransactionsEvolutionMetrics({ dappKey: this._dappKey, fromDate, toDate }).then((response) =>
            mapTransactionsEvolutionMetrics({ response, query })
          );
        case QueryType.TotalCount:
          if (query.transactionStatus) {
            return getTransactionsTotalMetrics({
              dappKey: this._dappKey,
              status: query.transactionStatus,
              fromDate,
              toDate,
            }).then((response) => mapTransactionsTotalMetrics({ response, query }));
          }
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
