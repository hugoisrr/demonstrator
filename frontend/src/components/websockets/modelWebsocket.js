import { useContext } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import ModelContext from '../../context/model/modelContext'

//export const client = new W3CWebSocket('ws://172.21.30.241:4000')
export const client = new W3CWebSocket('ws://localhost:4000')

const ModelWebsocket = () => {
	const modelContext = useContext(ModelContext)
	const { getModelData, getModelWks } = modelContext

	client.onerror = () => {
		console.error('Connection Error with WebSocket Model')
	}

	client.onopen = () => {
		console.log('WebSocket Model Client Connected')
	}

	client.onmessage = message => {
		message = JSON.parse(message.data)
		if (Array.isArray(message) && message.length > 0) {
			getModelWks(message)
		} else if (typeof message === 'object') {
			getModelData(message)
		}
	}

	client.onclose = () => {
		console.log('WebSocket Model Client Closed')
	}

	return null
}

export default ModelWebsocket
