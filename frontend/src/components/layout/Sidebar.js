//Graphic component for the sidebar on the left of each view
import React from 'react'
import { Link } from 'react-router-dom'
import DevicesList from './Sidebar/DevicesList'

const Sidebar = () => {
	return (
		<ul
			className='navbar-nav bg-gradient-primary sidebar sidebar-dark accordion'
			id='accordionSidebar'
		>
				
			{/* Link for logo that redirects to home page "/" */}
			<Link
				className='sidebar-brand d-flex align-items-center justify-content-center'
				to='/'
			>
				<div className='sidebar-brand-icon'>
					<img
						id='test'
						alt='test'
						className='img-fluid '
						src='img/torch.png'
					></img>
				</div>
				<div className='sidebar-brand-text mx-3'>LeanDA</div>
			</Link>

			<hr className='sidebar-divider my-0' />

			{/* Collapsed dropdown with links for the different data source views */}
			<li className='nav-item'>
				<a
					className='nav-link collapsed'
					href='/#'
					data-toggle='collapse'
					data-target='#collapseTwo'
					aria-expanded='true'
					aria-controls='collapseTwo'
				>
					<i className='fas fa-fw fa-signal'></i>
					<span style = {{fontSize : '1.2em'}}> Data Sources </span>
				</a>
				<div
					id='collapseTwo'
					className='collapse'
					aria-labelledby='headingTwo'
					data-parent='#accordionSidebar'
				>
					<div className='bg-white py-2 collapse-inner rounded'>
						<Link className='collapse-item' to='/'>
							Labeler Source
						</Link>
						<Link className='collapse-item' to='/model'>
							Model Source
						</Link>
						<Link className='collapse-item' to='/debug'>
							Signal view
						</Link>
					</div>
				</div>
			</li>

			<li className='nav-item'>
				<a
					className='nav-link collapsed'
					href='/#'
					data-toggle='collapse'
					data-target='#collapseUtilities'
					aria-expanded='true'
					aria-controls='collapseUtilities'
				>
					<i className='fas fa-th-list'></i>
					<span style = {{fontSize : '1.2em'}}> List of Devices </span>
				</a>
				<div
					id='collapseUtilities'
					className='collapse'
					aria-labelledby='headingUtilities'
					data-parent='#accordionSidebar'
				>
					<div className='bg-white py-2 collapse-inner rounded'>
						<h6 className='collapse-header'>List of Devices</h6>
						<DevicesList />
					</div>
				</div>
			</li>

			<hr className='sidebar-divider d-none d-md-block' />
		
			<li  style={{ position:"fixed", bottom:0, left:'5%'}}>
				<button className='rounded-circle border-0' id='sidebarToggle'></button>
			</li>
		</ul>
	)
}

export default Sidebar
