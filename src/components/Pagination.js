import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [...Array(totalPages).keys()].map(num => num + 1);
  //const pages = [];
  console.log(...Array(totalPages).keys());

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>&laquo;</button>
        </li>
        {pages.map(page => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(page)}>{page}</button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>&raquo;</button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
