import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// import ModelContent from './components/pages/ModelContent'
import DeviceContent from './components/pages/DeviceContent'
import LabelerContent from './components/pages/LabelerContent'
import Sidebar from './components/layout/Sidebar'
import * as JqueryFunctions from './assets/libs/customJquery'
import './App.scss'
import LabelerState from './context/labeler/LabelerState'
import DeviceState from './context/device/DeviceState'
import ModelState from './context/model/ModelState'
import * as Websockets from './components/websockets'

const App = () => {
	//Use animation jquery methods
	useEffect(() => {
		JqueryFunctions.toogleSideNavigation()
		JqueryFunctions.menuAccordionsResized()
		JqueryFunctions.preventContentWrapper()
		JqueryFunctions.topButtonAppear()
		JqueryFunctions.smoothScrollingTop()
	})
	return (
		<LabelerState>
			<DeviceState>
				<ModelState>
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
										{/* <Route exact path='/model' component={ModelContent} /> */}
										<Route exact path='/' component={DeviceContent} />
										<Route exact path='/test' />
									</Switch>
								</div>
							</div>
							<a className='scroll-to-top rounded' href='#page-top'>
								<i className='fas fa-angle-up'></i>
							</a>
						</Fragment>
					</Router>
				</ModelState>
			</DeviceState>
		</LabelerState>
	)
}

export default App
