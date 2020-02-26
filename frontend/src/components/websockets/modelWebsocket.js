import { useContext, useRef, useState } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import ModelContext from '../../context/model/modelContext'

const client = new W3CWebSocket('ws://172.21.30.241:4000')

const ModelWebsocket = () => {
	const modelContext = useContext(ModelContext)
	const { getModelData, getModelWks } = modelContext
	const [wks, setWks] = useState()
	const ref = useRef(true)

	client.onerror = () => {
		console.error('Connection Error with WebSocket Model')
	}

	client.onopen = () => {
		console.log('WebSocket Model Client Connected')
	}

	client.onmessage = message => {
		if (message.data.length > 0 && ref.current) {
			setWks(message.data)
			ref.current = false
		} else if (!ref.current) {
			getModelData(message.data)
		}
		getModelWks(wks)
	}

	return null
}

export default ModelWebsocket
