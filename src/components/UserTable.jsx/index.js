import { useEffect, useState } from 'react';
import Pagination from '../Footer/Pagination';
import React from 'react'
import axios from 'axios';
import './table.css'
const UserTable = ({selectedUsers, setSelectedUsers, search}) => {
    const [users, setUsers] = useState([]);
    const [unFilteredUsers, setUnfilteredUsers] = useState([]);
    const [userPerPage,  setUserPerPage] = useState(10);
    const [selectedPage, setSelectedPage] = useState(1);
    const [pages, setPages] = useState();
    useEffect(()=>{
        axios.get('http://localhost:3000/posts')
        .then((res)=>{
            console.log(res.data);
            setUsers(res.data)
            setUnfilteredUsers(res.data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }, [])
    useEffect(()=>{
        
        setPages(Math.ceil(users.length/userPerPage));
    }, [users])
    useEffect(()=>{
        const searchItemsStartingWith = (term) => {
            return unFilteredUsers.filter(item => 
              Object.values(item).some(value =>
                String(value).toLowerCase().startsWith(term.toLowerCase())
              )
            );
          };
          setUsers(searchItemsStartingWith(search))
    }, [search])

    function selectEditUser(index){
        
        console.log(users[index])
        setSelectedUsers(users[index]);
    }

     function editUser(field, value){
        console.log(field , " ", value)
        setSelectedUsers({...selectedUsers, [field]:value})
        setUnfilteredUsers({...selectedUsers, [field]:value})
     }

     const deleteUser = (id)=>{
        axios.delete(`http://localhost:3000/posts/${id}`)
        .then((res)=>{
            console.log(res);
            const updatedUsers = users.filter(users => users.id !== id);
            setUsers(updatedUsers)
            setUnfilteredUsers(updatedUsers)
        }).catch((err)=>{
            console.log(err);
        })
     }

     function sortArrayByField( field, ascending = true) {
        const arr = [...users];
        arr.sort((a, b) => {
          const valueA = field === 'createdAt' ? new Date(a[field]) : a[field];
          const valueB = field === 'createdAt' ? new Date(b[field]) : b[field];
          
          if (typeof valueA === 'string') {
            return ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
          } else {
            return ascending ? valueA - valueB : valueB - valueA;
          }
        })
        setUsers(arr);
     }



     const saveChanges =()=>{
      for(let i=0; i<Object.keys(selectedUsers).length; i++){
        if(selectedUsers[Object.keys(selectedUsers)[i]]=="")return;
      }

        if(selectedUsers.id){axios.patch(`http://localhost:3000/posts/${selectedUsers.id}`, 
            selectedUsers
        ).then((res)=>{
            console.log(res);
            setUsers((prev)=>{
                const arr = prev.map((data)=>{
                    if(data.id == selectedUsers.id){
                        return selectedUsers;
                    }else{
                        return data
                    }
                })
    
                return arr;
            })
            setSelectedUsers({
                author:'',
                comments:"",
                likes:"",
                title:""
            });
        }).catch((err)=>{
            console.log(err);
        })
    }else{
        console.log(selectedUsers)
        axios.post(`http://localhost:3000/posts`, 
            selectedUsers
        ).then((res)=>{
            console.log(res);
            setUsers([...users, {...selectedUsers, id: res.data.id}])
            setSelectedUsers({
                author:'',
                comments:"",
                likes:"",
                title:""
            });
        }).catch((err)=>{
            console.log(err);
        })
    }
     }
  return (
    <>

    {/* Edit Modal */}
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="editModalLabel">Edit Post</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div className='w-100 d-flex my-2'>
                    <div className='fw-semibold d-flex align-items-center'>Author :</div>
                    <div className='mx-2 p-2 border rounded'>
                        <input type='text' className='author border-0 outline-none' value={selectedUsers.author} onChange={(e)=>editUser("author", e.target.value)}/>
                    </div>
                </div>

                <div className='w-100 d-flex my-2'>
                    <div className='fw-semibold d-flex align-items-center'>Title :</div>
                    <div className='mx-2 p-2 border rounded'>
                        <input type='text' className='title border-0 outline-none' value={selectedUsers.title} onChange={(e)=>editUser("title", e.target.value)}/>
                    </div>
                </div>
                
                <div className='w-100 d-flex my-2'>
                    <div className='fw-semibold d-flex align-items-center'>Likes :</div>
                    <div className='mx-2 p-2 border rounded'>
                        <input type='text' className='likes border-0 outline-none' value={selectedUsers.likes} onChange={(e)=>editUser("likes", e.target.value)}/>
                    </div>
                </div>


                <div className='w-100 d-flex my-2'>
                    <div className='fw-semibold d-flex align-items-center'>Comments :</div>
                    <div className='mx-2 p-2 border rounded'>
                        <input type='text' className='comments border-0 outline-none' value={selectedUsers.comments} onChange={(e)=>editUser("comments", e.target.value)}/>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onClick={saveChanges} data-bs-dismiss="modal">Save changes</button>
            </div>
            </div>
        </div>
    </div>
 <div className='tableContainer '>
    <table>
      <thead>
        <tr>
          <th className='id'>
          <span>Id</span>
            <span onClick={()=>sortArrayByField("id")}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-up mx-2" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"/>
</svg></span>
          </th>
          <th className='author'> 
            <span>Author</span>
            <span onClick={()=>sortArrayByField("author")}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-up mx-2" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"/>
</svg></span>
          </th>
          <th className='comments'>
            <span>Comments</span>
            <span onClick={()=>sortArrayByField("comments")}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-up mx-2" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"/>
</svg></span>
</th>
          <th className='title'>
          <span>Title</span>
            <span onClick={()=>sortArrayByField("title")}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-up mx-2" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"/>
</svg></span>
          </th>
          <th  className='likes'>
          <span>Likes</span>
            <span onClick={()=>sortArrayByField("likes")}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-up mx-2" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"/>
</svg></span>
          </th>
          <th  className='likes'>Action</th>
        </tr>
      </thead>
      <tbody>
      {users.map((data, index)=>{
        if(index < (userPerPage*(selectedPage-1)) || index >= (userPerPage*(selectedPage)) ) return
        return (<tr  style={{ backgroundColor: index % 2 === 0 ? "#F7F6FE" : "white" }} key={data.id}>
          <td className='id'>#{data.id}</td>
          <td className='author'> {data.author}</td>
          <td className='comments'>{data.comments}</td>
          <td className='title'>{data.title}</td>
          <td  className='likes'>{data.likes}</td>
          <td className='action'>
            <div className='action-section'>
            <div className='edit-action' data-bs-toggle="modal" data-bs-target="#editModal"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#624DE3" class="bi bi-pencil" viewBox="0 0 16 16" onClick={(e)=>selectEditUser(index)}>
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
</svg>
            </div>
            <div className='delete-action' onClick={()=>deleteUser(data.id)}> 
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#A30D11" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg>
            </div>
            </div>
          </td>
        </tr>)})}
      </tbody>
      </table>
      </div>
      <Pagination selectedPage={selectedPage} setSelectedPage={setSelectedPage} pages={pages}/>
    </>
  )
}

export default UserTable;