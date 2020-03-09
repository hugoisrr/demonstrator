/* eslint-disable array-callback-return */
import { useContext } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import ModelContext from '../../context/model/modelContext'

//export const client = new W3CWebSocket('ws://172.21.30.241:4000')
const client = new W3CWebSocket('ws://localhost:4000')

const ModelWebsocket = () => {
	const modelContext = useContext(ModelContext)
	const {
		getModelData,
		getModelWks,
		pushToDictionary,
		startDictionary,
		getModelWebsocketStatus,
	} = modelContext

	client.onerror = () => {
		console.error('Connection Error with WebSocket Model')
		getModelWebsocketStatus('ERROR')
	}

	client.onopen = () => {
		console.log('WebSocket Model Client Connected')
		getModelWebsocketStatus('CONNECTING')
	}

	client.onmessage = message => {
		getModelWebsocketStatus('OPEN')
		message = JSON.parse(message.data)
		if (Array.isArray(message) && message.length > 0) {
			getModelWks(message)
		} else if (typeof message === 'object') {
			startDictionary()
			getModelData(message)
			pushToDictionary(message)
		}
	}

	client.onclose = () => {
		console.warn('WebSocket Model Client Closed')
		getModelWebsocketStatus('CLOSED')
	}

	return null
}

export default ModelWebsocket
