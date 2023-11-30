/** @format */

import React from 'react'
import MyCalendar from './components/molecules/calendar'
import './App.css'

function App() {
	const reservations: any[] = [
		{ reservationId: 1, propertyId: 1, start: '2023-11-13', end: '2023-11-15', amountOfPeople: 2 },
		{ reservationId: 2, propertyId: 1, start: '2023-11-17', end: '2023-11-19', amountOfPeople: 2 },
		{ reservationId: 3, propertyId: 2, start: '2023-11-15', end: '2023-11-17', amountOfPeople: 2 },
		{ reservationId: 4, propertyId: 2, start: '2023-11-19', end: '2023-11-21', amountOfPeople: 2 },
		{ reservationId: 5, propertyId: 2, start: '2023-11-12', end: '2023-11-15', amountOfPeople: 2 },
		{ reservationId: 6, propertyId: 5, start: '2023-11-21', end: '2023-11-29', amountOfPeople: 2 },
		{ reservationId: 7, propertyId: 5, start: '2023-11-01', end: '2023-11-10', amountOfPeople: 2 },
		{ reservationId: 8, propertyId: 5, start: '2023-11-10', end: '2023-11-13', amountOfPeople: 2 },
	]

	const userProperties = [
		{
			id: 1,
			name: '12',
			type: 'apartment',
			minOccupancy: 1,
			maxOccupancy: 1,
			numSingleBeds: 0,
			numDoubleBeds: 0,
			state: 'active',
			location: '19c/12',
			userId: 'clok0rd6f0000kkdgyf1pd0t3',
			placeId: 1,
		},
		{
			id: 3,
			name: 'Classic',
			type: 'apartment',
			minOccupancy: 1,
			maxOccupancy: 3,
			numSingleBeds: 1,
			numDoubleBeds: 1,
			state: 'active',
			location: 'Łukaszówki 5/41',
			userId: 'clok0rd6f0000kkdgyf1pd0t3',
			placeId: 2,
		},
		{
			id: 31,
			name: '1',
			type: 'apartment',
			minOccupancy: 1,
			maxOccupancy: 2,
			numSingleBeds: 0,
			numDoubleBeds: 1,
			state: 'active',
			location: 'Chłabówka 29',
			userId: 'clok0rd6f0000kkdgyf1pd0t3',
			placeId: 5,
		},
	]
	return (
		<div className='App'>
			<header className='App-header'>
				<div className='flex w-full'>
					<MyCalendar properties={userProperties} reservations={reservations} />
				</div>
			</header>
		</div>
	)
}

export default App
