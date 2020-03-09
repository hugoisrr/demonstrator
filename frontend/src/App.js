import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { LabelerContent } from './components/pages/LabelerContent'
import { ModelContent } from './components/pages/ModelContent'
import DeviceContent from './components/pages/DeviceContent'
import Sidebar from './components/layout/Sidebar'
import {
	toogleSideNavigation,
	menuAccordionsResized,
	preventContentWrapper,
	topButtonAppear,
	smoothScrollingTop,
} from './assets/libs/customJquery'

import './App.scss'
import LabelerState from './context/labeler/LabelerState'
import DeviceState from './context/device/DeviceState'
import ModelState from './context/model/ModelState'
import WebsocketState from './context/websocket/WebSocketState'
import * as Websockets from './components/websockets'

const App = () => {
	//Use animation jquery methods
	useEffect(() => {
		toogleSideNavigation()
		menuAccordionsResized()
		preventContentWrapper()
		topButtonAppear()
		smoothScrollingTop()
	})
	return (
		<LabelerState>
			<DeviceState>
				<ModelState>
					<WebsocketState>
						<Websockets.LabelerWebsocket />
						<Websockets.ModelWebsocket />
						<Websockets.DeviceWebsocket />
						<Router>
							<Fragment>
								<div id='wrapper'>
									<Sidebar />
									<div id='content-wrapper' className='d-flex flex-column'>
										<Switch>
											<Route exact path='/' component={LabelerContent} />
											<Route exact path='/model' component={ModelContent} />
											<Route exact path='/debug' component={DeviceContent} />
										</Switch>
									</div>
								</div>
								<a className='scroll-to-top rounded' href='#page-top'>
									<i className='fas fa-angle-up'></i>
								</a>
							</Fragment>
						</Router>
					</WebsocketState>
				</ModelState>
			</DeviceState>
		</LabelerState>
	)
}

export default App
