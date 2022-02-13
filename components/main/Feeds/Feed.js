import React, {Component, useState} from 'react'
import {
    View,
    Dimensions,
    FlatList,
    Text,
    ActivityIndicator,
    ScrollView,
    Button,
    StyleSheet,
    SafeAreaView, Image
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import VideoPlayer from "./VideosFeed_Objects/feedControl/components/VideoPlayer";
import firebase from "firebase";

import {StatusBar} from "expo-status-bar";
import {Feather} from "@expo/vector-icons";
import {Video} from "expo-av";
import VideoControls from "./VideosFeed_Objects/feedControl/components/VideoControls";
import {B} from "./Shared_Objects/Bold";
import ProfileTitle from "./Shared_Objects/ProfileTitle";
import Caption from "./Shared_Objects/Caption";
import PictureFeed from "./PictureFeed";
import VideoFeed from "./VideoFeed";


const {height, width} = Dimensions.get('window');


const separator = "##########################################################################################";

class FeedScreen extends Component {

    constructor(props) {
        super(props);
        this.usersFollowingRef = firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
        this.state = {
            requestProcessed: false,

            picturesReceived: 0,
            loadPictures: false,

            videosReceived: 0,
            loadVideos: false,

            videosOutOfBoundItems: [],
            videosDataFetched: [],
            videosIsLoading: true,

            picturesOutOfBoundItems: [],
            picturesDataFetched: [],
            picturesIsLoading: true
        };
    }

    handleVideosViewableItemsChanged = ({changed}) => {

        const videosOutOfBoundItems = changed;

        if (videosOutOfBoundItems.length !== 0) {
            this.setState({videosOutOfBoundItems});
        }

    };

    handlePicturesViewableItemsChanged = ({changed}) => {

        const picturesOutOfBoundItems = changed;

        if (picturesOutOfBoundItems.length !== 0) {
            this.setState({picturesOutOfBoundItems});
        }

    };

    componentDidMount() {
        this.unsubscribe = this.usersFollowingRef.onSnapshot(this.getData);
    }

    getData = async (querySnapshot) => {
        const videosDataFetched = [];
        const picturesDataFetched = [];

        let expectedFollowingUsersCount = querySnapshot.size;
        console.log(`\nNumber of Users Following: ${expectedFollowingUsersCount}`)

        let processedFollowingUsers = 0;

        // Got users Following info
        console.log("\nGot Users Following Data")
        await querySnapshot.forEach((user) => {

            // Get the user we are following userName & userProfilePhoto

           firebase.firestore()
                .collection('users')
                .doc(user.id)
                .get()
                .then(userDetails => {

                    console.log("\nGot Users Following Details etc: username, profileimage")
                    processedFollowingUsers++;
                    firebase.firestore()
                        .collection('posts')
                        .doc(user.id)
                        .collection('userPosts')
                        //.where("mediaType", "==", "video")
                        .get()
                        .then(usersFollowingPosts => {
                            console.log("\nGot Posts Of Users i am Following")

                            usersFollowingPosts.forEach((userPost) => {
                                const {caption, createdAt, downloadURL, mediaType, commentsCount} = userPost.data();
                                if (mediaType === "video") {

                                    this.setState({
                                        videosReceived: this.state.videosReceived + 1
                                    });

                                    videosDataFetched.push({
                                        key: userPost.id,
                                        name: userDetails.get("username"),
                                        profile: userDetails.get("profileimage"),
                                        caption,
                                        createdAt,
                                        downloadURL,
                                        commentsCount
                                    });
                                } else if (mediaType === "picture") {

                                    this.setState({
                                        picturesReceived: this.state.picturesReceived + 1
                                    });

                                    picturesDataFetched.push({
                                        key: userPost.id,
                                        name: userDetails.get("username"),
                                        profile: userDetails.get("profileimage"),
                                        caption,
                                        createdAt,
                                        downloadURL,
                                        commentsCount
                                    });
                                }

                                console.log(`\nUserID: ${user.id} \nUserName: ${userDetails.get("username")} \nProfile Picture: ${userDetails.get("profileimage")}   \nPostID : ${userPost.id} \nMediaType : ${mediaType} \nCaption: ${caption} \nCreatedAt: ${createdAt} \nDownloadURL: ${commentsCount} \nDownloadURL: ${downloadURL} \nMediaType: ${mediaType}`);
                                console.log(`\nProcessed Users Count = ${processedFollowingUsers} | Expected Users Count = ${expectedFollowingUsersCount}`);

                                if (processedFollowingUsers === expectedFollowingUsersCount) {
                                    console.log("\nSetting Data To Variable")
                                    this.setState({
                                        videosOutOfBoundItems: [],
                                        videosDataFetched,
                                        // videosIsLoading: false,

                                        picturesOutOfBoundItems: [],
                                        picturesDataFetched,
                                        //picturesIsLoading: false,
                                    });
                                }
                            })
                        })
                })
                .then(() => {

                    if (processedFollowingUsers === expectedFollowingUsersCount) {
                        console.log("\nLoad Pictures & Videos")
                        if (this.state.videosReceived > 0) {
                            this.setState({
                                loadVideos: true
                            });
                        }

                        if (this.state.picturesReceived > 0) {
                            this.setState({
                                loadVideos: true
                            });
                        }

                        this.setState({
                            videosIsLoading: false,
                            picturesIsLoading: false
                        });
                    }

                })
                .catch((error) => {
                    console.log(`${error} \nUnable to get Users following posts!`);
                });
        })
    }

    renderUserFollowingVideoPosts = ({item}) => {
        return <VideoPlayer
            height={height / 1.6}
            width={width}
            videoUri={item.downloadURL}
            item={item}
            videosOutOfBoundItems={this.state.videosOutOfBoundItems}
        />
    }

    render() {

        return (
            <>
                <StatusBar barStyle="dark-content"/>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView
                        style={{flex: 1}}
                        horizontal={true}
                        scrollEventThrottle={16}
                        pagingEnabled={true}
                    >
                        <View style={{width, height}}>

                            {this.state.videosIsLoading
                                ?
                                <View style={styles.loading}>
                                    <ActivityIndicator size="large" color="red"/>
                                </View>
                                :
                                <VideoFeed data={this.state.videosDataFetched} />

                            }

                        </View>

                        {/* Pictures Feed */}
                        {this.state.picturesIsLoading
                            ?
                            <View style={styles.loading}>
                                <ActivityIndicator size="large" color="red"/>
                            </View>
                            :
                            <PictureFeed data={this.state.picturesDataFetched}/>
                        }
                    </ScrollView>
                </SafeAreaView>
            </>
        );

    }
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    video: (width, height) => ({
        alignSelf: 'center',
        width: width,
        height: height
    }),
    picture: (width, height) => ({
        alignSelf: 'center',
        width: width,
        height: height
    }),
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 10
    }
})

export default FeedScreen;