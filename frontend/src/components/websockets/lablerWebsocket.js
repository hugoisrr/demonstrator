import { useContext, useRef, useState } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import LabelContext from '../../context/label/labelContext'

const client = new W3CWebSocket('ws://172.21.30.241:3000')

const LablerWebsocket = () => {
	const labelContext = useContext(LabelContext)
	const { getLabelData, getLabelWks } = labelContext
	const [wks, setWks] = useState()
	const ref = useRef(true)

	client.onerror = () => {
		console.error('Connection Error with WebSocket Labler')
	}

	client.onopen = () => {
		console.log('WebSocket Labler Client Connected')
	}

	client.onmessage = message => {
		if (message.data.length > 0 && ref.current) {
			setWks(message.data)
			ref.current = false
		} else if (!ref.current) {
			getLabelData(message.data)
		}
		getLabelWks(wks)
	}

	return null
}

export default LablerWebsocket
