/** @format */
import { isWithinInterval, parseISO } from 'date-fns'
import React, { MouseEventHandler } from 'react'

// Function to get the month name for a given date
const getMonthName = (date: Date) => {
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	return monthNames[date.getMonth()]
}

// Function to get the week for a given date
function getWeek(date: Date) {
	const firstDayOfWeek = date.getDate() - date.getDay()
	const lastDayOfWeek = firstDayOfWeek + 6
	return { start: new Date(date.getFullYear(), date.getMonth(), firstDayOfWeek), end: new Date(date.getFullYear(), date.getMonth(), lastDayOfWeek) }
}

// Function to get the month for a given date
function getMonth(date: Date) {
	const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
	const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
	return { start: firstDayOfMonth, end: lastDayOfMonth }
}

function isDayBetween({ day, start, end }: { day: Date; start: string; end: string }) {
	if (!day || !start || !end) return
	const dayDate = new Date(day.setHours(0, 0, 0, 0))
	const startDate = new Date(new Date(start).setHours(0, 0, 0, 0))
	const endDate = new Date(new Date(end).setHours(0, 0, 0, 0))
	return dayDate >= startDate && dayDate <= endDate
}

const getReservationStatus = (props: { propertyId: any; day: Date; reservations: any[]; reservationToCheck: any; daysInView: any[] }) => {
	const { propertyId, day, reservations, reservationToCheck, daysInView } = props

	if (!daysInView.length || !propertyId || !day || reservations.length < 1 || reservationToCheck.length < 0) return [{ none: true }, null, null]

	const dayDuringReservation = isDayBetween({ day, start: reservationToCheck.start, end: reservationToCheck.end })

	if (!dayDuringReservation) return [{ none: true }, null, null]

	const reservationsForPropertyInView = reservations.filter((reservation) => reservation.propertyId === propertyId)

	if (!reservationsForPropertyInView.length) return [{ none: true }, null, null]

	const isEndDateInView = (props: { reservationEnd: string; viewStart: Date; viewEnd: Date }) => {
		const { reservationEnd, viewStart, viewEnd } = props
		const reservationEndDate = parseISO(reservationEnd)
		const interval = { start: viewStart, end: viewEnd }
		return isWithinInterval(reservationEndDate, interval)
	}

	const hasEndStatus = isEndDateInView({ reservationEnd: reservationToCheck.end, viewStart: daysInView[0], viewEnd: daysInView[daysInView.length - 1] })

	const dayPlusHour = new Date(day)
	dayPlusHour.setHours(dayPlusHour.getHours() + 1)
	const dayString = dayPlusHour.toISOString().split('T')[0]

	let status = {}

	status = { hasEndStatus }

	// const overlappingReservation = reservationsForPropertyInView.find(
	// 	(r) => (r.start <= reservationToCheck.start && r.end >= reservationToCheck.start) || (r.start <= reservationToCheck.end && r.end >= reservationToCheck.end)
	// )

	const overlappingReservationStart = reservationsForPropertyInView.find((r) => r.end === reservationToCheck.start)
	const overlappingReservationEnd = reservationsForPropertyInView.find((r) => r.start === reservationToCheck.end)

	if (dayString === reservationToCheck.start) {
		status = { ...status, start: true, overlapsStart: overlappingReservationStart ? true : false, overlapsEnd: overlappingReservationEnd ? true : false }
	} else if (dayString === reservationToCheck.end) {
		status = { ...status, end: true, overlapsStart: overlappingReservationStart ? true : false, overlapsEnd: overlappingReservationEnd ? true : false }
	} else {
		status = { ...status, middle: true, overlapsStart: overlappingReservationStart ? true : false, overlapsEnd: overlappingReservationEnd ? true : false }
	}

	return [status, reservationToCheck.propertyId, reservationToCheck.reservationId]
}
const getReservationStatusOld = (props: { propertyId: any; day: Date; reservations: any[] }) => {
	if (!props?.propertyId || !props?.day || !props?.reservations) return
	const reservationsForProperty = props?.reservations.filter((reservation: { propertyId: any }) => reservation.propertyId === props?.propertyId)
	if (!reservationsForProperty) return 'none'
	// Format the day as a string in the format "YYYY-MM-DD"
	const dayPlusHour = new Date(props?.day)
	dayPlusHour.setHours(dayPlusHour.getHours() + 1)
	const dayString = dayPlusHour.toISOString().split('T')[0]

	const reservation: any = reservationsForProperty.find((reservation: { start: string; end: string }) =>
		isDayBetween({ day: props?.day, start: reservation?.start, end: reservation?.end })
	)

	if (reservation?.propertyId) {
		if (dayString === reservation.start) {
			// Check if there's a reservation that ends on this day
			const overlappingReservation = reservationsForProperty.find((r: { end: string }) => r.end === dayString)
			if (overlappingReservation) {
				return 'overlaps'
			}
			return 'start'
		} else if (dayString === reservation.end) {
			// Check if there's a reservation that starts on this day
			const overlappingReservation = reservationsForProperty.find((r: { start: string }) => r.start === dayString)
			if (overlappingReservation) {
				return 'overlaps'
			}
			return 'end'
		} else {
			return 'middle'
		}
	}
}

