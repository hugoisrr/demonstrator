/* eslint-disable array-callback-return */

/**
 * Model Websocket
 * Description - Implementation of Websocket through API methods, the file imports
 * methods from the Context, to set the status of the Websocket, to get the Workstations,
 * set the dictionary data structure and new incoming data from the websocket.
 * The file also export the client so the frontend would have control over the Websocket.
 */

import { useContext } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import ModelContext from '../../context/model/modelContext'

//export const client = new W3CWebSocket('ws://172.21.30.241:4000')
export const client = new W3CWebSocket('ws://localhost:4000')

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
		message = JSON.parse(message.data)
		if (Array.isArray(message) && message.length > 0) {
			// Gets the initial array of workstations 
			getModelWks(message)
		} else if (typeof message === 'object') {
			// Starts the dictionary structure and the data from the websocket
			startDictionary()
			getModelData(message)
			pushToDictionary(message)
			getModelWebsocketStatus('OPEN')
		}
	}

	client.onclose = () => {
		console.warn('WebSocket Model Client Closed')
		getModelWebsocketStatus('CLOSED')
	}

	return null
}

export default ModelWebsocket
