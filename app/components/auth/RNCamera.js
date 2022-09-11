import React, { useRef, useEffect } from "react"
import { View, Image, StyleSheet, Text, TouchableOpacity, Dimensions, Button, TouchableWithoutFeedback, Animated, Alert } from "react-native"
import { RNCamera } from 'react-native-camera';
import { useCamera } from "react-native-camera-hooks";
import Svg, {
    Ellipse,
    Rect,
    Line,
    Path
} from 'react-native-svg';

import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';

import { photoState } from '../../utils/state'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('screen');



const RNCameraComponet = ({ navigation, initialProps, route }) => {
    const [
        { cameraRef, type, isRecording, autoFocus, autoFocusPoint, ratio },
        { toggleFacing, touchToFocus, takePicture, textRecognized, facesDetected,
            recordVideo,
            setIsRecording, },
    ] = useCamera(initialProps);

    const [photo, setPhoto] = useRecoilState(photoState)

    const captureHandle = async () => {
        try {
            const data = await takePicture()
            console.log(data)
            setPhoto(data)
            navigation.navigate("Camera")
        } catch (error) {
            console.log(error)
        }
    }

    const TabToFocus = () => {
        touchToFocus
    }


    return (
        <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback
                onPress={touchToFocus}
            >
                <RNCamera
                    ref={cameraRef}
                    type={RNCamera.Constants.Type.back}
                    style={{ flex: 1 }}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    autoFocus={RNCamera.Constants.AutoFocus.on}
                //autoFocusPointOfInterest={autoFocusPoint.normalized}
                />
            </TouchableWithoutFeedback>
            <View style={{ ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' }}>
                <Svg
                    width="200"
                    height="200"
                >
                    <Rect
                        width="200"
                        height="200"
                        fill="null"
                        strokeWidth="7"
                        stroke="black"
                    />
                </Svg>

            </View>

            <View style={{ ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' }}>
                <Svg
                    width="60"
                    height="60"
                >
                    <Rect
                        width="60"
                        height="60"
                        fill="null"
                        strokeWidth="7"
                        stroke="red"
                    />
                </Svg>

            </View>
            <View style={{ ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    onPress={() => captureHandle()}>
                    <Icon
                        name='camera'
                        size={90}
                    />
                </TouchableOpacity>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    preview: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    fadingContainer: {
        padding: 20,
        backgroundColor: "powderblue"
    },
})

export default RNCameraComponet

