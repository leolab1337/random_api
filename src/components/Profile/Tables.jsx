import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import {useCookies} from "react-cookie";

/**
 * Component for displaying user's own tables
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Tables(props) {
    const apiBasePath = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`;

    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const [userTables, setUserTables] = useState([]);

    const navigate = useNavigate();

    const createNewTable = async () => {
        let path = `/newTable`;
        navigate(path);
    }

    const showTableInfo = async (tableName, tableOwner) => {
        props.setTableInfoName(tableName);
        props.setTableInfoOwner(tableOwner);
        let path = `/tableInfo`;
        navigate(path);
    }

    useEffect(  () => {
        fetchUserTables();
    }, []);

    /**
     * function fetches all user's own tables
     * @returns {Promise<void>}
     */
    const fetchUserTables = async () => {
        const reqOptions = {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'GET',
            credentials: 'include'
        }

        const resp = await fetch(`${apiBasePath}/userDatabase?own=true`, reqOptions);
        const respJson = await resp.json();
        setUserTables(respJson.result);
    }

    return (

        <div id="tables">

            <h3>Your tables</h3>


            <Button variant="primary" onClick={createNewTable}>Create a new table</Button>
            <br/><br/>



            <ListGroup as="ol" numbered className='gap-2 gap-lg-3 gap-xl-3  gap-sm-3 gap-md-3 gap-xxl-4'>
                {
                    (userTables[0] != null ) &&
                    userTables.map((item)=>{
                        return <ListGroup.Item  as='li'
                                                // style={{cursor:'pointer' }}
                                                style={item.accessType == "0" ?  {backgroundColor: '#90EE90',cursor:'pointer'} : item.accessType == "1" ? {backgroundColor: '#FFD580',cursor:'pointer' } : {backgroundColor: '#ADD8E6',cursor:'pointer'}  }
                                                className='w-50'
                                                key={item.id}
                                                onClick={()=>{ showTableInfo(item.name, item.username)} }>{item.name}
                        </ListGroup.Item>
                    })
                }
            </ListGroup>
            <br/>
        </div>
    );
}

export default Tables;
