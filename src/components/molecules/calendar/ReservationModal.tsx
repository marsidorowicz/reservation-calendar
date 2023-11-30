/** @format */

// ReservationModal.jsx
import { responsiveFontSizes, themeClass } from '../../../utilities/types'
import { Modal, Typography, Button } from '@mui/material'

function ReservationModal(props: { selectedReservation: any; onClose: any }) {
	return (
		<Modal
			sx={{
				backdropFilter: 'blur(3px)',
			}}
			className={responsiveFontSizes + ' p-2 flex items-center self-center justify-center '}
			open={props?.selectedReservation !== null}
			onClose={props?.onClose}
			aria-labelledby='reservation-modal-title'
			aria-describedby='reservation-modal-description'>
			<div className='absolute top-1/2 left-1/2 min-w-[50%] transform -translate-x-1/2 -translate-y-1/2 w-auto min-w-1/2 bg-white dark:bg-gray-800 border-2 border-black shadow-md p-5 text-gray-500 dark:text-gray-300'>
				<Typography
					className={themeClass + responsiveFontSizes + ' p-2 flex items-center self-center justify-center'}
					id='reservation-modal-title'
					variant='h6'
					component='h2'>
					Reservation Details
				</Typography>
				{props?.selectedReservation && (
					<>
						<Typography id='reservation-modal-property'>Property ID: {props?.selectedReservation.propertyId}</Typography>
						<Typography id='reservation-modal-start'>Start: {props?.selectedReservation.start}</Typography>
						<Typography id='reservation-modal-end'>End: {props?.selectedReservation.end}</Typography>
					</>
				)}
				<Button onClick={props?.onClose}>Close</Button>
			</div>
		</Modal>
	)
}

export default ReservationModal
