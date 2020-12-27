import '../style/reset.css'
import '../style/main.css'

import dragMatrix from './drag.matrix'
import dragAbsolute from './drag.absolute'

dragMatrix( document.getElementById( 'matrixDragBox' ) )
dragAbsolute( document.getElementById( 'absoluteDragBox' ) )
