import React, { useState, useEffect } from 'react'
import client, { databases, DATABASE_ID, COLLECTION_MSG_ID } from '../appWriteConfig'
import { ID, Query, Role, Permission } from 'appwrite'
import { Trash2 } from 'react-feather'
import Header from '../components/Header'
import { useAuth } from '../utils/authContext'

const Room = () => {

    const [messages, setMessages] = useState([])
    const [messageBody, setMessageBody] = useState("")
    const { user } = useAuth()

    useEffect(() => {
        getMessages()

        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_MSG_ID}.documents`, response => {
            // Callback will be executed on changes for documents A and all files.

            if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                console.log('A MESSAGE WAS CREATED')
                setMessages(prevState => [response.payload, ...prevState])
            }


            if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
                console.log('A MESSAGE WAS DELETED!!!')
                setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
            }
        });

        return () => {
            unsubscribe()
        }

    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault()

        let payload = {
            user_id: user.$id,
            username: user.name,
            msg_body: messageBody
        }

        let permissions = [
            Permission.write(Role.user(user.$id))
        ]

        let res = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_MSG_ID,
            ID.unique(),
            payload,
            permissions
        )

        console.log(res)

        // setMessages(prevState => [res, ...messages])

        setMessageBody("")
    }


    const getMessages = async () => {
        const res = await databases.listDocuments(DATABASE_ID, COLLECTION_MSG_ID, [
            Query.orderDesc('$createdAt')
        ])
        console.log(res)
        setMessages(res.documents)
    }

    const deleteMessage = async (message_id) => {
        databases.deleteDocument(DATABASE_ID, COLLECTION_MSG_ID, message_id)
        // setMessages(prevState => messages.filter(msg => msg.$id !== message_id))
    }

    return (
        <main className='container'>
            <Header />
            <div className='room--container'>

                <form onSubmit={handleSubmit} id="message--form">
                    <div>
                        <textarea required="true" maxLength="10000" placeholder='Say Something...' onChange={(e) => { setMessageBody(e.target.value) }} value={messageBody}>

                        </textarea>
                    </div>
                    <div className='send-btn--wrapper'>
                        <input className='btn btn--secondary' type='submit' value="Send" />
                    </div>
                </form>

                <div>
                    {messages.map(msg => (
                        <div key={msg.$id} className='message--wrapper'>
                            <div className='message--header'>
                                <p>
                                    {msg?.username ? (
                                        <span>
                                            {msg.username}
                                        </span>
                                    ) : (
                                        <span>Anonymous User</span>
                                    )}
                                    <small className='message-timestamp'>{new Date(msg.$createdAt).toLocaleString()}</small>
                                </p>
                                {
                                    msg.$permissions.includes(`delete(\"user:${user.$id}\")`) &&  <Trash2 className='delete--btn' onClick={() => deleteMessage(msg.$id)} />
                                }
                                
                            </div>
                            <div className='message--body'>
                                <span>
                                    {msg.msg_body}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default Room