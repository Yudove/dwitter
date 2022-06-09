import React, { useState } from "react";
import { dbService } from "../fbase";

const Dweet = ({dweetObj, isOwner}) => {
        const [editing, setEditing] = useState(false);
        const [newDweet, setNewDweet] = useState(dweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this dweet?");
        if(ok) {
           await dbService.doc(`dweets/${dweetObj.id}`).delete();
        } 
    }

    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(dweetObj, newDweet);
        await dbService.doc(`dweets/${dweetObj.id}`).update({
            text: newDweet,

        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {
        target : {value}, 
        } = event;
        setNewDweet(value);
    }
    return (
    <div>
            {
                editing ? (
                    <>
                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="Edit your Dweet" value ={newDweet} required onChange={onChange}/>
                    <input type="submit" value="Update Dweet" />
                </form>
                <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <><h3>{dweetObj.text}</h3>
                {isOwner && (
                <>
                <button onClick={onDeleteClick}>Delete Dweet</button>
                <button onClick={toggleEditing}>Update Dweet</button>
                </>
                )}
                
                </>)
            }

        
    </div>
    );
};

export default Dweet;