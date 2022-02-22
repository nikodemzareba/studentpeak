import {Button, Dimensions, FlatList, Image, ImageBackground, StyleSheet, Text, View} from "react-native";
import {Feather} from "@expo/vector-icons";
import React, {useState} from "react";
import ProfileTitle from "./Shared_Objects/ProfileTitle";
import Caption from "./Shared_Objects/Caption";

import Likes_And_Comments_Count_Txt from "./Shared_Objects/Likes_And_Comments/Likes_And_Comments_Count_Txt";
import View_All_Comments from "./Shared_Objects/Likes_And_Comments/View_All_Comments";
import Profile_Icon from "./Shared_Objects/Profile_Icon";
import Username_Link_Txt from "./Shared_Objects/Username_Link_Txt";
import LikeBTN from "./Shared_Objects/Likes_And_Comments/LikeBTN";
import {feedStyles} from "./Shared_Objects/Styles";
import LikesAndCommentsDisplay from "./Shared_Objects/Likes_And_Comments/LikesAndCommentsDisplay";
import {isUserNameTooLong} from "./Shared_Objects/FunctionsAndMethods/isUserNameTooLong";
import Pictures_And_Videos_Post_Object from "./Shared_Objects/Likes_And_Comments/Pictures_And_Videos_Post_Object";

const {height, width} = Dimensions.get('window');


export default function PictureFeed(props) {

    const [refresh, setRefresh] = useState(false);
    return (
        <View style={feedStyles.screenBackground}>

            {/*Profile Stories */}
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={props.storyData}
                horizontal
                contentContainerStyle={{
                    alignItems: 'center'
                }}
                renderItem={({item}) => {
                    return (

                        <View style={styles.stories}>
                            <Profile_Icon userID={item.key} profileImage={item.profileImage}
                                          width={45} height={45} borderRadius={45}
                                          navigation={props.navigation}

                            />

                            <Username_Link_Txt name={isUserNameTooLong(item.username, 8)} userID={item.key} fontSize={9}
                                               fontWeight={'normal'} navigation={props.navigation}/>

                        </View>
                    )
                }}
            />

            {/*Picture Feed Posts */}
            <FlatList
                style={{flex: 1}}
                contentContainerStyle={{paddingTop: 25}}
                data={props.data}
                horizontal={false}
                scrollEventThrottle={20}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{itemVisiblePercentThreshold: 30, waitForInteraction: true}}
                overScrollMode="never"
                extraData={refresh}
                renderItem={({item}) => {
                    return (

                        <Pictures_And_Videos_Post_Object
                            name={item.name}
                            profileImage={item.profile}
                            userID={item.userID}
                            navigation={props.navigation}
                            downloadURL={item.downloadURL}
                            mediaType={item.mediaType}

                            userLikedPost={item.userLikedPost}
                            postID={item.key}
                            likesCount={item.likesCount}
                            commentsCount={item.commentsCount}
                        />

                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({

    video: (width, height) => ({
        alignSelf: 'center',
        width: width,
        height: undefined,
        aspectRatio: 1,
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
    },
    stories: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingHorizontal: 0,
        marginBottom: 10,
        width: 60, height: 60
    }
})