/* eslint-disable */

import * as util from './util'


/* 定义距离尺寸的存储池 */
let E_SIZER = {}
/* 定义 */
let ELEMENT = null


/** 
 * 绑定事件
 * @param {MouseEvent} evte 鼠标事件对象
 * @returns {undefined}
 **/
function initBindEvent( el ){
    ELEMENT = el
    // 绑定mousedown事件 
    ELEMENT.addEventListener('mousedown', bindMouseDownEvent, false)        
    // 绑定mouseup事件
    document.addEventListener('mouseup', bindMouseUpEvent, false)
}


/** 
 * mousedown事件
 * @param {MouseEvent} evte 鼠标事件对象
 * @returns {undefined}
 **/ 
function bindMouseDownEvent(
    evte
){
    
    // @zgz 关键一行
    ELEMENT = evte.target

    evte.stopPropagation()
    evte.preventDefault()

    // 计算坐标边界巨鹿
    E_SIZER['distX'] = evte.clientX - evte.target.offsetLeft
    E_SIZER['distY'] = evte.clientY - evte.target.offsetTop

    // 绑定mousemove事件
    document.addEventListener('mousemove', bindMouseMoveEvent, false)
}    


/** 
 * mousemove事件
 * @param {MouseEvent} evte 鼠标事件对象
 * @returns {undefined}
 **/ 
function bindMouseMoveEvent(
    evte
){
    evte.stopPropagation()
    evte.preventDefault()

    let moveX = evte.clientX - E_SIZER['distX']
    let moveY = evte.clientY - E_SIZER['distY']
    
    // 写入style
    ELEMENT.style.left = `${moveX}px`
    ELEMENT.style.top = `${moveY}px`
}  


/** 
 * mouseup事件
 * @param {MouseEvent} evte 鼠标事件对象
 * @returns {undefined}
 **/ 
function bindMouseUpEvent(
    evte
){
    evte.stopPropagation()
    evte.preventDefault()

    document.removeEventListener('mousemove', bindMouseMoveEvent)
}    





export default function dragAbsolute( el ){
    // 执行初始化方法
    initBindEvent( el )
}
