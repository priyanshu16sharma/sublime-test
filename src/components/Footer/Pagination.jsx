import React from 'react'
import "./pagination.css"
const Pagination = ({selectedPage, setSelectedPage, pages}) => {
    const setpage = (page)=>{
        console.log(page);
        setSelectedPage(page)
    }
    return (
    <div className='w-100 d-flex justify-content-center gap-4' style={{height:"30px"}}>
       { Array.from({ length: pages }).map((_, index) => {
  return <div key={index} className='page-list-item d-flex align-items-center justify-content-center fw-semibold rounded' style={{backgroundColor: selectedPage==index+1?"#624DE3":"rgb(208, 210, 213)", color: selectedPage==index+1?"white":"black"}} onClick={()=>setpage(index+1)}>{index+1}</div>
})}

        
    </div>
  )
}

export default Pagination