// import React from 'react'

// function Pagination(list, pagination, handlePrevClick, preDisabled, totalPages, handlePageChange, currentPage, handleNextClick, nextDisabled) {
//     return (
//         <>
//             {
//                 list && list.length > pagination &&
// {
//                 <button
//                     onClick={handlePrevClick}
//                     disabled={preDisabled}
//                 >
//                     Prev
//                 </button>
//           {
//                 Array.from({ length: totalPages }, (_, i) => {
//                     return (
//                         <button
//                             onClick={() => handlePageChange(i + 1)}
//                             key={i}
//                             disabled={i + 1 === currentPage}
//                         >
//                             {i + 1}
//                         </button>
//                     )
//                 })
//             }

//             <button onClick={handleNextClick} disabled={nextDisabled} > Next </button>
//             }
//         }
//         </>
//     )
// }

// export default Pagination
