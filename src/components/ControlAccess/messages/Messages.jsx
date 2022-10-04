import {ListGroup, ListGroupItem} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";


/**
 * Messages for giving access by request of an user
 * @returns {JSX.Element}
 * @constructor
 */
const Messages = () => {

    const apiBasePath = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`;


    let [messages,setMessages] = useState([
        // { id: 7, sender: "test", receiver: "mike", tableName: "cars", message: null },
        // {id : 1, username : "petya" , message : "hello i am petya" },
        // {id : 2, username : "vasya" , message : "hello i am vasya" },
        // {id : 3, username : "misha" , message : "hello i am misha" },
        // {id : 4, username : "leo" , message : "hello i am leo" },
        // {id : 5, username : "andrew" , message : "hello i am andrew" }]);
]);


    /**
     * Here we get them from the server
     */
    useEffect(  () => {
        fetchAccessRequests();
    }, []);

    const fetchAccessRequests = async () => {
        const reqOptions = {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'GET',
            credentials: 'include'
        }

        const resp = await fetch(`${apiBasePath}/accessRequest`, reqOptions);
        const respJson = await resp.json();
        setMessages(respJson.result);
        console.log(respJson.result)
    }


    /**
     * function gives us a certain message from array of the messages
     * @param id
     * @returns {object} message
     */
    const findMessage = id => messages.find(({id})=> id === id);


    /**
     * By this function we decline an user's request for the access
     * @param id
     * @returns {Promise<void>}
     */
    const declineAccess = async (id) => {
        // alert("plz implement decline")

        const reqObj = {
            id: id,
        };

        const reqOptions = {
            headers:{
                'Content-Type': 'application/json'
            },
            method: "DELETE",
            body: JSON.stringify(reqObj),
            credentials: 'include'
        }

        const resp = await fetch(`${apiBasePath}/accessRequest`, reqOptions);
        const respJson = await resp.json();
        const respResult = respJson.isSuccess;
        const respMessage = respJson.message;

        if(respResult){ setMessages(current => current.filter(message => message.id != id))}

        alert(respMessage)

    }

    /**
     * Function for giving access to the required table
     * @param e
     * @param id{number}
     * @returns {Promise<void>}
     */
    const confirmAccess = async (e,id) => {
        // alert("plz implement confirm")

         // e.preventDefault();

        const message = findMessage(id);

        console.log(message)

        const reqData = {
            username: message.sender,
            name: message.tableName,
        }
        const reqOptions = {
            headers:{
                'Content-Type': 'application/json'
            },
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({...reqData})
        }

        const resp = await fetch(`${apiBasePath}/userDatabase`, reqOptions);
        const respJson = await resp.json();

        console.log(reqData);
        // setPostResult(respJson.message)

        if(respJson.isSuccess) {
            setMessages(current => current.filter(message => message.id != id));
        }
        alert(respJson.message);
    }




    return (

        <div>
            {
                (messages[0] != undefined) &&
                messages.map((m)=> (

                    <ListGroup>
                       <ListGroupItem>
                           <ul>
                               <li> id : {m.id} </li>
                               <li>tableName : {m.tableName}</li>
                               <li>sender: {m.sender}</li>
                               <li>message: {m.message}</li>
                           </ul>
                           <div className="mb-2">
                               <Button variant="success" onClick={() =>confirmAccess(m.id)}>Confirm</Button>{' '}
                               <Button variant="danger" onClick={() => declineAccess(m.id)}>Decline</Button>
                           </div>
                       </ListGroupItem>
                        <br/>
                    </ListGroup>
                ))
            }
        </div>
    );
};

export default Messages;
