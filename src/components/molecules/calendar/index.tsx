/** @format */

import React, { useEffect, useRef, useState } from 'react'
import ReservationModal from './ReservationModal'
import { getMonth, getMonthName, getWeek } from '../../../utilities/functions/calendar'
import ReservationTable from './ReservationTable'

function Calendar(props: { properties: any[]; reservations: any[] }) {
	// Get today's date
	const today = new Date()

	// Create state for the current week
	const [currentWeek, setCurrentWeek] = useState(getWeek(today))

	// Create state for the current month
	const [currentMonth, setCurrentMonth] = useState(getMonth(today))

	// Create state for the current view ('week' or 'month')
	const [currentView, setCurrentView] = useState(window.innerWidth <= 640 ? 'week' : 'week')

	// Create a ref for the scrollable container
	const scrollContainerRef = useRef(null)

	// Function to scroll the container
	const scroll = (direction: number) => {
		const newWeek = getWeek(new Date(currentWeek.start.getFullYear(), currentWeek.start.getMonth(), currentWeek.start.getDate() + direction * 7))
		setCurrentWeek(newWeek)
	}

	// Function to scroll the container
	const scrollMonth = (direction: number) => {
		const newMonth = getMonth(new Date(currentMonth.start.getFullYear(), currentMonth.start.getMonth() + direction, 1))
		setCurrentMonth(newMonth)
	}

	// Create an array of day numbers for the current week
	const days = [...Array(7).keys()].map((i) => new Date(currentWeek.start.getFullYear(), currentWeek.start.getMonth(), currentWeek.start.getDate() + i))

	// Create an array of day numbers for the current month
	const daysInMonth = [...Array(currentMonth.end.getDate() - currentMonth.start.getDate() + 1).keys()].map(
		(i) => new Date(currentMonth.start.getFullYear(), currentMonth.start.getMonth(), currentMonth.start.getDate() + i)
	)

	// Create an array of day numbers for the current view
	const daysInView = currentView === 'week' ? days : daysInMonth

	// Create state for the selected reservation
	const [selectedReservation, setSelectedReservation] = useState(null)

	// Function to handle cell click
	const handleCellClick = (reservation: React.SetStateAction<null>) => {
		setSelectedReservation(reservation)
	}

	// Function to close the modal
	const closeModal = () => {
		setSelectedReservation(null)
	}

	useEffect(() => {
		const handleResize = () => {
			setCurrentView(window.innerWidth <= 1200 ? 'week' : 'month')
		}

		window.addEventListener('resize', handleResize)

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return (
		<div className='flex flex-col items-center w-full  overflow-auto '>
			<div className='mb-4'>
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2'
					onClick={() => {
						setCurrentView('week')
						setCurrentWeek(getWeek(today))
					}}>
					{'Current Week'}
				</button>
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
					onClick={() => {
						setCurrentView('month')
						setCurrentMonth(getMonth(today))
					}}>
					{'Current Month'}
				</button>
			</div>
			<div className='mb-4'>
				<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2' onClick={() => setCurrentView('week')}>
					{'Weekly View'}
				</button>
				<button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => setCurrentView('month')}>
					{'Monthly View'}
				</button>
			</div>
			<h2 className='mb-4'>
				{currentView === 'week'
					? `Week Of${currentWeek.start.getDate()} ${getMonthName(currentWeek.start)}, ${currentWeek.start.getFullYear()}`
					: `${getMonthName(currentMonth.start)}, ${currentMonth.start.getFullYear()}`}
			</h2>

			<div className='flex items-start mb-10'>
				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10'
					onClick={() => (currentView === 'week' ? scroll(-1) : scrollMonth(-1))}>
					←
				</button>
				<ReservationTable
					properties={props?.properties}
					daysInView={daysInView}
					reservations={props?.reservations}
					handleCellClick={handleCellClick}
					scrollContainerRef={scrollContainerRef}
				/>

				<button
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10'
					onClick={() => (currentView === 'week' ? scroll(1) : scrollMonth(1))}>
					→
				</button>
			</div>
			<div className='flex items-start mb-10'>{/* <JsBookingCallendar /> */}</div>
			<ReservationModal selectedReservation={selectedReservation} onClose={closeModal} />
		</div>
	)
}

export default Calendar
