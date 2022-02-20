import React, {Component, useEffect, useRef, useState} from 'react'
import {
    View,
    Dimensions,
    FlatList,
    Text,
    ActivityIndicator,
    ScrollView,
    Button,
    StyleSheet,
    SafeAreaView, Image, TouchableOpacity, ImageBackground
} from 'react-native';
import {feedStyles} from "../Styles";
import ProfileTitle from "../ProfileTitle";
import LikesAndCommentsDisplay from "./LikesAndCommentsDisplay";
import Profile_Icon from "../Profile_Icon";
import Username_Link_Txt from "../Username_Link_Txt";
import {Feather} from "@expo/vector-icons";
import VideoFeed from "../../VideoFeed";
import firebase from "firebase";
import {isUserNameTooLong} from "../FunctionsAndMethods/isUserNameTooLong";
import {postLikeData} from "../../FakeJSONData/TempUsersLikedPost";
import FollowBTN from "./FollowBTN";


export default function UsersLikedPost(props) {
    const [loading, setLoading] = useState(true);
    //  const [postLikeData, setPostLikeData] = useState([])
    const userID = props.route.params.userID;
    const postID = props.route.params.postID;


    useEffect(() => {
        // console.log(`\n\nUserID: ${props.route.params.userID} \nPostID: ${postID}`)
    }, []);


    return (
        <View style={feedStyles.screenBackground}>

            <FlatList
                style={{flex: 1}}
                contentContainerStyle={{paddingTop: 25}}
                data={postLikeData}
                horizontal={false}
                scrollEventThrottle={20}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{itemVisiblePercentThreshold: 30, waitForInteraction: true}}
                overScrollMode="never"
                renderItem={({item}) => {
                    return (


                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                            marginBottom: 10,
                            padding: 10
                        }}>

                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Profile_Icon userID={item.userID} width={50} height={50} borderRadius={50}
                                              profileImage={item.profileImage} navigation={props.navigation}/>
                            </View>
                            <View style={{alignItems: 'flex-start'}}>
                                <Username_Link_Txt
                                    name={isUserNameTooLong(item.username, 28)}
                                    userID={item.userID}
                                    fontSize={15}
                                    fontWeight={'bold'} navigation={props.navigation}
                                />
                            </View>
                            <View style={{width: 100, height: 40}}>

                                {userID !== item.userID ?

                                    <FollowBTN userID={userID} otherUserID={item.userID}
                                               followingUser={item.following}/>
                                    :
                                    <View>

                                    </View>

                                }

                            </View>

                        </View>


                    )
                }}
            />

        </View>


    )

}

const styles = StyleSheet.create({
    loading: {

        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
})