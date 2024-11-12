    import { useState } from 'react';
import React from 'react';
    import Navbar from '../components/Navbar';
    import UserTable from '../components/UserTable.jsx';
    
    const Users = () => {
      const [selectedUsers, setSelectedUsers] = useState({
        author:'',
        comments:"",
        likes:"",
        title:""
    });
    const [search, setSearch] = useState("");
      return (
        <>
        <Navbar selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} setSearch={setSearch} search={search}/>
        <UserTable selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} setSearch={setSearch} search={search}/>
        
        </>
      )
    }
    
    export default Users