import React from 'react'
import './navbar.css'


const Navbar = ({setSelectedUsers, setSearch, search}) => {
    const resetEdit = ()=>{
        setSelectedUsers({
            author:'',
            comments:"",
            likes:"",
            title:""
        })
    }
  return (
    <div className='navbar-container d-flex px-4 justify-content-between'>
       <div className='left-container d-flex align-items-center'>
        <span className='fw-semibold'> Entries : </span>
        <input type='text' className='search-entry rounded mx-3' value={search} onChange={(e)=>setSearch(e.target.value)}/>
       </div>
       <div className='right-container d-flex align-items-center'>
       <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" onClick={resetEdit}>Add Post</button>
       </div>
    </div>
  )
}

export default Navbar