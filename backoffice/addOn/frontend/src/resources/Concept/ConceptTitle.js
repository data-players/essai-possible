import React from 'react';

const ConceptTitle = ({ record }) => {
  return <span>{record ? record['pair:label'] : ''}</span>;
};

export default ConceptTitle;
