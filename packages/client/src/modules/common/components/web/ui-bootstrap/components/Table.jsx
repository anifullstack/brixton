import React from 'react';
import PropTypes from 'prop-types';
import { Table as RSTable } from 'reactstrap';
import { Card } from '../components';

const renderHead = columns => {
  return columns.map(({ title, dataIndex, renderHeader, key }) => {
    return (
      <th
        key={key}
        className={`w-${columns.length === 2 ? 100 : 100 / columns.length}`}
        style={{ height: '60px', letterSpacing: '0.025rem' }}
      >
        {renderHeader ? renderHeader(title, dataIndex) : title}
      </th>
    );
  });
};

const renderBody = (columns, dataSource) => {
  return dataSource.map(entry => {
    return <tr key={entry.id}>{renderData(columns, entry)}</tr>;
  });
};

const renderData = (columns, entry) => {
  return columns.map(({ dataIndex, render, key }) => {
    return <td key={key}>{render ? render(entry[dataIndex], entry) : entry[dataIndex]}</td>;
  });
};

const Table = ({ dataSource, columns, ...props }) => {
  return (
    <Card style={{ borderRadius: '15px', padding: '0px 15px' }}>
      <RSTable className="table table-striped table-hover" style={{ borderRadius: '15px' }} {...props}>
        <thead>
          <tr>{renderHead(columns)}</tr>
        </thead>
        <tbody>{renderBody(columns, dataSource)}</tbody>
      </RSTable>
    </Card>
  );
};

Table.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array
};

export default Table;
