import React, { useEffect, useRef, useContext, useState } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { getAudioPath, increaseVolume, prePathUrl, setExtraVolume } from "../components/CommonFunctions";
import { MaskComponent } from "../components/CommonComponents"

let currentMaskNum = 0;
let subMaskNum = 0;
const maskPathList = [
    ['1'],
    ['2'],
    ['3'],
    ['4'],
    ['5'],
    ['6'],
    ['7'],
    ['sub'], //sub
    ['10'],
    ['sub'],
    ['13'],
]


const maskTransformList = [
    { x: 0.0, y: 0.0, s: 1 },
    { x: 0.0, y: 0.0, s: 1 },
    { x: 0.3, y: 0.4, s: 1.8 },
    { x: 0.5, y: 0.4, s: 2.4 },
    { x: 0.3, y: -0.15, s: 1.6 },
    { x: 0.25, y: -0.1, s: 2 },
    { x: -0.4, y: 0.1, s: 1.8 },
    { x: -0.35, y: 0.4, s: 1.8 }, // 7
    { x: -0.4, y: -0.1, s: 1.8 }, // 8
    { x: -0.1, y: -0.2, s: 1.4 }, // 9
    { x: -0.3, y: 0.5, s: 2 }, // 10
]


// plus values..
const marginPosList = [
    { s: 1, l: 0.0, t: 0 },
    { s: 0, l: 0, t: 0 },
    { s: 2, l: 0.4, t: 0.7 },
    { s: 3, l: 0.7, t: 0.5 },
    { s: 1.5, l: 0.3, t: 0 },
    { s: 2, l: 0.2, t: 0.0 },
    { s: 2, l: -0.3, t: -0.1 }, //6
    {}, //7

    { s: 2, l: -0.7, t: -0.1 }, // 8
    {}, // 9
    { s: 2, l: -0.7, t: -0.1 }, // 10
]

const audioPathList = [
    ['2'],
    ['3'],
    ['4'],
    ['5'],
    ['6'],
    ['7'],
    ['8'],
    ['9', '10'],
    ['11'],
    ['12'],
    ['13'],
]

