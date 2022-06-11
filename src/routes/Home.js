import React, { useEffect, useState } from "react";
import Dweet from "../components/Dweet";
import {v4 as uuidv4} from "uuid";
import { dbService, storageService } from "../fbase";

const Home = ({userObj}) => {
    const [dweet, setDweet] = useState("");
    const [dweets, setDweets] = useState([]);
    const [attachment, setAttachment] = useState();
    
    useEffect(() => {
        
        dbService.collection("dweets").onSnapshot(snapshot => {
            const dweetArray = snapshot.docs.map((doc) => ({
                id: doc.id, 
                ...doc.data(),
            }));
            setDweets(dweetArray);
        });
    }, [])
    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment != "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
            
        }
        const dweetObj = {
            text:dweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("dweets").add(dweetObj);
        setDweet("");
        setAttachment("");
    };
    console.log(dweets);
    const onChange = (event) => {
        const { target: {value}} = event;

        setDweet(value);
    };
    const onFileChange = (event) => {
         const {target: {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result},
        } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment(null);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={dweet} onChange={onChange} type="text" placeholder="feel good~" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Dweet" />
                {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
                )}
            </form>
            <div>
                {dweets.map((dweet) => (
                <Dweet key={dweet.id} dweetObj={dweet} isOwner={dweet.creatorId === userObj.uid}/>))}
            </div>
        </div>
    )
};

export default Home;