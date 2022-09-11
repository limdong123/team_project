import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, Text, Image, Button, Platform, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import SERVER_URL from '../../utils/misc'
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';
import { photoState } from '../../utils/state'
import CheckBox from '@react-native-community/checkbox';


const Camera = ({ navigation, route }) => {

    const [UserId, setUserId] = React.useState('')
    const [Select, setSelect] = React.useState('')
    const [Loading, setLoading] = React.useState(false)
    const [photo, setPhoto] = useRecoilState(photoState)
    const [toggleCheckBox, setToggleCheckBox] = React.useState(false)

    const item = [
        { label: '성인 인증', value: 'adult', inputLabel: '성인 인증!' },
    ]

    const createFormData = (photo, body = {}) => {
        const data = new FormData();

        data.append('photo', {
            name: UserId,
            uri: photo.uri,
            type: 'image/jpg'
        });
        data.append('UserID', UserId)
        data.append('Select', Select)
        Object.keys(body).forEach((key) => {
            data.append(key, body[key]);
        });
        return data;
    };

    //10초이상 되면 탈출
    const TimeoutLoading = setTimeout(() => setLoading(false), 10000)

    //Alert 버튼 
    const ButtonAlert = (params) => {
        Alert.alert(
            "오류!",
            `${params}`,
            [
                {
                    text: "Cancle",
                    onPress: () => console.log(params, "ERROR Cancle Pressed"),
                    style: "cancel"
                },
            ]
        )
    }

    //촬영전 주의사항
    const PhotoAlert = (params) => {
        Alert.alert(
            '주의!',
            `${params}`,
            [
                {
                    text: "OK",
                    onPress: () => console.log(params, "ERROR Cancle Pressed"),
                    style: "cancel"
                },
            ]
        )
    }

    const DataUpLoading = () => {
        TimeoutLoading
        if (UserId === '') {
            ButtonAlert('User ID를 입력해주세요')
        } else if (photo === null) {
            ButtonAlert('지문 이미지 다시 촬영해주세요')
        } else if (Select === '') {
            ButtonAlert('원하는 인증 선택을 해주세요')
        }
        else {
            setLoading(true)
            fetch(`${SERVER_URL}/api/upload`, {
                method: 'POST',
                body: createFormData(photo),
            })
                .then(response => {
                    //console.log(response.what)
                    return response.json()
                })
                .then(data => {
                    if (data.what === "matched") {
                        console.log("matched")
                        SendAuth()
                    } else if (data.what === "unmatched") {
                        console.log("unmatched")
                        setPhoto(null)
                        setLoading(false)
                        ButtonAlert('지문 매칭에 실패했습니다. 지문사진을 다시 촬영해주세요')
                    } else if (data.what === "noID") {
                        console.log('none Id')
                        setPhoto(null)
                        setLoading(false)
                        ButtonAlert('아이디를 찾을 수 없습니다. 아이디를 확인해 주세요')
                    } else {
                        console.log('netWork Error')
                        setPhoto(null)
                        setLoading(false)
                        ButtonAlert('네트워크가 오류. 다시 시도해 주세요')
                    }
                })
                .catch((error) => {
                    console.log('error to api/uploading', error);
                    console.log('netWork Error')
                    setPhoto(null)
                    setLoading(false)
                    ButtonAlert('네트워크가 응답하지 않습니다. 다시 시도해 주세요')
                });
        }
    }

    const SendAuth = () => {
        //fetch(`${SERVER_URL}/api/queryauth/${UserId}`)
        fetch(`${SERVER_URL}/api/queryauth/${UserId}`)
            .then(response => response.json())
            .then(json => navigation.navigate('Finish', { key: Select, Data: json.adultauth }))

            .catch(function (reason) {
                console.log('reason', reason)
            })
        setPhoto(null)
    }

    const placeholder = {
        label: '선택',
        value: null,
        color: '#9EA0A4'
    }

    const pickmove = async () => {
        PhotoAlert("지문을 빨간 박스안에 넣어주세요")
        navigation.navigate("RNCamera")
    }

    const checkboxClick = (newValue) => {
        setToggleCheckBox(newValue)
        if (newValue === true) {
            setSelect('adult')
        } else {
            setSelect("")
        }
    }

    return (
        <View style={styles.container}>
            {Loading ? <ActivityIndicator
            /> : (
                <View style={styles.container}>
                    <TextInput
                        style={styles.textInput}
                        placeholder='User ID를 입력해주세요'
                        placeholderTextColor='gray'
                        onChangeText={text => setUserId(text)}
                        autoCapitalize={'none'}
                    />
                    <TouchableOpacity
                        onPress={pickmove} style={[styles.button, { marginBottom: 10 }]}
                    >
                        <Text style={styles.btnText}>지문 촬영</Text>
                    </TouchableOpacity>
                    {
                        photo !== null ?
                            <View style={{
                                width: 300,
                                height: 300,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: 'rgb(20,153,184)',
                                borderWidth: 1,
                            }}>
                                <Image
                                    source={{ uri: photo.uri }}
                                    style={{ width: 300, height: 300 }}
                                />
                            </View>
                            :
                            <View style={{
                                width: 300,
                                height: 300,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: 'rgb(20,153,184)',
                                borderWidth: 1,
                            }}>
                                <Text style={{ color: "grey", fontSize: 17 }}>
                                    지문을 촬영해주세요
                                </Text>
                            </View>

                    }
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'black', marginTop: 30 }}>원하시는 인증을 선택해주세요</Text>
                        <View style={styles.checkboxContainer}>
                            <CheckBox
                                disabled={false}
                                tintColors={'black'}
                                value={toggleCheckBox}
                                onValueChange={(newValue) => checkboxClick(newValue)}
                                style={{ ...styles.checkbox, }}
                            />
                            <Text style={{ ...styles.label, color: 'black' }}>성인인증</Text>
                        </View>
                        <TouchableOpacity
                            onPress={DataUpLoading}
                            style={styles.button}
                        >
                            <Text style={styles.btnText}>인증하기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        height: "100%",
        textAlign: "center",
        backgroundColor: 'rgb(255,255,255)'
    },
    text: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        elevation: 8,   //그림자
        backgroundColor: 'rgb(20,153,184)',
        borderRadius: 30,          // 끝 뚱글개
        paddingVertical: 10,    //세로 높이
        paddingHorizontal: 60,  //가로 넓이
        marginTop: 10
    },
    btnText: {
        color: 'rgb(255,255,255)'
    },
    textInput: {
        elevation: 8,   //그림자
        fontSize: 17,
        marginBottom: 20,
        paddingVertical: 10,    //세로 높이
        paddingHorizontal: 20,  //가로 넓이
        borderWidth: 1,
        borderRadius: 25,
        borderColor: 'rgb(20,153,184)',
        width: '80%',

        backgroundColor: 'rgb(255,255,255)',
        color: 'black',
    },
    checkbox: {
        alignSelf: "center",

    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    label: {
        margin: 8,
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default Camera
