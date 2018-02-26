# RN-header
###结合react-navigation的自定义顶部导航栏


图片资源需自行替换


###props
- leftBtn 可选（Function 返回Component）自定义左侧按钮
- title Function（返回Component）或者String
- navigation 必需 父组件的navigation
- style 可选，控制容器样式
- menuOption Array右侧按钮为下拉菜单时可配置（[{name:...,onPress...}]name:String 菜单项名称，onPress：Function 菜单项点击事件）
- rightBtn 可选（Function 返回Component）自定义右侧按钮, 
- leftBtnHandle 可选（Function 自定义左侧按钮点击事件）
- shareOptions 可选 
- shareBtn 可选
