import React from 'react';
import { Badge } from 'react-bootstrap';

const FilterTags = ({ searchQuery, onRemoveFilter }) => {
    const tags = [];

    if (searchQuery.currentStatus) {
        tags.push({ key: 'currentStatus', label: `Status: ${searchQuery.currentStatus}` });
    }
    if (searchQuery.serviceCode) {
        tags.push({ key: 'serviceCode', label: `Service Code: ${searchQuery.serviceCode}` });
    }
    if (searchQuery.clientName) {
        tags.push({ key: 'clientName', label: `Client: ${searchQuery.clientName}` });
    }
    if (searchQuery.serviceType) {
        tags.push({ key: 'serviceType', label: `Service Type: ${searchQuery.serviceType}` });
    }
    if (searchQuery.driverName) {
        tags.push({ key: 'driverName', label: `Driver: ${searchQuery.driverName}` });
    }

    return (
        <div className="d-flex flex-wrap gap-2 filter-container">
            {tags.map((tag) => (
                <Badge
                    key={tag.key}
                    className="d-flex align-items-center gap-2 p-2 filter-tag"
                    pill
                >
                    {tag.label}
                    <span
                        onClick={() => onRemoveFilter(tag.key)}
                        style={{ cursor: 'pointer', marginLeft: '8px' }}
                    >
                        &times;
                    </span>
                </Badge>
            ))}
        </div>
    );
};

export default FilterTags;
