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

import VideoPlayer from "./feedControl/components/VideoPlayer";
import firebase from "firebase";

import {StatusBar} from "expo-status-bar";
import {Feather} from "react-native-vector-icons";
import {Video} from "expo-av";
import VideoControls from "./feedControl/components/VideoControls";


const {height, width} = Dimensions.get('window');


const separator = "##########################################################################################";
const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>
class FeedScreen extends Component {

    constructor(props) {
        super(props);
        this.usersFollowingRef = firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection('userFollowing')
        this.state = {
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

                    console.log("\nGot Users Following Details etc: username, profilePicture")
//HELLO Might cause an error if there are no posts from the user
                    firebase.firestore()
                        .collection('posts')
                        .doc(user.id)
                        .collection('userPosts')
                        //.where("mediaType", "==", "video")
                        .get()
                        .then(usersFollowingPosts => {
                            console.log("\nGot Posts Of Users i am Following")

                            usersFollowingPosts.forEach((userPost) => {
                                const {caption, createdAt, downloadURL, mediaType} = userPost.data();
                                if (mediaType === "video") {
                                    videosDataFetched.push({
                                        key: userPost.id,
                                        name: userDetails.get("username"),
                                        profile: userDetails.get("profilePicture"),
                                        caption,
                                        createdAt,
                                        downloadURL,
                                    });
                                } else if (mediaType === "picture") {
                                    picturesDataFetched.push({
                                        key: userPost.id,
                                        name: userDetails.get("username"),
                                        profile: userDetails.get("profilePicture"),
                                        caption,
                                        createdAt,
                                        downloadURL,
                                    });
                                }

                                processedFollowingUsers++;
                                console.log(`\nUserID: ${user.id} \nUserName: ${userDetails.get("username")} \nProfile Picture: ${userDetails.get("profilePicture")}   \nPostID : ${userPost.id} \nMediaType : ${mediaType} \nCaption: ${caption} \nCreatedAt: ${createdAt} \nDownloadURL: ${downloadURL} \nMediaType: ${mediaType}`);
                                console.log(`\nProcessed Users Count = ${processedFollowingUsers} | Expected Users Count = ${expectedFollowingUsersCount}`);

                                if (processedFollowingUsers === expectedFollowingUsersCount) {
                                    console.log("\nSetting Data To Variable")
                                    this.setState({
                                        videosOutOfBoundItems: [],
                                        videosDataFetched,
                                        videosIsLoading: false,

                                        picturesOutOfBoundItems: [],
                                        picturesDataFetched,
                                        picturesIsLoading: false,
                                    });
                                }
                            })
                        })
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
                                <View style={{flex: 1}}>
                                    <FlatList
                                        style={{flex: 1}}
                                        contentContainerStyle={{paddingTop: 25}}
                                        data={this.state.videosDataFetched}
                                        renderItem={this.renderUserFollowingVideoPosts}
                                        horizontal={false}
                                        scrollEventThrottle={20}
                                        showsVerticalScrollIndicator={false}
                                        onViewableItemsChanged={this.handleVideosViewableItemsChanged}
                                        viewabilityConfig={{itemVisiblePercentThreshold: 30, waitForInteraction: true}}
                                        overScrollMode="never"
                                    />

                                </View>
                            }

                        </View>

                        {/* Pictures Feed */}
                        {this.state.picturesIsLoading
                            ?
                            <View style={styles.loading}>
                                <ActivityIndicator size="large" color="red"/>
                            </View>
                            :
                            <View style={{flex: 1}}>

                                <FlatList
                                    style={{flex: 1}}
                                    contentContainerStyle={{paddingTop: 25}}
                                    data={this.state.picturesDataFetched}
                                    horizontal={false}
                                    scrollEventThrottle={20}
                                    showsVerticalScrollIndicator={false}
                                    onViewableItemsChanged={this.handlePicturesViewableItemsChanged}
                                    viewabilityConfig={{itemVisiblePercentThreshold: 30, waitForInteraction: true}}
                                    overScrollMode="never"
                                    renderItem={({item}) => {
                                        return (
                                            <View style={{flex: 1, marginBottom: 20}}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    paddingHorizontal: 10,
                                                    marginBottom: 10
                                                }}>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <Image style={{height: 30, width: 30, borderRadius: 30}}
                                                               source={{uri: item.profile}}/>
                                                        <Text style={{
                                                            marginLeft: 10,
                                                            color: '#000000',
                                                            fontSize: 15,
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {item.name}
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <Feather name="more-vertical" color="#000000" size={18}/>
                                                    </View>
                                                </View>

                                                <Image  source={{uri: item.downloadURL}}    style={styles.picture(width, height)}/>
                                                <Text style={{
                                                    marginLeft: 10,
                                                    color: '#000000',
                                                    fontSize: 15,
                                                    fontWeight: 'plain'
                                                }}> <B>{item.name}: </B>  "{item.caption}" </Text>


                                            </View>
                                        )
                                    }}
                                />

                            </View>
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