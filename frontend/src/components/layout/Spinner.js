//Spinner that renders when undefined data comes in as a result of no connection in the websocket
import React, { Fragment } from 'react'

export const Spinner = () => {
	const spinnerStyle = {
		width: '10rem',
		height: '10rem',
	}

	return (
		<Fragment>
			<div className='d-flex justify-content-center'>
				<div className='spinner-border my-5' style={spinnerStyle} role='status'>
					<span className='sr-only'>Loading...</span>
				</div>
			</div>
		</Fragment>
	)
}
