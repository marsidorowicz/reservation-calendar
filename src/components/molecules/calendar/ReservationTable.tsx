/** @format */

import { getReservationStatusOld, isDayBetween } from '../../../utilities/functions/calendar'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

function ReservationTable(
	props: Readonly<{
		properties: {
			id: React.Key | null | undefined
			name:
				| string
				| number
				| boolean
				| React.ReactPortal
				| React.ReactElement<any, string | React.JSXElementConstructor<any>>
				| Iterable<React.ReactNode>
				| null
				| undefined
			placeId: any
		}[]
		daysInView: any[]
		reservations: any[]
		handleCellClick: (arg0: any) => any
		scrollContainerRef: React.LegacyRef<HTMLDivElement> | undefined
	}>
) {
	return (
		<div ref={props?.scrollContainerRef} className='overflow-auto whitespace-nowrap mx-4'>
			<div className='flex'>
				<div>
					<table className='table-fixed'>
						<thead>
							<tr>
								<th className='w-20'></th>
								{props?.daysInView.map((day: Date, index: any) => (
									<th key={day.toString() + index} className='w-20'>
										{day.getDate()}
									</th>
								))}
							</tr>
						</thead>

						<tbody>
							{props?.properties?.length > 0 &&
								props?.properties.map((property, index) => {
									const reservationsForProperty = props?.reservations.filter((reservation) => reservation.propertyId === property.placeId)

									return (
										<tr key={property.placeId + index}>
											<td className='font-bold'>{property.name}</td>
											{props?.daysInView.map((day) => {
												const reservationStatus = getReservationStatusOld({
													propertyId: property.placeId,
													day: day,
													reservations: props?.reservations,
												})

												let cellClass = 'w-20 '

												if (reservationStatus === 'start') {
													cellClass += 'bg-gradient-to-r from-transparent to-blue-500 border border-r-0'
												} else if (reservationStatus === 'middle') {
													cellClass += 'bg-blue-500 border border-r-0 border-l-0'
												} else if (reservationStatus === 'end') {
													cellClass += 'bg-gradient-to-r from-blue-500 to-transparent border border-l-0'
												} else if (reservationStatus === 'overlaps') {
													cellClass += 'relative'
												} else {
													cellClass += 'bg-transparent border'
												}

												const dayPlusHour = new Date(day)
												dayPlusHour.setHours(dayPlusHour.getHours() + 1)
												const dayString = dayPlusHour.toISOString().split('T')[0]

												const reservation: any = reservationsForProperty.find((reservation) =>
													isDayBetween({ day: day, start: reservation?.start, end: reservation?.end })
												)

												if (reservation?.propertyId) {
													cellClass += ' cursor-pointer '
												}

												const firstReservation = reservationsForProperty.find((reservation) => dayString === reservation.end)

												const secondReservation = reservationsForProperty.find((reservation) => dayString === reservation.start)

												if (reservationStatus === 'overlaps') {
													reservation['overlaps'] = reservationStatus === 'overlaps'

													return firstReservation?.propertyId || secondReservation?.propertyId ? (
														<td key={day + property.placeId + index} className={cellClass}>
															<Tooltip title={firstReservation?.start + ' - ' + firstReservation?.end + ' : ' + firstReservation?.propertyId}>
																<div
																	className='absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-500 to-transparent border border-l-0'
																	onClick={() => props?.handleCellClick(firstReservation)}></div>
															</Tooltip>
															<Tooltip title={secondReservation?.start + ' - ' + secondReservation?.end + ' : ' + secondReservation?.propertyId}>
																<div
																	className='absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-transparent to-blue-500 border border-r-0'
																	onClick={() => props?.handleCellClick(secondReservation)}></div>
															</Tooltip>
														</td>
													) : (
														<></>
													)
												} else {
													return reservation?.propertyId ? (
														<Tooltip
															key={day + property.placeId + index}
															title={reservation?.start + ' - ' + reservation?.end + ' : ' + reservation?.propertyId}>
															<td
																className={cellClass}
																// colSpan={colSpan}
																onClick={() =>
																	(reservationStatus === 'start' || reservationStatus === 'end' || reservationStatus === 'middle') &&
																	reservation?.propertyId === property?.placeId &&
																	props?.handleCellClick(reservation)
																}></td>
														</Tooltip>
													) : (
														<td key={day + property.placeId + index} className={cellClass}></td>
													)
												}
											})}
										</tr>
									)
								})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default ReservationTable
