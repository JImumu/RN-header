import React, { Component } from 'react'
import {
  View,
  TouchableHighlight,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  NativeModules,
  FlatList,
  Alert
} from 'react-native'

let pixelRatio = PixelRatio.get();      //当前设备的像素密度
const defaultPixel = 2;                           //iphone6的像素密度
//px转换成dp
const w2 = 750 / defaultPixel;
const h2 = 1334 / defaultPixel;
const scale = Math.min(deviceHeight / h2, deviceWidth / w2);

export function scaleSize(size: number) {

    size = Math.round(size * scale + 0.5);
    return size / defaultPixel;
}


const SharePlatform = {
  SINA: 0,
  WECHAT: 1,
  WECHATMOMENT: 2,
  QQ: 4,
  QQZONE: 5
};

const shareItem = [{
  img:require('../resources/share/pyq.png'),
  text:'朋友圈',
  type:SharePlatform.WECHATMOMENT,
},{
  img:require('../resources/share/wx.png'),
  text:'微信好友',
  type:SharePlatform.WECHAT,
},{
  img:require('../resources/share/weibo.png'),
  text:'新浪微博',
  type:SharePlatform.SINA,
},{
  img:require('../resources/share/qq.png'),
  text:'QQ好友',
  type:SharePlatform.QQ,
},{
  img:require('../resources/share/qqzone.png'),
  text:'QQ空间',
  type:SharePlatform.QQZONE,
}]

const {
  width,
  height
} = Dimensions.get('window');



const returnBtn = require('../resources/dajiantou.png');
const anniuBtn = require('../resources/caifu/anniu.png');

