import React from 'react'

const SwitchAPI = ({ websocketStatus, change }) => {
	return (
		<div className='custom-control custom-switch'>
			<form>
				<input
					type='checkbox'
					className='custom-control-input'
					id='apiSwitch'
					checked={websocketStatus === 'OPEN' && 'true'}
					onChange={change}
				/>
				<label className='custom-control-label' htmlFor='apiSwitch'>
					Websocket switch{' '}
					<span
						className={
							websocketStatus === 'OPEN'
								? `badge badge-success`
								: `badge badge-info`
						}
					>
						{websocketStatus}
					</span>
				</label>
			</form>
		</div>
	)
}

export default SwitchAPI
