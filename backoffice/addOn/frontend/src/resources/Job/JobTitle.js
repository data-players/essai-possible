import React from 'react';

const DataSourceTitle = ({ record }) => {
    return <span>{record ? record['pair:label'] : ''}</span>;
};

export default DataSourceTitle
