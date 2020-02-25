import React, { Fragment, useEffect } from 'react'
import Sidebar from './components/layout/Sidebar'
import './App.scss'
import {
	toogleSideNavigation,
	menuAccordionsResized,
	preventContentWrapper,
	topButtonAppear,
	smoothScrollingTop,
} from './assets/libs/customJquery'

const App = () => {
	useEffect(() => {
		toogleSideNavigation()
		menuAccordionsResized()
		preventContentWrapper()
		topButtonAppear()
		smoothScrollingTop()
	})
	return (
		<Fragment>
			<div id='wrapper'>
				<Sidebar />
				<div id='content-wrapper' className='d-flex flex-column'>
					<div id='content'>
						<div className='container-fluid'>
							<h1 className='h3 mb-4 text-gray-800'>Blank Page</h1>
						</div>
					</div>
				</div>
			</div>
			<a className='scroll-to-top rounded' href='#page-top'>
				<i className='fas fa-angle-up'></i>
			</a>
		</Fragment>
	)
}

export default App
