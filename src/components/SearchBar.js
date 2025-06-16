import React, { useEffect, useState, useCallback } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { getSeachFilterResult } from '../services/getSearchFilterResult';
import FilterOffCanvas from './Filter';
import { get } from '../lib/request';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

const SearchBar = ({ onSearch, role, searchQuery, setSearchQuery }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch()
  const data = useSelector((state) => state.data);

  // ✅ Debounce with parameter directly passed
  const debouncedSearch = useCallback(
    debounce((val) => {
      if (!val.trim()) return;
      console.log('val', val);
      let url = `/admin/info/search-string/${val}`;
      if (role === 'client') {
        url = `/client/search-string/${val}`;
      }

      get(url, role)
        .then((res) => {
          if (res.data.status) {
            console.log('res.data.data', res.data.data);
            // onSearch(res.data.data);
            dispatch({
              type: 'getJobData',
              payload: res.data.data,
            });
          } else {
            console.warn('No search results found');
            onSearch([]); // Optional: clear results if nothing found
          }
        })
        .catch((err) => {
          console.error('Search API Error:', err);
        });
    }, 400),
    [role, onSearch]
  );

  // ✅ This passes the value directly
  const handleSearch = (val) => {
    setSearchTerm(val);
    debouncedSearch(val); // 🔥 use val directly
  };

  const handleSearchClick = (searchTerm, selectedOption) => {
    console.log('clicked');
    getSeachFilterResult(searchQuery, role)
      .then((res) => {
        onSearch(res);
        handleClose();
      })
      .catch((err) => {
        console.error('Filter API Error:', err);
      });
  };

  useEffect(() => {
    const hasFilters =
      searchQuery.currentStatus ||
      searchQuery.clientId ||
      searchQuery.driverId ||
      searchQuery.fromDate ||
      searchQuery.toDate ||
      searchQuery.jobId ||
      searchQuery.clientName ||
      searchQuery.driverName;

    if (hasFilters && searchTerm.trim()) {
      handleSearchClick(searchTerm, searchQuery);
    }
  }, []);

  return (
    <Form className="ms-auto d-block">
      <InputGroup style={{ border: '1px solid #B7B7B7', borderRadius: '4px' }}>
        <Form.Control
          type="text"
          placeholder="Search by Job ID or AWB"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ border: 'none', flex: '1 1 auto', minWidth: 0 }}
          className="search-input-width"
        />
        {/* <Button className="input-group-text cursor-pointer" style={{ backgroundColor: '#fff', border:'none' }} >
          <FaSearch style={{ color: '#0d6efd' }}/>
        </Button> */}
      </InputGroup>
      {/* <InputGroup>
        <Form.Control
          type="text"
          placeholder="Enter Job Id or AWB"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button variant="dark" onClick={handleShow} className="input-group-text cursor-pointer">
          <FaFilter />
        </Button>
      </InputGroup> */}

      <FilterOffCanvas
        show={show}
        handleClose={handleClose}
        onApplyFilter={(selectedOption) =>
          handleSearchClick(searchTerm, selectedOption)
        }
        role={role}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

    </Form>
  );
};

export default SearchBar;