export default class Header extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      showMenu: false,
      sharing: false
    };
  }
  rendMenu(menuOption){
    return(
      <View style = {styles.menuWrap}>
        <TouchableHighlight underlayColor = 'transparent' 
          onPress = {()=>{
            this.setState({
              showMenu:false
            })
          }}
          style = {{height:height,width:width}}
        >
          <View style = {styles.menuCon}>
            <View style = {styles.menu}>
              {
                menuOption.map((e, i) => 
                  <TouchableHighlight
                    underlayColor = 'transparent'
                    activeOpacity = { 0.6 }
                    onPress = {()=>{
                      this.setState({
                        showMenu:false
                      })
                      e.onPress()
                    }}
                    key = {i}
                  >
                    <Text 
                      style = {[styles.menuItem,{borderBottomWidth:i==(menuOption.length - 1) ? 0 : 0.5}]}
                    >{e.name}</Text>
                  </TouchableHighlight>
                )
              }
            </View>
            <View style = {styles.cancelBtn}>
              <TouchableHighlight
                underlayColor = 'transparent'
                activeOpacity = { 0.6 }
                onPress = {()=>{
                  this.setState({
                    showMenu:false
                  })
                }}
              >
                <Text style = {[styles.menuItem,{borderBottomWidth:0}]}>取消</Text>
              </TouchableHighlight>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
  renderShareView(options){
    return(
      <View style = {styles.menuWrap}>
        <TouchableHighlight underlayColor = 'transparent' 
          onPress = {()=>{
            this.setState({
              sharing:false
            })
          }}
          style = {{height:height,width:width}}
        >
          <View style = {styles.shareCon}>
            <View style = {styles.share}>
              <Text style = {styles.shareTitle}>分享到</Text>
              <FlatList 
                data = {shareItem}
                showsHorizontalScrollIndicator = {false}
                showsVerticalScrollIndicator  = {false}
                renderItem = {this.renderShareItem.bind(this,options)}
                keyExtractor = {(e,i) => i}
                numColumns = {4}
              />
            </View>
            <TouchableHighlight
              underlayColor = 'transparent'
              activeOpacity = { 0.6 }
              onPress = {()=>{
                this.setState({
                  sharing:false
                })
              }}
            >
              <View style = {styles.cancelShareBtn}>
                <Text style = {styles.cancelText}>取消</Text>
              </View>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
  renderShareItem(options, info){
    let item = info.item
    return(
      <TouchableHighlight
        underlayColor = 'transparent'
        activeOpacity = { 0.6 }
        onPress = {this.share.bind(this, {...options,type:item.type})}
        style = {styles.itemWrap}
      >
        <View style = {styles.item}>
          <Image style = {styles.itemImg} resizeMode = 'stretch' source = {item.img}/>
          <Text style = {styles.itemText}>{item.text}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  share(options){
    console.log(NativeModules)
      NativeModules.UMShareModule.shareWebPageToPlatformType(
        options.type,
        unescape(options.title),
        unescape(options.content),
        options.url,
        (code, message) => {
          console.log(code, message);
          setTimeout(()=>{
            if(code === 200){
              Alert.alert(
                '分享',
                '分享成功!',
                [
                  {text: '确定', onPress: () => {}, style: 'cancel'},
                ],
                { cancelable: true }
              )
            }
          },100)
        }
      )
    setTimeout(()=>{
      this.setState({sharing:false})
    },200)
  }
  renderRightBtn(){
    const { rightBtn, menu, shareOptions, shareBtn } = this.props
    let menuOption = this.props.menuOption || []
    if(typeof rightBtn === 'function'){
      return(
        rightBtn()
      )
    }else if(menuOption.length>=1 && menu){
      return(
        <TouchableHighlight
          underlayColor = 'transparent'
          activeOpacity = { 0.6 }
          onPress = {() => {
            this.setState({
              showMenu:true
            })
          }}
          style = {styles.returnBtn}
        >
          <Image resizeMode='stretch' style = {styles.anniuBtn} source = {anniuBtn}/>
        </TouchableHighlight>
      )
    }else if(shareBtn && shareOptions){
      return(
        <TouchableHighlight 
          underlayColor = 'transparent'
          activeOpacity = { 0.6 }
          onPress = {() => {
            this.setState({
              sharing:true
            })
          }}
        >
          <Text style = {styles.shareBtn}>分享</Text>
        </TouchableHighlight>
      )
    }
  }
  render(){
    const { leftBtn, title, navigation, style, menu, menuPress, rightBtn, leftBtnHandle, shareOptions, shareBtn} = this.props
    const { showMenu, sharing } = this.state
    let menuOption = this.props.menuOption || []
    return(
      <View style = {__IOS__?{zIndex:999}:{}}>
        <View style = {{height:__IOS__?scaleSize(30):0,backgroundColor:style?style.backgroundColor:'#fff'}}><Text> </Text></View>
        <View style = {[styles.header,style]}>
          <View style = {styles.title}>
            <View style = {{width:2*width/7}}>
              {
                typeof leftBtn === 'function'?
                leftBtn():
                <TouchableHighlight
                  underlayColor = 'transparent'
                  activeOpacity = { 0.6 }
                  onPress = {() => {
                    if(typeof leftBtnHandle === 'function'){
                      leftBtnHandle()
                    }else{
                      navigation.goBack()
                    }
                  }}
                  style = {styles.returnBtn}
                >
                    <Image resizeMode='stretch' style = {styles.returnBtnIcon} source = {returnBtn}/>
                </TouchableHighlight>
              }
            </View>
            <View style = {{alignItems:'center',width:3*width/7}}>
              {typeof title === 'function'?
                <View style = {styles.titleText1}>{title()}</View>:
                <Text style = {styles.titleText}>{title}</Text>
              }
            </View>
            <View style = {{alignItems:'flex-end',width:2*width/7}}>
              {this.renderRightBtn()}
            </View>
          </View>
        </View>
        {menuOption.length >= 1 && showMenu ? this.rendMenu(menuOption):<View>{null}</View>}
        {shareBtn && sharing ? this.renderShareView(shareOptions):<View>{null}</View>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header:{
    height:scaleSize(90),
    backgroundColor:'#fff',
    justifyContent:'space-around',
    borderBottomColor:'#ccc',
    borderBottomWidth:0.5
  },
  title:{
    flexDirection:'row',
    alignItems:'center',
  },
  returnBtn:{
    paddingLeft:scaleSize(30),
    width:scaleSize(100),
    height:scaleSize(90),
    justifyContent:'center'
  },
  anniuBtn:{
    paddingLeft:scaleSize(30),
    width:scaleSize(50),
    height:scaleSize(50),
    justifyContent:'center'
  },
  returnBtnIcon:{
    width:scaleSize(18),
    height:scaleSize(18*33/18),
  },
  titleText:{
    fontSize:scaleSize(36),
    color:'#333',
    fontWeight: 'bold',
  },
  titleText1:{
    alignSelf:'center'
  },
  menuWrap:{
    zIndex:999,
    position:'absolute',
    width:width,
    height:height,
    backgroundColor:'rgba(0,0,0,0.2)',
    top:0,
    left:0
  },
  menuCon:{
    position:'absolute',
    bottom:scaleSize(__IOS__?30:60),
    width:width - scaleSize(60),
    alignSelf:'center'
  },
  menu:{
    backgroundColor:'#fff',
    borderTopLeftRadius:scaleSize(20),
    borderTopRightRadius:scaleSize(20),
    borderBottomLeftRadius:scaleSize(20),
    borderBottomRightRadius:scaleSize(20),
    marginBottom:scaleSize(20),
  },
  cancelBtn:{
    backgroundColor:'#fff',
    borderRadius:scaleSize(20)
  },
  menuItem:{
    fontSize:scaleSize(36),
    color:'#333',
    paddingTop:scaleSize(20),
    paddingBottom:scaleSize(20),
    textAlign:'center',
    borderBottomWidth:0.5,
    borderBottomColor:'#eee'
  },
  shareCon:{
    position:'absolute',
    bottom:scaleSize(__IOS__?10:40),
    height:scaleSize(642),
    backgroundColor:'#efefef',
    width:width,
  },
  share:{
    width:width,
    height:scaleSize(532)
  },
  shareTitle:{
    color:'#666',
    fontSize:scaleSize(36),
    textAlign: 'center',
    marginTop:scaleSize(30),
  },
  cancelShareBtn:{
    width:width,
    height:scaleSize(110),
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center'
  },
  cancelText:{
    color:'#333',
    fontSize:scaleSize(36)
  },
  itemText:{
    fontSize:scaleSize(22),
    color:'#666',
    textAlign: 'center',
  },
  itemImg:{
    width:(width - scaleSize(68*4))/4,
    height:(width - scaleSize(68*4))/4,
  },
  itemWrap:{
    marginHorizontal:scaleSize(34),
    marginTop:scaleSize(60)
  },
  shareBtn:{
    color:'#333',
    fontSize: scaleSize(32),
    margin:scaleSize(30)
  }
})
  