const Scene = React.forwardRef(({ nextFunc, _baseGeo, loadFunc, bgLoaded }, ref) => {

    const audioList = useContext(UserContext)

    const subMarkInfoList = [
        [
            { p: '8', t: 3000, i: 0 },
            { p: '9', t: 5000, i: 1 },
        ],
        [
            { p: '11', t: 2500, i: 2 },
            { p: '12', t: 5000, i: 3 },
        ]
    ]

    const subMaskRefList = Array.from({ length: 4 }, ref => useRef())
    const [isSubMaskLoaded, setSubMaskLoaded] = useState(false)

    const baseObject = useRef();
    const blackWhiteObject = useRef();
    const colorObject = useRef();
    const currentImage = useRef()

    const [isSceneLoad, setSceneLoad] = useState(false)

    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {

            loadFunc()

            baseObject.current.className = 'aniObject'
            subMaskNum = 0;
            audioList.bodyAudio1.src = getAudioPath('intro/2');
            audioList.bodyAudio2.src = getAudioPath('intro/1');

            blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                returnImgPath(maskPathList[currentMaskNum][0], true) + '")'

            blackWhiteObject.current.style.transition = "0.5s"
            currentImage.current.style.transition = '0.5s'

            setTimeout(() => {


                // const audios = [
                //     audioList.bodyAudio1, audioList.bodyAudio2, audioList.bodyAudio3,
                //     audioList.clapAudio, audioList.yeahAudio, audioList.buzzAudio,
                //     audioList.tingAudio, audioList.replayAudio, audioList.successAudio,
                //     , audioList.commonAudio1, audioList.commonAudio2, audioList.commonAudio3
                // ]
                // for (let i = 0; i < 15; i++)
                //     setExtraVolume(audioList[i], 2)
                // audios.map(audio => {
                //     setExtraVolume(audio, 2)
                // })

                setExtraVolume(audioList.bodyAudio1, 2)
                setExtraVolume(audioList.bodyAudio2, 2)
                setExtraVolume(audioList.bodyAudio3, 2)

            }, 2500);

            setTimeout(() => {

                audioList.bodyAudio2.play()
                setTimeout(() => {
                    setSubMaskLoaded(true)
                    showIndividualImage()
                }, audioList.bodyAudio2.duration * 1000 + 1000);
            }, 3000);
        },
        sceneEnd: () => {
            currentMaskNum = 0;
            subMaskNum = 0;

            setSceneLoad(false)
        }
    }))

    function returnImgPath(imgName, isAbs = false) {
        return isAbs ? (prePathUrl() + 'images/intro/' + imgName + '.png')
            : ('intro/' + imgName + '.png');
    }

    const durationList = [
        2, 1, 1, 1.4, 1.4, 1.4, 1, 1, 1, 1.4, 1.4, 1.4, 1
    ]
    function showIndividualImage() {

        let currentMaskName = maskPathList[currentMaskNum]
        baseObject.current.style.transition = durationList[currentMaskNum] + 's'


        baseObject.current.style.transform =
            'translate(' + maskTransformList[currentMaskNum].x * 100 + '%,'
            + maskTransformList[currentMaskNum].y * 100 + '%) ' +
            'scale(' + maskTransformList[currentMaskNum].s + ') '

        setTimeout(() => {
            let timeDuration = audioList.bodyAudio1.duration * 1000 + 500
            let isSubAudio = false

            if (audioPathList[currentMaskNum].length > 1) {
                timeDuration += (audioList.bodyAudio3.duration * 1000 - 1000)
                isSubAudio = true;
            }

            if (currentMaskName != 'sub') {
                blackWhiteObject.current.className = 'show'
                colorObject.current.className = 'hide'
            }

            else {
                subMarkInfoList[subMaskNum].map((info, index) => {
                    setTimeout(() => {
                        if (index == 0)
                            colorObject.current.className = 'hide'
                        subMaskRefList[info.i].current.setClass('appear')
                        console.log(info)
                    }, info.t);
                })
            }

            if (maskPathList[currentMaskNum].length > 1) {
                maskPathList[currentMaskNum].map((value, index) => {
                    setTimeout(() => {
                        if (index > 0) {
                            blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                                returnImgPath(maskPathList[currentMaskNum][index], true) + '")'
                        }
                    }, (audioList.bodyAudio1.duration * 1000 + 1000) / maskPathList[currentMaskNum].length * index);
                }
                )
            }

            setTimeout(() => {

                if (marginPosList[currentMaskNum].s != null) {
                    currentImage.current.style.transform =
                        "translate(" + _baseGeo.width * marginPosList[currentMaskNum].l / 100 + "px,"
                        + _baseGeo.height * marginPosList[currentMaskNum].t / 100 + "px)"
                        + "scale(" + (1 + marginPosList[currentMaskNum].s / 100) + ") "
                }

                audioList.bodyAudio1.play().catch(error => { });
                if (isSubAudio)
                    setTimeout(() => {
                        setTimeout(() => {
                            subMaskRefList[1].current.setClass('hide')
                            audioList.bodyAudio3.play();
                        }, 500);
                    }, audioList.bodyAudio1.duration * 1000 + 500);

                setTimeout(() => {
                    if (currentMaskNum < audioPathList.length - 1) {
                        audioList.bodyAudio1.src = getAudioPath('intro/' + audioPathList[currentMaskNum + 1][0]);
                        if (audioPathList[currentMaskNum + 1].length > 1)
                            audioList.bodyAudio3.src = getAudioPath('intro/' + audioPathList[currentMaskNum + 1][1]);
                    }

                    setTimeout(() => {
                        currentImage.current.style.transform = "scale(1)"

                        setTimeout(() => {
                            colorObject.current.className = 'show'
                        }, 300);

                        setTimeout(() => {
                            if (currentMaskNum == maskPathList.length - 1) {
                                setTimeout(() => {
                                    baseObject.current.style.transition = '2s'

                                    baseObject.current.style.transform =
                                        'translate(' + '0%,0%)' +
                                        'scale(1)'

                                    setTimeout(() => {
                                        nextFunc()
                                    }, 5000);

                                }, 2000);
                            }
                            else {

                                if (currentMaskName == 'sub') {
                                    subMaskRefList.map(mask => mask.current.setClass('hide'))
                                    subMaskNum++
                                }

                                currentMaskNum++;

                                currentMaskName = maskPathList[currentMaskNum]
                                if (currentMaskName != 'sub')
                                    blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                                        returnImgPath(maskPathList[currentMaskNum], true) + '")'


                                blackWhiteObject.current.className = 'hide'
                                setTimeout(() => {
                                    showIndividualImage()
                                }, 2000);

                            }
                        }, 500);
                    }, 2000);
                }, timeDuration);
            }, 1000);

        }, durationList[currentMaskNum] * 1000);
    }

    return (
        <div>
            {
                isSceneLoad &&
                <div ref={baseObject}
                    className='hideObject'
                    style={{
                        position: "fixed", width: _baseGeo.width + "px"
                        , height: _baseGeo.height + "px",
                        left: _baseGeo.left + 'px',
                        top: _baseGeo.top + 'px',
                    }}
                >
                    <div
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%'
                        }} >
                        <img
                            width={'100%'}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',

                            }}
                            src={returnImgPath('grey_bg', true)}
                        />
                    </div>

                    <div
                        ref={blackWhiteObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                            WebkitMaskImage: 'url("' +
                                returnImgPath(maskPathList[currentMaskNum][0], true)
                                + '")',
                            WebkitMaskSize: '100% 100%',
                            WebkitMaskRepeat: "no-repeat"
                        }} >

                        <div
                            ref={currentImage}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <BaseImage
                                url={returnImgPath('color_bg')}
                            />

                            {/* {
                        outLineRefList.map(
                            (value, index) =>
                                <BaseImage
                                    className='hideObject'
                                    ref={outLineRefList[index]}
                                />
                        )

                    } */}

                        </div>
                    </div>

                    {
                        isSubMaskLoaded &&
                        subMarkInfoList.map((groupMask, groupIndex) =>
                            groupMask.map((value, index) =>
                                <MaskComponent
                                    ref={subMaskRefList[groupIndex * 2 + index]}
                                    maskPath={returnImgPath(value.p, true)}
                                />

                            )
                        )
                    }

                    <div
                        ref={colorObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                        }} >
                        <BaseImage
                            onLoad={bgLoaded}
                            url={returnImgPath('color_bg')}
                        />
                    </div>
                </div>
            }
        </div >
    );
});

export default Scene;