function calculateNumDays(reservation: { start: string | number | Date; end: string | number | Date; overlaps: any }) {
	// Parse the start and end dates of the reservation
	const startDate = new Date(reservation?.start)
	const endDate = new Date(reservation?.end)

	// Calculate the difference in time between the two dates
	const diffTime = Math.abs(endDate.getTime() - startDate.getTime())

	// Calculate the difference in days
	let numDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

	// If the reservation overlaps with another reservation, each reservation gets a count of 0.5 for the overlapping day
	if (reservation?.overlaps) {
		numDays -= 0.5
	}

	return numDays
}

function ReservationBlock(props: Readonly<{ reservation: any; className: string; onClick: MouseEventHandler<any> | undefined; colSpan: number }>) {
	return (
		<td
			className={'inset-y-0 right-0 w-1/2 bg-gradient-to-r from-transparent to-blue-500 border border-r-0' + props?.className}
			data-rezerwacja-id={props?.reservation.id}
			onClick={props?.onClick}
			colSpan={props?.colSpan + 0.5}>
			{props?.reservation?.start}
		</td>
	)
}

const ReservationBlockTest = (props: { className: any; onClick: any; reservation: any; colSpan: any }) => {
	const { className, onClick, reservation, colSpan } = props

	if (!reservation) return

	// Calculate the width of the cell
	const cellWidth = colSpan > 1 ? '100%' : '50%'

	return (
		<td className={'relative ' + className} data-rezerwacja-id={reservation?.propertyId} onClick={onClick} style={{ width: cellWidth }}>
			{reservation?.start}
		</td>
	)
}

function calculateRemainingDays(reservation: { end: string | number | Date; start: string | number | Date }, reservationStatus: string) {
	if (!reservation) return
	const today = new Date()
	let endDate = new Date(reservation.end)
	let startDate = new Date(reservation.start)

	if (reservationStatus === 'start') {
		return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
	} else if (reservationStatus === 'middle' || reservationStatus === 'end') {
		return Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
	} else return 0
}

function calculateDaysToEndOfWeek(dateString: string | number | Date) {
	// Parse the date string
	const date = new Date(dateString)

	// Get the current day of the week (0-6, where 0 is Sunday and 6 is Saturday)
	const currentDayOfWeek = date.getDay()

	// Calculate the number of days until the end of the week (Saturday)
	const daysToEndOfWeek = 6 - currentDayOfWeek

	return daysToEndOfWeek
}

// // The Reservation component
// const Reservation = (props: { onClick: any; reservation: any; startDay: any; endDay: any }) => {
// 	const { onClick, reservation, startDay, endDay } = props

// 	// Get the width of a day cell in pixels
// 	const dayCellWidth = document.querySelector('.day-cell').offsetWidth

// 	// Calculate the position and size of the reservation element
// 	const left = `${startDay * dayCellWidth}px`
// 	const width = `${(endDay - startDay + 1) * dayCellWidth}px`

// 	return (
// 		<div className='absolute top-0 h-full bg-blue-500 text-white text-center cursor-pointer' style={{ left, width }} onClick={onClick}>
// 			{reservation.propertyId}
// 		</div>
// 	)
// }

export {
	getMonthName,
	getWeek,
	getMonth,
	getReservationStatus,
	getReservationStatusOld,
	isDayBetween,
	calculateNumDays,
	ReservationBlock,
	ReservationBlockTest,
	calculateRemainingDays,
	calculateDaysToEndOfWeek,
	// Reservation,
}
