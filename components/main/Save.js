import React, {useState} from 'react'
import {View, TextInput, Image, Button} from 'react-native'

import firebase from 'firebase'
import {NavigationContainer} from '@react-navigation/native'


require("firebase/firestore")
require("firebase/firebase-Storage")

export default function Save(props) {
    //console.log(props.route.image)
    const [caption, setCaption] = useState("")

    const uri = props.route.params.image;
    const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random.toString(36)}`;

    const uploadImage = async () => {
        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on.toString("state_changed", taskProgress, taskError, taskCompleted)
    }

    const savePostData = (downloadURL) => {

        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadUrRL,
                caption,
                creation: firebase.firestore.FieldValue.serverTimeStamp()
            }).then((function () {
            //props.navigation.popToTop()  // returns screen back to main page

        }))
    }

    const uploadImage2 = async () => {
        const childPath2 = `posts/${firebase.auth().currentUser.uid}/${getRandomString(36)}`;
        const response = await fetch(uri); // fetch image
        const blob = await response.blob(); // convert to blob

        var ref = firebase.storage().ref().child(childPath2); // reference to image

        // upload image to fireStorage
        await ref.put(blob)
            .then(snapshot => {
                return snapshot.ref.getDownloadURL();
            })
            .catch((error) => {
                console.log(`${error} \nError uploading file to fire-storage!`);
                return downloadURL;
            })
            .then(downloadURL =>
            {
                console.log(`Successfully uploaded file and got download link - ${downloadURL}`);

                //upload to firestore
                firebase.firestore()
                    .collection('posts')
                    .doc(firebase.auth().currentUser.uid)
                    .collection("userPosts")
                    .add({
                        downloadURL,
                        caption,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                    console.log(`Successfully uploaded file to fire-store`);
                        props.navigation.navigate("Add2"); // return to camera screen
                })
                    .catch((error) => {
                    console.log(`${error} \nError uploading file to fire-store!`);
                    return downloadURL;
                });
                return downloadURL;
            });
    }

    function getRandomString(length) {/* Generates random Doc ID for file being uploaded */}
    {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    return (
        <View style={{flex: 1}}>
            <Image source={{uri: props.route.params.image}}/>
            <TextInput
                placeholder="Write a Caption ...."
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title="Save" onPress={() => uploadImage2()}/>
        </View>
    )
}
