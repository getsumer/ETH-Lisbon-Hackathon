import React from 'react';
import { Field, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from '../datasource';
import { AllTransactionStatus, MyDataSourceOptions, MyQuery } from '../types';
import { AggregationField, ProcessedTransactionStatus, QueryType, TimeSeriesInterval, TransactionStatus } from 'enums';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const handleChangeQueryType = (selectValue: SelectableValue<QueryType>) => {
    if (selectValue.value) {
      onChange({ ...query, queryType: selectValue.value });
      onRunQuery();
    }
  };
  const handleChangeTimeSeriesInterval = (selectValue: SelectableValue<TimeSeriesInterval>) => {
    if (selectValue.value) {
      onChange({ ...query, timeSeriesInterval: selectValue.value });
      onRunQuery();
    }
  };

  const handleChangeAggregationField = (selectValue: SelectableValue<AggregationField>) => {
    if (selectValue.value) {
      onChange({ ...query, aggregationField: selectValue.value });
    }
  };
  const handleChangeTransactionStatus = (selectValue: SelectableValue<AllTransactionStatus>) => {
    if (selectValue.value) {
      onChange({ ...query, transactionStatus: selectValue.value });
      onRunQuery();
    }
  };

  const { queryType, timeSeriesInterval, aggregationField, transactionStatus } = query;
  function renderQueryTypeField() {
    return (
      <Field label={'Type'} description={'Select waht kind of data you want to display'}>
        <Select
          options={[
            {
              label: 'Total Count',
              value: QueryType.TotalCount,
              description: 'Total amount of transactions for the selected date range',
            },
            {
              label: 'Transactions Evolution',
              value: QueryType.TimeSeries,
              description: 'Total amount of transactions aggregated by time',
            },
            {
              label: 'Web2 Events',
              value: QueryType.Events,
              description: 'Total amount of each event',
            },
          ]}
          onChange={handleChangeQueryType}
          value={queryType}
          allowCustomValue
        />
      </Field>
    );
  }
  function renderIntervalField() {
    return (
      <Field label={'Interval'}>
        <Select
          options={[
            {
              label: 'Daily',
              value: TimeSeriesInterval.Daily,
              description: 'Aggregate data by date',
            },
          ]}
          onChange={handleChangeTimeSeriesInterval}
          value={timeSeriesInterval}
          allowCustomValue
        />
      </Field>
    );
  }
  function renderAggregateField() {
    return (
      <Field label={'Aggregate'} description={'Aggregate data by that field in each x axis value'}>
        <Select
          options={[
            {
              label: 'Status',
              value: AggregationField.Status,
            },
          ]}
          onChange={handleChangeAggregationField}
          value={aggregationField}
          allowCustomValue
        />
      </Field>
    );
  }

  function renderTransactionStatusField() {
    return (
      <Field label={'Transaction Status'} description={'Filter by transaction Status'}>
        <Select
          options={[
            {
              label: 'Not processed',
              value: TransactionStatus.NotProcessed,
              description: 'The transaction was never processed due to an error',
            },
            {
              label: 'Success',
              value: ProcessedTransactionStatus.Successful,
            },
            {
              label: 'Pending',
              value: ProcessedTransactionStatus.Pending,
            },
            {
              label: 'Fail',
              value: ProcessedTransactionStatus.Failed,
            },
          ]}
          onChange={handleChangeTransactionStatus}
          value={transactionStatus as AllTransactionStatus}
          allowCustomValue
        />
      </Field>
    );
  }

  function renderFormContent() {
    switch (query.queryType) {
      case QueryType.TotalCount:
        return (
          <>
            {renderQueryTypeField()}
            {renderAggregateField()}
            {renderTransactionStatusField()}
          </>
        );
      case QueryType.TimeSeries:
        return (
          <>
            {renderQueryTypeField()}
            {renderIntervalField()}
            {renderAggregateField()}
          </>
        );
      case QueryType.Events:
        return <>{renderQueryTypeField()}</>;
      default:
        return <>{renderQueryTypeField()}</>;
    }
  }
  return <div className="gf-form">{renderFormContent()}</div>;
}
