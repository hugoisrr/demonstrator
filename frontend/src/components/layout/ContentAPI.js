/**
 * ContentAPI
 * Description - This is a helper component that receives the children from
 * a parent component as a prop, depending if there is a dropdown component
 * it renders the proper content
 */

import React, { Fragment } from 'react'
import SwitchAPI from './SwitchAPI'
import { Dropdown } from './Dropdown'

const ContentAPI = ({ children, title, websocketStatus, change, dropdown }) => {
	if (dropdown) {
		return (
			<Fragment>
				<div id='content'>
					<div className='container-fluid'>
						<div className='d-sm-flex align-items-center justify-content-between mb-4 my-4'>
							<h1 className='h3 mb-0 text-gray-300'>{title}</h1>
							<Dropdown />
							<SwitchAPI websocketStatus={websocketStatus} change={change} />
						</div>
						{children}
					</div>
				</div>
			</Fragment>
		)
	} else {
		return (
			<Fragment>
				<div id='content'>
					<div className='container-fluid'>
						<div className='d-sm-flex align-items-center justify-content-between mb-4 my-4'>
							<h1 className='h3 mb-0 text-gray-300'>{title}</h1>
							<SwitchAPI websocketStatus={websocketStatus} change={change} />
						</div>
						{children}
					</div>
				</div>
			</Fragment>
		)
	}
}

export default ContentAPI
