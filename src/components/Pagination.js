import React from 'react';
import { Pagination } from 'react-bootstrap';

const MyPagination = ({ totalPages, currentPage, onPageChange }) => {
  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageItems = [];
    const pageLimit = 5;

    let startPage = Math.max(currentPage - Math.floor(pageLimit / 2), 1);
    let endPage = startPage + pageLimit - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - pageLimit + 1, 1);
    }

    if (startPage > 1) {
      pageItems.push(
        <Pagination.Item key={1} onClick={() => handleClick(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pageItems.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handleClick(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageItems.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      pageItems.push(
        <Pagination.Item key={totalPages} onClick={() => handleClick(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return pageItems;
  };

  return (
    <Pagination className="w-100 my-pagination justify-content-center justify-content-lg-end">
      <Pagination.Prev
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {renderPageNumbers()}
      <Pagination.Next
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
};

export default MyPagination;

// import React from 'react';
// import { Pagination } from 'react-bootstrap';

// const MyPagination = ({ totalPages, currentPage, onPageChange }) => {
//   const handleClick = (page) => {
//     if (page >= 1 && page <= totalPages && page !== currentPage) {
//       onPageChange(page);
//     }
//   };

//   const renderPageNumbers = () => {
//     const pageItems = [];
//     const pageLimit = 5;

//     let startPage = Math.max(currentPage - Math.floor(pageLimit / 2), 1);
//     let endPage = startPage + pageLimit - 1;

//     if (endPage > totalPages) {
//       endPage = totalPages;
//       startPage = Math.max(endPage - pageLimit + 1, 1);
//     }

//     if (startPage > 1) {
//       pageItems.push(
//         <Pagination.Item key={1} onClick={() => handleClick(1)}>
//           1
//         </Pagination.Item>
//       );
//       if (startPage > 2) {
//         pageItems.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
//       }
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageItems.push(
//         <Pagination.Item
//           key={i}
//           active={i === currentPage}
//           onClick={() => handleClick(i)}
//         >
//           {i}
//         </Pagination.Item>
//       );
//     }

//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) {
//         pageItems.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
//       }
//       pageItems.push(
//         <Pagination.Item key={totalPages} onClick={() => handleClick(totalPages)}>
//           {totalPages}
//         </Pagination.Item>
//       );
//     }

//     return pageItems;
//   };

//   return (
//     <Pagination className="w-100 my-pagination justify-content-center justify-content-lg-end">
//       <Pagination.Prev
//         onClick={() => handleClick(currentPage - 1)}
//         disabled={currentPage === 1}
//       />
//       {renderPageNumbers()}
//       <Pagination.Next
//         onClick={() => handleClick(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       />
//     </Pagination>
//   );
// };

// export default MyPagination;

// import React from 'react';
// import { Pagination } from 'react-bootstrap';

// const MyPagination = ({ totalPages, currentPage, onPageChange }) => {
//   const handleClick = (page) => {
//     onPageChange(page);
//   };

//   return (
//     <Pagination className="my-pagination justify-content-center">
//       <Pagination.Prev
//         onClick={() => handleClick(currentPage - 1)}
//         disabled={currentPage === 1}
//       />
//       {[...Array(totalPages).keys()].map((page) => (
//         <Pagination.Item
//           key={page + 1}
//           active={page + 1 === currentPage}
//           onClick={() => handleClick(page + 1)}
//         >
//           {page + 1}
//         </Pagination.Item>
//       ))}
//       <Pagination.Next
//         onClick={() => handleClick(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       />
//     </Pagination>
//   );
// };

// export default MyPagination;
